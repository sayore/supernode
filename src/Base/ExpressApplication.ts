import { Application, TypeOfApplication, SafetyMode } from "./Application";
import express from "express";

export class ExpressApplication implements Application {
    Type = TypeOfApplication.Express;
    uid: string;
    app: express.Application;
    port: number;
    standalone:boolean;
    constructor(port: number, standalone:boolean=false) {
        let app = express();
        this.port = port;
        this.app = app;

        this.standalone=standalone;
    }
    error?(eventdata?: any): void {
        
    }
    exit?(eventdata?: any): void {
        
    }
    init?(eventdata?: any): void {
        
    }
    async run(eventdata?: any) {
        if(this.standalone)
        {
            this.init();
            this.app.listen(this.port);
        }
    }
    typeOfApplication?: TypeOfApplication;
    needsSafeMode?: SafetyMode;
    meta?: object;
    /** >alas.<something.de */
    protected subdomain: string;
    /** something.de */
    protected domain: string;

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
    };
}
