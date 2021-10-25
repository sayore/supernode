export interface Application {
    /**
     * Define a function to run on error event.
     */
    error?(eventdata?:any) : void
    /**
     * Define a function to run on exit event.
     */
    exit?(eventdata?:any) : void
    /**
     * Define a function to run on init event.
     */
    init?(eventdata?:any) : void
    /**
     * Define a function to run permanently
     */
    run(eventdata?:any) : void
    /**
     * Set the mode the Application shall be run on the sevServer
     */
    typeOfApplication? : TypeOfApplication
    needsSafeMode? : SafetyMode
    meta? : object
}

export interface ApplicationCollection {
    applications:Application[]
    meta? : object
}

enum TypeOfApplication {
    Webserver,
    BackgroundProcess,
    Database
}

enum SafetyMode {
    NeedsCatch,
    Safe,
    OnceNeedsCatch,
    Once
}
