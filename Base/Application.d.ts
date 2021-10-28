import { ApplicationCollection } from "./ApplicationCollection";
import { IApplication } from "./IApplication";
import { ITypeable } from "./ITypeable";
export declare class Application implements IApplication, ITypeable {
    Type: string | TypeOfApplication;
    uid: string;
    Parent?: ApplicationCollection;
    error?(eventdata?: any): void;
    exit?(eventdata?: any): void;
    init?(eventdata?: any): void;
    run(eventdata?: any): Promise<void>;
    restart?(): void;
    typeOfApplication?: TypeOfApplication;
    needsSafeMode?: SafetyMode;
    meta?: object;
}
export declare enum TypeOfApplication {
    Webserver = "Webserver Application",
    Express = "Express Application",
    BackgroundProcess = "Background Application",
    Database = "Database Application",
    NoInteraction = "None Application"
}
export declare enum SafetyMode {
    NeedsCatch = 0,
    Safe = 1,
    OnceNeedsCatch = 2,
    Once = 3
}
