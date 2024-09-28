const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const pg_users_database_docker_file = path.join(__dirname, 'databases', 'users', 'docker-compose.yml');
const pg_galery_database_docker_file = path.join(__dirname, 'databases', 'galery', 'docker-compose.yml');

function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const process = spawn('sudo', [command, ...args], { stdio: 'inherit' });

        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}

async function manageDocker(type, action) {
    try {
        let dockerComposeFile;

        if (type === 'users') {
            dockerComposeFile = pg_users_database_docker_file;
        } else if (type === 'galery') {
            dockerComposeFile = pg_galery_database_docker_file;
        } else if (type === 'all') {
            // Handle both types
            await manageDocker('users', action);
            await manageDocker('galery', action);
            return; // Exit early to avoid further processing
        } else {
            throw new Error('Unknown type. Use "users", "galery", or "all".');
        }

        if (!fs.existsSync(dockerComposeFile)) {
            throw new Error(`docker-compose.yml not found for type "${type}"`);
        }

        if (action === 'start') {
            console.log(`Starting Docker containers for ${type}...`);
            await runCommand('docker-compose', ['-f', dockerComposeFile, 'up', '-d']);
            console.log(`Docker containers for ${type} started.`);
        } else if (action === 'stop') {
            console.log(`Stopping Docker containers for ${type}...`);
            await runCommand('docker-compose', ['-f', dockerComposeFile, 'down']);
            console.log(`Docker containers for ${type} stopped.`);
        } else {
            console.error(`Unknown action: ${action}. Use "start" or "stop".`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

const type = process.argv[2];
const action = process.argv[3];

manageDocker(type, action);