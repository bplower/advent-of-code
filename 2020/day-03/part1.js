
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const passswordRegex = /(?<min>\d+)-(?<max>\d+) (?<char>[a-z]): (?<password>[a-z]*)/;

(async () => {
  const data = await readFile('./data.txt');
  const lines = data.toString().split("\n");

  const patternWidth = lines[0].length;

  const startState = {
    trees: 0,
    position: 0
  };

  const reduceRow = ({ trees, position }, row) => {
    const isTree = row[position] === '#';
    trees = row[position] === '#' ? trees + 1 : trees;
    const newPosition = (position + 3) % patternWidth;
    // For debugging
    const icon = isTree ? 'X' : 'O';
    const tempRow = row.substring(0, position) + icon + row.substring(position + 1);
    console.log(tempRow, position, newPosition, isTree, trees);
    // End debugging
    return {
      trees,
      position: newPosition
    };
  };

  const { trees } = R.reduce(reduceRow, startState, lines);

  console.log(trees);
})();
