const { createServer } = require('http');
const { handle } = require('./handle'); 
const { registry, RegistryHostname } = require('./registry');
const { gateway } = require('./gateway');

const handlers = {
    registry: handle(registry),
    gateway: handle(gateway)
}

const server = createServer(function(req, res) {
    if (RegistryHostname === req.headers.host) {
        handlers.registry(req, res);
    } else {
        handlers.gateway(req, res);
    }
});

function main() {
    server.listen(process.env.PORT || 8080);
}

module.exports = { main, server };
