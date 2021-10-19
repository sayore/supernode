import * as Discord from 'discord.js';

export class MessageHelper {
    static getSendersVisibleName(msg:Discord.Message) {
        return msg.member.displayName
    }
    
    static getRepliantsVisibleName(msg:Discord.Message) {
        if(this.hasRepliant(msg))
        return (msg.mentions?.repliedUser?
                    (msg.mentions.repliedUser.username?
                        msg.mentions.repliedUser.username
                        :msg.mentions.repliedUser.tag)
                    :"noone?")
        else return "noone?";
    }

    static isRepliant(msg:Discord.Message, userid:string) {
        
        if(this.hasRepliant(msg))
        {
            console.log(console.log(msg.mentions.repliedUser.id))
            console.log(userid)
            return msg.mentions.repliedUser.id == userid
        }
        else
        return false;
    }

    static hasRepliant(msg:Discord.Message) {
        return msg.mentions != undefined;
    }
}