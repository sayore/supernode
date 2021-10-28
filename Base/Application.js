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
class Application {
    constructor() {
        this.Type = TypeOfApplication.NoInteraction;
        this.Parent = undefined;
    }
    error(eventdata) {
        throw new Error("Method not implemented.");
    }
    exit(eventdata) {
        throw new Error("Method not implemented.");
    }
    init(eventdata) {
        throw new Error("Method not implemented.");
    }
    run(eventdata) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    restart() {
        this.run();
    }
}
exports.Application = Application;
var TypeOfApplication;
(function (TypeOfApplication) {
    TypeOfApplication["Webserver"] = "Webserver Application";
    TypeOfApplication["Express"] = "Express Application";
    TypeOfApplication["BackgroundProcess"] = "Background Application";
    TypeOfApplication["Database"] = "Database Application";
    TypeOfApplication["NoInteraction"] = "None Application";
})(TypeOfApplication = exports.TypeOfApplication || (exports.TypeOfApplication = {}));
var SafetyMode;
(function (SafetyMode) {
    SafetyMode[SafetyMode["NeedsCatch"] = 0] = "NeedsCatch";
    SafetyMode[SafetyMode["Safe"] = 1] = "Safe";
    SafetyMode[SafetyMode["OnceNeedsCatch"] = 2] = "OnceNeedsCatch";
    SafetyMode[SafetyMode["Once"] = 3] = "Once";
})(SafetyMode = exports.SafetyMode || (exports.SafetyMode = {}));
//# sourceMappingURL=Application.js.map