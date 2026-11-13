import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { APPOINTMENT_COLUMNS, ENQUIRY_COLUMNS } from "@/lib/admin/enquiries/columns";

/**
 * Every column the administrator screens SELECT must exist in the table definitions in supabase/migrations/. This is a
 * static check (it reads the SQL as text): it exists because a column that does not exist (a history table once used
 * `changed_at`, not `created_at`) only fails when a real administrator opens the screen. The remote REST layer was also
 * probed with the same selects; this keeps the two in step from now on.
 */

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const sql = readdirSync(join(root, "supabase/migrations"))
  .filter((name) => name.endsWith(".sql"))
  .sort()
  .map((name) => readFileSync(join(root, "supabase/migrations", name), "utf8"))
  .join("\n")
  .replace(/--[^\n]*/g, "");

/** Column names declared in `create table public.<name> ( ... );` (constraint lines are skipped). */
function columnsOf(table: string): Set<string> {
  const match = new RegExp(`create table public\\.${table} \\(([\\s\\S]*?)\\n\\);`).exec(sql);
  assert.ok(match, `table ${table} not found in the migrations`);
  const names = match[1]
    .split("\n")
    .map((line) => /^\s{2}(\w+)\s+(?:uuid|text|date|time|timestamptz|jsonb|boolean|bigint|integer)\b/.exec(line)?.[1])
    .filter((name): name is string => !!name);
  return new Set(names);
}

const list = (select: string) => select.split(",").map((column) => column.trim()).filter(Boolean);
const read = (relative: string) => readFileSync(join(root, relative), "utf8");

describe("the columns the admin screens select exist in the schema", () => {
  it("enquiries", () => {
    const columns = columnsOf("enquiries");
    for (const column of list(ENQUIRY_COLUMNS)) assert.ok(columns.has(column), `enquiries.${column}`);
  });

  it("appointments", () => {
    const columns = columnsOf("appointments");
    for (const column of list(APPOINTMENT_COLUMNS)) assert.ok(columns.has(column), `appointments.${column}`);
  });

  it("enquiry_notes, activity_logs and appointment_status_history (the selects written inline in the queries)", () => {
    const inline = (file: string, table: string) => {
      const source = read(file);
      const found = [...source.matchAll(new RegExp(`from\\("${table}"\\)\\s*\\.select\\("([^"]+)"`, "g"))].map((m) => list(m[1]));
      assert.ok(found.length > 0, `${file} should select from ${table}`);
      return found.flat();
    };
    for (const [file, table] of [
      ["lib/admin/enquiries/queries.ts", "enquiry_notes"],
      ["lib/admin/enquiries/queries.ts", "activity_logs"],
      ["lib/admin/appointments/queries.ts", "activity_logs"],
      ["lib/admin/appointments/queries.ts", "appointment_status_history"],
    ] as const) {
      const columns = columnsOf(table);
      for (const column of inline(file, table)) assert.ok(columns.has(column), `${table}.${column} (selected in ${file})`);
    }
  });

  it("the columns used to order and filter exist too", () => {
    const history = columnsOf("appointment_status_history");
    assert.ok(history.has("changed_at") && !history.has("created_at"), "the status history is timestamped by changed_at");
    const queries = read("lib/admin/appointments/queries.ts");
    assert.match(queries, /order\("changed_at"/);
    assert.doesNotMatch(queries.split("appointment_status_history")[1]?.split("activity_logs")[0] ?? "", /created_at/);
    const appointments = columnsOf("appointments");
    for (const column of ["preferred_date", "preferred_time", "created_at", "rescheduled_from_id", "enquiry_id", "status"]) assert.ok(appointments.has(column), column);
  });
});
