#!/usr/bin/env node
// Sync the Lovable landing (branch punta-biker-landing) into this Next.js app.
// Usage:
//   node scripts/sync-lovable.mjs --check     report whether Lovable has unsynced changes
//   node scripts/sync-lovable.mjs --dry-run   show what would be written
//   node scripts/sync-lovable.mjs             sync
// Runbook: docs/LOVABLE_SYNC.md

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BRANCH = "punta-biker-landing";
const STATE_FILE = join(ROOT, "lovable-sync.json");
const SCOPE = ".pb-landing";
const args = new Set(process.argv.slice(2));

// Fonts used by the Lovable CSS -> CSS variable exposed by next/font in app/page.tsx.
const FONT_MAP = {
  "Plus Jakarta Sans": "--font-pjs",
  "League Spartan": "--font-spartan",
  Tangerine: "--font-tangerine",
};

const ALIASES = [
  ["@/components/ui/button", "@/components/landing/ui/button"],
  ["@/components/inquiry-modal", "@/components/landing/inquiry-modal"],
  ["@/components/spin-viewer", "@/components/landing/spin-viewer"],
  ["@/lib/inquiry", "@/lib/landing/inquiry"],
  ["@/lib/i18n", "@/lib/landing/i18n"],
  ["@/lib/media", "@/lib/landing/media"],
  ["@/lib/utils", "@/lib/landing/utils"],
];

const ICON_FILES = ["favicon.png", "apple-touch-icon.png", "app-icon-192.png", "app-icon-512.png", "manifest.webmanifest"];

const fail = (msg) => {
  throw new Error(msg);
};

function git(...a) {
  return execFileSync("git", a, { cwd: ROOT, maxBuffer: 512 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
}
const gitText = (...a) => git(...a).toString("utf8").trim();

function readState() {
  return existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, "utf8")) : null;
}

function replaceOrThrow(src, pattern, replacement, label) {
  const out = src.replace(pattern, replacement);
  if (out === src) fail(`Lovable changed shape: could not apply "${label}". Update scripts/sync-lovable.mjs.`);
  return out;
}

function rewriteAliases(src) {
  for (const [from, to] of ALIASES) src = src.split(`"${from}"`).join(`"${to}"`);
  return src;
}

