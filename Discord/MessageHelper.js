"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHelper = void 0;
class MessageHelper {
    static getSendersVisibleName(msg) {
        return msg.member.displayName;
    }
    static getRepliantsVisibleName(msg) {
        return (msg.mentions.repliedUser ?
            (msg.mentions.repliedUser.username ?
                msg.mentions.repliedUser.username
                : msg.mentions.repliedUser.tag)
            : "noone?");
    }
}
exports.MessageHelper = MessageHelper;
//# sourceMappingURL=MessageHelper.js.map