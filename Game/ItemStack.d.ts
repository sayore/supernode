import { Activateable } from "./Activateable";
import { Item } from "./Item";
export declare class ItemStack extends Activateable {
    Item: Item;
    Amount: number;
    constructor();
    getName(): string;
    getDescription(): string;
    getId(): number;
    getCanonicalId(): string;
}
