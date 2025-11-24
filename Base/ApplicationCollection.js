import { TypeOfApplication } from "./Application.js";
import { ExpressApplicationHandler } from "../Express/ExpressApplicationHandler.js";
/**
 * A collection of applications that can be managed as a single unit.
 */
export class ApplicationCollection {
    /**
     * A unique identifier for the application collection.
     */
    uid;
    /**
     * Propagates an error to all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    error(eventdata) {
        this.applications.forEach((app) => {
            if (app.error)
                app.error(eventdata);
        });
    }
    /**
     * Propagates an exit signal to all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    exit(eventdata) {
        this.applications.forEach((app) => {
            if (app.exit)
                app.exit(eventdata);
        });
    }
    /**
     * Initializes all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    init(eventdata) {
        this.applications.forEach((app) => {
            app.Parent = this;
            if (app.init)
                app.init(eventdata);
        });
    }
    /**
     * Runs all applications in the collection.
     * @param eventdata Optional data associated with the event.
     */
    run(eventdata) {
        this.applications.forEach(async (app) => {
            if (app.Type == TypeOfApplication.Express)
                ExpressApplicationHandler.registerSubApp(app);
            else
                try {
                    app.run(eventdata);
                }
                catch (e) {
                    if (app.error)
                        app.error(e);
                    if (app.restart)
                        app.restart();
                }
        });
        if (!!ExpressApplicationHandler)
            ExpressApplicationHandler.run();
    }
    /**
     * The type of the application.
     */
    typeOfApplication;
    /**
     * The safety mode for the application.
     */
    needsSafeMode;
    /**
     * Adds a collection of applications to this collection.
     * @param apps The collection of applications to add.
     */
    addApps(apps) {
        apps.applications.forEach((appl) => { this.applications.push(appl); });
    }
    /**
     * The type of this object.
     */
    Type = "ApplicationCollection";
    /**
     * The list of applications in the collection.
     */
    applications = [];
    /**
     * Optional metadata for the application collection.
     */
    meta;
}
// TODO: Add local Server instance to see running services
//# sourceMappingURL=ApplicationCollection.js.map