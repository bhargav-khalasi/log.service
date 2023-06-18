const fs = require('fs').promises;
const lockfile = require('proper-lockfile');
const { insertBatchData } = require('../mysql/query');
const { FILE_PATH } = require('../constants');
const lodash = require('lodash')

const filePath = FILE_PATH;

async function readFileAndWriteToDb() {
    let release
    try {
        release = await lockfile.lock(filePath, { retries: { retries: 10, maxTimeout: 1000 } });
        console.log('Lock acquired');

        const data = await fs.readFile(filePath, 'utf8');
        console.log('File read:', data);

        if (data == null || data == "") {
            release();
            return;
        }

        // Process the read data
        let stringData = data.split("#").filter((val) => !lodash.isEmpty(val))
        let jsonData = stringData.map((val) => {
            return JSON.parse(val)
        })
        await insertBatchData(jsonData);

        await fs.truncate(filePath, 0);
        console.log('File truncated');

        release(); // Release the lock
        console.log('Lock released');
    } catch (error) {
        release()
        console.error('An error occurred:', error);
    }
}

module.exports = {
    readFileAndWriteToDb
}