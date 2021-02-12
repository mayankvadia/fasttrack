let sql = require("mssql");
const mysql = require('mysql');
let config = require("../config/connection");
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
// let allTablesName = `SELECT TABLE_NAME
//         FROM INFORMATION_SCHEMA.TABLES
//         WHERE  TABLE_CATALOG='FastTrack'`;
const allTablesName  = `SELECT TABLE_NAME FROM FastTrack.INFORMATION_SCHEMA.TABLES GO`;
exports.insertRecord0 = async () => {
    // console.log("===== BEGIN TABLE CREATION =====");
    // let dropDB = `DROP DATABASE IF EXISTS ${process.env.DATABASE} ;`;
    // let drop = await executeMySql(dropDB);

    // let createDB = `CREATE DATABASE IF NOT EXISTS  ${process.env.DATABASE} ;`;
    // let create = await executeMySql(createDB);

    // let useDB = `USE ${process.env.DATABASE};`;
    // let use = await executeMySql(useDB);

    tables = await executeMsSql(allTablesName);
    console.log(tables.recordset.length);
    let chunk1 = tables.recordset.slice(0, 30);
    // console.log("----- CHUNK : 1 -----");
    // console.log(chunk1);
    await createHelper(chunk1, "chunk1");

};

exports.insertRecord1 = async () => {
    tables = await executeMsSql(allTablesName);
    let chunk2 = tables.recordset.slice(30, 60);
    // console.log("----- CHUNK : 2 -----");
    // console.log(chunk2);
    await createHelper(chunk2, "chunk2");

};

exports.insertRecord2 = async () => {
    tables = await executeMsSql(allTablesName);
    let chunk3 = tables.recordset.slice(60, 90);
    // console.log("----- CHUNK : 3 -----");
    // console.log(chunk3);
    await createHelper(chunk3, "chunk3");

};

exports.insertRecord3 = async () => {
    tables = await executeMsSql(allTablesName);
    let chunk4 = tables.recordset.slice(90, 120);
    // console.log("----- CHUNK : 4 -----");
    // console.log(chunk4);
    await createHelper(chunk4, "chunk4");

};

exports.insertRecord4 = async () => {
    tables = await executeMsSql(allTablesName);
    let chunk5 = tables.recordset.slice(120, 150);
    // console.log("----- CHUNK : 5 -----");
    // console.log(chunk5);
    await createHelper(chunk5, "chunk5");

};

exports.insertRecord5 = async () => {
    tables = await executeMsSql(allTablesName);
    let chunk6 = tables.recordset.slice(150, 180);
    // console.log("----- CHUNK : 6 -----");
    // console.log(chunk6);
    await createHelper(chunk6, "chunk6");
};

exports.insertRecord6 = async () => {
    tables = await executeMsSql(allTablesName);
    let chunk7 = tables.recordset.slice(180, 210);
    // console.log("----- CHUNK : 7 -----");
    // console.log(chunk7);
    await createHelper(chunk7, "chunk7");
};

exports.insertRecord7 = async () => {
    tables = await executeMsSql(allTablesName);
    let chunk8 = tables.recordset.slice(210, 240);
    // console.log("----- CHUNK : 8 -----");
    // console.log(chunk8);
    await createHelper(chunk8, "chunk8");
};

exports.insertRecord8 = async () => {
    tables = await executeMsSql(allTablesName);
    let chunk9 = tables.recordset.slice(240, 270);
    // console.log("----- CHUNK : 9 -----");
    // console.log(chunk9);
    await createHelper(chunk9, "chunk9");
};

exports.insertRecord9 = async () => {
    tables = await executeMsSql(allTablesName);
    let chunk10 = tables.recordset.slice(270, 300);
    // console.log("----- CHUNK : 10 -----");
    // console.log(chunk10);
    await createHelper(chunk10, "chunk10");
};

exports.insertRecord10 = async () => {
    tables = await executeMsSql(allTablesName);
    let chunk11 = tables.recordset.slice(300, 310);
    // console.log("----- CHUNK : 11 -----");
    // console.log(chunk11);
    await createHelper(chunk11, "chunk11");
};

let test = [
    "'LVMH_CUSTOMER'",
    "new_items",
    "new_stores",
    "Items_Chanel_ Benelux",
    "'2_Art 61_A_Sort $'",
    "HVBE_Brand_Country",
    "New_Stores222",
    "New_Stores_xxxx",
    "Ship_To_Parties",
    "Reserve voor conding"
];

const exclude = [
    'hein',
    'Reserve voor conding'
];

