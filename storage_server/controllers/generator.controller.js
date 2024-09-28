

function createUrlKey (data) {
    return Buffer.from(data).toString('hex');
}
function decodeUrlKey (data) {
    return Buffer.from(data, 'hex').toString();
}

function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function createAddressKey(path) {
    const sigmented_path = path.split('/');
    const short_path = sigmented_path[sigmented_path.length - 1];
    return short_path;
}

console.log('Module generator.controller loaded');
module.exports = {
    createUrlKey,
    decodeUrlKey,
    randomString,
    createAddressKey
}