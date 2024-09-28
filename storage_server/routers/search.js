const { setClass } = require('../models/user.classes');
const { initGalleryFull } = require('../controllers/search.hash.controller');

async function searchRoutes(fastify, options) {
    if (await initGalleryFull()) {
        throw new Error('Failed to init gallery maps');
    }

    fastify.get('/search/:param?', async (request, reply) => {
        try {
            const param = request.params.param || 'search';
            const user = setClass(request.cookies.access_token);
            const result = await user.search(param, request.headers['x-search-value']);
            return reply.status(200).send(result);
        } catch (error) {
            const status = error.statusCode || 500;
            const message = error.message || 'Internal server error';
            return reply.status(status).send({ error: message });
        }
    });
};

module.exports = searchRoutes;