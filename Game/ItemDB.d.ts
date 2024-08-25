import { Item } from './Item';
import { ItemStack } from './ItemStack';
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
