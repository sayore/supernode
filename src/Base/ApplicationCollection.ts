import { ITypeable } from "./ITypeable.js";
import { TypeOfApplication, SafetyMode, Application } from "./Application.js";
import { IApplicationCollection } from "./IApplicationCollection.js";
import { IApplication } from "./IApplication.js";
import { ExpressApplicationHandler } from "../Express/ExpressApplicationHandler.js"
import { ExpressApplication } from "./ExpressApplication.js";


/**
 * A collection of applications that can be managed as a single unit.
 */
export class ApplicationCollection implements IApplicationCollection, ITypeable, IApplication {
    /**
     * A unique identifier for the application collection.
     */
    uid: string;
    /**
     * Propagates an error to all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    error?(eventdata?: any): void {
        this.applications.forEach((app) => {
            if(app.error)
            app.error(eventdata);
        });
    }
    /**
     * Propagates an exit signal to all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    exit?(eventdata?: any): void {
        this.applications.forEach((app) => {
            if(app.exit)
            app.exit(eventdata);
        });
    }
    /**
     * Initializes all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    init?(eventdata?: any): void {
        this.applications.forEach((app) => {
            app.Parent = this;
            if(app.init)
            app.init(eventdata);
        });
    }
    /**
     * Runs all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    run(eventdata?: any): void {
        this.applications.forEach(async (app) => {
            if(app.Type == TypeOfApplication.Express)
                ExpressApplicationHandler.registerSubApp((<ExpressApplication>app))
            else
            try {
                app.run(eventdata);
            } catch(e) {
                if(app.error)
                app.error(e);
                if(app.restart)
                app.restart();
            }
        });
        if(!!ExpressApplicationHandler)
            ExpressApplicationHandler.run()
    }
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
    addApps(apps: ApplicationCollection): void {
        apps.applications.forEach((appl) => { this.applications.push(appl); });
    }
    /**
     * The type of this object.
     */
    Type: string = "ApplicationCollection";
    /**
     * The list of applications in the collection.
     */
    applications: Application[] = [];
    /**
     * Optional metadata for the application collection.
     */
    meta?: object;
}

// TODO: Add local Server instance to see running services