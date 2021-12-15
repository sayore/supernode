export declare class Logging {
    static interactiveMode: boolean;
    static loggingActiveOn: {
        ll: LogLevel;
        to: LogTarget;
    }[];
    static log(msg: any[] | any, level?: LogLevel | string): void;
}
export declare class InteractiveLogging {
    draw: any[];
    registerDraw(drawFunc: () => void): void;
}
export declare enum LogTarget {
    Console = "TTY",
    Textfile = "TF"
}
export declare enum LogLevel {
    Unknown = "Unknown",
    Normal = "Normal",
    Verbose = "Verbose",
    Testing = "Testing",
    Report = "Report"
}
