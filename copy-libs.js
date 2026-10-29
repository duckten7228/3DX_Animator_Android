const fs = require('fs');
const path = require('path');
const t = path.join('node_modules', 'three');
const out = path.join('www', 'libs');
fs.mkdirSync(out, { recursive: true });
const files = {
  'build/three.min.js': 'three.min.js',
  'examples/js/controls/OrbitControls.js': 'controls/OrbitControls.js',
  'examples/js/loaders/GLTFLoader.js': 'loaders/GLTFLoader.js',
  'examples/js/exporters/GLTFExporter.js': 'exporters/GLTFExporter.js',
  'examples/js/loaders/OBJLoader.js': 'loaders/OBJLoader.js'
};
for (const [src, dst] of Object.entries(files)) {
  const to = path.join(out, dst);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(path.join(t, src), to);
  console.log('copied', dst);
}
