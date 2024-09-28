const { isFileOrDirExist } = require("./controllers/file.controller")

const storage_dir = isFileOrDirExist(["../", "storage"]);
const images_dir = isFileOrDirExist([storage_dir, "images"], true);
const uploads_dir = isFileOrDirExist([storage_dir, "uploads"], true);
const server_dir = isFileOrDirExist(["../", "storage_server"]);
const server_images_dir = isFileOrDirExist([images_dir, "server_images"], true);
const gallery_dir = isFileOrDirExist([images_dir, "gallery"], true);

const paths = {
    storage: {
        storage_dir,
        images_dir,
        uploads_dir,
        server_images_dir,
        gallery_dir
    },
    server: {
        server_dir
    }
}

const port = 4402;

const server_settings = {
    paths,
    port
};

console.log('Module config loaded');
module.exports = { server_settings }