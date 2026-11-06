// Usage: node scripts/obfuscate.js <input.html> <output.html>
//
// Finds every <script> ... </script> block in the HTML that has no src=
// attribute (i.e. it's inline code, not a link to an external file),
// runs it through javascript-obfuscator, and writes the scrambled
// version back in place. Everything else in the file (HTML, CSS,
// comments outside <script>) is left exactly as it was.

const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error('Usage: node obfuscate.js <input.html> <output.html>');
  process.exit(1);
}

let html = fs.readFileSync(inputPath, 'utf8');

const scriptTagRe = /<script((?:(?!src=)[^>])*)>([\s\S]*?)<\/script>/gi;

let count = 0;
html = html.replace(scriptTagRe, (full, attrs, code) => {
  if (!code.trim()) return full; // empty tag, nothing to obfuscate
  count++;
  const result = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.3,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false, // keep global/window-level names intact so other
                           // inline scripts and inline event handlers (onclick=…)
                           // in the HTML keep working
    selfDefending: true,
    disableConsoleOutput: false,
  }).getObfuscatedCode();
  return `<script${attrs}>${result}</script>`;
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Obfuscated ${count} inline <script> block(s). Wrote ${outputPath}`);
