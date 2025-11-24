import { TypeOfApplication } from "./Application.js";
import express from "express";
export class ExpressApplication {
    Type = TypeOfApplication.Express;
    uid;
    app;
    port;
    standalone;
    constructor(port, standalone = false) {
        let app = express();
        this.port = port;
        this.app = app;
        this.standalone = standalone;
    }
    error(eventdata) {
    }
    exit(eventdata) {
    }
    init(eventdata) {
    }
    async run(eventdata) {
        if (this.standalone) {
            if (this.init)
                this.init();
            this.app.listen(this.port);
        }
    }
    typeOfApplication;
    needsSafeMode;
    meta;
    /** >alas.<something.de */
    subdomain;
    /** something.de */
    domain;
    #_createServer() {
    }
    getMiddleware() {
        return this.#_getMiddleware((this.subdomain ? this.subdomain + "." : "") + this.domain, this.app);
    }
    #_getMiddleware(hostname, server) {
        if (!hostname)
            throw new Error('vhost hostname required');
        if (!server)
            throw new Error('vhost server required');
        var regexp = new RegExp('^' + hostname.replace(/[^*\w]/g, '\\$&').replace(/[*]/g, '(?:.*?)') + '$', 'i');
        if (server.onvhost)
            server.onvhost(hostname);
        return function vhost(req, res, next) {
            if (!req.headers.host)
                return next();
            var host = req.headers.host.split(':')[0];
            if (!regexp.test(host))
                return next();
            if ('function' == typeof server)
                return server(req, res, next);
            server.emit('request', req, res);
        };
    }
    ;
}
//# sourceMappingURL=ExpressApplication.js.map