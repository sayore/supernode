import { Item } from "../Game/Item";
import { IDrawable } from "./IDrawable";
export declare class TypeCheck {
    static isDrawable(obj: any): obj is IDrawable;
    static isItem(obj: any): obj is Item;
}
