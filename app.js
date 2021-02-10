require("dotenv").config();
const express = require("express");
const app = express();
const celery = require('celery-node');
const redis = require("redis");
let config = require("./config/connection");
const data = require('./src/data');


// const pool1 = new sql.ConnectionPool(config.msSqlConfig);
// const pool1Connect = pool1.connect();


const workerCelery = celery.createWorker("redis://127.0.0.1:6379/1", "redis://127.0.0.1:6379/2");
workerCelery.register('create', data.createTable);
workerCelery.start();


const createTables = async () => {
    const automationClientCelery = celery.createClient("redis://127.0.0.1:6379/1", "redis://127.0.0.1:6379/2");
    let leadAutoSaveCel = automationClientCelery.createTask("create");
    let leadAutoSave = leadAutoSaveCel.applyAsync(["test_table"]);
    leadAutoSave.get().then(async (data) => {
        console.log("leadImportCeleryResult data: ", data)
        // await this.importDataSend(clientIp, publish, cmpId, userDetail, 'lead');
    });
};
createTables();

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`app is running at ${port}`);
});
//
// module.exports = {
//     pool1Connect,
//     pool1,
// };
