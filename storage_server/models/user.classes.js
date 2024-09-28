const { validateAccessToken, getPayloadFromToken } = require('../controllers/jwt.controller');
const { 
    fullValidationUploadImageClient, 
    fullValidationUploadImageSubscriber, 
    fullValidationUploadImageUnauthorized 
} = require('../controllers/validation/image.validation');
const { StatusCodeError } = require('../models/errors');
const { replaceFile, deleteFile } = require('../controllers/file.controller');
const { server_settings: { paths: { storage }} } = require('../config');
const { createAddressKey } = require('../controllers/generator.controller');
const { galleryDBRequest: { 
    insertInGallery, 
    deleteFromGallery, 
    selectOwnedGallery,
    selectMostViewedGallery,
    selectNewestGallery,
    selectOldestGallery,
    selectRandomGallery 
}} = require('../controllers/db.request.controller');

const { 
    selectFromGalleryMaps,
    inputSearch,
    ownedSearch,
    deleteFromGalleryMap,
    appendGalleryItemMap
    
} = require('../controllers/search.hash.controller');
const path = require('path');




async function replaceAndShortFile(path, path_to = storage.gallery_dir, sorted = true) {
    const finalPath = await replaceFile(path, path_to, sorted); 
    if (!finalPath) {
        throw new StatusCodeError(400, 'Failed to upload image');
    }
    const short_address = await createAddressKey(finalPath);
    if (!short_address) {
        throw new StatusCodeError(400, 'Failed to upload image');
    }
    return short_address
}

class User {
    constructor(token = null) {
        this.token = token;
        this.name = null;
        this.email = null;
        this.id = null;
        this.client_id = null;
        this.role = null;

        if (token) {
            this.initializeFromToken();
            this.validateToken();
        }
    }

    initializeFromToken() {
        try {
            const payload = getPayloadFromToken(this.token);
            this.name = payload.name || null;
            this.email = payload.email || null;
            this.id = payload.id || null;
            this.client_id = payload.client_id || null;
            this.role = payload.role || null;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    validateToken() {
        try {
            return validateAccessToken(this.token);
        } catch (error) {
            throw new Error('Token validation failed');
        }
    }

    uploadImage(imagePath) {
        throw new Error('Method not implemented');
    }
    
    appendGallery(image_address ,label = '') {
        throw new Error('Method not implemented');
    }

    deleteImage(urlOrId) {
        throw new Error('Method not implemented');
    }

    async replaceImageFileToGallery(path, path_to = storage.gallery_dir, sorted = true) {
        return await replaceAndShortFile(path, path_to, sorted);
    }

    getClassName () {
        return 'User';
    }

    getData () {
        return {
            name: this.name,
            email: this.email,
            id: this.id,
            client_id: this.client_id,
            role: this.role
        };
    }

    search () {
        throw new Error('Method not implemented');
    }

    delete () {
        throw new Error('Method not implemented');
    }
}

class Client extends User {
    constructor(token) {
        super(token);
    }

    async uploadImage(imagePath) {
        if (!imagePath) {
            throw new StatusCodeError(400, 'Path not found');
        }

        const valid = await fullValidationUploadImageClient(imagePath);
        if (!valid) {
            throw new StatusCodeError(400, 'Failed to upload image');
        } else {
            return await this.replaceImageFileToGallery(imagePath);
        }
    }

    // async deleteImage(data, param) {
    //     if (param === 'id') {
    //         await deleteFromGallery(data, 'id');
    //     } else if (param === 'address') {
    //         await deleteFromGallery(data, 'image_address');
    //     } else {
    //         throw new StatusCodeError(400, 'Invalid param');
    //     }
    // }

    async appendGallery(image_address ,label = '', publicState = true) {
        const result = await insertInGallery({
            owner_id: this.id,
            owner_name: this.name,
            image_address,
            file_label: label,
            public: publicState
        });
        appendGalleryItemMap(result);
        return result;
    }

    async getGallery(param, limit = 12, pagination = 0) {
        // need to add validation on data TODO!

        switch (param) {
            case 'owned':
                return await selectOwnedGallery(this.id, pagination, limit);
            case 'popular':
                return await selectMostViewedGallery(pagination, limit);
            case 'latest':
                return await selectNewestGallery(pagination, limit);
            case 'oldest':
                return await selectOldestGallery(pagination, limit);
            case 'random':
                return await selectRandomGallery(limit);
            default:
                throw new StatusCodeError(401, 'Bad request');
        }
    }

    getClassName () {
        return 'Client';
    }

    search (param, value = '') {
        if (param === 'search') {
            if (!value) {
                throw new StatusCodeError(401, 'Bad request');
            }
            return inputSearch(value);
        } else if (param === 'owned') {
            return ownedSearch(this.id);
        } else {
            throw new StatusCodeError(401, 'Bad request');
        }
    }

    async delete (image_id) {
        if (!image_id) {
            throw new StatusCodeError(401, 'Bad request');
        }

        const address = await deleteFromGallery(this.id, image_id);
        deleteFile(path.join(storage.gallery_dir, address));
        deleteFromGalleryMap(image_id);
    }
}

class Unauthorized extends User {
    constructor() {
        super(null);
    }

    async uploadImage(imagePath) {
        if (!imagePath) {
            throw new StatusCodeError(400, 'Path not found');
        }

        console.log('uploadImage path set to: ', imagePath);

        const valid =  await fullValidationUploadImageUnauthorized(imagePath);
        if (!valid) {
            throw new StatusCodeError(400, 'Failed to upload image');
        } else {
            return await this.replaceImageFileToGallery(imagePath);
        }
    }

    // async deleteImage(data, param) {
    //     throw new StatusCodeError(401, 'Unauthorized');
    // }

    async getGallery(param, limit = 12, pagination = 0) {
        // need to add validation on data TODO!

        switch (param) {
            case 'popular':
                return await selectMostViewedGallery(pagination, limit);
            case 'latest':
                return await selectNewestGallery(pagination, limit);
            case 'oldest':
                return await selectOldestGallery(pagination, limit);
            case 'random':
                return await selectRandomGallery(limit);
            case 'owned':
                throw new StatusCodeError(401, 'Unauthorized');
            default:
                throw new StatusCodeError(401, 'Bad request');
        }
    }

    getClassName () {
        return 'Unauthorized';
    }

    search (param, value = '') {
        if (param === 'search') {
            if (!value) {
                throw new StatusCodeError(401, 'Bad request');
            }
            return inputSearch(value);
        } else if (param === 'owned') {
            throw new StatusCodeError(401, 'Unauthorized');
        } else {
            throw new StatusCodeError(401, 'Bad request');
        }
    }

    delete (image_id) {
        throw new StatusCodeError(401, 'Unauthorized');
    }
}

class Subscriber extends Client {
    constructor(token) {
        super(token);
    }

    async uploadImage(imagePath) {
        if (!imagePath) {
            throw new StatusCodeError(400, 'Path not found');
        }

        const valid = await fullValidationUploadImageSubscriber(imagePath);
        if (!valid) {
            throw new StatusCodeError(400, 'Failed to upload image');
        } else {
            return await this.replaceImageFileToGallery(imagePath);
        }
    }

    getClassName () {
        return 'Subscriber';
    }
}

function setClass(token) {
    if (!token) {
        return new Unauthorized();
    }

    const tokenPayload = getPayloadFromToken(token);

    if (tokenPayload.role === 'client') {
        return new Client(token);
    } else if (tokenPayload.role === 'subscriber') {
        return new Subscriber(token);
    } else {
        return new Unauthorized();
    }
}

module.exports = {
    setClass
};