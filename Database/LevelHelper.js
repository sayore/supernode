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
    static increase(db, key, amount = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let val = yield LevelHelper.getCheckd(db, key, 0);
            return yield db.put(key, val + amount);
        });
    }
    static decrease(db, key, amount = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let val = yield LevelHelper.getCheckd(db, key, 0);
            return yield db.put(key, val - amount);
        });
    }
    static getCheckd(db, key, defaultval = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield db.exists(key))) {
                yield db.put(key, defaultval);
            }
            return yield db.get(key);
        });
    }
}
exports.LevelHelper = LevelHelper;
//# sourceMappingURL=LevelHelper.js.map