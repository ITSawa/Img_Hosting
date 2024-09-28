const sharp = require('sharp');
const fs = require('fs');
const { StatusCodeError } = require('../../models/errors');
const { valid_formats, valid_mimes } = require('../../models/accessed.data');
const { isFileExist } = require('../file.controller');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getMetadata(imagePath) {
    try {
        return await sharp(imagePath).metadata();
    } catch (error) {
        throw new StatusCodeError(400, 'Failed to retrieve image metadata');
    }
}

function validateFormatAndMime(metadata) {
    const mime = metadata.format;

    if (!valid_formats.includes(mime)) {
        throw new StatusCodeError(400, 'Invalid image format');
    }

    const mimeType = `image/${mime}`;
    if (!valid_mimes.includes(mimeType)) {
        throw new StatusCodeError(400, 'Invalid image mime type');
    }

    return true;
}

function validateImageWidthAndHeight(metadata, maxWidth, maxHeight) {
    const { width, height } = metadata;

    if (width > maxWidth || height > maxHeight) {
        throw new StatusCodeError(400, 'Image dimensions exceed maximum allowed');
    }

    return true;
}

function validateImageWeight(imagePath, maxSize) {
    const stats = fs.statSync(imagePath);
    const size = stats.size;

    if (size > maxSize) {
        throw new StatusCodeError(400, 'Image size exceeds maximum allowed');
    }

    return true;
}

async function fullValidation(imagePath, settings) {
    await isFileExist(imagePath);
    
    const metadata = await getMetadata(imagePath);

    if (
        validateFormatAndMime(metadata)
        && validateImageWidthAndHeight(metadata, settings.max_width, settings.max_height)
        && validateImageWeight(imagePath, settings.max_size)
    ) {
        return true;
    } else {
        throw new StatusCodeError(400, 'Failed to validate image');
    }
}

const { client_validation, subscriber_validation, unauthorized_validation } = require('../../models/accessed.data');

async function fullValidationUnauthorized(imagePath) {
    return await fullValidation(imagePath, unauthorized_validation);
}

async function fullValidationClient(imagePath) {
    return await fullValidation(imagePath, client_validation);
}

async function fullValidationSubscriber(imagePath) {
    return await fullValidation(imagePath, subscriber_validation);
}

module.exports = {
    fullValidationUploadImageClient: fullValidationClient,
    fullValidationUploadImageSubscriber: fullValidationSubscriber,
    fullValidationUploadImageUnauthorized: fullValidationUnauthorized,
    isFileExist
};