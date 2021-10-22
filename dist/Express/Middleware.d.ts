export declare class Middleware {
    static vhost(hostname: string, server: any): (req: any, res: any, next: any) => any;
    static session(): void;
}
