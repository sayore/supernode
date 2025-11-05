import { ApplicationCollection } from "./ApplicationCollection.js";
import { IApplication } from "./IApplication.js";
import { ITypeable } from "./ITypeable.js";

/**
 * Represents a generic application. This class is intended to be extended by more specific application types.
 */
export class Application implements IApplication, ITypeable{
    /**
     * The type of the application.
     */
    Type: string | TypeOfApplication = TypeOfApplication.NoInteraction;
    /**
     * A unique identifier for the application.
     */
    uid: string;
    /**
     * A reference to the parent application collection, if any.
     */
    Parent?: ApplicationCollection = undefined;
    /**
     * A method to be called when the application encounters an error.
     * @param eventdata Optional data associated with the event.
     */
    error?(eventdata?: any): void {
        throw new Error("Method not implemented.");
    }
    /**
     * A method to be called when the application exits.
     * @param eventdata Optional data associated with the event.
     */
    exit?(eventdata?: any): void {
        throw new Error("Method not implemented.");
    }
    /**
     * A method to be called to initialize the application.
     * @param eventdata Optional data associated with the event.
     */
    init?(eventdata?: any): void {
        throw new Error("Method not implemented.");
    }
    /**
     * The main method to run the application.
     * @param eventdata Optional data associated with the event.
     */
    async run(eventdata?: any) {
        throw new Error("Method not implemented.");
    }
    /**
     * Restarts the application by calling the run method.
     */
    restart?() {
        this.run();
    }
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
export enum TypeOfApplication {
    Webserver = "Webserver Application",
    Express = "Express Application",
    BackgroundProcess = "Background Application",
    Database = "Database Application",
    NoInteraction = "None Application"
}

/**
 * Defines the different safety modes for an application.
 */
export enum SafetyMode {
    /**
     * The application needs a try-catch block around its execution.
     */
    NeedsCatch,
    /**
     * The application is considered safe to run without a try-catch block.
     */
    Safe,
    /**
     * The application needs a try-catch block for its first run.
     */
    OnceNeedsCatch,
    /**
     * The application runs once and is considered safe.
     */
    Once
}
