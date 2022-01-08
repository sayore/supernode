import { Item } from './Item';
import { ItemStack } from './ItemStack';
import _ from 'lodash';

export class ItemDB {
    constructor(
        public items:Item[]
        ) {}
    
    getById(id:number) : Item { return this.items.find(i=>i.Id==id); }
    getByCanonicalId(cid:string) : Item { return this.items.find(i=>i.CanonicalId==cid); }
    getByName(name:string) : Item { return this.items.find(i=>i.Name==name); }

    createStackById(id:number, amount:number) : ItemStack { return _.clone(this.getById(id)?.toItemStack(amount)); }
    createStackByCanonicalId(cid:string, amount:number) : ItemStack { return this.getByCanonicalId(cid)?.toItemStack(amount); }
    createStackByName(name:string, amount:number) : ItemStack { return this.getByName(name)?.toItemStack(amount); }
}
