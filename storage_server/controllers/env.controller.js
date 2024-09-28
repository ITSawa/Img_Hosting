const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env'), override: true });

function getEnv(key) {
    const value = process.env[key];
    if (value) {
        return value;
    } else {
        throw new Error(`Environment variable ${key} not found`);
    }
}

const access_secret = getEnv('ACCESS_SECRET');
const api_secret = getEnv('API_SECRET');
const cross_server_secret = getEnv('CROSS_SERVER_SECRET');

const secrets = {
    access_secret,
    api_secret,
    cross_server_secret,
}

const database_login = getEnv('DATABASE_LOGIN');
const database_password = getEnv('DATABASE_PASSWORD');
const database_host = getEnv('DATABASE_HOST');
const database_port = getEnv('DATABASE_PORT');
const database_name = getEnv('DATABASE_NAME');
const database_type = getEnv('DATABASE_TYPE');

const database = {
    login: database_login,
    password: database_password,
    host: database_host,
    port: database_port,
    name: database_name,
    type: database_type,
}

console.log('Module env.controller loaded, all environment variables loaded successfully');
module.exports = { secrets, database }