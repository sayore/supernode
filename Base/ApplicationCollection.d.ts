import { ITypeable } from "./ITypeable";
import { TypeOfApplication, SafetyMode, Application } from "./Application";
import { IApplicationCollection } from "./IApplicationCollection";
import { IApplication } from "./IApplication";
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
