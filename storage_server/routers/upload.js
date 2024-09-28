const path = require('path');
const fs = require('fs');
const multer = require('fastify-multer');
const { setClass } = require('../models/user.classes');
const { StatusCodeError } = require('../models/errors');
const { server_settings: { paths: { storage } } } = require('../config');
const { randomString } = require('../controllers/generator.controller');
const { valid_mimes } = require('../models/accessed.data');
const { deleteFile } = require('../controllers/file.controller');
// const { appendGalleryItemMap } = require('../controllers/search.hash.controller');

const max_file_weight = 10 * 1024 * 1024; // 10MB

function createUrl(final_path) {
  return `image/${final_path}`;
}

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storage.uploads_dir);
  },
  filename: function (req, file, cb) {
    cb(null, randomString(24) + Date.now() + '.' + file.mimetype.split('/')[1]);
  },
});

const fileFilter = (req, file, cb) => {
  if (valid_mimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new StatusCodeError(400, 'Invalid file format'), false);
  }
};

const upload = multer({
  storage: storageConfig,
  limits: { fileSize: max_file_weight },
  fileFilter: fileFilter
});

async function uploadRoutes(fastify, options) {
  fastify.post('/upload', { 
    preHandler: upload.single('image'),
    handler: async (request, reply) => {
      try {
        console.log('File:', request.file);
        console.log('File path:', request.file.path);

        const token = request.cookies.access_token;
        const user = setClass(token);
        console.log(`Class set to: ${user.getClassName()}`);
        const finaly_path = await user.uploadImage(request.file.path);

        const className = user.getClassName();
        let result;
        if (className === 'Client' || className === 'Subscriber') {
          result = await user.appendGallery(finaly_path, request.headers['x-file-label'] || '', request.headers['x-public'] || true);
        }
        return reply.status(200).send({ id: result.id, image_address: result.image_address, file_label: result.file_label });

      } catch (error) {
        // console.error(error);
        deleteFile(request.file.path);
        const status = error.statusCode || 500;
        const message = error.message || 'Internal server error';
        return reply.status(status).send({ error: message });
      }
    }
  });
}

console.log('Module upload.router loaded');
module.exports = uploadRoutes;