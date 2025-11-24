import { Item } from "../Game/Item.js";
import { IDrawable } from "./IDrawable.js";
export declare class TypeCheck {
    static isDrawable(obj: any): obj is IDrawable;
    static isItem(obj: any): obj is Item;
}
