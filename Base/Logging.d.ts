/**
 * A static class for handling logging throughout the application.
 */
export declare class Logging {
    private static interactiveMode;
    private static loggingActiveOn;
    /**
     * Logs a message with a specified log level.
     * @param msg The message to log. Can be a single value or an array of values.
     * @param level The log level. Defaults to LogLevel.Unknown.
     */
    static log(msg: any[] | any, level?: LogLevel | string): void;
    /**
     * Sets the log target for a specific log level.
     * @param ll The log level to configure.
     * @param lt The target for the log level.
     */
    static setLogTarget(ll: LogLevel, lt: LogTarget): void;
}
/**
 * A class for handling interactive logging, such as progress bars or animations.
 */
export declare class InteractiveLogging {
    draw: never[];
    registerDraw(drawFunc: () => void): void;
}
/**
 * Defines the possible targets for logging.
 */
export declare enum LogTarget {
    Console = "TTY",
    Textfile = "TF",
    Null = "NULL",
    All = "All"
}
/**
 * Defines the different levels of logging.
 */
export declare enum LogLevel {
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
