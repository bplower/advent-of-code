
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const shiny_gold = 'shiny gold';

// wavy purple bags contain 1 drab white bag, 4 muted yellow bags, 2 wavy aqua bags.
const parseRule = (acc0, ruleText) => {
  const [subjectType, targetText] = ruleText.split(' bags contain ');
  const targets = R.reduce((acc1, i) => {
    if (i === 'no other bags.') {
      return acc1;
    }
    const parts = i.split(' ');
    return {
      ...acc1,
      [parts.slice(1, 3).join(' ')]: parseInt(parts[0])
    }
  }, {}, targetText.split(', '));
  if (acc0[subjectType] !== undefined) {
    console.log(`Subject type ${subjectType} already in dictionary`);
  }
  return {
    ...acc0,
    [subjectType]: targets
  }
};

(async () => {
  const data = await readFile('./data.txt');
  const unparsedRules = data.toString().split('\n');
  const parsedRules = R.reduce(parseRule, {}, unparsedRules);

  const countSubBags = (bagType) => {
    if (R.keys(parsedRules[bagType]).length === 0) {
      return 0;
    }
    const counts = R.map(
      k => parsedRules[bagType][k] + parsedRules[bagType][k] * countSubBags(k),
      R.keys(parsedRules[bagType])
    );
    return R.sum(counts);
  };

  const result = countSubBags(shiny_gold);
  console.log(result);
})();
