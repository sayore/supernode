import { Item } from './Item.js';
import { ItemStack } from './ItemStack.js';
import _ from 'lodash';

export class ItemDB {
    constructor(
        public items:Item[]
        ) {}
    
    getById(id:number) : Item | undefined { return this.items.find(i=>i.Id==id); }
    getByCanonicalId(cid:string) : Item | undefined { return this.items.find(i=>i.CanonicalId==cid); }
    getByName(name:string) : Item | undefined { return this.items.find(i=>i.Name==name); }

    createStackById(id:number, amount:number) : ItemStack | undefined { return _.clone(this.getById(id)?.toItemStack(amount)); }
    createStackByCanonicalId(cid:string, amount:number) : ItemStack | undefined { return this.getByCanonicalId(cid)?.toItemStack(amount); }
    createStackByName(name:string, amount:number) : ItemStack | undefined { return this.getByName(name)?.toItemStack(amount); }
}
