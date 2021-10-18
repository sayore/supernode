import { Item } from "../Game/Item";
import { IDrawable } from "./IDrawable";

export class TypeCheck {
    static isDrawable(obj:any) : obj is IDrawable {
        return (obj as IDrawable).Position !== undefined;
    }
    static isItem(obj:any) : obj is Item {
        return (obj as Item).Id !== undefined;
    }
}