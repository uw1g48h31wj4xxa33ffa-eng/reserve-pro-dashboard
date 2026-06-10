const fs = require('fs');
let html = fs.readFileSync('forms_demo/change/index.html', 'utf8');

const missingCss = `
        .policy-card:hover {
            border-color: #cbd5e1;
            background: #f8fafc;
        }

        .policy-card.active {
            border-color: #3a7bd5;
            background: rgba(58, 123, 213, 0.1);
        }

        .policy-card.active .policy-main-text {
            color: #3a7bd5;
        }
`;

html = html.replace('var(--border)', '#e2e8f0');
html = html.replace('var(--transition)', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
html = html.replace('var(--text-light)', '#718096');
html = html.replace('/* --- CHANGE SPECIFIC --- */', '/* --- CHANGE SPECIFIC --- */\n' + missingCss);

fs.writeFileSync('forms_demo/change/index.html', html);
console.log('Fixed policy-card CSS');
