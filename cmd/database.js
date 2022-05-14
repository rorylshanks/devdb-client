const got = require('got');
const utils = require('./utils.js')
const chalk = require('chalk');
const ora = require('ora');
const { table } = require('table')

var baseURL = utils.getBaseURL()

async function createDatabase(args) {
    var apiKey = utils.getAPIKey(args);
    var bodyToPost = {
        type: args.type,
        snapshot: args.snapshot
    }
    try {
        var spinner = ora(chalk.bold('Creating database of type ' + args.type +' on devdb cloud...')).start();
        const { body } = await got.post(baseURL + '/api/v1/database', {
            json: bodyToPost,
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.succeed('Database created!')
        console.log("Please use the below connection details to connect to your database")
        var resultsTable = []
        resultsTable.push([chalk.bold("ID"), body.id])
        resultsTable.push([chalk.bold("Username"), body.username])
        resultsTable.push([chalk.bold("Password"), body.password])
        resultsTable.push([chalk.bold("Hostname"), body.endpoint])
        resultsTable.push([chalk.bold("Port"), body.port])
        console.log(table(resultsTable))
        utils.writeManifestFile(args, JSON.stringify(body))
    } catch (error) {
        spinner.fail('Unable to create database')
        console.error(error.response.body)
        process.exit(1)
    }

}

async function listDatabases(args) {
    var apiKey = utils.getAPIKey(args);
    try {
        var spinner = ora(chalk.bold('Grabbing databases from DevDB Cloud...')).start();
        const { body } = await got.get(baseURL + '/api/v1/database', {
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.stop()
        var resultsTable = []
        resultsTable.push([chalk.bold("ID"), chalk.bold("Name"), chalk.bold("Endpoint"), chalk.bold("Port"), chalk.bold("Type"), chalk.bold("Created")])
        for (db of body) {
            resultsTable.push([db.id, db.name, db.endpoint, db.port, db.type, db.created])
        }
        console.log(table(resultsTable))
        utils.writeManifestFile(args, JSON.stringify(body))
    } catch (error) {
        spinner.fail('Unable to create database')
        console.error(error.response.body)
        process.exit(1)
    }
}

async function deleteDatabase(args) {
    var apiKey = utils.getAPIKey(args);
    try {
        var spinner = ora(chalk.bold('Deleting database ' + (args.id || args.name) + '...')).start();
        var bodyToPost = {
            name: args.name,
            id: args.id
        }
        const { body } = await got.delete(baseURL + '/api/v1/database', {
            json: bodyToPost,
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.succeed('Database ' + (args.id || args.name) + ' deleted!')
    } catch (error) {
        console.error(error.response.body)
        process.exit(1)
    }

}

module.exports = {
    createDatabase,
    listDatabases,
    deleteDatabase
}