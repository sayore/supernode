import { Level } from "level";
export class LevelHelper extends Level {
    async increase(key, amount = 1) {
        let val = await this.getCheckd(key, 0);
        return await this.put(key, val + amount);
    }
    async decrease(key, amount = 1) {
        let val = await this.getCheckd(key, 0);
        ///@ts-ignore
        return await this.put(key, val - amount);
    }
    async getCheckd(key, defaultval = undefined) {
        if (!await this.exists(key)) {
            await this.put(key, defaultval);
        }
        return await this.get(key);
    }
    async exists(key) {
        return !!(await this.get(key));
    }
}
//# sourceMappingURL=LevelHelper.js.map