import { Chanceable } from "./Chanceable";

export class Chance {
        static random(chanceables: Chanceable<any>[]) {
            // Collect ALL the possible chances (each Item has a certain chance, and we accumulate it)
            var allChances = 0;
            chanceables.forEach(c => allChances += c.chance);

            // Throw a dart onto the possible chance size
            var picked = Math.floor(Math.random() * allChances);

            // Remove items until we reach'd the picked chance point in the accumulation
            var i = 0; for (;picked > 0; i++) picked -= chanceables[i].chance;

            // Return the picked chance, it's index is -1 because out loop actually added pone before
            return chanceables[i - 1];
        }
}


