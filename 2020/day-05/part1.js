
const R = require('ramda');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

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

const convertCodes = obj => {
  const rowNum = rowFromBinary(obj.rowCode);
  const seatNum = seatFromBinary(obj.seatCode);
  const seatId = (rowNum * 8) + seatNum;
  return { ...obj, rowNum, seatNum, seatId };
};
const exampleCode = objFromCode('FBFBBFFRLR');

(async () => {
  const data = await readFile('./data.txt');
  const codeList = data.toString().split("\n");
  const codeListObj = R.map(objFromCode, codeList);

  const decoded = R.map(convertCodes, codeListObj);

  const seatIds = R.map(R.prop('seatId'), decoded);
  const maxSeatId = R.reduce(R.max, 0, seatIds);
  console.log(maxSeatId);
})();
