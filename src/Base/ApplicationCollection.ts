import { ITypeable } from "./ITypeable.js";
import { TypeOfApplication, SafetyMode, Application } from "./Application.js";
import { IApplicationCollection } from "./IApplicationCollection.js";
import { IApplication } from "./IApplication.js";
import { ExpressApplicationHandler } from "../Express/ExpressApplicationHandler.js"
import { ExpressApplication } from "./ExpressApplication.js";


export class ApplicationCollection implements IApplicationCollection, ITypeable, IApplication {
    uid: string;
    error?(eventdata?: any): void {
        this.applications.forEach((app) => {
            if(app.error)
            app.error(eventdata);
        });
    }
    exit?(eventdata?: any): void {
        this.applications.forEach((app) => {
            if(app.exit)
            app.exit(eventdata);
        });
    }
    init?(eventdata?: any): void {
        this.applications.forEach((app) => {
            app.Parent = this;
            if(app.init)
            app.init(eventdata);
        });
    }
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
    typeOfApplication?: TypeOfApplication;
    needsSafeMode?: SafetyMode;
    addApps(apps: ApplicationCollection): void {
        apps.applications.forEach((appl) => { this.applications.push(appl); });
    }
    Type: string = "ApplicationCollection";
    applications: Application[] = [];
    meta?: object;
}

// TODO: Add local Server instance to see running services