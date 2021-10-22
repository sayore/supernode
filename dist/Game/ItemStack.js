"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemStack = void 0;
const Activateable_1 = require("./Activateable");
class ItemStack extends Activateable_1.Activateable {
    constructor() {
        super();
        this.Parent = this.Item;
    }
    getName() { return this.Item.Name; }
    getDescription() { return this.Item.Description; }
    getId() { return this.Item.Id; }
}
exports.ItemStack = ItemStack;
//# sourceMappingURL=ItemStack.js.map