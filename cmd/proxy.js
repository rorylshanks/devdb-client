const { exec } = require("child_process");
const fs = require('fs')
const tmp = require('tmp');

function createProxy(localPort, remoteHost, cert, key) {
    const config = tmp.fileSync();
    const certFile = tmp.fileSync();
    const keyFile = tmp.fileSync();
    var configFile = `
fips = no
foreground = yes
pid = 
debug = 3
delay = yes
options = NO_SSLv2
options = NO_SSLv3
[db]
   client = yes
   sni = ${remoteHost}
   accept = 0.0.0.0:${localPort}
   connect = ${remoteHost}:9500
   cert = ${certFile.name}
   key = ${keyFile.name}
    `
    fs.writeFileSync(config.name, configFile)
    fs.writeFileSync(certFile.name, cert)
    fs.writeFileSync(keyFile.name, key)
    exec(`stunnel ${config.name}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

module.exports = {
    createProxy
}