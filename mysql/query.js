const { TABLE_NAME } = require("../constants");
const { getConnection } = require("./connect");

let mysqlInsertCount = 0;

async function insertBatchData(batchData) {
    try {
        const query = `INSERT INTO ${TABLE_NAME} (id, unix_ts, user_id, event_name) VALUES ?`;

        await getConnection().query(query, [batchData.map(obj => [obj.id, obj.unix_ts, obj.user_id, obj.event_name])]);
        mysqlInsertCount += batchData.length
        console.log('Batch data inserted successfully: ', mysqlInsertCount);

    }
    catch (error) {
        console.log('error: ', error)
    }
}

module.exports = {
    insertBatchData
}