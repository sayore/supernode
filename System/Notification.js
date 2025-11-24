"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const net = __importStar(require("net"));
class Notification {
    /**
     * Sends a notification.
     * @param title Title text
     * @param body Body text
     * @param replacesId (Optional) The ID of an existing notification to update. 0 = New.
     * @param timeoutDuration (Optional) Duration in ms.
     * @returns A Promise that resolves to the Notification ID (use this ID to update later).
     */
    static send(title, body, replacesId = 0, timeoutDuration = 5000) {
        return new Promise((resolve, reject) => {
            const socketPath = this.getSocketPath();
            if (!socketPath) {
                return reject("DBUS_SESSION_BUS_ADDRESS not found.");
            }
            // --- 1. Construct Payload ---
            // Signature: susssasa{sv}i
            let payload = Buffer.alloc(0);
            payload = this.appendString(payload, "SuperNode"); // App Name
            payload = this.appendUInt32(payload, replacesId); // Replaces ID (The magic argument)
            payload = this.appendString(payload, ""); // Icon
            payload = this.appendString(payload, title); // Summary
            payload = this.appendString(payload, body); // Body
            // Actions (Empty Array)
            payload = this.align(payload, 4);
            payload = Buffer.concat([payload, Buffer.from([0, 0, 0, 0])]);
            // Hints (Empty Dict)
            payload = this.align(payload, 4);
            payload = Buffer.concat([payload, Buffer.from([0, 0, 0, 0])]);
            // Timeout
            payload = this.align(payload, 4);
            const timeoutBuf = Buffer.alloc(4);
            timeoutBuf.writeInt32LE(timeoutDuration);
            payload = Buffer.concat([payload, timeoutBuf]);
            // --- 2. Construct Header ---
            const currentSerial = this.serialId++;
            let fields = Buffer.alloc(0);
            fields = this.appendHeaderField(fields, 1, "/org/freedesktop/Notifications");
            fields = this.appendHeaderField(fields, 6, "org.freedesktop.Notifications");
            fields = this.appendHeaderField(fields, 2, "org.freedesktop.Notifications");
            fields = this.appendHeaderField(fields, 3, "Notify");
            fields = this.align(fields, 8);
            fields = Buffer.concat([fields, Buffer.from([8, 13]), Buffer.from("susssasa{sv}i"), Buffer.from([0])]);
            fields = this.align(fields, 8);
            const fixedHeader = Buffer.alloc(12);
            fixedHeader.write("l");
            fixedHeader.writeUInt8(1, 1); // Type 1 = Method Call
            fixedHeader.writeUInt8(0, 2);
            fixedHeader.writeUInt8(1, 3);
            fixedHeader.writeUInt32LE(payload.length, 4);
            fixedHeader.writeUInt32LE(currentSerial, 8);
            const headerLenBuf = Buffer.alloc(4);
            headerLenBuf.writeUInt32LE(fields.length);
            const fullPacket = Buffer.concat([fixedHeader, headerLenBuf, fields, payload]);
            // --- 3. Dispatch & Wait for Reply ---
            this.dispatch(socketPath, fullPacket, currentSerial, resolve, reject);
        });
    }
    static dispatch(socketPath, packet, sentSerial, resolve, reject) {
        const client = net.createConnection(socketPath);
        let handshakeComplete = false;
        client.on('connect', () => {
            const uid = process.getuid ? process.getuid().toString() : "1000";
            const hexUid = Buffer.from(uid).toString('hex');
            client.write(Buffer.concat([
                Buffer.from([0]),
                Buffer.from(`AUTH EXTERNAL ${hexUid}\r\n`, 'ascii')
            ]));
        });
        client.on('data', (data) => {
            const str = data.toString('ascii');
            // 1. Handle Auth Handshake
            if (!handshakeComplete && str.includes("OK")) {
                handshakeComplete = true;
                client.write("BEGIN\r\n");
                client.write(packet);
                return;
            }
            // 2. Handle Binary Response
            if (handshakeComplete) {
                // We are looking for Type 2 (Method Return) and matching Serial
                // Header format: [Endian(1)][Type(1)][Flags(1)][Ver(1)][BodyLen(4)][ReplySerial(4)]...
                // Need at least 12 bytes for header
                if (data.length < 12)
                    return;
                const msgType = data.readUInt8(1);
                const replySerial = data.readUInt32LE(8); // The serial we sent, effectively
                if (msgType === 2) {
                    // This is a Method Return!
                    // To find the body (the ID), we must skip the header fields.
                    const fieldsLen = data.readUInt32LE(12);
                    // Header Size = 12 (Fixed) + 4 (Len field) + FieldsLen + Padding
                    let headerEnd = 16 + fieldsLen;
                    // Align to 8 bytes (Body start)
                    while (headerEnd % 8 !== 0)
                        headerEnd++;
                    // The Body contains the Return Value (UINT32)
                    if (data.length >= headerEnd + 4) {
                        const notificationId = data.readUInt32LE(headerEnd);
                        resolve(notificationId);
                        client.end();
                    }
                }
                else if (msgType === 3) {
                    // Type 3 = Error
                    reject("D-Bus Error Returned");
                    client.end();
                }
            }
        });
        client.on('error', (err) => reject(err));
    }
    // --- Helpers (Same as before) ---
    static getSocketPath() {
        const addr = process.env.DBUS_SESSION_BUS_ADDRESS;
        if (!addr)
            return null;
        const match = addr.match(/path=([^,]+)/);
        return match ? match[1] : null;
    }
    static align(buffer, alignment) {
        const padding = (alignment - (buffer.length % alignment)) % alignment;
        if (padding === 0)
            return buffer;
        return Buffer.concat([buffer, Buffer.alloc(padding)]);
    }
    static appendString(buffer, str) {
        buffer = this.align(buffer, 4);
        const strBuf = Buffer.from(str, 'utf8');
        const lenBuf = Buffer.alloc(4);
        lenBuf.writeUInt32LE(strBuf.length);
        return Buffer.concat([buffer, lenBuf, strBuf, Buffer.from([0])]);
    }
    static appendUInt32(buffer, val) {
        buffer = this.align(buffer, 4);
        const buf = Buffer.alloc(4);
        buf.writeUInt32LE(val);
        return Buffer.concat([buffer, buf]);
    }
    static appendHeaderField(buffer, type, val) {
        buffer = this.align(buffer, 8);
        buffer = Buffer.concat([buffer, Buffer.from([type])]);
        buffer = Buffer.concat([buffer, Buffer.from([1]), Buffer.from("s"), Buffer.from([0])]);
        buffer = this.appendString(buffer, val);
        return buffer;
    }
}
exports.Notification = Notification;
Notification.serialId = 1;
//# sourceMappingURL=Notification.js.map