
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const passportRegex = /(?<field>[a-z]+):(?<value>[\S]+)/g;

const requiredProps = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
const optionalProps = ['cid'];

const isValid = passport =>
  !R.includes(undefined, R.props(requiredProps, passport));

(async () => {
  const data = await readFile('./data.txt');
  const passportsMultiLine = data.toString().split("\n\n");

  const passportsSingleLine = R.map(p => p.split('\n').join(' '), passportsMultiLine);
  console.log(passportsSingleLine[0])

  const passports = R.map(i => {
    const parts = Array.from(i.matchAll(passportRegex))
    return R.mergeAll(R.map(p => ({ [p.groups.field]: p.groups.value }), parts));
  }, passportsSingleLine);

  // console.log(passports.length);

  const numValid = (R.reduce( (acc, i) => i ? acc + 1 : acc, 0, R.map(isValid, passports)));

  console.log(numValid);
})();
