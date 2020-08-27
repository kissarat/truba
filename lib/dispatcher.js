const { v4: uuid } = require('uuid');

function packRequestMetadata(req, id) {
    const headers = {
        id,
        method: req.method
    };
    Object.keys(req.headers).forEach(name => {
        headers[`r-${name}`] = req.headers[name];
    });
    return headers;   
}

class ServiceRequest {
    constructor(request, response) {
        this.id = uuid();
        this.request = request;
        this.response = response;
    }

    getRequestHeaders() {
        packRequestMetadata(this.request, this.id);
    }
}

export class Dispatcher {
    constructor() {
        this.requests = {};
        this.responses = {};
    }

    register(req, res) {
        const hostname = req.headers.host;
        const requests = this.requests[hostname];
        if (requests && requests.length > 0) {
            let serviceRequest;
            if (req.headers.id) {
                serviceRequest = requests.find(item => item.id === req.headers.id);
                if (!serviceRequest) {
                    console.error(`Service ${req.headers.id} not found for ${hostname}`)
                }
            }
            if (!serviceRequest) {
                serviceRequest = requests.unshift();
            }
            res.writeHead(200, serviceRequest.getRequestHeaders());
            serviceRequest.request.pipe(res);
        } else {
            this.responses[hostname] = res;
        }
    }

    handle(request, response) {
        const hostname = request.headers.host;
        const serviceResponse = this.responses[hostname];
        if (serviceResponse) {
            delete this.responses[hostname];
            serviceResponse.writeHead(200, packRequestMetadata(request));
            request.pipe(serviceResponse);
        } else {
            const requests = this.requests[hostname];
            const serviceRequest = new ServiceRequest(request, response);
            if (requests) {
                requests.push(serviceRequest);
            } else {
                this.requests[hostname] = [serviceRequest];
            }
        }
    }
}
