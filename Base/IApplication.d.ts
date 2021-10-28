import { TypeOfApplication, SafetyMode } from "./Application";
export interface IApplication {
    uid: string;
    /**
     * Define a function to run on error event.
     */
    error?(eventdata?: any): void;
    /**
     * Define a function to run on exit event.
     */
    exit?(eventdata?: any): void;
    /**
     * Define a function to run on init event.
     */
    init?(eventdata?: any): void;
    /**
     * Define a function to run permanently
     */
    run(eventdata?: any): void;
    /**
     * Set the mode the Application shall be run on the sevServer
     */
    typeOfApplication?: TypeOfApplication;
    needsSafeMode?: SafetyMode;
    meta?: object;
}
