const { Dispatcher } = require('./dispatcher');

const dispatcher = new Dispatcher();

function gateway(req, res) {
    dispatcher.handle(req);
}

module.exports = { gateway, services };
