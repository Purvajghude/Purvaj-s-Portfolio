// WCAG contrast for the alpha-over-ground text tokens.
const lin = (c) => { c/=255; return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4); };
const L = ([r,g,b]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const ratio = (a,b) => { const l1=L(a),l2=L(b); const [hi,lo]=l1>l2?[l1,l2]:[l2,l1]; return (hi+0.05)/(lo+0.05); };
const over = (fg,a,bg) => fg.map((c,i)=>Math.round(a*c+(1-a)*bg[i]));

const cases = [
  ['LIGHT --text-2 (0.64)', [16,16,18], 0.64, [232,232,229]],
  ['LIGHT --text-3 (0.40)', [16,16,18], 0.40, [232,232,229]],
  ['DARK  --text-2 (0.62)', [242,241,238], 0.62, [11,11,13]],
  ['DARK  --text-3 (0.38)', [242,241,238], 0.38, [11,11,13]],
];
for (const [name, fg, a, bg] of cases) {
  const r = ratio(over(fg,a,bg), bg);
  const body = r >= 4.5 ? 'PASS' : 'FAIL';
  const large = r >= 3.0 ? 'pass' : 'FAIL';
  console.log(`${name.padEnd(24)} ${r.toFixed(2)}:1   body(4.5) ${body}   large(3.0) ${large}`);
}
