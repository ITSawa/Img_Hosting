const jwt = require('jsonwebtoken');
const { secrets } = require('./env.controller');
const { StatusCodeError } = require('../models/errors');

function validateToken(token, secret) {
    if (!token) {
        throw new StatusCodeError(401, 'Unauthorized');
    } else if (!secret) {
        throw new StatusCodeError(500);
    }
    const decoded = jwt.verify(token, secret);
    if (!decoded) {
        throw new StatusCodeError(401, 'Unauthorized');
    }
    return decoded;
}

function validateAccessToken(token) {
    return validateToken(token, secrets.access_secret);
}

function getPayloadFromToken(token) {
    try {
        const base64Payload = token.split('.')[1];
        const payloadBuffer = Buffer.from(base64Payload, 'base64');
        const payload = JSON.parse(payloadBuffer.toString());

        if (!payload) {
            throw new StatusCodeError(401, 'Invalid token');
        }

        return payload;
    } catch (error) {
        console.error(error);
        throw new StatusCodeError(401, 'Invalid token');
    }
}

console.log('Module jwt.controller loaded');
module.exports = {
    validateAccessToken,
    validateToken,
    getPayloadFromToken
}