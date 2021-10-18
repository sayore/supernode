export interface ICommand {
    prefix?:boolean
    userlimitedids?:string[]
    grouplimitedids?:string[]
    messagecontent?:string
    triggerwords?:string[]
    triggerfunc?:Function
    typeofcmd?:TypeOfCmd
    cmd(msg: any) : void
}


export enum TypeOfCmd {
    Action,
    Moderation,
    Other,
    Information
}