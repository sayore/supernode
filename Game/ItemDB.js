"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemDB = void 0;
const lodash_1 = __importDefault(require("lodash"));
class ItemDB {
    constructor(items) {
        this.items = items;
    }
    getById(id) { return this.items.find(i => i.Id == id); }
    getByCanonicalId(cid) { return this.items.find(i => i.CanonicalId == cid); }
    getByName(name) { return this.items.find(i => i.Name == name); }
    createStackById(id, amount) { var _a; return lodash_1.default.clone((_a = this.getById(id)) === null || _a === void 0 ? void 0 : _a.toItemStack(amount)); }
    createStackByCanonicalId(cid, amount) { var _a; return (_a = this.getByCanonicalId(cid)) === null || _a === void 0 ? void 0 : _a.toItemStack(amount); }
    createStackByName(name, amount) { var _a; return (_a = this.getByName(name)) === null || _a === void 0 ? void 0 : _a.toItemStack(amount); }
}
exports.ItemDB = ItemDB;
//# sourceMappingURL=ItemDB.js.map