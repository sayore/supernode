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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = exports.LogTarget = exports.InteractiveLogging = exports.Logging = void 0;
const fs = __importStar(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
/**
 * A static class for handling logging throughout the application.
 */
class Logging {
    /**
     * Logs a message with a specified log level.
     * @param msg The message to log. Can be a single value or an array of values.
     * @param level The log level. Defaults to LogLevel.Unknown.
     */
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
                logstring = `[ ${chalk_1.default.green(llevel)} ${chalk_1.default.green(ldate)} ]`;
                break;
            case level = LogLevel.GReport:
                logstring = `[ ${chalk_1.default.green(llevel)} ${chalk_1.default.green(ldate)} ]`;
                break;
            case level = LogLevel.NReport:
                logstring = `[ ${chalk_1.default.red(llevel)} ${chalk_1.default.red(ldate)} ]`;
                break;
            case level = LogLevel.Normal:
                logstring = `[ ${chalk_1.default.white(llevel)} ${chalk_1.default.yellow(ldate)} ]`;
                break;
            case level = LogLevel.Verbose:
                logstring = `[ ${chalk_1.default.blue(llevel)} ${chalk_1.default.blue(ldate)} ]`;
                break;
            case level = LogLevel.Testing:
                logstring = `[ ${chalk_1.default.cyan(llevel)} ${chalk_1.default.cyan(ldate)} ]`;
                break;
            case level = LogLevel.Info:
                logstring = `[ ${chalk_1.default.yellow(llevel)} ${chalk_1.default.yellow(ldate)} ]`;
                break;
            case level = LogLevel.Raw:
                logstring = `[ ${chalk_1.default.red(llevel)} ${chalk_1.default.red(ldate)} ]`;
                break;
            default:
                logstring = `[ ${chalk_1.default.grey(llevel)} ${chalk_1.default.grey(ldate)} ]`;
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
    /**
     * Sets the log target for a specific log level.
     * @param ll The log level to configure.
     * @param lt The target for the log level.
     */
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
/**
 * A class for handling interactive logging, such as progress bars or animations.
 */
class InteractiveLogging {
    constructor() {
        this.draw = [];
    }
    registerDraw(drawFunc) {
        if (!drawFunc)
            this.draw.push(drawFunc);
    }
}
exports.InteractiveLogging = InteractiveLogging;
/**
 * Defines the possible targets for logging.
 */
var LogTarget;
(function (LogTarget) {
    LogTarget["Console"] = "TTY";
    LogTarget["Textfile"] = "TF";
    LogTarget["Null"] = "NULL";
    LogTarget["All"] = "All";
})(LogTarget || (exports.LogTarget = LogTarget = {}));
/**
 * Defines the different levels of logging.
 */
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
/**
 * Logs a message to the console.
 * @param msg The message to log.
 * @param logstring The formatted log string.
 * @returns The original message.
 */
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
/**
 * Logs a message to a file.
 * @param level The log level, used to determine the file name.
 * @param logstring The formatted log string.
 * @param msg The message to log.
 */
function logToFile(level, logstring, msg) {
    fs.ensureFileSync('./log/' + level + ".log");
    fs.appendFileSync('./log/' + level + ".log", logstring + " " + msg + "\n");
    if (level != LogLevel.Verbose) {
        fs.ensureFileSync('./log/all.log');
        fs.appendFileSync('./log/all.log', logstring + " " + msg + "\n");
    }
}
//# sourceMappingURL=Logging.js.map