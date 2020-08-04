const { createServer } = require('http');

const server = createServer(function(req, res) {
    res.end(JSON.stringify({ method: req.method }));
});

function main() {
    server.listen(process.env.PORT || 8080);
}

module.exports = { main, server };
