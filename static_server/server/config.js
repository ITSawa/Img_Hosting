const { isFileOfDirExist } = require("./controllers/file.controller")
const path = require("path");

// const web_dir = isFileOfDirExist(["../", "web"]);
// const server_dir = isFileOfDirExist(["../", "server"]);

// const build_dir = isFileOfDirExist([web_dir, "build"], true);
// const static_dir = isFileOfDirExist([build_dir, "static"], true);
// const index_file  = isFileOfDirExist([build_dir, "index.html"], true);

const web_dir = '../web';
const server_dir = '../server';

const build_dir = path.join(web_dir, 'build');
const static_dir = path.join(build_dir, 'static');
const index_file  = path.join(build_dir, 'index.html');

const paths = {
    web_dir,
    server_dir,
    build_dir,
    static_dir,
    index_file,
    array: [web_dir, server_dir, build_dir, static_dir, index_file]
};

port = 4400

server_settings = {
    port,
    paths
}

module.exports = {
    server_settings
}