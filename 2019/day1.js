const utils = require('./advent-utils.js');

const fuelRequired = (mass) => Math.floor(mass / 3) - 2;

const fuelRequiredExtra = (mass) => {
    const fuel = fuelRequired(mass);
    return fuel >= 0 ? fuel + fuelRequired(fuel) : fuel;
};

let sum1 = 0;
let sum2 = 0;

utils.getLinesInt('input-day1.txt', (mass) => {
    sum1 += fuelRequired(mass);
    sum2 += fuelRequiredExtra(mass);
}).then(() => {
    console.log(sum1, sum2);
});
