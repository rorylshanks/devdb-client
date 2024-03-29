const got = require('got');
const utils = require('./utils.js')
const chalk = require('chalk');
const ora = require('ora');
const { table } = require('table')

var baseURL = utils.getBaseURL()

async function createSnapshot(args) {
    var apiKey = utils.getAPIKey(args);
    var bodyToPost = {
        dbId: args.databaseId,
        name: args.name
    }
    try {
        var spinner = ora(chalk.bold('Creating snapshot from source ' + args.databaseId + ' on devdb cloud...')).start();
        const { body } = await got.post(baseURL + '/api/v1/snapshot', {
            json: bodyToPost,
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.succeed('Snapshot created!')
        var resultsTable = []
        resultsTable.push([chalk.bold("Snapshot ID"), body.snapshotId])
        console.log(table(resultsTable))
        utils.writeManifestFile(args, JSON.stringify(body))
    } catch (error) {
        spinner.fail('Unable to create snapshot')
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
        resultsTable.push([chalk.bold("Snapshot ID"), chalk.bold("Name"), chalk.bold("Type"), chalk.bold("Size"), chalk.bold("Created")])
        for (db of body) {
            if ((db.isImage == "0") && (db.sourceDbId == args.databaseId)) {
                resultsTable.push([db.id, db.name, db.type, utils.formatBytes(db.size), db.created])
            }
            
        }
        console.log(table(resultsTable))
        utils.writeManifestFile(args, JSON.stringify(body))
    } catch (error) {
        spinner.fail('Unable to create snapshot')
        console.log(error.response.body)
    }
}

async function deleteSnapshot(args) {
    var apiKey = utils.getAPIKey(args);
    try {
        var spinner = ora(chalk.bold('Deleting snapshot ' + args.snapshotId + '...')).start();
        var bodyToPost = {
            id: args.snapshotId
        }
        const { body } = await got.delete(baseURL + '/api/v1/snapshot', {
            json: bodyToPost,
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.succeed('Snapshot ' + args.snapshotId + ' deleted!')
    } catch (error) {
        console.log(error.response.body)
        spinner.fail('Unable to delete snapshot')
    }

}

async function rollbackDatabaseToSnapshot(args) {
    var apiKey = utils.getAPIKey(args);
    try {
        var spinner = ora(chalk.bold(`Rolling back database ${args.databaseId} to snapshot ${args.snapshotId || "latest"}...`)).start();
        var bodyToPost = {
            dbId: args.databaseId,
            snapshotId: args.snapshotId
        }
        await got.post(baseURL + '/api/v1/database/rollback', {
            json: bodyToPost,
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.succeed('Database rolled back!')
    } catch (error) {
        console.log(error.response.body)
        spinner.fail('Unable to rollback')
    }

}

module.exports = {
    createSnapshot,
    listSnapshots,
    deleteSnapshot,
    rollbackDatabaseToSnapshot
}