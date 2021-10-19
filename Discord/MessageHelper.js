"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHelper = void 0;
class MessageHelper {
    static getSendersVisibleName(msg) {
        return msg.member.displayName;
    }
    static getRepliantsVisibleName(msg) {
        var _a;
        if (this.hasRepliant(msg))
            return (((_a = msg.mentions) === null || _a === void 0 ? void 0 : _a.repliedUser) ?
                (msg.mentions.repliedUser.username ?
                    msg.mentions.repliedUser.username
                    : msg.mentions.repliedUser.tag)
                : "noone?");
        else
            return "noone?";
    }
    static isRepliant(msg, userid) {
        if (this.hasRepliant(msg)) {
            console.log(console.log(msg.mentions.repliedUser.id));
            console.log(userid);
            return msg.mentions.repliedUser.id == userid;
        }
        else
            return false;
    }
    static hasRepliant(msg) {
        return msg.mentions != undefined;
    }
}
exports.MessageHelper = MessageHelper;
//# sourceMappingURL=MessageHelper.js.map