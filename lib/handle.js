function send(object) {
    this.end(JSON.stringify(object));
}

function fail(err, status = 400) {
    console.error(err);
    this
        .status(status)
        .send({ message: typeof err === 'string' ? err : err.message });
}

function handle(callback) {
    return async function(req, res) {
        res.send = send;
        res.fail = fail; 
        try {
            await callback(req, res);
        }
        catch(err) {
            res.fail(err);
        }
    }
}
