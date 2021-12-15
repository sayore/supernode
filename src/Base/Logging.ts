import * as fs from "fs-extra";

export class Logging {
    static interactiveMode: boolean = false;
    static loggingActiveOn:{ll:LogLevel,to:LogTarget}[]=[]
    static log(msg:any[] | any, level:LogLevel | string = LogLevel.Unknown) {
        var t = new Date();
        let logstring = "[ "+level.padEnd(10,' ')+t.getDay().toString().padStart(2,"0")+"."+t.getMonth().toString().padStart(2,"0")+"."+t.getFullYear() + " " +t.getHours().toString().padStart(2,"0")+":"+t.getMinutes().toString().padStart(2,"0")+":"+t.getSeconds().toString().padStart(2,"0")+"."+t.getMilliseconds().toString().padStart(4,"0")+" ]"
        if(!this.interactiveMode)
            if(this.loggingActiveOn.find(lao => lao.ll==level&&lao.to==LogTarget.Textfile))
            {
                // Log to file
                fs.ensureFileSync('./log/'+level+".log"); 
                fs.appendFileSync('./log/'+level+".log",logstring+" "+msg+"\n");
                
                if(level != LogLevel.Verbose) {
                    fs.ensureFileSync('./log/all.log'); 
                    fs.appendFileSync('./log/all.log',logstring+" "+msg+"\n");
                }
            } else {
                if(typeof(msg)=="string")
                    console.log(logstring+" "+msg);
                else {
                    try {
                    msg = [logstring, ...msg]
                    console.log( ... msg);
                } catch {
                    console.log(logstring+" "+msg);

                    }
            }
        }
    }
}

export class InteractiveLogging {
    draw = [];
    registerDraw(drawFunc:()=>void) {
        this.draw.push(drawFunc);
    }
}

export enum LogTarget {
    Console = "TTY",
    Textfile = "TF",
    All = "All"
}

export enum LogLevel {
    Unknown = "Unknown",
    Normal = "Normal",
    Verbose = "Verbose",
    Testing = "Testing",
    Report = "Report"
}