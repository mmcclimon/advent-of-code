const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    input: fs.createReadStream('input-day1.txt'),
    crlfDelay: Infinity,
});

const fuelRequired = (mass) => Math.floor(mass / 3) - 2;
const fuelRequiredExtra = (mass) => {
    let total = 0;
    let base = mass;

    do {
        base = fuelRequired(base);
        total += base >= 0 ? base : 0;
    } while (base >= 0);

    return total;
};

/*
const tests = [14, 1969, 100756];
for (const t of tests) {
    console.log(fuelRequiredExtra(t));
}
*/


let sum1 = 0;
let sum2 = 0;

rl.on('line', (line) => {
    const mass = parseInt(line);
    sum1 += fuelRequired(mass);
    sum2 += fuelRequiredExtra(mass);
}).on('close', () => {
    console.log(sum1);
    console.log(sum2);
});
