
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

(async () => {
  const data = await readFile('./data.txt');
  const lines = data.toString().split("\n");

  const patternWidth = lines[0].length;

  const startState = {
    trees: 0,
    position: 0
  };

  const reduceRow = right => ({ trees, position }, row) => {
    const isTree = row[position] === '#';
    trees = isTree ? trees + 1 : trees;
    const newPosition = (position + right) % patternWidth;
    // For debugging
    // const icon = isTree ? 'X' : 'O';
    // const tempRow = row.substring(0, position) + icon + row.substring(position + 1);
    // console.log(tempRow, position, newPosition, isTree, trees);
    // End debugging
    return {
      trees,
      position: newPosition
    };
  };

  const calculateSlopeTrees = ({right, down}) => {
    const indexedFunc = R.addIndex(R.map);
    const indexedLines = indexedFunc((val, idx) => ({ val, idx }), lines);
    const filteredLines = R.filter( (i) => i.idx % down === 0, indexedLines);

    // console.log("normal lines", lines.length);
    // console.log("filtered lines", filteredLines.length);
    const { trees } = R.reduce(reduceRow(right), startState, R.map(l => l.val, filteredLines));
    return trees;
  };

  const slopes = [
    { right: 1, down: 1 },
    { right: 3, down: 1 },
    { right: 5, down: 1 },
    { right: 7, down: 1 },
    { right: 1, down: 2 },
  ];

  const results = R.map(calculateSlopeTrees, slopes);

  console.log(results);

  const answer = R.reduce(R.multiply, 1, results);

  console.log(answer);
})();
