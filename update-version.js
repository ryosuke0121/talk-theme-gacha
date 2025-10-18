const fs = require('fs');
const path = require('path');

// package.jsonからバージョンを読み込む
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// index.htmlを読み込む
const indexPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// バージョン番号を更新
indexHtml = indexHtml.replace(
    /<span id="version">[\d.]+<\/span>/,
    `<span id="version">${version}</span>`
);

// ファイルに書き込む
fs.writeFileSync(indexPath, indexHtml, 'utf8');

console.log(`✅ バージョンを ${version} に更新しました`);
