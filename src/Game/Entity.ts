import { ITypeable } from "../Base/ITypeable.js";

export class Entity implements ITypeable {
    Type: string="CommonEntity";
    Game:any;
    
    initialize() {}
    preUpdate(progress:number) {}
    update(progress:number) {}
    postUpdate(progress:number) {}
    unload() {}
}