const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const nginx_conf_file = path.join(__dirname, 'nginx.conf');

if (!fs.existsSync(nginx_conf_file)) {
    throw new Error('Error: nginx config file not found');
}

const startNginx = () => {
    console.log(`Starting Nginx server with config: ${nginx_conf_file}`);

    const child = spawn('sudo', ['nginx', '-c', nginx_conf_file]);

    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
        if (data.toString().includes('bind() to 0.0.0.0:80 failed (98: Address already in use)')) {
            console.error('Error: Port 80 is already in use. Attempting to stop existing Nginx process.');
            stopNginx(() => {
                console.log('Trying to restart Nginx...');
                startNginx();
            });
        } else {
            console.error(`stderr: ${data}`);
        }
    });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
};

const stopNginx = (callback) => {
    const child = spawn('sudo', ['pkill', 'nginx']);

    child.on('close', (code) => {
        console.log(`Nginx process stopped with code ${code}`);
        if (callback) {
            callback();
        }
    });
};

if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length !== 1 || !['start', 'stop'].includes(args[0])) {
        console.error('Incorrect parameter while nginx boot > start/stop only');
        process.exit(1);
    }

    const action = args[0];

    if (action === 'start') {
        startNginx();
    } else if (action === 'stop') {
        stopNginx();
    }
}

module.exports = { startNginx, stopNginx };