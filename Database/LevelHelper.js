"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelHelper = void 0;
class LevelHelper {
    static increase(db_1, key_1) {
        return __awaiter(this, arguments, void 0, function* (db, key, amount = 1) {
            let val = yield LevelHelper.getCheckd(db, key, 0);
            return yield db.put(key, val + amount);
        });
    }
    static decrease(db_1, key_1) {
        return __awaiter(this, arguments, void 0, function* (db, key, amount = 1) {
            let val = yield LevelHelper.getCheckd(db, key, 0);
            return yield db.put(key, val - amount);
        });
    }
    static getCheckd(db_1, key_1) {
        return __awaiter(this, arguments, void 0, function* (db, key, defaultval = undefined) {
            if (!(yield db.exists(key))) {
                yield db.put(key, defaultval);
            }
            return yield db.get(key);
        });
    }
}
exports.LevelHelper = LevelHelper;
//# sourceMappingURL=LevelHelper.js.map