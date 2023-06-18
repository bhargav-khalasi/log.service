const fs = require('fs').promises;
const { FILE_PATH } = require('../constants');

const filePath = FILE_PATH;

let apihitCount = 0

async function logAPICall(data) {
  try {
    await fs.appendFile(filePath, JSON.stringify(data)+ "#");
    ++apihitCount;
    console.log('Successfully wrote to log file: ', apihitCount);
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
}

module.exports = {
    logAPICall
}