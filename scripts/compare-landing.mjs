#!/usr/bin/env node
// Parity gate: compare the server-rendered text and media of the Lovable site against this app.
// Usage: node scripts/compare-landing.mjs [lovableUrl] [appUrl]
// Defaults: https://puntabiker.lovable.app  vs  http://localhost:3000
// Exit code 0 = identical text and media, 1 = differences, 2 = fetch failure.

const [lovableUrl = "https://puntabiker.lovable.app", appUrl = "http://localhost:3000"] = process.argv.slice(2);

const ENTITIES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#x27;": "'", "&#39;": "'", "&nbsp;": " " };
// "Edit with Lovable" badge is injected by Lovable hosting only; it is not part of the design.
const LOVABLE_BADGE = new Set(["Edit with", "Edit with Lovable", "Dismiss"]);
const decode = (s) => s.replace(/&(?:amp|lt|gt|quot|nbsp|#x27|#39);/g, (m) => ENTITIES[m]);

async function load(url) {
  const res = await fetch(url, { headers: { "user-agent": "punta-bikers-parity-check" } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

function analyze(html) {
  const body = html.replace(/<head[\s\S]*?<\/head>/i, "");
  const stripped = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const text = stripped
    .split(/<[^>]+>/)
    .map((t) => decode(t).replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const media = new Set();
  for (const m of stripped.matchAll(/\b(?:src|poster)="([^"]+)"/g)) {
    media.add(m[1].split("?")[0].split("/").pop().replace(/-[A-Za-z0-9_]{8}(\.\w+)$/, "$1"));
  }
  const alts = [...stripped.matchAll(/\balt="([^"]*)"/g)].map((m) => decode(m[1]));
  const labels = [...stripped.matchAll(/\baria-label="([^"]*)"/g)].map((m) => decode(m[1])).filter((l) => !LOVABLE_BADGE.has(l));
  return { text: text.filter((t) => !LOVABLE_BADGE.has(t)), media: [...media].sort(), alts, labels };
}

function diffSequences(a, b) {
  const n = a.length;
  const m = b.length;
  const lcs = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
  const onlyA = [];
  const onlyB = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) onlyA.push(a[i++]);
    else onlyB.push(b[j++]);
  }
  while (i < n) onlyA.push(a[i++]);
  while (j < m) onlyB.push(b[j++]);
  return { onlyA, onlyB };
}

try {
  const [L, A] = (await Promise.all([load(lovableUrl), load(appUrl)])).map(analyze);
  let differences = 0;
  const report = (title, a, b) => {
    const { onlyA, onlyB } = diffSequences(a, b);
    if (!onlyA.length && !onlyB.length) {
      console.log(`OK   ${title}: identical (${a.length} items)`);
      return;
    }
    differences += onlyA.length + onlyB.length;
    console.log(`DIFF ${title}`);
    onlyA.slice(0, 25).forEach((t) => console.log(`  - only Lovable: ${t.slice(0, 120)}`));
    onlyB.slice(0, 25).forEach((t) => console.log(`  + only app:     ${t.slice(0, 120)}`));
  };
  report("visible text", L.text, A.text);
  report("media files (img/video/source basenames)", L.media, A.media);
  report("image alt texts", L.alts, A.alts);
  report("aria-labels", L.labels, A.labels);
  console.log(differences ? `\n${differences} difference(s). Lovable=${lovableUrl} App=${appUrl}` : "\nPARITY OK: same text, media, alts and labels.");
  process.exitCode = differences ? 1 : 0;
} catch (e) {
  console.error(`COMPARE FAILED: ${e.message}`);
  process.exitCode = 2;
}
