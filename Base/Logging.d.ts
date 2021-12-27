export declare class Logging {
    private static interactiveMode;
    private static loggingActiveOn;
    static log(msg: any[] | any, level?: LogLevel | string): void;
    static setLogTarget(ll: LogLevel, lt: LogTarget): void;
}
export declare class InteractiveLogging {
    draw: any[];
    registerDraw(drawFunc: () => void): void;
}
export declare enum LogTarget {
    Console = "TTY",
    Textfile = "TF",
    Null = "NULL",
    All = "All"
}
export declare enum LogLevel {
    Unknown = "Unknown",
    Normal = "Normal",
    Verbose = "Verbose",
    Testing = "Testing",
    Report = "Report"
}
