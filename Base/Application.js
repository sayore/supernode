/**
 * Represents a generic application. This class is intended to be extended by more specific application types.
 */
export class Application {
    /**
     * The type of the application.
     */
    Type = TypeOfApplication.NoInteraction;
    /**
     * A unique identifier for the application.
     */
    uid;
    /**
     * A reference to the parent application collection, if any.
     */
    Parent = undefined;
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
    async run(eventdata) {
        throw new Error("Method not implemented.");
    }
    /**
     * Restarts the application by calling the run method.
     */
    restart() {
        this.run();
    }
    /**
     * The type of the application, as defined by the TypeOfApplication enum.
     */
    typeOfApplication;
    /**
     * The safety mode for the application.
     */
    needsSafeMode;
    /**
     * Optional metadata for the application.
     */
    meta;
}
/**
 * Defines the different types of applications.
 */
export var TypeOfApplication;
(function (TypeOfApplication) {
    TypeOfApplication["Webserver"] = "Webserver Application";
    TypeOfApplication["Express"] = "Express Application";
    TypeOfApplication["BackgroundProcess"] = "Background Application";
    TypeOfApplication["Database"] = "Database Application";
    TypeOfApplication["NoInteraction"] = "None Application";
})(TypeOfApplication || (TypeOfApplication = {}));
/**
 * Defines the different safety modes for an application.
 */
export var SafetyMode;
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
})(SafetyMode || (SafetyMode = {}));
//# sourceMappingURL=Application.js.map