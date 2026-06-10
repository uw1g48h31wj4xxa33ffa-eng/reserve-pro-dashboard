const fs = require('fs');

const newRes = fs.readFileSync('forms_demo/new-reservation/index.html', 'utf8');
let change = fs.readFileSync('forms_demo/change/index.html', 'utf8');

const newCssMatch = newRes.match(/<style>([\s\S]*?)<\/style>/);
if (!newCssMatch) throw new Error('No style in newRes');
let newCss = newCssMatch[1];

// Extract change specific classes
const specificClassesRegex = /(?:\.policy-card-group|\.policy-card|\.policy-content|\.policy-label|\.policy-main-text|\.info-note|\.app-container|\.form-wrapper|\.step-header|\.step-desc)\s*\{[\s\S]*?\}/g;
let extraCss = '';
let match;
while ((match = specificClassesRegex.exec(change)) !== null) {
    extraCss += match[0] + '\n\n';
}

extraCss += `
        .warning-box {
            background: #fff5f5;
            border: 2px solid #feb2b2;
            border-radius: 20px;
            padding: 24px;
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
        }

        .warning-box.compact {
            padding: 32px 20px;
            text-align: center;
            background: #fffcfc;
            border: 1px solid #fee2e2;
            border-radius: 24px;
            flex-direction: column;
            justify-content: center;
        }

        .warning-icon { font-size: 1.5rem; }
        .warning-content h3 { color: var(--accent-red); font-size: 1rem; margin-bottom: 8px; font-weight: 900; }
        .warning-content p { color: #c53030; font-size: 0.95rem; font-weight: 700; }
`;

const combinedCss = newCss + '\n/* --- CHANGE SPECIFIC --- */\n' + extraCss;

// Replace change CSS
change = change.replace(/<style>[\s\S]*?<\/style>/, '<style>\n' + combinedCss + '\n    </style>');

// Make sure HTML container classes match new-reservation's structure
change = change.replace(/class="app-container"/g, 'class="container"');
change = change.replace(/class="form-wrapper"/g, 'class="form-body"');

fs.writeFileSync('forms_demo/change/index.html', change);
console.log('Fully replaced CSS and aligned wrapper classes.');
