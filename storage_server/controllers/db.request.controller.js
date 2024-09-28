const Gallery = require('../models/db.models');
const { validateIsScript, isSQLInjection } = require('../controllers/validation/input.validation');
const { StatusCodeError } = require('../models/errors');

async function saveRequest(request) {
    try {
        if (typeof request !== 'function') {
            throw new Error('Invalid request');
        }
        const response = await request();
        return response;
    } catch (error) {
        console.error(error.message ? error.message : error);
        throw new StatusCodeError(400, 'Bad request');
    }
}

function selectOwnedGallery(user_id, pagination = 0, limit = 12, desc = true) {
    return saveRequest(async () => {
        const gallery = await saveRequest(() => Gallery.findAll({ where: { owner_id: user_id }, order: [['created_at', desc ? 'DESC' : 'ASC']], limit: limit, offset: pagination }));
        return gallery;
    });
}

function selectMostViewedGallery(pagination = 0, limit = 12) {
    return saveRequest(async () => {
        const gallery = await saveRequest(() => 
            Gallery.findAll({ 
                attributes: ['image_address', 'created_at', 'views', 'file_label'],
                order: [['views', 'DESC']], 
                limit: limit, 
                offset: pagination 
            })
        );
        return gallery;
    });
}

function selectNewestGallery(pagination = 0, limit = 12) {
    return saveRequest(async () => {
        const gallery = await saveRequest(() => 
            Gallery.findAll({ 
                attributes: ['image_address', 'created_at', 'views', 'file_label'],
                order: [['created_at', 'DESC']], 
                limit: limit, 
                offset: pagination 
            })
        );
        return gallery;
    });
}

function selectOldestGallery(pagination = 0, limit = 12) {
    return saveRequest(async () => {
        const gallery = await saveRequest(() => 
            Gallery.findAll({ 
                attributes: ['image_address', 'created_at', 'views', 'file_label'],
                order: [['created_at', 'ASC']], 
                limit: limit, 
                offset: pagination 
            })
        );
        return gallery;
    });
}

function selectRandomGallery(limit = 12) {
    return saveRequest(async () => {
        const gallery = await saveRequest(() => 
            Gallery.findAll({ 
                attributes: ['image_address', 'created_at', 'views', 'file_label'],
                order: Sequelize.literal('RANDOM()'), 
                limit: limit 
            })
        );
        return gallery;
    });
}

function insertInGallery(gallery) {
    if (!validateIsScript(gallery.file_label) || isSQLInjection(gallery.file_label)) {
        throw new Error('Invalid image label');
    }

    return saveRequest(async () => {
        const newGallery = await saveRequest(() => Gallery.create(gallery));
        return newGallery;
    });
}

async function deleteFromGallery(owner_id, id) {
    try {
        const file = await saveRequest(() => Gallery.findOne({ where: { owner_id, id } }));
        
        if (!file) {
            throw new StatusCodeError(404, 'File not found');
        }

        const deletedCount = await saveRequest(() => Gallery.destroy({ where: { owner_id, id } }));
        
        if (deletedCount === 0) {
            throw new StatusCodeError(401, 'Unauthorized');
        }

        return file.image_address;
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || 'Internal server error';
        throw new StatusCodeError(status, message);
    }
}

async function selectAllGallery(public = true) {
    return saveRequest(async () => {
        const gallery = await saveRequest(() => Gallery.findAll({ where: { public } }));
        return gallery;
    });
}

const galleryDBRequest = {
    selectOwnedGallery,
    selectMostViewedGallery,
    selectNewestGallery,
    selectOldestGallery,
    insertInGallery,
    deleteFromGallery,
    selectRandomGallery,
    selectAllGallery
};

module.exports = { galleryDBRequest };

// async function test(id) {
//     const result = await selectGalleryByID(id);
//     console.log(result);
// }

// test(1);
