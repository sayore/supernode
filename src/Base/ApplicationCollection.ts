import { ITypeable } from "./ITypeable";
import { TypeOfApplication, SafetyMode, Application } from "./Application";
import { IApplicationCollection } from "./IApplicationCollection";
import { IApplication } from "./IApplication";
import { ExpressApplicationHandler } from "../Express/ExpressApplicationHandler"
import { ExpressApplication } from "./ExpressApplication";


export class ApplicationCollection implements IApplicationCollection, ITypeable, IApplication {
    uid: string;
    error?(eventdata?: any): void {
        this.applications.forEach((app) => {
            app.error(eventdata);
        });
    }
    exit?(eventdata?: any): void {
        this.applications.forEach((app) => {
            app.exit(eventdata);
        });
    }
    init?(eventdata?: any): void {
        this.applications.forEach((app) => {
            app.Parent = this;
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
                app.error(e);
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