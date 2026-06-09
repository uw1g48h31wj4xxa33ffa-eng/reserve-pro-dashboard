const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // Add an ID to the system version div so we can update it
    content = content.replace(/<div style="text-align:center; font-size:0\.75rem; color:#a0aec0; margin-top:10px;">System Version: v1\.1 \(Auto-Sync\)<\/div>/g, 
        '<div id="sync-status-display" style="text-align:center; font-size:0.75rem; color:#a0aec0; margin-top:10px;">System Version: v1.1 (Auto-Sync) - 待機中...</div>');

    // Update refreshBookedSlots to change the text on success/failure
    const regex = /async function refreshBookedSlots\(\) \{\s*try \{\s*const res = await fetch\('http:\/\/localhost:3001\/api\/holidays\?t=' \+ new Date\(\)\.getTime\(\), \{ cache: 'no-store' \}\);\s*if \(res\.ok\) \{\s*const data = await res\.json\(\);\s*if \(data\.holidays\) \{\s*holidaysList = Object\.keys\(data\.holidays\);\s*\}\s*if \(data\.blockedSlots\) \{\s*blockedSlotsList = data\.blockedSlots;\s*\}\s*const stat = document\.getElementById\('sync-status-display'\);\s*if \(stat\) stat\.innerText = \`System Version: v1\.1 \(Auto-Sync\) - 最終同期: \$\{new Date\(\)\.toLocaleTimeString\(\)\} \(ブロック: \$\{blockedSlotsList\.length\}件\)\`;\s*\}\s*\} catch \(e\) \{\s*console\.error\("ローカルサーバーとの通信エラー:", e\);\s*const stat = document\.getElementById\('sync-status-display'\);\s*if \(stat\) stat\.innerText = \`System Version: v1\.1 \(Auto-Sync\) - 通信エラー: \$\{e\.message\}\`;\s*\}/g;
    
    // Actually, it's safer to just inject it before `renderCalendar();` inside refreshBookedSlots.
    const target = /\} catch \(e\) \{\s*console\.error\("ローカルサーバーとの通信エラー:", e\);\s*\}/g;
    const replacement = `    const stat = document.getElementById('sync-status-display');
                    if (stat) stat.innerText = \`System Version: v1.1 (Auto-Sync) - 最終同期: \${new Date().toLocaleTimeString()} (ブロック: \${blockedSlotsList.length}件)\`;
                }
            } catch (e) {
                console.error("ローカルサーバーとの通信エラー:", e);
                const stat = document.getElementById('sync-status-display');
                if (stat) stat.innerText = \`System Version: v1.1 (Auto-Sync) - 通信エラー: \${e.message}\`;
            }`;
    
    content = content.replace(target, replacement);

    fs.writeFileSync(p, content);
    console.log('Added sync status debugger for ' + form);
});
