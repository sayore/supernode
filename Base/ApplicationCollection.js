"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.applications.forEach((app) => __awaiter(this, void 0, void 0, function* () {
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
        }));
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