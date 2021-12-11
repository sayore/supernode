export declare class Environment {
    static EnvFileLocations: {
        linux: string;
        win32: string;
    };
    static save(name: string, data: any): void;
    static load<T>(name: string): T;
    static checkExists(name: string): boolean;
}
