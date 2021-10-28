import { IApplication } from "./IApplication";


export interface IApplicationCollection {
    applications: IApplication[];
    meta?: object;
    addApps(apps: IApplicationCollection): void;
}