function main() {
  try {
    git("fetch", "origin", BRANCH);
  } catch (e) {
    fail(`git fetch origin ${BRANCH} failed: ${e.stderr?.toString() || e.message}`);
  }
  const sha = gitText("rev-parse", `origin/${BRANCH}`);
  const state = readState();

  if (args.has("--check")) {
    if (state?.commit === sha) {
      console.log(`UP TO DATE: ${BRANCH} @ ${sha.slice(0, 7)} already synced (${state.syncedAt}).`);
      return 0;
    }
    console.log(`PENDING: ${BRANCH} is at ${sha.slice(0, 7)}, last synced ${state ? state.commit.slice(0, 7) : "never"}.`);
    if (state) {
      try {
        console.log(gitText("diff", "--name-status", state.commit, sha));
      } catch {
        console.log("(previous synced commit not reachable; full sync needed)");
      }
    }
    return 1;
  }

  const files = gitText("ls-tree", "-r", "--name-only", sha).split("\n").filter(Boolean);
  const has = (p) => files.includes(p);
  const show = (p) => {
    if (!has(p)) fail(`Missing upstream file: ${p}`);
    return git("show", `${sha}:${p}`);
  };
  const showText = (p) => show(p).toString("utf8");

  for (const p of ["src/routes/index.tsx", "src/styles.css", "src/lib/i18n.ts", "src/lib/inquiry.ts", "src/lib/media.ts", "src/lib/utils.ts", "src/components/inquiry-modal.tsx", "src/components/spin-viewer.tsx", "src/components/ui/button.tsx"]) {
    if (!has(p)) fail(`Missing upstream file: ${p}`);
  }

  const warnings = [];
  const unported = files.filter((f) => /^src\/routes\//.test(f) && !/(index\.tsx|__root\.tsx|README\.md)$/.test(f));
  if (unported.length) warnings.push(`New Lovable routes NOT ported: ${unported.join(", ")}`);

  // ---- assets -------------------------------------------------------------------
  const assetFiles = files.filter((f) => f.startsWith("assets-originales/") && !f.endsWith("manifest.json"));
  const assetByBase = new Map();
  for (const f of assetFiles) {
    const base = posix.basename(f);
    if (assetByBase.has(base)) fail(`Duplicate asset basename in assets-originales: ${base}`);
    assetByBase.set(base, f.slice("assets-originales/".length));
  }

  const outputs = new Map(); // repo-relative path -> string | Buffer
  const usedAssets = new Map(); // rel path under public/landing -> source repo path

  function useAsset(relPath, sourcePath) {
    usedAssets.set(relPath, sourcePath);
    return `/landing/${relPath}`;
  }

  function resolvePointer(pointerPath) {
    const pointer = JSON.parse(showText(pointerPath));
    const orig = pointer.original_filename;
    const rel = assetByBase.get(orig);
    if (!rel) fail(`Pointer ${pointerPath} -> "${orig}" not found in assets-originales/`);
    return useAsset(rel, `assets-originales/${rel}`);
  }

  function transformAssetImports(src) {
    const consts = [];
    let out = src.replace(/^import\s+(\w+)\s+from\s+"@\/assets\/([^"]+)";?[ \t]*\r?\n/gm, (_m, id, name) => {
      if (name.endsWith(".asset.json")) {
        const pointerPath = `src/assets/${name}`;
        if (!has(pointerPath)) fail(`Pointer not found: ${pointerPath}`);
        consts.push(`const ${id} = { url: ${JSON.stringify(resolvePointer(pointerPath))} };`);
      } else if (/\.(jpe?g|png|webp|svg)$/i.test(name)) {
        const filePath = `src/assets/${name}`;
        if (!has(filePath)) fail(`Image not found: ${filePath}`);
        consts.push(`const ${id} = ${JSON.stringify(useAsset(name, filePath))};`);
      } else {
        fail(`Unsupported asset import: @/assets/${name}`);
      }
      return "";
    });
    if (consts.length) {
      const lines = out.split("\n");
      let lastImport = -1;
      lines.forEach((l, i) => {
        if (/^import\s/.test(l)) lastImport = i;
      });
      lines.splice(lastImport + 1, 0, ...consts);
      out = lines.join("\n");
    }
    return out;
  }

  function transformGlobs(src) {
    return src.replace(
      /const (\w+) = import\.meta\.glob<\{ url: string \}>\("@\/assets\/([\w\-/]+)\/\*\.asset\.json", \{ eager: true, import: "default" \}\);\s*\nexport const (\w+) = Object\.keys\(\1\)\.sort\(\)\.map\(k => \1\[k\]!\.url\);/g,
      (_m, _mod, dir, exportName) => {
        const prefix = `src/assets/${dir}/`;
        const pointers = files.filter((f) => f.startsWith(prefix) && f.endsWith(".asset.json") && !f.slice(prefix.length).includes("/")).sort();
        if (!pointers.length) fail(`No frames found for glob ${dir}`);
        const urls = pointers.map(resolvePointer);
        return `export const ${exportName} = [\n${urls.map((u) => `  ${JSON.stringify(u)},`).join("\n")}\n];`;
      },
    );
  }

  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const installed = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]);

  function guard(file, src) {
    for (const bad of [/@\/assets\//, /import\.meta/, /@tanstack/, /createFileRoute/, /\?url["']/]) {
      if (bad.test(src)) fail(`${file}: leftover Lovable-only construct ${bad}. Update scripts/sync-lovable.mjs.`);
    }
    for (const m of src.matchAll(/from\s+"([^"]+)"/g)) {
      const spec = m[1];
      if (spec.startsWith("@/")) {
        if (!/^@\/(components\/landing|lib\/landing)\//.test(spec)) fail(`${file}: imports ${spec}, which is not ported (new Lovable dependency?).`);
      } else if (!spec.startsWith(".")) {
        const name = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
        if (!installed.has(name) && !["react", "react-dom", "vitest"].includes(name)) fail(`${file}: package "${name}" is not installed. Run: npm install ${name}`);
      }
    }
  }

  const USE_CLIENT = '"use client";\n\n';

  // ---- lib ---------------------------------------------------------------------
  for (const f of ["i18n", "inquiry", "utils"]) outputs.set(`src/lib/landing/${f}.ts`, rewriteAliases(showText(`src/lib/${f}.ts`)));
  outputs.set("src/lib/landing/media.ts", transformAssetImports(rewriteAliases(showText("src/lib/media.ts"))));
  if (has("src/lib/inquiry.test.ts")) outputs.set("src/lib/landing/inquiry.test.ts", rewriteAliases(showText("src/lib/inquiry.test.ts")));

  // ---- components --------------------------------------------------------------
  outputs.set("src/components/landing/ui/button.tsx", rewriteAliases(showText("src/components/ui/button.tsx")));

  let spin = showText("src/components/spin-viewer.tsx");
  spin = transformGlobs(spin);
  outputs.set("src/components/landing/spin-viewer.tsx", USE_CLIENT + rewriteAliases(transformAssetImports(spin)));

  let modal = showText("src/components/inquiry-modal.tsx");
  modal = replaceOrThrow(
    modal,
    "<Dialog.Portal>",
    '<Dialog.Portal container={typeof document === "undefined" ? undefined : document.querySelector<HTMLElement>(".pb-landing")}>',
    "scope dialog portal inside .pb-landing",
  );
  outputs.set("src/components/landing/inquiry-modal.tsx", USE_CLIENT + rewriteAliases(transformAssetImports(modal)));

  // ---- landing page ------------------------------------------------------------
  let page = showText("src/routes/index.tsx");

  const metaOf = (re, label) => {
    const m = page.match(re);
    if (!m) fail(`Could not extract ${label} from src/routes/index.tsx`);
    return JSON.parse(`"${m[1]}"`);
  };
  const meta = {
    title: metaOf(/\{ title: "((?:[^"\\]|\\.)*)" \}/, "title"),
    description: metaOf(/\{ name: "description", content: "((?:[^"\\]|\\.)*)" \}/, "description"),
    ogTitle: metaOf(/\{ property: "og:title", content: "((?:[^"\\]|\\.)*)" \}/, "og:title"),
    ogDescription: metaOf(/\{ property: "og:description", content: "((?:[^"\\]|\\.)*)" \}/, "og:description"),
  };
  outputs.set("src/lib/landing/meta.ts", `export const landingMeta = ${JSON.stringify(meta, null, 2)} as const;\n`);

  page = replaceOrThrow(page, /import \{ createFileRoute \} from "@tanstack\/react-router";\r?\n/, "", "remove createFileRoute import");
  page = replaceOrThrow(page, /export const Route = createFileRoute\("\/"\)\(\{[\s\S]*?\r?\n\}\);\r?\n/, "", "remove Route definition");
  page = replaceOrThrow(page, "function Index() {", "export function LandingPage() {", "rename Index component");
  page = replaceOrThrow(page, "return <div ref={pageRef}>", 'return <div ref={pageRef} className="pb-landing">', "scope page root with .pb-landing");
  outputs.set("src/components/landing/landing-page.tsx", USE_CLIENT + rewriteAliases(transformAssetImports(page)));

  for (const [path, content] of outputs) if (/\.(tsx?|mjs)$/.test(path)) guard(path, content.toString());

  // ---- css ---------------------------------------------------------------------
  outputs.set("app/landing.css", buildCss(showText("src/styles.css"), sha));

  // ---- icons / favicon ---------------------------------------------------------
  for (const f of ICON_FILES) outputs.set(`public/${f}`, show(`public/${f}`));
  outputs.set("app/favicon.ico", show("public/favicon.ico"));
  const knownPublic = new Set([...ICON_FILES, "favicon.ico", "robots.txt"]);
  const newPublic = files.filter((f) => f.startsWith("public/") && !knownPublic.has(f.slice(7)));
  if (newPublic.length) warnings.push(`New Lovable public files NOT copied: ${newPublic.join(", ")}`);

  // ---- assets to public/landing ------------------------------------------------
  for (const [rel, source] of usedAssets) outputs.set(`public/landing/${rel}`, show(source));
  const unusedAssets = assetFiles.filter((f) => ![...usedAssets.values()].includes(f));
  if (unusedAssets.length) warnings.push(`${unusedAssets.length} assets in assets-originales/ are not referenced by the landing (skipped).`);

  // ---- write -------------------------------------------------------------------
  let written = 0;
  let unchanged = 0;
  for (const [rel, content] of outputs) {
    const abs = join(ROOT, rel);
    const buf = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    if (existsSync(abs) && readFileSync(abs).equals(buf)) {
      unchanged++;
      continue;
    }
    written++;
    if (args.has("--dry-run")) {
      console.log(`would write ${rel}`);
      continue;
    }
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, buf);
  }

  const managed = ["public/landing", "src/components/landing", "src/lib/landing"];
  let pruned = 0;
  for (const dir of managed) {
    for (const abs of walk(join(ROOT, dir))) {
      const rel = abs.slice(ROOT.length + 1).split("\\").join("/");
      if (!outputs.has(rel)) {
        pruned++;
        if (args.has("--dry-run")) console.log(`would delete ${rel}`);
        else rmSync(abs);
      }
    }
  }

  if (!args.has("--dry-run")) {
    writeFileSync(STATE_FILE, JSON.stringify({ branch: BRANCH, commit: sha, syncedAt: new Date().toISOString() }, null, 2) + "\n");
  }

  console.log(`Synced ${BRANCH} @ ${sha.slice(0, 7)}: ${written} written, ${unchanged} unchanged, ${pruned} pruned, ${usedAssets.size} assets.`);
  for (const w of warnings) console.log(`WARN: ${w}`);
  console.log("Next: npx tsc --noEmit | npx vitest run src/lib/landing | npm run build | node scripts/compare-landing.mjs");
  return 0;
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const abs = join(dir, name);
    return statSync(abs).isDirectory() ? walk(abs) : [abs];
  });
}

