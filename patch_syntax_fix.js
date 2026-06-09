const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // Remove the extra closing brace
    const target = /const stat = document\.getElementById\('sync-status-display'\);\s*if \(stat\) stat\.innerText = `System Version: v1\.1 \(Auto-Sync\) - 最終同期: \$\{new Date\(\)\.toLocaleTimeString\(\)\} \(ブロック: \$\{blockedSlotsList\.length\}件\)`;\s*\}\s*\}\s*catch \(e\)/g;
    const replacement = `const stat = document.getElementById('sync-status-display');
                    if (stat) stat.innerText = \`System Version: v1.1 (Auto-Sync) - 最終同期: \${new Date().toLocaleTimeString()} (ブロック: \${blockedSlotsList.length}件)\`;
            } catch (e)`;
            
    if (content.match(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(p, content);
        console.log('Fixed JS syntax error in ' + form);
    } else {
        console.log('Regex not matched in ' + form);
    }
});
