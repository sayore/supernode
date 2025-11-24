export declare class Notification {
    private static serialId;
    /**
     * Sends a notification.
     * @param title Title text
     * @param body Body text
     * @param replacesId (Optional) The ID of an existing notification to update. 0 = New.
     * @param timeoutDuration (Optional) Duration in ms.
     * @returns A Promise that resolves to the Notification ID (use this ID to update later).
     */
    static send(title: string, body: string, replacesId?: number, timeoutDuration?: number): Promise<number>;
    private static dispatch;
    private static getSocketPath;
    private static align;
    private static appendString;
    private static appendUInt32;
    private static appendHeaderField;
}
