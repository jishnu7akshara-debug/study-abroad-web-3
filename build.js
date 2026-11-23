const fs = require('fs');
const path = require('path');

function populate(dirName) {
  const target = path.join(__dirname, dirName);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  fs.mkdirSync(target, { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(target, 'index.html'));
  fs.cpSync(path.join(__dirname, 'css'), path.join(target, 'css'), { recursive: true });
  fs.cpSync(path.join(__dirname, 'js'), path.join(target, 'js'), { recursive: true });
}

populate('dist');
populate('public');
console.log('Build complete: synced to dist/ and public/');
