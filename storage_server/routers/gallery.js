const { setClass } = require('../models/user.classes');


async function galleryRoutes(fastify, options) {
    fastify.get('/gallery/:param', async (request, reply) => {

        const token = request.cookies.access_token;
        const param = request.params.param;
        const user = setClass(token);
        const result = await user.getGallery(param);
        return result;
    })
}

module.exports = galleryRoutes;