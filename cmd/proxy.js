const { exec } = require("child_process");

function createProxy(localPort, remoteHost, remotePort) {
    exec(`socat TCP-LISTEN:${localPort},fork TCP:${remoteHost}:${remotePort}`, (error, stdout, stderr) => {
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