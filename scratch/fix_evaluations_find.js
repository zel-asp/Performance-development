const fs = require('fs');
const path = 'c:/Etulle/js/performance.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/\(window\.dbEvaluations\s*\|\|\s*\[\]\)/g, 'getDbEvaluations()');

fs.writeFileSync(path, content, 'utf8');
console.log('Replaced successfully!');
