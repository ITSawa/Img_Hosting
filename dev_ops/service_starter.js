const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function createAndCheckFilePath(_path) {
    const full_path = path.join(__dirname, _path);
    if (!fs.existsSync(full_path)) {
        throw new Error(`Path not found: ${full_path}`);
    } else {
        return full_path;
    }
}

// const docker_boot = createAndCheckFilePath('../docker/docker_boot.js');

function logError(serverName, message) {
    const logFilePath = path.join(__dirname, 'server_errors.log');
    const logMessage = `${new Date().toISOString()} - [${serverName}] ${message}\n`;
    fs.appendFileSync(logFilePath, logMessage);
}

function runCommand(command, args, name, callback) {
    const options = { stdio: 'inherit' }; // 'inherit' чтобы видеть вывод в консоли

    const process = spawn(command, args, options);

    process.on('exit', (code, signal) => {
        if (code === 0) {
            console.log(`[${name}] Command finished successfully.`);
            if (callback) callback(); // Запускаем callback, если команда завершилась успешно
        } else {
            const errorMessage = `[${name} ERROR] Command failed with code ${code} and signal ${signal}`;
            logError(name, errorMessage);
            console.error(errorMessage);
        }
    });

    process.on('error', (err) => {
        const errorMessage = `[${name} ERROR] Command encountered an error: ${err.message}`;
        logError(name, errorMessage);
        console.error(errorMessage);
    });
}

function startServer(command, args, name, workingDir, restartAttempts = 5) {
    let attempts = 0;

    function spawnServer() {
        const options = { cwd: workingDir };
        const serverProcess = spawn(command, args, options);

        serverProcess.stdout.on('data', (data) => {
            const message = `[${name}] ${data.toString().trim()}`;
            if (message.includes('ERROR') || message.includes('error')) {
                logError(name, message);
                console.error(message);
            } else {
                console.log(message);
            }
        });

        serverProcess.stderr.on('data', (data) => {
            const errorMessage = `[${name} ERROR] ${data.toString().trim()}`;
            logError(name, errorMessage);
            console.error(errorMessage);
        });

        serverProcess.on('exit', (code, signal) => {
            const exitMessage = `${name} exited with code ${code} and signal ${signal}`;
            logError(name, exitMessage);
            console.log(exitMessage);

            attempts++;
            if (attempts < restartAttempts) {
                console.log(`Restarting ${name} (${attempts}/${restartAttempts})...`);
                setTimeout(spawnServer, 5000);
            } else {
                console.log(`${name} has reached maximum restart attempts.`);
            }
        });

        serverProcess.on('error', (err) => {
            const errorMessage = `${name} encountered an error: ${err.message}`;
            logError(name, errorMessage);
            console.error(errorMessage);
        });
    }

    spawnServer();
}

const server_ports = {
    static_server: 4400,
    auth_server: `-port=${4401}`,
    storage_server: 4402
};

function setupNginxAndStartServers() {
    runCommand('node', ['nginx_boot', 'stop'], 'Nginx Stop', () => {
        runCommand('node', ['nginx_boot', 'start'], 'Nginx Start', () => {
            runCommand('node', ['../docker/docker_boot.js', 'all', 'stop'], 'Docker Stop', () => {
                runCommand('node', ['../docker/docker_boot.js', 'all', 'start'], 'Docker Start', () => {
                    startServer('go', ['run', 'server.go', server_ports.auth_server], 'Auth Server', path.join(__dirname, '../auth_server'));
                    startServer('node', ['server.js', server_ports.static_server], 'Static Server', path.join(__dirname, '../static_server/server'));
                    startServer('node', ['server.js', server_ports.storage_server], 'Storage Server', path.join(__dirname, '../storage_server/'));
                })
            })
            // startServer('go', ['run', 'server.go', server_ports.auth_server], 'Auth Server', path.join(__dirname, '../auth_server'));
            // startServer('node', ['server.js', server_ports.static_server], 'Static Server', path.join(__dirname, '../static_server/server'));
            // startServer('node', ['server.js', server_ports.storage_server], 'Storage Server', path.join(__dirname, '../storage_server/'));
        });
    });
}

setupNginxAndStartServers();