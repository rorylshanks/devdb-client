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

module.exports = {
    getAPIKey,
    getBaseURL,
    writeManifestFile
}