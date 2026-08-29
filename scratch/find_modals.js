const fs = require('fs');
const content = fs.readFileSync('c:/Etulle/view/modals.php', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.includes('id="modal-')) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});
