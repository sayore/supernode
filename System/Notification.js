import * as net from 'net';
export class Notification {
    static serialId = 1;
    static async send(title, body, replacesId = 0, timeoutDuration = 5000) {
        const socketPath = this.getSocketPath();
        if (!socketPath)
            throw new Error("DBUS_SESSION_BUS_ADDRESS not found.");
        return new Promise((resolve, reject) => {
            // console.log(`[🔌 Connecting] Path: ${socketPath}`);
            const client = net.createConnection(socketPath);
            let buffer = Buffer.alloc(0);
            let state = 'AUTH';
            let resolved = false;
            client.on('connect', () => {
                // console.log('[✅ Connected] Sending Auth...');
                client.write(Buffer.from([0]));
                const uid = process.getuid ? process.getuid().toString() : "1000";
                const hexUid = Buffer.from(uid).toString('hex');
                client.write(`AUTH EXTERNAL ${hexUid}\r\n`);
            });
            client.on('data', (chunk) => {
                // console.log(`[📥 RX] ${chunk.length} bytes`);
                buffer = Buffer.concat([buffer, chunk]);
                // --- STEP 1: AUTH ---
                if (state === 'AUTH') {
                    const lineEnd = buffer.indexOf('\n');
                    if (lineEnd !== -1) {
                        const line = buffer.slice(0, lineEnd).toString('ascii').trim();
                        if (line.startsWith("OK")) {
                            // console.log(`[🔐 Handshake] OK. Saying Hello...`);
                            buffer = buffer.slice(lineEnd + 1);
                            client.write("BEGIN\r\n");
                            client.write(this.createHelloPacket());
                            state = 'HELLO';
                        }
                        else {
                            reject(new Error(`Auth failed: ${line}`));
                            client.end();
                        }
                    }
                }
                // --- STEP 2 & 3: MESSAGE LOOP ---
                if (state !== 'AUTH') {
                    while (buffer.length >= 12) {
                        const msgType = buffer.readUInt8(1);
                        const bodyLen = buffer.readUInt32LE(4);
                        const fieldsLen = buffer.readUInt32LE(12);
                        let headerSize = 12 + 4 + fieldsLen;
                        while (headerSize % 8 !== 0)
                            headerSize++;
                        const totalMsgSize = headerSize + bodyLen;
                        if (buffer.length < totalMsgSize)
                            return;
                        const msgBuffer = buffer.slice(0, totalMsgSize);
                        buffer = buffer.slice(totalMsgSize);
                        if (msgType === 3) {
                            let errText = "Unknown";
                            try {
                                const nameLen = msgBuffer.readUInt32LE(headerSize);
                                errText = msgBuffer.slice(headerSize + 4, headerSize + 4 + nameLen).toString();
                            }
                            catch (e) { }
                            console.error(`[🔥 DBus Error] ${errText}`);
                            reject(new Error(`D-Bus Error: ${errText}`));
                            client.end();
                            return;
                        }
                        if (state === 'HELLO') {
                            if (msgType === 2) {
                                // console.log('[✅ Registered] Hello confirmed.');
                                // Small delay to ensure connection stability before Notify
                                setTimeout(() => {
                                    // console.log('[📤 Sending Notification...]');
                                    client.write(this.createNotifyPacket(title, body, replacesId, timeoutDuration));
                                    state = 'NOTIFY';
                                }, 10);
                            }
                        }
                        else if (state === 'NOTIFY') {
                            if (msgType === 2) {
                                if (msgBuffer.length >= headerSize + 4) {
                                    const id = msgBuffer.readUInt32LE(headerSize);
                                    // console.log(`[🎉 Success] Notification ID: ${id}`);
                                    resolved = true;
                                    resolve(id);
                                    client.end();
                                    return;
                                }
                            }
                        }
                    }
                }
            });
            client.on('close', () => {
                if (!resolved) {
                    reject(new Error("Socket closed without returning a response"));
                }
            });
            client.on('error', (err) => reject(err));
        });
    }
    // --- PACKET CONSTRUCTORS ---
    static createHelloPacket() {
        let fields = Buffer.alloc(0);
        fields = this.appendHeaderField(fields, 1, "o", "/org/freedesktop/DBus");
        fields = this.appendHeaderField(fields, 6, "s", "org.freedesktop.DBus");
        fields = this.appendHeaderField(fields, 2, "s", "org.freedesktop.DBus");
        fields = this.appendHeaderField(fields, 3, "s", "Hello");
        return this.wrapPacket(fields, Buffer.alloc(0));
    }
    static createNotifyPacket(title, body, replacesId, timeout) {
        // --- BODY ---
        let payload = Buffer.alloc(0);
        payload = this.appendString(payload, "SuperNode"); // App Name
        payload = this.appendUInt32(payload, replacesId); // Replaces ID
        payload = this.appendString(payload, ""); // Icon
        payload = this.appendString(payload, title); // Summary
        payload = this.appendString(payload, body); // Body
        // Actions (as) -> Empty
        payload = this.align(payload, 4);
        payload = Buffer.concat([payload, Buffer.from([0, 0, 0, 0])]);
        // Hints (a{sv}) -> Empty
        payload = this.align(payload, 4);
        payload = Buffer.concat([payload, Buffer.from([0, 0, 0, 0])]);
        // Timeout (i)
        payload = this.align(payload, 4);
        const t = Buffer.alloc(4);
        t.writeInt32LE(timeout);
        payload = Buffer.concat([payload, t]);
        // --- HEADER ---
        let fields = Buffer.alloc(0);
        fields = this.appendHeaderField(fields, 1, "o", "/org/freedesktop/Notifications");
        fields = this.appendHeaderField(fields, 2, "s", "org.freedesktop.Notifications");
        fields = this.appendHeaderField(fields, 3, "s", "Notify");
        fields = this.appendHeaderField(fields, 6, "s", "org.freedesktop.Notifications");
        // NOTE: REMOVED Field 8 (Signature). 
        // Allowing the server to infer types avoids strict string validation errors.
        return this.wrapPacket(fields, payload);
    }
    static wrapPacket(fields, payload) {
        const fixedHeader = Buffer.alloc(12);
        fixedHeader.write("l");
        fixedHeader.writeUInt8(1, 1);
        fixedHeader.writeUInt8(0, 2);
        fixedHeader.writeUInt8(1, 3);
        fixedHeader.writeUInt32LE(payload.length, 4);
        fixedHeader.writeUInt32LE(this.serialId++, 8);
        const headerLenBuf = Buffer.alloc(4);
        headerLenBuf.writeUInt32LE(fields.length);
        let headerPart = Buffer.concat([fixedHeader, headerLenBuf, fields]);
        const padding = (8 - (headerPart.length % 8)) % 8;
        if (padding > 0)
            headerPart = Buffer.concat([headerPart, Buffer.alloc(padding)]);
        return Buffer.concat([headerPart, payload]);
    }
    // --- HELPERS ---
    static align(b, a) {
        const padding = (a - (b.length % a)) % a;
        return padding === 0 ? b : Buffer.concat([b, Buffer.alloc(padding)]);
    }
    static appendString(b, s) {
        b = this.align(b, 4);
        const sBuf = Buffer.from(s, 'utf8');
        const l = Buffer.alloc(4);
        l.writeUInt32LE(sBuf.length);
        return Buffer.concat([b, l, sBuf, Buffer.from([0])]);
    }
    static appendUInt32(b, v) {
        b = this.align(b, 4);
        const buf = Buffer.alloc(4);
        buf.writeUInt32LE(v);
        return Buffer.concat([b, buf]);
    }
    static appendHeaderField(b, code, type, val) {
        b = this.align(b, 8);
        b = Buffer.concat([b, Buffer.from([code, 1]), Buffer.from(type), Buffer.from([0])]);
        if (type === 'g') {
            const sBuf = Buffer.from(val, 'utf8');
            b = Buffer.concat([b, Buffer.from([sBuf.length]), sBuf, Buffer.from([0])]);
        }
        else {
            b = this.appendString(b, val);
        }
        return b;
    }
    static getSocketPath() {
        const addr = process.env.DBUS_SESSION_BUS_ADDRESS;
        if (!addr)
            return null;
        const match = addr.match(/path=([^,]+)/);
        return match ? match[1] : null;
    }
}
//# sourceMappingURL=Notification.js.map