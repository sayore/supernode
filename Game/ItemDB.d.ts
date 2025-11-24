import { Item } from './Item.js';
import { ItemStack } from './ItemStack.js';
export declare class ItemDB {
    items: Item[];
    constructor(items: Item[]);
    getById(id: number): Item | undefined;
    getByCanonicalId(cid: string): Item | undefined;
    getByName(name: string): Item | undefined;
    createStackById(id: number, amount: number): ItemStack | undefined;
    createStackByCanonicalId(cid: string, amount: number): ItemStack | undefined;
    createStackByName(name: string, amount: number): ItemStack | undefined;
}
