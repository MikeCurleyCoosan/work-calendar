const sh = require("./shifts");

console.log("START");

const getDayValue = (shiftName) => {
    switch (shiftName) {
        case sh.DAY_SHIFT:
            return 1;
        case sh.NIGHT_SHIFT:
            return 1;
        case sh.START_NIGHT_SHIFT:
            return 0.5;
        case sh.END_NIGHT_SHIFT:
            return 0.5;
        case sh.DAY_OFF:
            return 0;
    }
    console.error("unknown day:", shiftName);
};

sh.shift.A.forEach((day, index) => {
    let sum = (getDayValue(sh.shift.A[index])
        + getDayValue(sh.shift.B[index])
        + getDayValue(sh.shift.C[index])
        + getDayValue(sh.shift.D[index]));
    console.log(`sum for day: ${index + 1} = ${sum}`);
});

console.log("STOP");
