require("dotenv").config();
const express = require("express");
const app = express();
const celery = require('celery-node');
const redis = require("redis");
let config = require("./config/connection");
const data = require('./src/data');
const mysql = require('mysql');

// const pool1 = new sql.ConnectionPool(config.msSqlConfig);
// const pool1Connect = pool1.connect();

const mysqlConnection = mysql.createConnection(
    config.mySqlConfig
);

mysqlConnection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});
initDB = async () => {
    let dropDB = `DROP DATABASE IF EXISTS ${process.env.DATABASE} ;`;
    let drop = await executeMySql(dropDB);

    let createDB = `CREATE DATABASE IF NOT EXISTS  ${process.env.DATABASE} ;`;
    let create = await executeMySql(createDB);

    let useDB = `USE ${process.env.DATABASE};`;
    let use = await executeMySql(useDB);
};

executeMySql = async (query) => {
    // mysqlConnection = await config.connection;
    await mysqlConnection.query(query, function (err, results) {
        if (err) {
            console.log(`::::: Getting Error While executing :::::`);
            console.log(query);
            console.log("-----------------------------------------");
            console.log(err.message);
            return false;
        } else {
            // console.log("results--->", results);
            return results;
        }
    });
};
initDB();

const workerCelery = celery.createWorker("redis://127.0.0.1:6379/1", "redis://127.0.0.1:6379/2", "redis://127.0.0.1:6379/3",
    "redis://127.0.0.1:6379/4",
    "redis://127.0.0.1:6379/5",
    "redis://127.0.0.1:6379/6",
    "redis://127.0.0.1:6379/7",
    "redis://127.0.0.1:6379/8",
    "redis://127.0.0.1:6379/9",
    "redis://127.0.0.1:6379/10",
    "redis://127.0.0.1:6379/11",
);

workerCelery.register('insert0', data.insertRecord0);
workerCelery.register('insert1', data.insertRecord1);
workerCelery.register('insert2', data.insertRecord2);
workerCelery.register('insert3', data.insertRecord3);
workerCelery.register('insert4', data.insertRecord4);
workerCelery.register('insert5', data.insertRecord5);
workerCelery.register('insert6', data.insertRecord6);
workerCelery.register('insert7', data.insertRecord7);
workerCelery.register('insert8', data.insertRecord8);
workerCelery.register('insert9', data.insertRecord9);
workerCelery.register('insert10', data.insertRecord10);

workerCelery.start();


// const createTables = async () => {
// const automationClientCelery = celery.createClient("redis://127.0.0.1:6379/1", "redis://127.0.0.1:6379/2", "redis://127.0.0.1:6379/3",
//     "redis://127.0.0.1:6379/4",
//     "redis://127.0.0.1:6379/5",
//     "redis://127.0.0.1:6379/6",
// );
// let leadAutoSaveCel = automationClientCelery.createTask("create");
// let leadAutoSave = leadAutoSaveCel.applyAsync(["test_table"]);
// leadAutoSave.get().then(async (data) => {
//     // console.log("leadImportCeleryResult data: ", data)
//     // await this.importDataSend(clientIp, publish, cmpId, userDetail, 'lead');
// });
// };

const insertAll = () => {
    insertRecords0();
    insertRecords1();
    // insertRecords2();
    // insertRecords3();
    // insertRecords4();
    // insertRecords5();
    // insertRecords6();
    // insertRecords7();
    // insertRecords8();
    // insertRecords9();
    // insertRecords10();
};

const insertRecords0 = () => {
    insertHelper("insert0");
};

const insertRecords1 = () => {
    insertHelper("insert1");
};
const insertRecords2 = () => {
    insertHelper("insert2");
};
const insertRecords3 = () => {
    insertHelper("insert2");
};
const insertRecords4 = () => {
    insertHelper("insert3");
};
const insertRecords5 = () => {
    insertHelper("insert4");
};
const insertRecords6 = () => {
    insertHelper("insert5");
};
const insertRecords7 = () => {
    insertHelper("insert6");
};
const insertRecords8 = () => {
    insertHelper("insert7");
};
const insertRecords9 = () => {
    insertHelper("insert9");
};
const insertRecords10 = () => {
    insertHelper("insert10");
};

const insertHelper = async (worker) => {
    const automationClientCelery = celery.createClient("redis://127.0.0.1:6379/1", "redis://127.0.0.1:6379/2", "redis://127.0.0.1:6379/3",
        "redis://127.0.0.1:6379/4",
        "redis://127.0.0.1:6379/5",
        "redis://127.0.0.1:6379/6",
        "redis://127.0.0.1:6379/7",
        "redis://127.0.0.1:6379/8",
        "redis://127.0.0.1:6379/9",
        "redis://127.0.0.1:6379/10",
    );
    let leadAutoSaveCel = automationClientCelery.createTask(worker);
    await leadAutoSaveCel.applyAsync(["inserts"]).get().then((res) => {
        // console.log("res->", res);
    }).catch((e) => {
        console.log("err", e);
    });
};


// createTables();
insertAll();

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`app is running at ${port}`);
});
//
// module.exports = {
//     pool1Connect,
//     pool1,
// };
