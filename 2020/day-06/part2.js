
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const countAnswer = input => R.countBy(R.toLower)(Array.from(input));

const countAllYes = (acc, obj) => {
  if (obj['\n'] === undefined) {
    obj['\n'] = 0;
  }
  const members = R.prop("\n", obj) + 1;

  const questions = R.keys(R.omit(['\n'], obj));
  const everyoneYes = R.filter(i => obj[i] === members, questions);
  return acc + everyoneYes.length;
}

(async () => {
  const data = await readFile('./data.txt');
  const groupText = data.toString().split('\n\n');

  const answerObjs = R.map(countAnswer, groupText);
  const sumAnswers = R.reduce(
    countAllYes,
    0,
    answerObjs
  );

  console.log(sumAnswers);
})();
