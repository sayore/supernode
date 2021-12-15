"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = exports.LogTarget = exports.InteractiveLogging = exports.Logging = void 0;
const fs = __importStar(require("fs-extra"));
class Logging {
    static log(msg, level = LogLevel.Unknown) {
        var t = new Date();
        let logstring = "[ " + level.padEnd(10, ' ') + t.getDay().toString().padStart(2, "0") + "." + t.getMonth().toString().padStart(2, "0") + "." + t.getFullYear() + " " + t.getHours().toString().padStart(2, "0") + ":" + t.getMinutes().toString().padStart(2, "0") + ":" + t.getSeconds().toString().padStart(2, "0") + "." + t.getMilliseconds().toString().padStart(4, "0") + " ]";
        if (!this.interactiveMode)
            if (this.loggingActiveOn.find(lao => lao.ll == level && lao.to == LogTarget.Textfile)) {
                // Log to file
                fs.ensureFileSync('./log/' + level + ".log");
                fs.appendFileSync('./log/' + level + ".log", logstring + " " + msg + "\n");
                if (level != LogLevel.Verbose) {
                    fs.ensureFileSync('./log/all.log');
                    fs.appendFileSync('./log/all.log', logstring + " " + msg + "\n");
                }
            }
            else {
                if (typeof (msg) == "string")
                    console.log(logstring + " " + msg);
                else {
                    msg = [logstring, ...msg];
                    console.log(...msg);
                }
            }
    }
}
exports.Logging = Logging;
Logging.interactiveMode = false;
Logging.loggingActiveOn = [];
class InteractiveLogging {
    constructor() {
        this.draw = [];
    }
    registerDraw(drawFunc) {
        this.draw.push(drawFunc);
    }
}
exports.InteractiveLogging = InteractiveLogging;
var LogTarget;
(function (LogTarget) {
    LogTarget["Console"] = "TTY";
    LogTarget["Textfile"] = "TF";
})(LogTarget = exports.LogTarget || (exports.LogTarget = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel["Unknown"] = "Unknown";
    LogLevel["Normal"] = "Normal";
    LogLevel["Verbose"] = "Verbose";
    LogLevel["Testing"] = "Testing";
    LogLevel["Report"] = "Report";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
//# sourceMappingURL=Logging.js.map