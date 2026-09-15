/**
 * Mechanical pre-flight audit against DESIGN_CONTRACT.md section 12.
 * Node is used deliberately: PowerShell text pipelines corrupt UTF-8 punctuation.
 * Run: node audit.cjs <src-dir>
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || 'src';
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); }
    else if (/\.(jsx?|css|html)$/.test(e.name)) files.push(p);
  }
})(ROOT);

const EM = '\u2014', EN = '\u2013';
const results = [];
const add = (level, rule, file, line, detail) =>
  results.push({ level, rule, file, line, detail });

for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const lines = text.split(/\r?\n/);
  const isCss = f.endsWith('.css');

  lines.forEach((ln, i) => {
    const n = i + 1;

    if (ln.includes(EM) || ln.includes(EN))
      add('FAIL', 'em/en dash', f, n, ln.trim().slice(0, 90));

    if (/from ['"]framer-motion['"]/.test(ln))
      add('FAIL', 'framer-motion import', f, n, ln.trim());

    if (/addEventListener\(\s*['"]scroll['"]/.test(ln))
      add('FAIL', 'scroll listener', f, n, ln.trim());

    if (/\b100vh\b/.test(ln))
      add('FAIL', '100vh (use 100dvh)', f, n, ln.trim());

    if (isCss && /border-radius\s*:/.test(ln) && !/:\s*(0|var\(--radius\))\s*;?/.test(ln))
      add('FAIL', 'non-zero radius', f, n, ln.trim());

    if (/#000000\b|#000\b(?![0-9a-f])|#ffffff\b|#fff\b(?![0-9a-f])/i.test(ln))
      add('WARN', 'pure black/white', f, n, ln.trim().slice(0, 90));

    if (/Fraunces|Instrument[_ ]Serif|['"]Inter['"]/.test(ln))
      add('FAIL', 'banned typeface', f, n, ln.trim().slice(0, 90));

    if (/#(a855f7|8b5cf6|7c3aed|6366f1|863bff)/i.test(ln))
      add('FAIL', 'AI-purple hex', f, n, ln.trim().slice(0, 90));

    // Hand-rolled icon paths. Long path data means a drawn glyph.
    const m = ln.match(/<path[^>]*\sd=["']([^"']{80,})/);
    if (m) add('WARN', 'hand-rolled svg path', f, n, m[1].slice(0, 40) + '...');

    if (/Scroll to explore|scroll to investigate|↓\s*scroll/i.test(ln))
      add('FAIL', 'scroll cue', f, n, ln.trim().slice(0, 90));
  });
}

// Home-page budgets: eyebrows and marquees.
const sectionsDir = path.join(ROOT, 'sections');
if (fs.existsSync(sectionsDir)) {
  const sectionFiles = fs.readdirSync(sectionsDir).filter((f) => f.endsWith('.jsx'));
  let eyebrows = 0;
  const perFile = {};
  for (const sf of sectionFiles) {
    const t = fs.readFileSync(path.join(sectionsDir, sf), 'utf8');
    const c = (t.match(/u-eyebrow/g) || []).length;
    perFile[sf] = c;
    eyebrows += c;
  }
  const cap = Math.ceil(sectionFiles.length / 3);
  add(
    eyebrows <= cap ? 'PASS' : 'FAIL',
    'eyebrow budget',
    'sections/',
    0,
    `${eyebrows} used, cap ${cap} (${sectionFiles.length} sections). ` +
      Object.entries(perFile).filter(([, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(' ')
  );
}

const order = { FAIL: 0, WARN: 1, PASS: 2 };
results.sort((a, b) => order[a.level] - order[b.level]);

const fails = results.filter((r) => r.level === 'FAIL').length;
const warns = results.filter((r) => r.level === 'WARN').length;

for (const r of results) {
  const loc = r.line ? `${r.file}:${r.line}` : r.file;
  console.log(`[${r.level}] ${r.rule.padEnd(22)} ${loc}\n         ${r.detail}`);
}
console.log(`\n${files.length} files scanned. ${fails} FAIL, ${warns} WARN.`);
process.exit(fails > 0 ? 1 : 0);
