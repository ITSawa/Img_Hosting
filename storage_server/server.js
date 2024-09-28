const fastify = require('fastify')({ logger: false });
const fastifyCookie = require('@fastify/cookie');
const multer = require('fastify-multer');
const { server_settings: { port, paths } } = require('./config');
const fastifyStatic = require('@fastify/static');



// Register middleware
fastify.register(fastifyCookie);
fastify.register(multer.contentParser);

fastify.register(fastifyStatic, {
  root: paths.storage.images_dir,
  prefix: '/images/',
});



// Register routers
const uploadRoutes = require('./routers/upload');
fastify.register(uploadRoutes);

const galleryRoutes = require('./routers/gallery');
fastify.register(galleryRoutes);

const searchRoutes = require('./routers/search');
fastify.register(searchRoutes);

const downloadRoutes = require('./routers/download');
fastify.register(downloadRoutes);

const deleteRoutes = require('./routers/delete');
fastify.register(deleteRoutes);


fastify.get('/', async (request, reply) => {
  return { message: 'I\'m alive!' };
});

const selected_port = process.argv[2] || port;

const start = async () => {
  try {
    fastify.listen({ port: selected_port });
    console.log(`Server is running on http://localhost:${selected_port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();