// ---- CSS scoping -----------------------------------------------------------------
function parseBlocks(css) {
  const items = [];
  let i = 0;
  let prelude = "";
  while (i < css.length) {
    const ch = css[i];
    if (ch === "{") {
      let depth = 1;
      let j = i + 1;
      while (j < css.length && depth > 0) {
        if (css[j] === "{") depth++;
        else if (css[j] === "}") depth--;
        j++;
      }
      if (depth !== 0) fail("styles.css: unbalanced braces");
      items.push({ prelude: prelude.trim(), body: css.slice(i + 1, j - 1) });
      prelude = "";
      i = j;
    } else if (ch === ";") {
      items.push({ prelude: prelude.trim(), body: null });
      prelude = "";
      i++;
    } else {
      prelude += ch;
      i++;
    }
  }
  if (prelude.trim()) fail(`styles.css: trailing content "${prelude.trim().slice(0, 40)}"`);
  return items;
}

function scopeSelector(sel) {
  sel = sel.trim();
  if (sel === ":root" || sel === "body") return SCOPE;
  if (sel === "html") return `html:has(${SCOPE})`;
  return `${SCOPE} ${sel}`;
}

function mapFonts(text) {
  return text.replace(/(font-family:[^;}]*|--font-[\w-]+:[^;}]*)/g, (decl) =>
    decl.replace(/"([^"]+)"/g, (m, family) => {
      const variable = FONT_MAP[family];
      if (!variable) fail(`styles.css: unknown font "${family}". Add it to FONT_MAP here and to next/font in app/page.tsx.`);
      return `var(${variable}), ${m}`;
    }),
  );
}

