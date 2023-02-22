"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringExt = void 0;
class StringExt extends String {
    // Replace all occurrences of a substring in a string
    static replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
}
exports.StringExt = StringExt;
//# sourceMappingURL=StringExt.js.map