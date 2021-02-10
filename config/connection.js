exports.msSqlConfig = {
    user: 'sa',
    password: 'admin@12345',
    server: "DESKTOP-BKAJR6Q",
    database: 'FastTrack',
    port: 1433,
    connectionTimeout: 30000,
    driver: 'tedious',
    options: {
        instanceName: 'SQLEXPRESS',
        database: 'FastTrack',
        port: 1433,
        "enableArithAbort": true
    }
};

exports.mySqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'admin',
    // database: "FastTrack"
};