createHelper = async (chunk, chunkName) => {
    // let useDB = `USE ${process.env.DATABASE};`;
    // let use = await executeMySql(useDB);
    for (let table of chunk) {
        if(!exclude.includes(table.TABLE_NAME)){
            console.log(`=============== ${table.TABLE_NAME} | ${chunkName} ===============`);
            let tableDesign = `exec sp_columns [${table.TABLE_NAME}];`;
            let design = await executeMsSql(tableDesign);
            if (design) {
                let fields = [];
                design.recordset.forEach(element => {
                    let str = ` \`${element.COLUMN_NAME}\` ${DATA_TYPE_REF[element.TYPE_NAME]}`;
                    fields.push(str);
                });
                // table.TABLE_NAME = table.TABLE_NAME.replace(/["']/g, "");
                // table.TABLE_NAME = table.TABLE_NAME.replace("Items_Chanel_ Benelux", "Items_Chanel_Benelux");
                let fieldsString = `CREATE TABLE \`${table.TABLE_NAME}\` ( ${fields.join(', ')} );`;
                await executeMySql(fieldsString);
                // insertHelper(table.TABLE_NAME, design, chunkName);
                let columns = {};
                for (let col of design.recordset) {
                    columns[col.COLUMN_NAME] = col.TYPE_NAME;
                }
                let readData = `SELECT * FROM [${table.TABLE_NAME}];`;
                let data = await executeMsSql(readData);

                if (data && data.recordset) {
                    for (let record of data.recordset) {
                        if (record) {
                            let values = [];
                            for (const key of Object.keys(columns)) {
                                if (DATA_TYPE_REF[columns[key]] === 'TEXT') {
                                    values.push(record[key] ? `"${record[key].replace(/"/g,"'")}"` : 'null');
                                } else if (DATA_TYPE_REF[columns[key]] === 'DATETIME') {
                                    // values.push(record[key] ?  new Date(record[key]).toISOString().slice(0, 19).replace('T'," ") : 'null');
                                    let fullDt;
                                    if (record[key]) {
                                        fullDt = record[key].getDate() + "-" + record[key].getMonth() + "-" + record[key].getFullYear();
                                    } else {
                                        fullDt = "null";
                                    }
                                    values.push(`${fullDt}`);
                                } else {
                                    values.push(record[key] ? record[key] : 'null');
                                }
                            }

                            let insertRow = `INSERT INTO \`${table.TABLE_NAME}\` (${Object.keys(columns).join(', ')}) VALUES ( ${values.join(', ')}); `;
                            // console.log(insertRow);
                              executeMySql(insertRow);
                        } else {
                            console.log(`No record found for table ${table.TABLE_NAME} : ${record}`);
                        }

                    }
                } else {
                    console.log(`No data found for table ${table.TABLE_NAME} : ${data}`);
                }
                // break;
            }
        }

    }
};


// insertHelper = async (tableName, design, chunkName) => {
//     // for (let table of chunk) {
//     //     if(table === "53_Store_RGA_Metadata"){
//     // let tableDesign = `exec sp_columns [${table.TABLE_NAME}];`;
//     // let design = await executeMsSql(tableDesign);
//     // if (design) {
//     let columns = {};
//     for (let col of design.recordset) {
//         columns[col.COLUMN_NAME] = col.TYPE_NAME;
//     }
//     let readData = `SELECT * FROM [${tableName}];`;
//     let data = await executeMsSql(readData);
//
//     if (data && data.recordset) {
//         for (let record of data.recordset) {
//             if (record) {
//                 let values = [];
//                 for (const key of Object.keys(columns)) {
//                     if (DATA_TYPE_REF[columns[key]] === 'TEXT') {
//                         values.push(record[key] ? `"${record[key].replace(/"/g,"'")}"` : 'null');
//                     } else if (DATA_TYPE_REF[columns[key]] === 'DATETIME') {
//                         // values.push(record[key] ?  new Date(record[key]).toISOString().slice(0, 19).replace('T'," ") : 'null');
//                         let fullDt;
//                         if (record[key]) {
//                             fullDt = record[key].getDate() + "-" + record[key].getMonth() + "-" + record[key].getFullYear();
//                         } else {
//                             fullDt = "null";
//                         }
//                         values.push(`${fullDt}`);
//                     } else {
//                         values.push(record[key] ? record[key] : 'null');
//                     }
//                 }
//
//                 let insertRow = `INSERT INTO ${tableName} (${Object.keys(columns).join(', ')}) VALUES ( ${values.join(', ')}); `;
//                 // console.log(insertRow);
//                 return await executeMySql(insertRow);
//             } else {
//                 console.log(`No record found for table ${tableName} : ${record}`);
//             }
//
//         }
//     } else {
//         console.log(`No data found for table ${tableName} : ${data}`);
//     }
//     // }
//
//     // }
//     // }
// };


executeMsSql = async (query) => {
    await pool1Connect;
    try {
        const request = pool1.request();
        return await request.query(query);
    } catch (err) {
        console.log(`::::: Getting Error While executing :::::`);
        console.log(query);
        console.log("-----------------------------------------");
        console.error('SQL error', err);
        // return false;
    }
};

executeMySql = async (query) => {
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




