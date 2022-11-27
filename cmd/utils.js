const chalk = require('chalk');
const fs = require('fs');

function getAPIKey(argv) {
    if (process.env.DEVDB_API_KEY) {
        return process.env.DEVDB_API_KEY
    }
    if (argv.apiKey) {
        return argv.apiKey
    }
    console.log(chalk.red('User is not authenticated!'));
    console.log("Please ensure the correct API key is being used with the --apiKey command line flag");
    console.log("or with the environment variable DEVDB_API_KEY");
    console.log("If you do not have an API Key, please create an account at https://devdb.cloud");
    process.exit(1)
}

function getBaseURL() {
    if (process.env.DEVDB_DEBUG_LOCAL == "true") {
        return "http://localhost:3000"
    } else {
        return "https://app.devdb.cloud"
    }
    
}

function writeManifestFile(args, body) {
    if (args.manifest) {
        fs.writeFileSync(args.manifest, body);
    }
}

function getLocalPort(type) {
    if (type.includes("mysql57")) {
        return 3306
    }
    if (type.includes("pg")) {
        return 5432
    }
    return 3306
}

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

module.exports = {
    getAPIKey,
    getBaseURL,
    writeManifestFile,
    getLocalPort,
    formatBytes
}