export declare class Environment {
    static EnvFileLocations: {
        linux: string;
        win32: string;
    };
    static save(name: string, data: object): void;
    static load<T>(name: string): T;
}
