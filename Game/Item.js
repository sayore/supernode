import { Activateable } from "./Activateable.js";
import { ItemStack } from './ItemStack.js';
export class Item extends Activateable {
    Extra = {};
    Id;
    CanonicalId;
    Name;
    Description;
    BaseValue;
    Quality;
    Color;
    constructor(props) {
        super();
        Object.assign(this, props);
    }
    toItemStack(amount) {
        var is = new ItemStack();
        is.Amount = amount;
        is.Item = this;
        is.Parent = this;
        return is;
    }
}
//# sourceMappingURL=Item.js.map