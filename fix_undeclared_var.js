const fs = require('fs');

// counseling, new-reservation, change は currentSelectedTimeSlot の宣言が抜けている
const forms = ['counseling', 'new-reservation', 'change'];

forms.forEach(f => {
    const p = 'forms_v3/' + f + '/index.html';
    if (!fs.existsSync(p)) return;
    let txt = fs.readFileSync(p, 'utf8');

    // currentSelectedSlots の宣言行の直後に currentSelectedTimeSlot を追加する
    if (!txt.includes('let currentSelectedTimeSlot')) {
        txt = txt.replace(
            'let currentSelectedSlots = [];',
            'let currentSelectedSlots = [];\n        let currentSelectedTimeSlot = "";'
        );
        fs.writeFileSync(p, txt);
        console.log(f + ': fixed (added currentSelectedTimeSlot declaration)');
    } else {
        console.log(f + ': already has declaration, skipping');
    }
});
