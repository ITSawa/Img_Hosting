const path = require('path');
const fs = require('fs');
const { StatusCodeError } = require('../models/errors');
const { createAddressKey } = require('../controllers/generator.controller');

// inner server function (do not use this for/in routing)
function isFileOrDirExist(_path, full = false, logs = false) {
    const full_path = full ? path.join(..._path) : path.join(__dirname, "..", ..._path);

    if (fs.existsSync(full_path)) {
        const stat = fs.lstatSync(full_path);

        if (stat.isFile()) {
            logs && console.log(`Successfully found file at: ${full_path}`);
        } else if (stat.isDirectory()) {    
            logs && console.log(`Successfully found directory at: ${full_path}`);
        } else {
            throw new Error(`Unknown file type at path: ${full_path}`);
        }

        return full_path;
    } else {
        throw new Error(`File or directory not found on path: ${full_path}`);
    }
}

function replaceFile(old_path, new_path, shorted = false) {
    try {
        console.log(`Replacing file from: ${old_path} to: ${new_path} shorted: ${shorted}`);
        const file_name = createAddressKey(old_path);
        const new_full_path = path.join(new_path, file_name);
        fs.renameSync(old_path, new_full_path);
        return shorted ? file_name : new_path;
    } catch (error) {
        throw new StatusCodeError(500);
    }
}

async function isFileExist(filePath) {
    // await delay(1000);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        throw new StatusCodeError(404, 'File not found');
    }
    return true;
}


function deleteFile(path) {
    try {
        fs.unlinkSync(path);
    } catch (error) {
        console.error(`Failed to delete file by path: ${path}`);
    }
}

function validateOnFileInjection(file_address) {
    if (!file_address || typeof file_address != 'string' ||  file_address.includes('..') || file_address.includes('/') || file_address.includes('\\') || file_address.includes(':') || file_address.includes('*') || file_address.includes('?')) {
        throw new StatusCodeError(400, 'Bad request');
    }
}

console.log('Module file.controller loaded');
module.exports = {
    isFileOrDirExist,
    replaceFile,
    deleteFile,
    isFileExist,
    validateOnFileInjection
}