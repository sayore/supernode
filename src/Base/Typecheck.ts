import { Item } from "../Game/Item.js";
import { IDrawable } from "./IDrawable.js";

export class TypeCheck {
    static isDrawable(obj:any) : obj is IDrawable {
        return !!(obj && (obj as IDrawable).Position !== undefined);
    }
    static isItem(obj:any) : obj is Item {
        return !!(obj && (obj as Item).Id !== undefined);
    }
}