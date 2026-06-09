const fs = require('fs');
const path = require('path');

const forms = ['counseling', 'new-reservation', 'referral-reservation', 'change'];

forms.forEach(form => {
    const p = path.join(__dirname, 'forms_v3', form, 'index.html');
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // Replace the specific state preservation block inside refreshBookedSlots
    const regex = /if \(savedPeriod === 'detailed'\) \{\s*document\.getElementById\('detailed-time-group'\)\.style\.display = "block";\s*document\.getElementById\('period-confirm-area'\)\.style\.display = "block";\s*if \(savedHour\) selectHourButton\(savedHour\);\s*\}/g;
    
    const replacement = `if (savedPeriod === 'detailed') {
                        document.getElementById('detailed-time-group').style.display = "block";
                        document.getElementById('period-confirm-area').style.display = "block";
                        
                        // If the hour button no longer exists, it was fully blocked
                        if (savedHour) {
                            const stillExists = Array.from(document.getElementById('hour-buttons-container').querySelectorAll('.slot-btn'))
                                .some(btn => parseInt(btn.getAttribute('data-value')) === parseInt(savedHour));
                            if (stillExists) {
                                selectHourButton(savedHour);
                            } else {
                                currentSelectedHour = "";
                                document.getElementById('minute-group').style.display = "none";
                            }
                        }
                    }`;

    if (content.match(regex)) {
        content = content.replace(regex, replacement);
        
        // We also need to invalidate any savedSlots that are now booked!
        const invalidationRegex = /currentSelectedSlots = savedSlots;/g;
        const invalidationReplacement = `currentSelectedSlots = savedSlots.filter(slot => {
                        if (slot === "午前" || slot === "午後" || slot === "終日") return true;
                        // It's a time string like "16:15"
                        return !isBooked(selectedDate, slot);
                    });`;
        content = content.replace(invalidationRegex, invalidationReplacement);

        // And we need to call updatePeriodActiveState to restore the blue highlights!
        const restoreHighlightsRegex = /currentSelectedHour = savedHour;\n/g;
        const restoreHighlightsReplacement = `currentSelectedHour = savedHour;
                    updatePeriodActiveState();\n`;
        content = content.replace(restoreHighlightsRegex, restoreHighlightsReplacement);
        
        fs.writeFileSync(p, content);
        console.log('Fixed state preservation bug for ' + form);
    } else {
        console.log('Regex not matched for ' + form);
    }
});
