"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationCollection = void 0;
const Application_1 = require("./Application");
const ExpressApplicationHandler_1 = require("../Express/ExpressApplicationHandler");
class ApplicationCollection {
    constructor() {
        this.Type = "ApplicationCollection";
        this.applications = [];
    }
    error(eventdata) {
        this.applications.forEach((app) => {
            app.error(eventdata);
        });
    }
    exit(eventdata) {
        this.applications.forEach((app) => {
            app.exit(eventdata);
        });
    }
    init(eventdata) {
        this.applications.forEach((app) => {
            app.Parent = this;
            app.init(eventdata);
        });
    }
    run(eventdata) {
        this.applications.forEach((app) => {
            if (app.Type == Application_1.TypeOfApplication.Express)
                ExpressApplicationHandler_1.ExpressApplicationHandler.registerSubApp(app);
            else
                try {
                    app.run(eventdata);
                }
                catch (e) {
                    app.error(e);
                    app.restart();
                }
        });
        if (!!ExpressApplicationHandler_1.ExpressApplicationHandler)
            ExpressApplicationHandler_1.ExpressApplicationHandler.run();
    }
    addApps(apps) {
        apps.applications.forEach((appl) => { this.applications.push(appl); });
    }
}
exports.ApplicationCollection = ApplicationCollection;
// TODO: Add local Server instance to see running services
//# sourceMappingURL=ApplicationCollection.js.map