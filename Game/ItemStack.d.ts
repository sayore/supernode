import { Activateable } from "./Activateable.js";
import { Item } from "./Item.js";
export declare class ItemStack extends Activateable {
    Item: Item;
    Amount: number;
    constructor();
    getName(): string | undefined;
    getDescription(): string | undefined;
    getId(): number;
    getCanonicalId(): string;
}
