const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // Remove the absolute positioned one at the bottom of body
    content = content.replace(/<div style="position:absolute; bottom:10px; left:0; width:100%; text-align:center; font-size:0\.75rem; color:#a0aec0; z-index:9999; pointer-events:none; font-family:sans-serif;">System Version: v1\.1 \(Auto-Sync\)<\/div>\n/g, '');

    // Add it right before <script> inside the container or outside it
    // Actually, replacing `<script>` is the easiest reliable anchor
    // To put it inside the container, we have to find the end of .container
    // Let's just find `    </div>\n\n    <script>` or similar
    const regex = /        <\/div>\n    <\/div>\n\n    <script>/g;
    const replacement = `            <div style="text-align:center; font-size:0.75rem; color:#a0aec0; margin-top:10px;">System Version: v1.1 (Auto-Sync)</div>\n        </div>\n    </div>\n\n    <script>`;

    if (content.match(regex)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(p, content);
        console.log('Placed under back button for ' + form);
    } else {
        // Fallback if formatting differs
        content = content.replace(/<\/div>\s*<\/div>\s*<script>/g, `            <div style="text-align:center; font-size:0.75rem; color:#a0aec0; margin-top:10px;">System Version: v1.1 (Auto-Sync)</div>\n        </div>\n    </div>\n\n    <script>`);
        fs.writeFileSync(p, content);
        console.log('Placed under back button (fallback) for ' + form);
    }
});
