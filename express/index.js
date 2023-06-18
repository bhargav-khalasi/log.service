const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const writer = require('../writer')
const { connectToMysql } = require('../mysql/connect')
const { readFileAndWriteToDb } = require('../reader')

const jsonParser = bodyParser.json()

app.post('/log', jsonParser, async function (req, res) {
  try {
    const logMessage = req.body
    await writer.logAPICall(logMessage)
    res.send({ success: true })
  } catch (error) {
    console.log('ERROR: ', error)
    res.send({ success: false })
  }
})

async function startServer() {
  try {
    await connectToMysql()
    console.log('starting server')
    app.listen(3000)
    console.log('server started at port: 3000')
    setInterval(async () => {
      await readFileAndWriteToDb()
    }, 5000);
  } catch (error) {
    console.log('startServer error: ', error)
  }
}

module.exports.startServer = startServer