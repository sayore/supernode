export class MessageHelper {
    static getSendersVisibleName(msg) {
        return msg?.member?.displayName;
    }
    static getRepliantsVisibleName(msg) {
        if (this.hasRepliant(msg))
            return (msg.mentions?.repliedUser ?
                (msg.mentions.repliedUser.username ?
                    msg.mentions.repliedUser.username
                    : msg.mentions.repliedUser.tag)
                : "noone?");
        else
            return "noone?";
    }
    static isRepliant(msg, userid) {
        if (this.hasRepliant(msg)) {
            //console.log(console.log(msg.mentions.repliedUser.id))
            //console.log(userid)
            if (msg?.mentions?.repliedUser?.id)
                return msg.mentions.repliedUser.id == userid;
        }
        else
            return false;
    }
    static hasRepliant(msg) {
        return msg.mentions != undefined;
    }
}
//# sourceMappingURL=MessageHelper.js.map