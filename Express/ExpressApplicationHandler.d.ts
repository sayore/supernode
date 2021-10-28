import { ExpressApplication } from "../Base/ExpressApplication";
declare class _ExpressApplicationHandler extends ExpressApplication {
    private static _instance;
    private constructor();
    registerSubApp(appl: ExpressApplication): void;
    run(): Promise<void>;
    static get Instance(): _ExpressApplicationHandler;
}
export declare let ExpressApplicationHandler: _ExpressApplicationHandler;
export {};
