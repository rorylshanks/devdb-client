#!/usr/bin/env node

const databaseCmd = require('./cmd/database.js')
const snapshotCmd = require('./cmd/snapshot.js')

require('yargs/yargs')(process.argv.slice(2))
    .command({
        command: 'create-database',
        aliases: ['create', 'up'],
        desc: 'Launch a database in devdb cloud',
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
                describe: 'Start devdb client in proxy mode'
            },
            username: {
                describe: 'Desired username to use for the database (WARNING, can be insecure). When unset a random username will be generated'
            },
            password: {
                describe: 'Desired password to use for the database (WARNING, can be insecure). When unset a random password will be generated'
            }
        },
        handler: databaseCmd.createDatabase
    })
    .command({
        command: 'list-databases',
        aliases: ['ld', 'list'],
        desc: 'List databases in devdb cloud',
        handler: databaseCmd.listDatabases
    })
    .command({
        command: 'delete-database',
        aliases: ['delete', 'rm'],
        desc: 'Delete database from devdb cloud',
        builder: {
            id: {
                alias: 'i',
                describe: 'ID of the database to delete'
            },
            name: {
                alias: 'n',
                describe: 'Name of the database to delete (must be unique)'
            }
        },
        handler: databaseCmd.deleteDatabase
    })
    .command({
        command: 'create-snapshot',
        aliases: ['snapshot'],
        desc: 'Create s snapshot from an existing database',
        builder: {
            source: {
                alias: 's',
                describe: 'The source database ID that you want to snapshot',
                demandOption: true
            },
            name: {
                alias: 'n',
                describe: 'Name of the created snapshot',
                demandOption: true
            }
        },
        handler: snapshotCmd.createSnapshot
    })
    .command({
        command: 'list-snapshots',
        aliases: ['ls'],
        desc: 'List all snapshots',
        handler: snapshotCmd.listSnapshots
    })
    .command({
        command: 'delete-snapshot',
        aliases: ['rms'],
        desc: 'Delete snapshot from DevDB',
        builder: {
            id: {
                alias: 'i',
                describe: 'ID of the snapshot to delete'
            },
            name: {
                alias: 'n',
                describe: 'Name of the snapshot to delete (must be unique)'
            }
        },
        handler: snapshotCmd.deleteSnapshot
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

