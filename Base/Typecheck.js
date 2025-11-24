export class TypeCheck {
    static isDrawable(obj) {
        return !!(obj && obj.Position !== undefined);
    }
    static isItem(obj) {
        return !!(obj && obj.Id !== undefined);
    }
}
//# sourceMappingURL=Typecheck.js.map