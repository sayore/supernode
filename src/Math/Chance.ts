import { Chanceable } from "./Chanceable";

export class Chance {
    static random(chanceables: Chanceable<any>[]) {
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
