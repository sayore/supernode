export class StringExt extends String {
    // Replace all occurrences of a substring in a string
    static replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
}
//# sourceMappingURL=StringExt.js.map