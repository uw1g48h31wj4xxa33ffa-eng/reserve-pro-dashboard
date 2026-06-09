const fs = require('fs');

let code = fs.readFileSync('app.js', 'utf8');

const target = `            if (isHoliday) {
                btn.disabled = true;
                btn.style.opacity = "0.5";
                btn.textContent = timeStr + " (休診)";
            } else {`;
            
const replacement = `            if (isHoliday) {
                btn.disabled = true;
                btn.style.opacity = "0.4";
                btn.style.textDecoration = "line-through";
                btn.textContent = timeStr;
            } else {`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('app.js', code);
    console.log("Replaced holiday btn text successfully");
} else {
    console.log("Target not found");
}