function scopeBlocks(css, keyframes) {
  const out = [];
  for (const { prelude, body } of parseBlocks(css)) {
    if (body === null) {
      if (/^@(import|source)\b/.test(prelude)) continue;
      fail(`styles.css: unsupported at-statement "${prelude}"`);
    } else if (prelude.startsWith("@theme")) {
      const fonts = [...body.matchAll(/(--font-[\w-]+:[^;]+;)/g)].map((m) => m[1]);
      if (fonts.length) out.push(`${SCOPE} { ${mapFonts(fonts.join(" "))} }`);
    } else if (prelude.startsWith("@keyframes")) {
      const name = prelude.replace("@keyframes", "").trim();
      keyframes.add(name);
      out.push(`${prelude} {${body}}`);
    } else if (prelude.startsWith("@media")) {
      out.push(`${prelude} {\n${scopeBlocks(body, keyframes).map((l) => `  ${l}`).join("\n")}\n}`);
    } else if (prelude.startsWith("@")) {
      fail(`styles.css: unsupported at-rule "${prelude.slice(0, 40)}"`);
    } else {
      const selectors = splitTopLevel(prelude).map(scopeSelector).join(", ");
      out.push(`${selectors} { ${mapFonts(body.trim())} }`);
    }
  }
  return out;
}

function splitTopLevel(selectorList) {
  const parts = [];
  let depth = 0;
  let cur = "";
  for (const ch of selectorList) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(cur);
      cur = "";
    } else cur += ch;
  }
  parts.push(cur);
  return parts;
}

function buildCss(source, sha) {
  let css = source.replace(/\/\*[\s\S]*?\*\//g, "");
  if (/url\(/.test(css)) fail("styles.css contains url(); map those assets in scripts/sync-lovable.mjs.");
  const keyframes = new Set();
  let out = scopeBlocks(css, keyframes).join("\n");
  for (const name of keyframes) {
    out = out.replace(new RegExp(`@keyframes ${name}\\b`, "g"), `@keyframes pb-${name}`);
    out = out.replace(new RegExp(`(animation:\\s*)${name}\\b`, "g"), `$1pb-${name}`);
  }
  assertScoped(out);
  return `/* GENERATED by scripts/sync-lovable.mjs from ${BRANCH}@${sha.slice(0, 7)}. Do not edit; edit in Lovable and re-sync. */\n${out}\n`;
}

function assertScoped(css) {
  for (const { prelude, body } of parseBlocks(css)) {
    if (body === null) fail("scoped css: stray statement");
    if (prelude.startsWith("@keyframes")) continue;
    if (prelude.startsWith("@media")) {
      assertScoped(body);
      continue;
    }
    for (const sel of splitTopLevel(prelude)) {
      const s = sel.trim();
      if (!s.startsWith(SCOPE) && !s.startsWith(`html:has(${SCOPE})`)) fail(`scoped css: unscoped selector "${s}"`);
    }
  }
}

try {
  process.exitCode = main();
} catch (e) {
  console.error(`SYNC FAILED (nothing was written): ${e.message}`);
  process.exitCode = 2;
}
