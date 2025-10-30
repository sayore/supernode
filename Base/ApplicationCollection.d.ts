import { ITypeable } from "./ITypeable.js";
import { TypeOfApplication, SafetyMode, Application } from "./Application.js";
import { IApplicationCollection } from "./IApplicationCollection.js";
import { IApplication } from "./IApplication.js";
export declare class ApplicationCollection implements IApplicationCollection, ITypeable, IApplication {
    uid: string;
    error?(eventdata?: any): void;
    exit?(eventdata?: any): void;
    init?(eventdata?: any): void;
    run(eventdata?: any): void;
    typeOfApplication?: TypeOfApplication;
    needsSafeMode?: SafetyMode;
    addApps(apps: ApplicationCollection): void;
    Type: string;
    applications: Application[];
    meta?: object;
}
