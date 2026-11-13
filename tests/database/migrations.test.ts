import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { enquiryCategories } from "@/content/enquiry-options";
import { appointmentStatusOrder, enquiryStatusOrder } from "@/lib/dashboard-preview/labels";

/**
 * Static guards for the Stage 6.3 database files. These tests read the SQL as text: they do NOT run it. The
 * behaviour of the schema, grants, policies and triggers is tested by the pgTAP files in supabase/tests/database/,
 * which need a real Postgres (`supabase test db`). These checks catch drift between the SQL and the application, and
 * the mistakes a reviewer would otherwise have to spot by eye.
 */

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const dir = (relative: string) => join(root, relative);
const migrationNames = readdirSync(dir("supabase/migrations")).filter((name) => name.endsWith(".sql")).sort();
const migrations = migrationNames.map((name) => ({ name, sql: readFileSync(join(dir("supabase/migrations"), name), "utf8") }));
const all = migrations.map((m) => m.sql).join("\n");
const bootstrap = readFileSync(dir("supabase/bootstrap/first-admin.sql"), "utf8");
const pgtap = readdirSync(dir("supabase/tests/database")).filter((name) => name.endsWith(".test.sql"));
/** SQL without comments, so a comment that explains a rule is not mistaken for code. */
const code = (sql: string) => sql.replace(/--[^\n]*/g, "").replace(/comment on [^;]*;/gi, "");

