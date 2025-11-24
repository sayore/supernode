import { Activateable } from "./Activateable.js";
import { ItemStack } from './ItemStack.js';
export declare class Item extends Activateable {
    Extra: any;
    Id: number;
    CanonicalId: string;
    Name?: string;
    Description?: string;
    BaseValue?: number;
    Quality?: number;
    Color?: ("White" | "Black" | "Red" | "Yellow" | "Green" | "Blue" | "None");
    constructor(props: {
        Id: number;
        CanonicalId: string;
        Name?: string;
        Description?: string;
        BaseValue?: number;
        Quality?: number;
        Color?: ("White" | "Black" | "Red" | "Yellow" | "Green" | "Blue" | "None");
        Extra?: any;
    });
    toItemStack(amount: number): ItemStack;
}
