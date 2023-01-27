"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ExpressApplication_instances, _ExpressApplication__createServer, _ExpressApplication__getMiddleware;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressApplication = void 0;
const Application_1 = require("./Application");
const express_1 = __importDefault(require("express"));
class ExpressApplication {
    constructor(port, standalone = false) {
        _ExpressApplication_instances.add(this);
        this.Type = Application_1.TypeOfApplication.Express;
        let app = (0, express_1.default)();
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
    run(eventdata) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.standalone) {
                this.init();
                this.app.listen(this.port);
            }
        });
    }
    getMiddleware() {
        return __classPrivateFieldGet(this, _ExpressApplication_instances, "m", _ExpressApplication__getMiddleware).call(this, (this.subdomain ? this.subdomain + "." : "") + this.domain, this.app);
    }
    ;
}
exports.ExpressApplication = ExpressApplication;
_ExpressApplication_instances = new WeakSet(), _ExpressApplication__createServer = function _ExpressApplication__createServer() {
}, _ExpressApplication__getMiddleware = function _ExpressApplication__getMiddleware(hostname, server) {
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
//# sourceMappingURL=ExpressApplication.js.map