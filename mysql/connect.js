const mysql = require('mysql');
const { TABLE_NAME } = require('../constants');


let connection = null

async function createLoggingTable() {
    const createTableQuery = `
    CREATE TABLE ${TABLE_NAME} (
      id INT,
      unix_ts INT,
      user_id INT,
      event_name VARCHAR(20)
    )`;
    await connection.query(`DROP TABLE IF EXISTS ${TABLE_NAME}`)
    let results = await connection.query(createTableQuery)
    console.log('LOGGING table created!');
}

async function connectToMysql(retryCount = 3, delay = 3000) {

    console.log('Attempting connection...');
    while (retryCount > 0) {
        try {
            connection = mysql.createConnection({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE
            });
            await new Promise((resolve, reject) => {
                connection.connect((err) => {
                    if (err) {
                        console.error('Error connecting to MySQL database:', err);
                        reject(err);
                        return;
                    }
                    console.log('Connected to MySQL database!');
                    createLoggingTable()
                    resolve();
                });
            });
            return; // Successful connection, exit the function
        } catch (error) {
            console.log(`Retrying connection in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            retryCount--;
        }
    }

    throw new Error('Failed to connect to MySQL database');
}

function getConnection() {
    if (!connection) {
        throw new Error('MySQL connection is not established');
    }
    return connection;
}


module.exports = {
    getConnection,
    connectToMysql
}