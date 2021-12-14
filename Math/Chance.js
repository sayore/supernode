"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chance = void 0;
class Chance {
    static random(chanceables) {
        var allChances = 0;
        chanceables.forEach(c => allChances += c.chance);
        var picked = Math.floor(Math.random() * allChances);
        var i = 0;
        for (; picked > 0; i++) {
            picked -= chanceables[i].chance;
            //console.log("A"+i+" "+picked)
        }
        return chanceables[i - 1];
    }
}
exports.Chance = Chance;
//# sourceMappingURL=Chance.js.map