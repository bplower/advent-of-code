
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const passswordRegex = /(?<min>\d+)-(?<max>\d+) (?<char>[a-z]): (?<password>[a-z]*)/;

(async () => {
  const data = await readFile('./data.txt');
  const lines = data.toString().split("\n");

  let numCorrect = 0;

  R.forEach(i => {
    let { min, max, char, password } = i.match(passswordRegex).groups;
    min = parseInt(min);
    max = parseInt(max);
    const count = R.reduce((acc, c) => c === char ? acc + 1 : acc, 0, password);
    const valid = min <= count && count <= max;

    if (valid) {
      numCorrect += 1;
    }
  }, lines);

  console.log(numCorrect);
})();