/** Values of `column in ('a', 'b', ...)` inside a named CHECK constraint. */
function checkList(constraint: string, column: string): string[] {
  const match = new RegExp(`constraint ${constraint} check \\(\\s*${column} in \\(([^)]*)\\)`, "i").exec(code(all));
  assert.ok(match, `constraint ${constraint} not found`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

describe("migrations: files and order", () => {
  it("are timestamped, strictly increasing and in the expected order", () => {
    assert.deepEqual(
      migrationNames.map((name) => name.replace(/^\d+_/, "").replace(/\.sql$/, "")),
      [
        "private_schema_and_administrators",
        "create_enquiries",
        "create_appointments",
        "create_notes_history_and_activity",
        "create_audit_triggers",
        "enable_rls_and_grants",
        "create_submission_support_tables",
        "create_submit_enquiry_function",
        "create_reschedule_appointment_function",
        "create_admin_membership_check",
      ],
    );
    for (const name of migrationNames) assert.match(name, /^\d{14}_[a-z_]+\.sql$/, name);
    assert.deepEqual([...migrationNames], [...migrationNames].sort());
  });

  it("the pgTAP files exist and each declares a plan and cleans up after itself", () => {
    assert.deepEqual(pgtap, [
      "001_schema_and_constraints.test.sql",
      "002_access_control.test.sql",
      "003_audit_history.test.sql",
      "004_submit_enquiry.test.sql",
      "005_appointment_reschedule.test.sql",
    ]);
    for (const name of pgtap) {
      const sql = readFileSync(join(dir("supabase/tests/database"), name), "utf8");
      assert.match(sql, /select plan\(\d+\);/, name);
      assert.match(sql, /select \* from finish\(\);\s*rollback;\s*$/, `${name} must roll back`);
    }
  });
});

describe("migrations: the schema matches the application", () => {
  it("the enquiry divisions are exactly the Contact form's categories", () => {
    assert.deepEqual(checkList("enquiries_division_allowed", "division"), enquiryCategories.map((category) => category.id));
  });

  it("enquiry and appointment statuses are exactly the dashboard's", () => {
    assert.deepEqual(checkList("enquiries_status_allowed", "status"), [...enquiryStatusOrder]);
    assert.deepEqual(checkList("appointments_status_allowed", "status"), [...appointmentStatusOrder]);
    // The history tables use the same lists.
    assert.deepEqual(checkList("enquiry_status_history_new_allowed", "new_status"), [...enquiryStatusOrder]);
    assert.deepEqual(checkList("appointment_status_history_new_allowed", "new_status"), [...appointmentStatusOrder]);
  });

  it("every interest slug in the form is accepted by the database's slug rule", () => {
    const slug = /^[a-z0-9-]+$/;
    for (const category of enquiryCategories) for (const interest of category.interests) assert.match(interest.slug, slug, interest.slug);
  });

  it("services map to requested_service (energy, security) and products to requested_item (foods, industrial)", () => {
    const rule = /case division\s+when 'general' then requested_item is null and requested_service is null\s+when 'energy' then requested_item is null\s+when 'security' then requested_item is null\s+when 'foods' then requested_service is null\s+when 'industrial-equipment' then requested_service is null/;
    assert.match(code(all), rule);
  });

  it("uses the form's length limits", () => {
    assert.match(all, /char_length\(full_name\) between 2 and 100/);
    assert.match(all, /char_length\(message\) between 10 and 2000/);
    assert.match(all, /char_length\(email\) <= 254/);
    assert.match(all, /char_length\(organisation\) between 1 and 120/);
  });

  it("stores no price anywhere", () => {
    assert.doesNotMatch(code(all), /\bprice\b|\bamount\b|\bcost\b/i);
  });

  it("generates a BOOM-prefixed reference in the database, unique", () => {
    assert.match(all, /'BOOM-'/);
    assert.match(all, /constraint enquiries_reference_key unique \(reference\)/);
    assert.match(all, /create sequence private\.enquiry_reference_seq/);
  });
});

describe("migrations: security rules", () => {
  it("every table in public enables row-level security", () => {
    const tables = [...code(all).matchAll(/create table public\.(\w+)/g)].map((m) => m[1]);
    assert.deepEqual(tables.sort(), [
      "activity_logs",
      "appointment_status_history",
      "appointments",
      "enquiries",
      "enquiry_notes",
      "enquiry_status_history",
    ]);
    for (const table of tables) assert.match(code(all), new RegExp(`alter table public\\.${table} enable row level security`), table);
  });

  it("the administrator table is in the private schema, has RLS on, and no grants or policies", () => {
    assert.match(code(all), /create table private\.admin_users/);
    assert.match(code(all), /alter table private\.admin_users enable row level security/);
    assert.doesNotMatch(code(all), /grant [^;]*private\.admin_users/i);
    assert.doesNotMatch(code(all), /create policy[^;]*private\.admin_users/i);
    assert.doesNotMatch(code(all), /create table public\.admin_users/);
  });

  it("nothing is granted to anon or PUBLIC, and nothing can be deleted by a grant", () => {
    const grants = [...code(all).matchAll(/\bgrant\b[^;]*;/gi)].map((m) => m[0]);
    assert.ok(grants.length > 0);
    for (const grant of grants) {
      assert.doesNotMatch(grant, /\bto\b[^;]*\banon\b/i, grant);
      assert.doesNotMatch(grant, /\bto\b[^;]*\bpublic\b/i, grant);
      assert.doesNotMatch(grant, /\b(delete|truncate|all)\b\s+on\b|\bon\b[^;]*\bdelete\b/i, grant);
    }
  });

  it("there is no policy for anon and none for DELETE; every policy is for authenticated and needs an active administrator", () => {
    const policies = [...code(all).matchAll(/create policy "([^"]+)"\s+on public\.(\w+) for (\w+) to (\w+)([\s\S]*?);/g)];
    assert.equal(policies.length, 10);
    for (const [, name, , command, role, body] of policies) {
      assert.equal(role, "authenticated", name);
      assert.notEqual(command, "delete", name);
      assert.match(body, /private\.is_active_admin\(\)/, name);
    }
  });

  it("every SECURITY DEFINER function sets an empty search_path", () => {
    const functions = code(all).split(/create (?:or replace )?function /i).slice(1);
    const definers = functions.filter((fn) => /security definer/i.test(fn));
    assert.ok(definers.length >= 8, "expected the helper, the reference generator and the audit triggers");
    for (const fn of definers) assert.match(fn, /set search_path = ''/i, fn.slice(0, 60));
  });

  it("every function in the private schema has its public execute right revoked", () => {
    const names = [...code(all).matchAll(/create (?:or replace )?function (private\.\w+)\(/gi)].map((m) => m[1]);
    assert.ok(names.length >= 12);
    for (const name of names) {
      assert.match(code(all), new RegExp(`revoke all on function ${name.replace(".", "\\.")}\\([^)]*\\) from public`, "i"), name);
    }
  });

  it("user-editable metadata is never used to decide anything", () => {
    assert.doesNotMatch(code(all), /user_metadata|raw_user_meta_data|app_metadata/);
  });

  it("deletion is blocked on business records and the logs are append-only", () => {
    for (const table of ["enquiries", "appointments"]) assert.match(code(all), new RegExp(`before delete on public\\.${table}[\\s\\S]*?forbid_delete`));
    for (const table of ["enquiry_notes", "enquiry_status_history", "appointment_status_history", "activity_logs"]) {
      assert.match(code(all), new RegExp(`before update or delete on public\\.${table}[\\s\\S]*?forbid_change`));
    }
    const cascades = code(all).split("\n").filter((line) => /on delete cascade/i.test(line));
    assert.equal(cascades.length, 1, "only one cascade exists");
    assert.match(cascades[0], /auth\.users/, "and it is the administrator row following its Auth user");
  });

  it("status history is written only when a status really changes", () => {
    assert.match(code(all), /after update of status on public\.enquiries[\s\S]*?when \(old\.status is distinct from new\.status\)/);
    assert.match(code(all), /after update of status on public\.appointments[\s\S]*?when \(old\.status is distinct from new\.status\)/);
  });

  it("activity metadata can only hold non-personal keys", () => {
    assert.match(all, /metadata - array\['from_status', 'to_status', 'reference', 'division'\]/);
  });
});

describe("SQL files contain no secrets and no real identifiers", () => {
  const ALLOWED = /^(0{8}-0{4}-0{4}-0{4}-0{12}|([0-9a-f])\2{7}-\2{4}-4\2{3}-8\2{3}-\2{12}|[a-f0-9]{8}-0{4}-4000-8000-0{9}[0-9a-f]{3})$/i;

  it("migrations, bootstrap and tests contain only obviously fake UUIDs", () => {
    const files = [
      ...migrations.map((m) => ({ name: m.name, sql: m.sql })),
      { name: "first-admin.sql", sql: bootstrap },
      ...pgtap.map((name) => ({ name, sql: readFileSync(join(dir("supabase/tests/database"), name), "utf8") })),
    ];
    for (const { name, sql } of files) {
      for (const [uuid] of sql.matchAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi)) {
        assert.match(uuid, ALLOWED, `${name} contains a UUID that does not look like a placeholder or test fake: ${uuid}`);
      }
    }
  });

  it("the bootstrap script holds only the all-zero placeholder and refuses to run until it is replaced", () => {
    const uuids = new Set([...bootstrap.matchAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi)].map((m) => m[0]));
    assert.deepEqual([...uuids], ["00000000-0000-0000-0000-000000000000"]);
    assert.match(bootstrap, /raise exception 'Replace the placeholder UUID/);
    assert.match(bootstrap, /on conflict \(user_id\) do update/);
  });

  it("the bootstrap script is outside migrations, so it is never applied automatically", () => {
    assert.ok(!migrationNames.some((name) => /bootstrap|first.?admin/i.test(name)));
  });

  it("no key, token or connection string appears in any SQL file", () => {
    const text = [all, bootstrap, ...pgtap.map((name) => readFileSync(join(dir("supabase/tests/database"), name), "utf8"))].join("\n");
    assert.doesNotMatch(text, /sb_secret_|sb_publishable_|eyJ[A-Za-z0-9_-]{20,}\.|\.supabase\.co|postgres(ql)?:\/\/|password\s*[:=]\s*'[^']/i);
  });
});

describe("the public submission function (Stage 6.4)", () => {
  const fn = migrations.find((m) => m.name.endsWith("create_submit_enquiry_function.sql"))!.sql;
  const support = migrations.find((m) => m.name.endsWith("create_submission_support_tables.sql"))!.sql;
  const signature = /public\.submit_enquiry\(([^)]*)\)/;

  it("is SECURITY DEFINER with an empty search_path and executable by service_role alone", () => {
    const body = code(fn);
    assert.match(body, /create or replace function public\.submit_enquiry\([\s\S]*?security definer\s+set search_path = ''/);
    const revoke = /revoke all on function public\.submit_enquiry\([^)]*\)\s+from public, anon, authenticated;/i;
    assert.match(body, revoke);
    const grants = [...body.matchAll(/grant execute on function public\.submit_enquiry\([^)]*\)\s+to (\w+);/gi)].map((m) => m[1]);
    assert.deepEqual(grants, ["service_role"]);
  });

  it("takes no id, reference, status, source or timestamp from the caller", () => {
    const params = [...(signature.exec(code(fn))?.[1] ?? "").matchAll(/\bp_(\w+)\b/g)].map((m) => m[1]);
    assert.ok(params.length >= 12);
    for (const name of params) assert.doesNotMatch(name, /^(id|reference|status|source)$|created|updated/, name);
  });

  it("writes only the intended columns, so status, source, reference and timestamps come from the database", () => {
    const columns = (table: string) =>
      new RegExp(`insert into public\\.${table} \\(([^)]*)\\)`).exec(code(fn))?.[1].split(",").map((c) => c.trim()).filter(Boolean);
    assert.deepEqual(columns("enquiries"), [
      "full_name", "phone", "phone_e164", "email", "organisation", "location", "division", "requested_service", "requested_item", "message",
    ]);
    assert.deepEqual(columns("appointments"), ["enquiry_id", "preferred_date", "preferred_time"]);
  });

  it("creates the enquiry and its appointment inside one function body (atomic) and never confirms an appointment", () => {
    const body = code(fn);
    assert.doesNotMatch(body, /\bcommit\b|\bsavepoint\b|\bexception\s+when\b/i, "no sub-transaction or swallowed error could leave half a submission");
    assert.doesNotMatch(body, /'confirmed'/);
  });

  it("applies idempotency, the content-duplicate guard and the persistent rate limits", () => {
    const body = code(fn);
    assert.match(body, /c_per_client_hour constant integer := 5;/);
    assert.match(body, /c_per_client_day constant integer := 15;/);
    assert.match(body, /c_overall_hour constant integer := 300;/);
    assert.match(body, /private\.enquiry_submissions/);
    assert.match(body, /pg_advisory_xact_lock/);
    assert.match(body, /interval '24 hours'/);
  });

  it("keeps only a salted hash of the client address, never the address", () => {
    assert.match(code(fn), /pg_catalog\.sha256\(/);
    assert.match(code(fn), /insert into private\.enquiry_attempts \(client_hash\)/);
    assert.match(support, /client_hash ~ '\^\[0-9a-f\]\{64\}\$'/);
    assert.doesNotMatch(code(support), /\bip(_address)?\b|inet/i);
  });

  it("the support tables are private, closed to every API role, with RLS and no policy", () => {
    for (const table of ["enquiry_submissions", "enquiry_attempts", "enquiry_throttle_pepper"]) {
      assert.match(code(support), new RegExp(`create table private\\.${table}`));
      assert.match(code(support), new RegExp(`alter table private\\.${table} enable row level security`));
      assert.match(code(support), new RegExp(`revoke all on table private\\.${table} from public, anon, authenticated, service_role`));
    }
    assert.doesNotMatch(code(support), /\bcreate policy\b|\bgrant\b/i);
    assert.doesNotMatch(code(support), /create table public\./);
  });

  it("the pepper is generated by the database, not written in a file", () => {
    assert.match(code(support), /insert into private\.enquiry_throttle_pepper \(pepper\)\s+values \(replace\(gen_random_uuid\(\)/);
  });
});

describe("the application and the tables", () => {
  it("nothing in the app queries the new tables or calls the database", () => {
    const folders = ["app", "components", "content", "hooks", "lib"];
    const walk = (relative: string): string[] =>
      readdirSync(dir(relative), { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory() ? walk(`${relative}/${entry.name}`) : /\.(ts|tsx)$/.test(entry.name) ? [`${relative}/${entry.name}`] : [],
      );
    // Only the administrator's own data code (Stage 6.5, user session, RLS applies) may read these tables.
    const adminAccess = [
      "lib/admin/enquiries/queries.ts",
      "lib/admin/enquiries/enquiry-actions.ts",
      "lib/admin/appointments/queries.ts",
      "lib/admin/appointments/appointment-actions.ts",
    ];
    for (const file of folders.flatMap(walk)) {
      if (adminAccess.includes(file)) continue;
      const source = readFileSync(dir(file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
      assert.doesNotMatch(source, /\.from\(\s*["'`](enquiries|appointments|enquiry_notes|enquiry_status_history|appointment_status_history|activity_logs)["'`]/, file);
    }
  });

  it("the Contact form no longer carries a development-preview switch or notice", () => {
    for (const gone of ["lib/enquiry/config.ts", "components/contact/PreviewNotice.tsx"]) {
      assert.throws(() => readFileSync(dir(gone), "utf8"), gone);
    }
  });
});
