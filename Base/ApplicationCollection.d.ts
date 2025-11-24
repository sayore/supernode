import { ITypeable } from "./ITypeable.js";
import { TypeOfApplication, SafetyMode, Application } from "./Application.js";
import { IApplicationCollection } from "./IApplicationCollection.js";
import { IApplication } from "./IApplication.js";
/**
 * A collection of applications that can be managed as a single unit.
 */
export declare class ApplicationCollection implements IApplicationCollection, ITypeable, IApplication {
    /**
     * A unique identifier for the application collection.
     */
    uid: string;
    /**
     * Propagates an error to all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    error?(eventdata?: any): void;
    /**
     * Propagates an exit signal to all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    exit?(eventdata?: any): void;
    /**
     * Initializes all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    init?(eventdata?: any): void;
    /**
     * Runs all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    run(eventdata?: any): void;
    /**
     * The type of the application.
     */
    typeOfApplication?: TypeOfApplication;
    /**
     * The safety mode for the application.
     */
    needsSafeMode?: SafetyMode;
    /**
     * Adds a collection of applications to this collection.
     * @param apps The collection of applications to add.
     */
    addApps(apps: ApplicationCollection): void;
    /**
     * The type of this object.
     */
    Type: string;
    /**
     * The list of applications in the collection.
     */
    applications: Application[];
    /**
     * Optional metadata for the application collection.
     */
    meta?: object;
}
