export declare class Notification {
    private static serialId;
    static send(title: string, body: string, replacesId?: number, timeoutDuration?: number): Promise<number>;
    private static createHelloPacket;
    private static createNotifyPacket;
    private static wrapPacket;
    private static align;
    private static appendString;
    private static appendUInt32;
    private static appendHeaderField;
    private static getSocketPath;
}
