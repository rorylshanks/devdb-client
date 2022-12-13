#!/usr/bin/env node

const databaseCmd = require('./cmd/database.js')
const snapshotCmd = require('./cmd/snapshot.js')
const imageCmd = require('./cmd/image.js')

require('yargs/yargs')(process.argv.slice(2))
    .command({
        command: 'create-database',
        aliases: ['create', 'up'],
        desc: 'Launch a database',
        builder: {
            type: {
                alias: 't',
                describe: 'The type of database you want to create in devdb',
                choices: [
                    "mysql57",
                    "pg13"
                ],
                demandOption: true
            },
            name: {
                alias: 'n',
                describe: 'Name of the created database'
            },
            description: {
                describe: 'Description of the created database'
            },
            snapshot: {
                alias: 's',
                describe: 'Snapshot to create the database from'
            },
            proxy: {
                alias: 'p',
                describe: 'Start devdb client in proxy mode (requires socat to be installed, unless running in Docker)'
            },
            proxyPort: {
                describe: 'Local port to listen on for proxy mode'
            },
            username: {
                describe: 'Desired username to use for the database (WARNING, can be insecure). When unset a random username will be generated'
            },
            password: {
                describe: 'Desired password to use for the database (WARNING, can be insecure). When unset a random password will be generated'
            },
            reconnect: {
                describe: 'Reconnect to the database with the specified name, if it exists. If it doesnt exist, it will create normally.'
            }
        },
        handler: databaseCmd.createDatabase
    })
    .command({
        command: 'list-databases',
        aliases: ['ld', 'list'],
        desc: 'List databases',
        handler: databaseCmd.listDatabases
    })
    .command({
        command: 'delete-database <databaseId>',
        aliases: ['delete', 'rm'],
        desc: 'Delete database',
        handler: databaseCmd.deleteDatabase
    })
    .command({
        command: 'create-snapshot <databaseId> [snapshotName]',
        aliases: ['snapshot'],
        desc: 'Create a snapshot from an existing database',
        builder: {
            snapshotName: {
                alias: 'n',
                describe: 'Name of the created snapshot'
            }
        },
        handler: snapshotCmd.createSnapshot
    })
    .command({
        command: 'create-image <databaseId> [snapshotName]',
        aliases: ['ci'],
        desc: 'Create image from running database',
        builder: {
            snapshotName: {
                alias: 'n',
                describe: 'Name of the created image',
                demandOption: true
            }
        },
        handler: imageCmd.createImage
    })
    .command({
        command: 'list-snapshots <databaseId>',
        aliases: ['ls'],
        desc: 'List all snapshots',
        handler: snapshotCmd.listSnapshots
    })
    .command({
        command: 'list-images',
        aliases: ['li'],
        desc: 'List all images',
        handler: imageCmd.listImages
    })
    .command({
        command: 'delete-snapshot <snapshotId>',
        aliases: ['rms'],
        desc: 'Delete snapshot from DevDB',
        handler: snapshotCmd.deleteSnapshot
    })
    .command({
        command: 'delete-image <imageId>',
        aliases: ['rms'],
        desc: 'Delete image from DevDB',
        handler: imageCmd.deleteImage
    })
    .command({
        command: 'rollback-database <databaseId> [snapshotId]',
        aliases: ['rb', 'rollback'],
        desc: 'Rollback database',
        builder: {
            snapshotId: {
                alias: 'snapshot',
                describe: 'ID of the snapshot to rollback to. Defaults to the most recent snapshot'
            }
        },
        handler: snapshotCmd.rollbackDatabaseToSnapshot
    })
    .options({
        apikey: {
          alias: 'k',
          describe: 'API Key to access DevDB (or from env var DEVDB_API_KEY)'
        },
        manifest: {
            describe: 'Write a JSON output manifest file with the detailed results of the requested command'
          }
      })
    .demandCommand()
    .help()
    .argv

