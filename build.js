const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });

fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(dist, 'index.html'));
fs.cpSync(path.join(__dirname, 'css'), path.join(dist, 'css'), { recursive: true });
fs.cpSync(path.join(__dirname, 'js'), path.join(dist, 'js'), { recursive: true });

console.log('Build completed successfully. Files in dist:', fs.readdirSync(dist));
