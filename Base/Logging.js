"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
        var _a;
        var t = new Date();
        let logstring = "";
        function logStringDefault() {
            return [
                level.padEnd(10, ' '),
                t.getDate().toString().padStart(2, "0") + "." + (t.getMonth() + 1).toString().padStart(2, "0") + "." + t.getFullYear() + " " + t.getHours().toString().padStart(2, "0") + ":" + t.getMinutes().toString().padStart(2, "0") + ":" + t.getSeconds().toString().padStart(2, "0")
            ];
        }
        let [llevel, ldate] = logStringDefault();
        switch (level) {
            case level = LogLevel.Report:
                logstring = "[ " + llevel.green + " " + ldate.green + " ]";
                break;
            case level = LogLevel.GReport:
                logstring = "[ " + llevel.green + " " + ldate.green + " ]";
                break;
            case level = LogLevel.NReport:
                logstring = "[ " + llevel.red + " " + ldate.red + " ]";
                break;
            case level = LogLevel.Normal:
                logstring = "[ " + llevel.white + " " + ldate.yellow + " ]";
                break;
            case level = LogLevel.Verbose:
                logstring = "[ " + llevel.blue + " " + ldate.blue + " ]";
                break;
            case level = LogLevel.Testing:
                logstring = "[ " + llevel.cyan + " " + ldate.cyan + " ]";
                break;
            case level = LogLevel.Info:
                logstring = "[ " + llevel.yellow + " " + ldate.yellow + " ]";
                break;
            case level = LogLevel.Raw:
                logstring = "[ " + llevel.red + " " + ldate.red + " ]";
                break;
            default:
                logstring = "[ " + llevel.grey + " " + ldate.grey + " ]";
        }
        if (!this.interactiveMode) {
            let logTarget = (_a = this.loggingActiveOn.find(lao => lao.ll == level)) === null || _a === void 0 ? void 0 : _a.to;
            switch ((logTarget ? logTarget : LogTarget.Console)) {
                case LogTarget.All:
                    logToFile(level, logstring, msg);
                    logToConsole(msg, logstring);
                    break;
                case LogTarget.Textfile:
                    // Log to file
                    logToFile(level, logstring, msg);
                    break;
                case LogTarget.Console:
                    logToConsole(msg, logstring);
                    break;
            }
        }
    }
    static setLogTarget(ll, lt) {
        let lao = this.loggingActiveOn.findIndex(lao => lao.ll == ll);
        if (lao == -1) {
            this.loggingActiveOn.push({ ll, to: lt });
        }
        else {
            this.loggingActiveOn[lao].to = lt;
        }
        ;
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
    LogTarget["Null"] = "NULL";
    LogTarget["All"] = "All";
})(LogTarget || (exports.LogTarget = LogTarget = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel["Unknown"] = "Unknown";
    LogLevel["Normal"] = "Normal";
    LogLevel["Verbose"] = "Verbose";
    LogLevel["Testing"] = "Testing";
    LogLevel["Raw"] = "Testing";
    LogLevel["Info"] = "Info";
    LogLevel["Report"] = "Report";
    LogLevel["GReport"] = "GReport";
    LogLevel["NReport"] = "NReport";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
function logToConsole(msg, logstring) {
    if (typeof (msg) == "string")
        console.log(logstring + " " + msg);
    else {
        try {
            msg = [logstring, ...msg];
            console.log(...msg);
        }
        catch (_a) {
            console.log(logstring + " " + msg);
        }
    }
    return msg;
}
function logToFile(level, logstring, msg) {
    fs.ensureFileSync('./log/' + level + ".log");
    fs.appendFileSync('./log/' + level + ".log", logstring + " " + msg + "\n");
    if (level != LogLevel.Verbose) {
        fs.ensureFileSync('./log/all.log');
        fs.appendFileSync('./log/all.log', logstring + " " + msg + "\n");
    }
}
//# sourceMappingURL=Logging.js.map