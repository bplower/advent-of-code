
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const countAnswer = input => R.countBy(R.toLower)(Array.from(input));

(async () => {
  const data = await readFile('./data.txt');
  const groupText = data.toString().split('\n\n');

  const linesByGroup = R.map(g => g.split('\n').join(''), groupText);

  const answerObjs = R.map(countAnswer, linesByGroup)

  const sumAnswers = R.reduce((acc, obj) => acc + R.keys(obj).length, 0, answerObjs);
  console.log(sumAnswers);

})();
