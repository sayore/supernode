"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemDB = void 0;
class ItemDB {
    constructor(items) {
        this.items = items;
    }
    getById(id) { return this.items.find(i => i.Id == id); }
    getByCanonicalId(cid) { return this.items.find(i => i.CanonicalId == cid); }
    getByName(name) { return this.items.find(i => i.Name == name); }
    createStackById(id, amount) { return this.getById(id).toItemStack(amount); }
    createStackByCanonicalId(cid, amount) { return this.getByCanonicalId(cid).toItemStack(amount); }
    createStackByName(name, amount) { return this.getByName(name).toItemStack(amount); }
}
exports.ItemDB = ItemDB;
//# sourceMappingURL=ItemDB.js.map