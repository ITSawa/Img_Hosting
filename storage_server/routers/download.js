const { server_settings: { paths: { storage } } } = require('../config');
const { isFileExist, validateOnFileInjection } = require('../controllers/file.controller');
const path = require('path');

async function downloadRoutes(fastify, options) {
    fastify.get('/download/', async (request, reply) => {
        try {
            console.log('File address:', request.headers['x-file-address']);

            const file_address = request.headers['x-file-address'];
            validateOnFileInjection(file_address);

            console.log('File path valided!')

            const full_path = path.join(storage.gallery_dir, file_address);
            await isFileExist(full_path);

            console.log('File found!')

            return reply.status(200).sendFile(file_address, storage.gallery_dir);
        } catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || 'Internal server error';
            return reply.status(status).send({ error: message });
        }
    });
}

console.log('Module download.router loaded');
module.exports = downloadRoutes;