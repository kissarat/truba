const yargs = require('yargs');
const { createServer, request } = require('http');

const hosts = {
    'truba.labiak.org': 8080
};

function serve() {
    for(const hostname in hosts) {
        const port = hosts[hostname];
        request({
            hostname
        })
    }
}
