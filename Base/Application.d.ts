import { ApplicationCollection } from "./ApplicationCollection.js";
import { IApplication } from "./IApplication.js";
import { ITypeable } from "./ITypeable.js";
/**
 * Represents a generic application. This class is intended to be extended by more specific application types.
 */
export declare class Application implements IApplication, ITypeable {
    /**
     * The type of the application.
     */
    Type: string | TypeOfApplication;
    /**
     * A unique identifier for the application.
     */
    uid: string;
    /**
     * A reference to the parent application collection, if any.
     */
    Parent?: ApplicationCollection;
    /**
     * A method to be called when the application encounters an error.
     * @param eventdata Optional data associated with the event.
     */
    error?(eventdata?: any): void;
    /**
     * A method to be called when the application exits.
     * @param eventdata Optional data associated with the event.
     */
    exit?(eventdata?: any): void;
    /**
     * A method to be called to initialize the application.
     * @param eventdata Optional data associated with the event.
     */
    init?(eventdata?: any): void;
    /**
     * The main method to run the application.
     * @param eventdata Optional data associated with the event.
     */
    run(eventdata?: any): Promise<void>;
    /**
     * Restarts the application by calling the run method.
     */
    restart?(): void;
    /**
     * The type of the application, as defined by the TypeOfApplication enum.
     */
    typeOfApplication?: TypeOfApplication;
    /**
     * The safety mode for the application.
     */
    needsSafeMode?: SafetyMode;
    /**
     * Optional metadata for the application.
     */
    meta?: object;
}
/**
 * Defines the different types of applications.
 */
export declare enum TypeOfApplication {
    Webserver = "Webserver Application",
    Express = "Express Application",
    BackgroundProcess = "Background Application",
    Database = "Database Application",
    NoInteraction = "None Application"
}
/**
 * Defines the different safety modes for an application.
 */
export declare enum SafetyMode {
    /**
     * The application needs a try-catch block around its execution.
     */
    NeedsCatch = 0,
    /**
     * The application is considered safe to run without a try-catch block.
     */
    Safe = 1,
    /**
     * The application needs a try-catch block for its first run.
     */
    OnceNeedsCatch = 2,
    /**
     * The application runs once and is considered safe.
     */
    Once = 3
}
