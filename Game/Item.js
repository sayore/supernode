"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const Activateable_1 = require("./Activateable");
const ItemStack_1 = require("./ItemStack");
class Item extends Activateable_1.Activateable {
    constructor(props) {
        super();
        this.Extra = {};
        Object.assign(this, props);
    }
    toItemStack(amount) {
        var is = new ItemStack_1.ItemStack();
        is.Amount = amount;
        is.Item = this;
        is.Parent = this;
        return is;
    }
}
exports.Item = Item;
//# sourceMappingURL=Item.js.map