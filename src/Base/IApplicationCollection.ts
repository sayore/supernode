import { IApplication } from "./IApplication.js";


export interface IApplicationCollection {
    applications: IApplication[];
    meta?: object;
    addApps(apps: IApplicationCollection): void;
}
