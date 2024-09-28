const { Sequelize } = require('sequelize');
const { database } = require('./env.controller');

let db = null;

const dbConfig = {
    host: database.host,
    port: database.port,
    username: database.login,
    password: database.password,
    database: database.name,
    dialect: database.type,
    logging: console.log
}

const initializeDatabase = async (dbConfig) => {
    db = new Sequelize(dbConfig);
    // db.authenticate()
}

const isConnected = async () => {
    db.authenticate()
        .then(() => { console.log('Connection has been established successfully.') })
        .catch(err => { throw new Error('Unable to connect to the database: \n', err) });
}

const startDb = async () => {
    await initializeDatabase(dbConfig);
    await isConnected();
}

startDb();

console.log('Database connection established');
module.exports = db