import fs from "fs-extra";
import chalk from 'chalk';

/**
 * A static class for handling logging throughout the application.
 */
export class Logging {
    private static interactiveMode: boolean = false;
    private static loggingActiveOn: { ll: LogLevel, to: LogTarget }[] = []
    /**
     * Logs a message with a specified log level.
     * @param msg The message to log. Can be a single value or an array of values.
     * @param level The log level. Defaults to LogLevel.Unknown.
     */
    static log(msg: any[] | any, level: LogLevel | string = LogLevel.Unknown) {
        var t = new Date();
        let logstring = "";
        function logStringDefault() {
            return [
                level.padEnd(10, ' '),
                t.getDate().toString().padStart(2, "0") + "." + (t.getMonth()+1).toString().padStart(2, "0") + "." + t.getFullYear() + " " + t.getHours().toString().padStart(2, "0") + ":" + t.getMinutes().toString().padStart(2, "0") + ":" + t.getSeconds().toString().padStart(2, "0")];
        }
        let [llevel,ldate] = logStringDefault();
        switch(level) {
            case level = LogLevel.Report:
                logstring = `[ ${chalk.green(llevel)} ${chalk.green(ldate)} ]`
                break;
            case level = LogLevel.GReport:
                logstring = `[ ${chalk.green(llevel)} ${chalk.green(ldate)} ]`
                break;
            case level = LogLevel.NReport:
                logstring = `[ ${chalk.red(llevel)} ${chalk.red(ldate)} ]`
                break;
            case level = LogLevel.Normal:
                logstring = `[ ${chalk.white(llevel)} ${chalk.yellow(ldate)} ]`
                break;
            case level = LogLevel.Verbose:
                logstring = `[ ${chalk.blue(llevel)} ${chalk.blue(ldate)} ]`
                break;
            case level = LogLevel.Testing:
                logstring = `[ ${chalk.cyan(llevel)} ${chalk.cyan(ldate)} ]`
                break;
            case level = LogLevel.Info:
                logstring = `[ ${chalk.yellow(llevel)} ${chalk.yellow(ldate)} ]`
                break;
            case level = LogLevel.Raw:
                logstring = `[ ${chalk.red(llevel)} ${chalk.red(ldate)} ]`
                break;
            default:
                logstring = `[ ${chalk.grey(llevel)} ${chalk.grey(ldate)} ]`
        }
        if (!this.interactiveMode) {
            let logTarget = this.loggingActiveOn.find(lao => lao.ll == level)?.to;
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
    static setLogTarget(ll:LogLevel,lt:LogTarget) {
        let lao = this.loggingActiveOn.findIndex(lao => lao.ll == ll);
        if(lao==-1) {
            this.loggingActiveOn.push({ll,to:lt})
        } else {
            this.loggingActiveOn[lao].to=lt;
        };
    }
}

/**
 * A class for handling interactive logging, such as progress bars or animations.
 */
export class InteractiveLogging {
    draw = [];
    registerDraw(drawFunc: () => void) {
        if (!drawFunc)
        this.draw.push(drawFunc);
    }
}

/**
 * Defines the possible targets for logging.
 */
export enum LogTarget {
    Console = "TTY",
    Textfile = "TF",
    Null = "NULL",
    All = "All"
}

/**
 * Defines the different levels of logging.
 */
export enum LogLevel {
    Unknown = "Unknown",
    Normal = "Normal",
    Verbose = "Verbose",
    Testing = "Testing",
    Raw = "Testing",
    Info = "Info",
    Report = "Report",
    GReport = "GReport",
    NReport = "NReport"
}

/**
 * Logs a message to the console.
 * @param msg The message to log.
 * @param logstring The formatted log string.
 * @returns The original message.
 */
function logToConsole(msg: any, logstring: string) {
    if (typeof (msg) == "string")
        console.log(logstring + " " + msg);
    else {
        try {
            msg = [logstring, ...msg];
            console.log(...msg);
        } catch {
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
function logToFile(level: string, logstring: string, msg: any) {
    fs.ensureFileSync('./log/' + level + ".log");
    fs.appendFileSync('./log/' + level + ".log", logstring + " " + msg + "\n");

    if (level != LogLevel.Verbose) {
        fs.ensureFileSync('./log/all.log');
        fs.appendFileSync('./log/all.log', logstring + " " + msg + "\n");
    }
}
