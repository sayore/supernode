"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeCheck = void 0;
class TypeCheck {
    static isDrawable(obj) {
        return obj.Position !== undefined;
    }
    static isItem(obj) {
        return obj.Id !== undefined;
    }
}
exports.TypeCheck = TypeCheck;
//# sourceMappingURL=Typecheck.js.map