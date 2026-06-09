const fs = require('fs');
const path = require('path');

const missingForms = ['new-reservation', 'change'];

const missingFunction = `
        function selectPeriodButton(value) {
            currentSelectedPeriod = value;

            const detailedGroup = document.getElementById('detailed-time-group');
            const confirmArea = document.getElementById('period-confirm-area');

            if (value === "") {
                detailedGroup.style.display = "none";
                confirmArea.style.display = "none";
                currentSelectedSlots = [];
            } else if (value === "detailed") {
                currentSelectedSlots = [];
                detailedGroup.style.display = "block";
                confirmArea.style.display = "block";
                currentSelectedTimeSlot = "";
                updateTimeSlotActiveState();
            } else {
                detailedGroup.style.display = "none";
                confirmArea.style.display = "block";
                
                if (value === "終日") {
                    if (currentSelectedSlots.includes("終日")) {
                        currentSelectedSlots = [];
                    } else {
                        currentSelectedSlots = ["終日"];
                    }
                } else {
                    const allDayIdx = currentSelectedSlots.indexOf("終日");
                    if (allDayIdx !== -1) {
                        currentSelectedSlots.splice(allDayIdx, 1);
                    }
                    const idx = currentSelectedSlots.indexOf(value);
                    if (idx !== -1) {
                        currentSelectedSlots.splice(idx, 1);
                    } else {
                        currentSelectedSlots.push(value);
                    }
                }
            }
            updatePeriodActiveState();
            updateConfirmButtonState();
        }
`;

missingForms.forEach(form => {
    const filePath = path.join(__dirname, 'forms_v3', form, 'index.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add it right before function updatePeriodActiveState()
    if (!content.includes('function selectPeriodButton(')) {
        content = content.replace('        function updatePeriodActiveState() {', missingFunction + '\n        function updatePeriodActiveState() {');
        fs.writeFileSync(filePath, content);
        console.log(`Restored selectPeriodButton in ${form}`);
    }
});
