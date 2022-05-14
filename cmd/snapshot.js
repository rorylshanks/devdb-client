const got = require('got');
const utils = require('./utils.js')
const chalk = require('chalk');
const ora = require('ora');
const { table } = require('table')

var baseURL = utils.getBaseURL()

async function createSnapshot(args) {
    var apiKey = utils.getAPIKey(args);
    var bodyToPost = {
        dbId: args.source,
        name: args.name
    }
    try {
        var spinner = ora(chalk.bold('Creating snapshot from source ' + args.source +' on devdb cloud...')).start();
        const { body } = await got.post(baseURL + '/api/v1/snapshot', {
            json: bodyToPost,
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.succeed('Snapshot created!')
        console.log("Please use the below connection details to connect to your database")
        var resultsTable = []
        resultsTable.push([chalk.bold("ID"), body.snapshotId])
        console.log(table(resultsTable))
        utils.writeManifestFile(args, JSON.stringify(body))
    } catch (error) {
        spinner.fail('Unable to create database')
        console.log(error.response.body)
        process.exit(1)
    }

}

async function listSnapshots(args) {
    var apiKey = utils.getAPIKey(args);
    try {
        var spinner = ora(chalk.bold('Grabbing snapshots from DevDB Cloud...')).start();
        const { body } = await got.get(baseURL + '/api/v1/snapshot', {
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.stop()
        var resultsTable = []
        resultsTable.push([chalk.bold("ID"), chalk.bold("Name"), chalk.bold("Type"), chalk.bold("Created")])
        for (db of body) {
            resultsTable.push([db.id, db.name, db.type, db.created])
        }
        console.log(table(resultsTable))
        utils.writeManifestFile(args, JSON.stringify(body))
    } catch (error) {
        spinner.fail('Unable to create database')
        console.log(error)
        console.log(body)
    }
}

async function deleteSnapshot(args) {
    var apiKey = utils.getAPIKey(args);
    try {
        var spinner = ora(chalk.bold('Deleting database ' + (args.id || args.name) + '...')).start();
        var bodyToPost = {
            name: args.name,
            id: args.id
        }
        const { body } = await got.delete(baseURL + '/api/v1/snapshot', {
            json: bodyToPost,
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.succeed('Snapshot ' + (args.id || args.name) + ' deleted!')
    } catch (error) {
        console.log(error)
        console.log(body)
        spinner.fail('Unable to delete database')
    }

}

module.exports = {
    createSnapshot,
    listSnapshots,
    deleteSnapshot
}