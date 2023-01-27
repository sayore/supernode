import * as fs from "fs-extra";

export class Logging {
    private static interactiveMode: boolean = false;
    private static loggingActiveOn: { ll: LogLevel, to: LogTarget }[] = []
    static log(msg: any[] | any, level: LogLevel | string = LogLevel.Unknown) {
        var t = new Date();
        let logstring = "[ " + level.padEnd(10, ' ') + t.getDate().toString().padStart(2, "0") + "." + (t.getMonth()+1).toString().padStart(2, "0") + "." + t.getFullYear() + " " + t.getHours().toString().padStart(2, "0") + ":" + t.getMinutes().toString().padStart(2, "0") + ":" + t.getSeconds().toString().padStart(2, "0") + "." + t.getMilliseconds().toString().padStart(4, "0") + " ]"
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
    static setLogTarget(ll:LogLevel,lt:LogTarget) {
        let lao = this.loggingActiveOn.findIndex(lao => lao.ll == ll);
        if(lao==-1) {
            this.loggingActiveOn.push({ll,to:lt})
        } else {
            this.loggingActiveOn[lao].to=lt;
        };
    }
}

export class InteractiveLogging {
    draw = [];
    registerDraw(drawFunc: () => void) {
        this.draw.push(drawFunc);
    }
}

export enum LogTarget {
    Console = "TTY",
    Textfile = "TF",
    Null = "NULL",
    All = "All"
}

export enum LogLevel {
    Unknown = "Unknown",
    Normal = "Normal",
    Verbose = "Verbose",
    Testing = "Testing",
    Report = "Report"
}

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

function logToFile(level: string, logstring: string, msg: any) {
    fs.ensureFileSync('./log/' + level + ".log");
    fs.appendFileSync('./log/' + level + ".log", logstring + " " + msg + "\n");

    if (level != LogLevel.Verbose) {
        fs.ensureFileSync('./log/all.log');
        fs.appendFileSync('./log/all.log', logstring + " " + msg + "\n");
    }
}
