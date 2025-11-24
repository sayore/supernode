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
const Application_js_1 = require("./Application.js");
const ExpressApplicationHandler_js_1 = require("../Express/ExpressApplicationHandler.js");
/**
 * A collection of applications that can be managed as a single unit.
 */
class ApplicationCollection {
    constructor() {
        /**
         * The type of this object.
         */
        this.Type = "ApplicationCollection";
        /**
         * The list of applications in the collection.
         */
        this.applications = [];
    }
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
        this.applications.forEach((app) => __awaiter(this, void 0, void 0, function* () {
            if (app.Type == Application_js_1.TypeOfApplication.Express)
                ExpressApplicationHandler_js_1.ExpressApplicationHandler.registerSubApp(app);
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
        }));
        if (!!ExpressApplicationHandler_js_1.ExpressApplicationHandler)
            ExpressApplicationHandler_js_1.ExpressApplicationHandler.run();
    }
    /**
     * Adds a collection of applications to this collection.
     * @param apps The collection of applications to add.
     */
    addApps(apps) {
        apps.applications.forEach((appl) => { this.applications.push(appl); });
    }
}
exports.ApplicationCollection = ApplicationCollection;
// TODO: Add local Server instance to see running services
//# sourceMappingURL=ApplicationCollection.js.map