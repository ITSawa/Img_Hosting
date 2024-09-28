const unauthorized_validation = {
    max_size : 1024 * 512, // 512 KB
    max_height : 512, // 500 pixels
    max_width : 512, // 500 pixels
}


const client_validation = {
    max_size : 3 * 1024 * 1024, // 3 MB
    max_height : 2048, // 1k pixels
    max_width : 2048, // 1k pixels
}

const subscriber_validation = {
    max_size : 10 * 1024 * 1024, // 10 MB
    max_height : 8192, // 5k pixels
    max_width : 8192, // 5k pixels
}

const valid_formats = ['png', 'jpg', 'jpeg', 'webp'];
const valid_mimes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];






module.exports = {
    unauthorized_validation,
    client_validation,
    subscriber_validation,
    valid_formats,
    valid_mimes
}