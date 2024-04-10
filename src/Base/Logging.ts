import * as fs from "fs-extra";
import colors from "colors";
export class Logging {
    private static interactiveMode: boolean = false;
    private static loggingActiveOn: { ll: LogLevel, to: LogTarget }[] = []
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
                logstring="[ "+llevel.green+" "+ldate.green+" ]"
                break;
            case level = LogLevel.GReport:
                logstring="[ "+llevel.green+" "+ldate.green+" ]"
                break;
            case level = LogLevel.NReport:
                logstring="[ "+llevel.red+" "+ldate.red+" ]"
                break;
            case level = LogLevel.Normal:
                logstring="[ "+llevel.white+" "+ldate.yellow+" ]"
                break;
            case level = LogLevel.Verbose:
                logstring="[ "+llevel.blue+" "+ldate.blue+" ]"
                break;
            case level = LogLevel.Testing:
                logstring="[ "+llevel.cyan+" "+ldate.cyan+" ]"
                break;
            case level = LogLevel.Info:
                logstring="[ "+llevel.yellow+" "+ldate.yellow+" ]"
                break;
            case level = LogLevel.Raw:
                logstring="[ "+llevel.red+" "+ldate.red+" ]"
                break;
            default:
                logstring="[ "+llevel.grey+" "+ldate.grey+" ]"
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
    Raw = "Testing",
    Info = "Info",
    Report = "Report",
    GReport = "GReport",
    NReport = "NReport"
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
