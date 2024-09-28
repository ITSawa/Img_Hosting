const fs = require("fs");
const path = require("path");

function isFileOfDirExist(_path, full = false) {
    const full_path = full ? path.join(..._path) : path.join(__dirname, "..", ..._path);
    
    if (fs.existsSync(full_path)) {
        const stat = fs.lstatSync(full_path);
        
        if (stat.isFile()) {
            console.log(`Successfully found file at: ${full_path}`);
        } else if (stat.isDirectory()) {
            console.log(`Successfully found directory at: ${full_path}`);
        } else {
            throw new Error(`Unknown file type at path: ${full_path}`);
        }
        
        return full_path;
    } else {
        throw new Error(`File or directory not found on path: ${full_path}`);
    }
}


module.exports = {
    isFileOfDirExist
}