import * as Discord from 'discord.js';

export class MessageHelper {
    static getSendersVisibleName(msg:Discord.Message) {
        return msg.member.displayName
    }
    
    static getRepliantsVisibleName(msg:Discord.Message) {
        return (msg.mentions.repliedUser?
                    (msg.mentions.repliedUser.username?
                        msg.mentions.repliedUser.username
                        :msg.mentions.repliedUser.tag)
                    :"noone?")
    }
}