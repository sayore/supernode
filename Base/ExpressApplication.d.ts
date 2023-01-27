import { Application, TypeOfApplication, SafetyMode } from "./Application";
import express from "express";
export declare class ExpressApplication implements Application {
    #private;
    Type: TypeOfApplication;
    uid: string;
    app: express.Application;
    port: number;
    standalone: boolean;
    constructor(port: number, standalone?: boolean);
    error?(eventdata?: any): void;
    exit?(eventdata?: any): void;
    init?(eventdata?: any): void;
    run(eventdata?: any): Promise<void>;
    typeOfApplication?: TypeOfApplication;
    needsSafeMode?: SafetyMode;
    meta?: object;
    /** >alas.<something.de */
    protected subdomain: string;
    /** something.de */
    protected domain: string;
    getMiddleware(): (req: any, res: any, next: any) => any;
}
