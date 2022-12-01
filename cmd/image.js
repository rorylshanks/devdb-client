const got = require('got');
const utils = require('./utils.js')
const chalk = require('chalk');
const ora = require('ora');
const { table } = require('table')

var baseURL = utils.getBaseURL()

async function createImage(args) {
    var apiKey = utils.getAPIKey(args);
    var bodyToPost = {
        dbId: args.databaseId,
        name: args.snapshotName,
        image: true
    }
    try {
        var spinner = ora(chalk.bold('Creating image from source ' + args.databaseId +' on devdb cloud...')).start();
        const { body } = await got.post(baseURL + '/api/v1/snapshot', {
            json: bodyToPost,
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.succeed('Image created!')
        var resultsTable = []
        resultsTable.push([chalk.bold("Image ID"), body.snapshotId])
        console.log(table(resultsTable))
        utils.writeManifestFile(args, JSON.stringify(body))
    } catch (error) {
        spinner.fail('Unable to create image')
        console.log(error.response.body)
        process.exit(1)
    }

}

async function listImages(args) {
    var apiKey = utils.getAPIKey(args);
    try {
        var spinner = ora(chalk.bold('Grabbing images from DevDB Cloud...')).start();
        const { body } = await got.get(baseURL + '/api/v1/snapshot', {
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.stop()
        var resultsTable = []
        resultsTable.push([chalk.bold("Image ID"), chalk.bold("Name"), chalk.bold("Type"), chalk.bold("Size"), chalk.bold("Created")])
        for (db of body) {
            if (db.isImage == "1") {
                resultsTable.push([db.id, db.name, db.type, utils.formatBytes(db.size), db.created])
            }
            
        }
        console.log(table(resultsTable))
        utils.writeManifestFile(args, JSON.stringify(body))
    } catch (error) {
        spinner.fail('Unable to create image')
console.log(error.response.body)
    }
}

async function deleteImage(args) {
    var apiKey = utils.getAPIKey(args);
    try {
        var spinner = ora(chalk.bold('Deleting image ' + args.imageId + '...')).start();
        var bodyToPost = {
            id: args.imageId
        }
        const { body } = await got.delete(baseURL + '/api/v1/snapshot', {
            json: bodyToPost,
            responseType: 'json',
            headers: {
                "x-api-key": apiKey
            }
        });
        spinner.succeed('Image ' + args.imageId + ' deleted!')
    } catch (error) {
console.log(error.response.body)
        spinner.fail('Unable to delete image')
    }

}

module.exports = {
    createImage,
    listImages,
    deleteImage
}