const { server_settings: { paths: { storage } } } = require('../config');
const { setClass } = require('../models/user.classes');
const path = require('path');

async function deleteRoutes(fastify, options) {
    fastify.delete('/delete/', async (request, reply) => {
        const token = request.cookies.access_token;
        const user = setClass(token);
        await user.delete(request.headers['x-image-id']);

        // need to update maps

        return reply.status(200).send({ message: 'File successfully deleted' });
    });
}

console.log('Module delete.router loaded');
module.exports = deleteRoutes;