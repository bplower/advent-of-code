
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const shiny_gold = 'shiny gold';
const has_shiny_gold = R.has(shiny_gold);

// wavy purple bags contain 1 drab white bag, 4 muted yellow bags, 2 wavy aqua bags.
const parseRule = (acc0, ruleText) => {
  const [subjectType, targetText] = ruleText.split(' bags contain ');
  const targets = R.reduce((acc1, i) => {
    if (i === 'no other bags') {
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

const canHoldGold = rules => i => {
  // Check if it can hold gold
  if (has_shiny_gold(rules[i]) && rules[i][shiny_gold] > 0) {
    return true;
  }

  // Check each of it's sub bags
  const canHoldGold_ = canHoldGold(rules);
  const result = R.reduce((acc, b) => {
    if (acc) {
      return acc;
    }
    return canHoldGold_(b);
  }, false, R.keys(rules[i]));
  return result;
};

const countHoldsGold = rules => {
  const canHoldGold_ = canHoldGold(rules);
  return (acc, i) => {
    if (canHoldGold_(i)) {
      return acc + 1;
    } else {
      return acc;
    }
  };
}

(async () => {
  const data = await readFile('./data.txt');
  const unparsedRules = data.toString().split('\n');
  const parsedRules = R.reduce(parseRule, {}, unparsedRules);
  const result = R.reduce(countHoldsGold(parsedRules), 0, R.keys(parsedRules));

  console.log(result);
})();
