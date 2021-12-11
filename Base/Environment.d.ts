export declare class Environment {
    static EnvFileLocations: {
        linux: string;
        win32: string;
    };
    static save(envfilename: string, data: any): void;
    static load<T>(envfilename: string): T;
    static checkExists(envfilename: string): boolean;
    static getEnvFilePath(envfilename: string): string;
}
