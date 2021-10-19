"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
class Middleware {
    static vhost(hostname, server) {
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
    static session() {
        throw new Error("Not implemented yet.");
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=Middleware.js.map