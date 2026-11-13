// Module resolution hook for the unit tests: lets Node's built-in TypeScript support load the project's own
// modules exactly as written (extensionless relative imports and the "@/" alias). No dependency is needed.
import { statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

function isFile(url) {
  try {
    return statSync(fileURLToPath(url)).isFile();
  } catch {
    return false;
  }
}

export async function resolve(specifier, context, nextResolve) {
  let base;
  if (specifier.startsWith("@/")) base = pathToFileURL(root + specifier.slice(2)).href;
  else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL) base = new URL(specifier, context.parentURL).href;
  if (base) {
    for (const candidate of [base, `${base}.ts`, `${base}/index.ts`]) {
      if (isFile(candidate)) return nextResolve(candidate, context);
    }
  }
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    // Next.js ships subpaths such as "next/server" as CommonJS files without an "exports" map, which Node's ESM
    // resolver will not find without the extension (bundlers do). Retry with ".js" for those only.
    if (specifier.startsWith("next/") && !specifier.endsWith(".js") && error?.code === "ERR_MODULE_NOT_FOUND") {
      return nextResolve(`${specifier}.js`, context);
    }
    throw error;
  }
}
