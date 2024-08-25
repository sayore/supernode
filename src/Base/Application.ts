import { ApplicationCollection } from "./ApplicationCollection.js";
import { IApplication } from "./IApplication.js";
import { ITypeable } from "./ITypeable.js";

export class Application implements IApplication, ITypeable{
    Type: string | TypeOfApplication = TypeOfApplication.NoInteraction;
    uid: string;
    Parent?: ApplicationCollection = undefined;
    error?(eventdata?: any): void {
        throw new Error("Method not implemented.");
    }
    exit?(eventdata?: any): void {
        throw new Error("Method not implemented.");
    }
    init?(eventdata?: any): void {
        throw new Error("Method not implemented.");
    }
    async run(eventdata?: any) {
        throw new Error("Method not implemented.");
    }
    restart?() {
        this.run();
    }
    typeOfApplication?: TypeOfApplication;
    needsSafeMode?: SafetyMode;
    meta?: object;
}

export enum TypeOfApplication {
    Webserver = "Webserver Application",
    Express = "Express Application",
    BackgroundProcess = "Background Application",
    Database = "Database Application",
    NoInteraction = "None Application"
}

export enum SafetyMode {
    NeedsCatch,
    Safe,
    OnceNeedsCatch,
    Once
}
