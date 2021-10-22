import { ITypeable } from "../Base/ITypeable";
export declare class Entity implements ITypeable {
    Type: string;
    Game: any;
    initialize(): void;
    preUpdate(progress: number): void;
    update(progress: number): void;
    postUpdate(progress: number): void;
    unload(): void;
}
