let sql = require("mssql");
const mysql = require('mysql');

let config = require("../config/connection");
const celery = require('celery-node');
const redis = require("redis");

const pool1 = new sql.ConnectionPool(config.msSqlConfig);
const pool1Connect = pool1.connect();

const mysqlConnection = mysql.createConnection(
    config.mySqlConfig
);

mysqlConnection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

const DATA_TYPE_REF = {
    "nvarchar": "TEXT",
    "varchar": "TEXT",
    "nchar": "TEXT",
    "char": "TEXT",
    "int identity": "INT",
    "int": "INT",
    "float": "DOUBLE",
    "bit": "TINYINT",
    "datetime": "DATETIME",
    "smalldatetime": "DATETIME",
    "numeric": "DECIMAL",
    "numeric() identity": "DECIMAL",
    "image": "LONGBLOB",
    "uniqueidentifier": "TEXT",
};

exports.createTable = async (table = "tbl_default") => {
    console.log("===== BEGIN =====");
    let dropDB = `DROP DATABASE IF EXISTS ${process.env.DATABASE} ;`;
    let drop = await executeMySql(dropDB);

    // let createDB = `CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE} ;`;
    let createDB = `CREATE DATABASE IF NOT EXISTS  ${process.env.DATABASE} ;`;
    let create = await executeMySql(createDB);

    let useDB = `USE ${process.env.DATABASE};`;
    let use = await executeMySql(createDB);

    let allTablesName = `SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE  TABLE_CATALOG='FastTrack'`;

    let tables = await executeMsSql(allTablesName);

    // for (i = 0; i < tables.length; i++) {
    for (let i = 0; i < 3; i++) {
        // read table schema and create table
        let tableDesign = `exec sp_columns [${tables.recordset[i].TABLE_NAME}];`;
        let design = await executeMsSql(tableDesign);
        let fields = [];
        design.recordset.forEach(element => {
            let str = element.COLUMN_NAME + " " + DATA_TYPE_REF[element.TYPE_NAME];
            fields.push(str);
        });

        let fieldsString = `CREATE TABLE ${[tables.recordset[i].TABLE_NAME]} (${fields.join(', ')});`;
        let create = await executeMySql(fieldsString);

        break;
    }
    console.log("===== END =====");
};

executeMsSql = async (query) => {
    await pool1Connect;
    try {
        const request = pool1.request();
        return await request.query(query);
    } catch (err) {
        console.error('SQL error', err);
        // return false;
    }
};

executeMySql = async (query) => {
    isDBExist = true;
    await mysqlConnection.query(query, function (err, results, fields) {
        if (err) {
            console.log(`Getting Error While executing ::::: ${query}`);
            console.log(err.message);
            // return false;
            isDBExist = false;
        }
        console.log("results--->", results);
        // return true;
    });

    if (!isDBExist) {
        console.log("Changing Database");
        await mysqlConnection.changeUser({
            database: process.env.DATABASE
        }, function (err, results) {
            if (err) {
                console.log('error in changing database', err);
                console.log(err);
            }
        });
    }

};




