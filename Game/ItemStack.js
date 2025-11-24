import { Activateable } from "./Activateable.js";
export class ItemStack extends Activateable {
    Item;
    Amount;
    constructor() {
        super();
        this.Parent = this.Item;
    }
    getName() { return this.Item.Name; }
    getDescription() { return this.Item.Description; }
    getId() { return this.Item.Id; }
    getCanonicalId() { return this.Item.CanonicalId; }
}
//# sourceMappingURL=ItemStack.js.map