
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const passswordRegex = /(?<pos1>\d+)-(?<pos2>\d+) (?<char>[a-z]): (?<password>[a-z]*)/;

(async () => {
  const data = await readFile('./data.txt');
  const lines = data.toString().split("\n");

  let numCorrect = 0;

  R.forEach(i => {
    let { pos1, pos2, char, password } = i.match(passswordRegex).groups;
    pos1 = parseInt(pos1) - 1;
    pos2 = parseInt(pos2) - 1;
    const char1 = password[pos1];
    const char2 = password[pos2];
    const valid = char1 === char && char2 !== char ||
                  char1 !== char && char2 === char

    if (valid) {
      numCorrect += 1;
    }
  }, lines);

  console.log(numCorrect);
})();