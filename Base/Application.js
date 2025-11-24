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
exports.SafetyMode = exports.TypeOfApplication = exports.Application = void 0;
/**
 * Represents a generic application. This class is intended to be extended by more specific application types.
 */
class Application {
    constructor() {
        /**
         * The type of the application.
         */
        this.Type = TypeOfApplication.NoInteraction;
        /**
         * A reference to the parent application collection, if any.
         */
        this.Parent = undefined;
    }
    /**
     * A method to be called when the application encounters an error.
     * @param eventdata Optional data associated with the event.
     */
    error(eventdata) {
        throw new Error("Method not implemented.");
    }
    /**
     * A method to be called when the application exits.
     * @param eventdata Optional data associated with the event.
     */
    exit(eventdata) {
        throw new Error("Method not implemented.");
    }
    /**
     * A method to be called to initialize the application.
     * @param eventdata Optional data associated with the event.
     */
    init(eventdata) {
        throw new Error("Method not implemented.");
    }
    /**
     * The main method to run the application.
     * @param eventdata Optional data associated with the event.
     */
    run(eventdata) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    /**
     * Restarts the application by calling the run method.
     */
    restart() {
        this.run();
    }
}
exports.Application = Application;
/**
 * Defines the different types of applications.
 */
var TypeOfApplication;
(function (TypeOfApplication) {
    TypeOfApplication["Webserver"] = "Webserver Application";
    TypeOfApplication["Express"] = "Express Application";
    TypeOfApplication["BackgroundProcess"] = "Background Application";
    TypeOfApplication["Database"] = "Database Application";
    TypeOfApplication["NoInteraction"] = "None Application";
})(TypeOfApplication || (exports.TypeOfApplication = TypeOfApplication = {}));
/**
 * Defines the different safety modes for an application.
 */
var SafetyMode;
(function (SafetyMode) {
    /**
     * The application needs a try-catch block around its execution.
     */
    SafetyMode[SafetyMode["NeedsCatch"] = 0] = "NeedsCatch";
    /**
     * The application is considered safe to run without a try-catch block.
     */
    SafetyMode[SafetyMode["Safe"] = 1] = "Safe";
    /**
     * The application needs a try-catch block for its first run.
     */
    SafetyMode[SafetyMode["OnceNeedsCatch"] = 2] = "OnceNeedsCatch";
    /**
     * The application runs once and is considered safe.
     */
    SafetyMode[SafetyMode["Once"] = 3] = "Once";
})(SafetyMode || (exports.SafetyMode = SafetyMode = {}));
//# sourceMappingURL=Application.js.map