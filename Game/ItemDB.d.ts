import { Item } from './Item';
import { ItemStack } from './ItemStack';
export declare class ItemDB {
    items: Item[];
    constructor(items: Item[]);
    getById(id: number): Item;
    getByCanonicalId(cid: string): Item;
    getByName(name: string): Item;
    createStackById(id: number, amount: number): ItemStack;
    createStackByCanonicalId(cid: string, amount: number): ItemStack;
    createStackByName(name: string, amount: number): ItemStack;
}
