const fs = require("fs");
const readline = require("readline");

const getLines = async function (filename, cb) {
    const rl = readline.createInterface({
        input: fs.createReadStream(filename),
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        cb(line);
    }
};

const getLinesInt = async function (filename, cb) {
    return getLines(filename, (line) => cb(parseInt(line)));
}

const fuelRequired = (mass) => Math.floor(mass / 3) - 2;
const fuelRequiredExtra = (mass) => {
    const fuel = fuelRequired(mass);
    return fuel >= 0 ? fuel + fuelRequired(fuel) : fuel;
};

let sum1 = 0;
let sum2 = 0;

getLinesInt('input-day1.txt', (mass) => {
    sum1 += fuelRequired(mass);
    sum2 += fuelRequiredExtra(mass);
}).then(() => {
    console.log(sum1, sum2);
});
