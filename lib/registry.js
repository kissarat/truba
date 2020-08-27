// const { loadJSON } = require('auxiliary');
const { services } = require('./gateway');

const RegistryHostname = process.env.REGISTRY || 'localhost';

async function registry(req, res) {
    if ('POST' === req.method) {
        services[req.url.slice(1)] = { response: res }
    } else {
        res.fail('Allowed only POST', 405);
    }
}

module.exports = { registry, RegistryHostname };
