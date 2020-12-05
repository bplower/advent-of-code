
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const chalk = require('chalk');

const objFromCode = i => ({
  rowCode: i.substring(0, 7),
  seatCode: i.substring(7, 10)
})

const fromBinaryCode = (zeroRegex, oneRegex, code) =>
  parseInt(
    code.replace(zeroRegex, '0').replace(oneRegex, '1'),
    2
  );

const rowFromBinary = code => fromBinaryCode(/F/g, /B/g, code);

const seatFromBinary = code => fromBinaryCode(/L/g, /R/g, code);

const calcSeatId = (row, seat) => (row * 8) + seat;

const convertCodes = obj => {
  const rowNum = rowFromBinary(obj.rowCode);
  const seatNum = seatFromBinary(obj.seatCode);
  const seatId = calcSeatId(rowNum, seatNum);
  return { ...obj, rowNum, seatNum, seatId };
};

const seatList = Array.from(Array(8).keys());

const rowReport = seatDict => row => R.map(seat => {
  const seatId = calcSeatId(row, seat);
  const hasSeat = R.has(seatId, seatDict);
  const seatString = seatId.toString().padStart(3);
  const coloredSeat = hasSeat ? chalk.green(seatString) : chalk.grey(seatString);
  return `[ ${coloredSeat} ]`
}, seatList);

const printVisualSeating = (seatIds, seatDict) => {
  // Get first and last row with people
  const maxSeatId = R.reduce(R.max, 0, seatIds);
  const minSeatId = R.reduce(R.min, maxSeatId, seatIds);
  const lastRow = seatDict[maxSeatId].rowNum;
  const firstRow = seatDict[minSeatId].rowNum;
  const tmpRowList = Array.from(Array(128).keys());
  const rowList = tmpRowList.slice(firstRow, lastRow + 1);

  const rowReporter = rowReport(seatDict);

  rowList.forEach(row => {
    console.log(rowReporter(row).join(' '));
  });
}

(async () => {
  const data = await readFile('./data.txt');
  const codeList = data.toString().split("\n");
  const codeListObj = R.map(objFromCode, codeList);

  const decoded = R.map(convertCodes, codeListObj);
  const seatDict = R.reduce((acc, i) => ({ ...acc, [i.seatId]: i }), {}, decoded);
  const seatIds = R.map(R.prop('seatId'), decoded).sort();

  // Print visual seating for debugging
  printVisualSeating(seatIds, seatDict);

  // Calculate target seat
  const seatsMissingNext = R.filter(i => {
    const nextExists = R.has(i + 1, seatDict);
    const afterExists = R.has(i + 2, seatDict);
    return !nextExists && afterExists
  }, seatIds);

  const ourSeat = seatsMissingNext[0] + 1;
  console.log(ourSeat);
})();
