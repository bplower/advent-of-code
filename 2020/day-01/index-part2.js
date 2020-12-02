
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

(async () => {
  const data = await readFile('./data.txt');
  const lines = data.toString().split("\n");
  const nums = R.map(parseInt, lines);

  const add2020 = [];

  R.forEach(i => {
    R.forEach(k => {
      R.forEach(j => {
        if (i + k + j == 2020) {
          add2020.push([i, k, j].sort())
        }
      }, nums)
    }, nums)
  }, nums);

  const target = R.uniq(add2020)[0];

  const answer = R.reduce(R.multiply, 1, target);

  console.log(answer);
})();