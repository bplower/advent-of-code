
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const passportRegex = /(?<field>[a-z]+):(?<value>[\S]+)/g;

const requiredProps = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
const optionalProps = ['cid'];

const validHeightRegex = /(?<value>[\d]+)(?<units>cm|in)/
const validHairColorRegex = /#([a-z0-9]{6})$/
const validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

const isValid = passport => {
  // Validate the props
  if (R.includes(undefined, R.props(requiredProps, passport))) {
    console.log('rejected over missing keys')
    return false;
  }

  // Validate birth year
  if (!(passport.byr.length === 4 && parseInt(passport.byr) >= 1920 && parseInt(passport.byr) <= 2002)) {
    console.log('rejected over birth year')
    return false;
  }

  // Validate issue year
  if (!(passport.iyr.length === 4 && parseInt(passport.iyr) >= 2010 && parseInt(passport.iyr) <= 2020)) {
    console.log('rejected over issue year')
    return false;
  }

  // Validate expiration year
  if (!(passport.eyr.length === 4 && parseInt(passport.eyr) >= 2020 && parseInt(passport.eyr) <= 2030)) {
    console.log('rejected over expiration year')
    return false;
  }

  // Validate height
  // console.log(passport.hgt.match(validHeightRegex))
  const height = (passport.hgt.match(validHeightRegex) || { groups: {} }).groups;
  if (  !(height.units === 'cm' && height.value >= 150 && height.value <= 193)
     && !(height.units === 'in' && height.value >= 59 && height.value <= 76)) {
    console.log('rejected over height')
    return false;
  }

  // validate hair color
  if (!passport.hcl.match(validHairColorRegex)) {
    console.log('rejected over hair color')
    return false;
  }

  // validate eye color
  if (!R.includes(passport.ecl, validEyeColors)) {
    console.log('rejected over eye color')
    return false
  }

  // Validate passport id
  if (!(passport.pid.length === 9 && parseInt(passport.pid, 10))) {
    console.log('rejected passport id')
    return false;
  }

  return true;
}

(async () => {

  // For debugging
  // console.log(isValid({
  //   byr: '1926',
  //   iyr: '2018',
  //   eyr: '2020',
  //   hgt: '170cm',
  //   hcl: '#18171d',
  //   ecl: 'amb',
  //   pid: '0123456789',
  // }))
  // End debugging

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
