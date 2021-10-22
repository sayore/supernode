import * as Discord from 'discord.js';
export declare class MessageHelper {
    static getSendersVisibleName(msg: Discord.Message): string;
    static getRepliantsVisibleName(msg: Discord.Message): string;
    static isRepliant(msg: Discord.Message, userid: string): boolean;
    static hasRepliant(msg: Discord.Message): boolean;
}
