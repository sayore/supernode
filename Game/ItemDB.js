import _ from 'lodash';
export class ItemDB {
    items;
    constructor(items) {
        this.items = items;
    }
    getById(id) { return this.items.find(i => i.Id == id); }
    getByCanonicalId(cid) { return this.items.find(i => i.CanonicalId == cid); }
    getByName(name) { return this.items.find(i => i.Name == name); }
    createStackById(id, amount) { return _.clone(this.getById(id)?.toItemStack(amount)); }
    createStackByCanonicalId(cid, amount) { return this.getByCanonicalId(cid)?.toItemStack(amount); }
    createStackByName(name, amount) { return this.getByName(name)?.toItemStack(amount); }
}
//# sourceMappingURL=ItemDB.js.map