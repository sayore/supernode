import { Level } from "level";

export class LevelHelper<K,V> extends Level<K,V> {
    async increase(key:K,amount:any=1) {
        let val = await this.getCheckd(key,0);
        return await this.put(key,val+amount);
    }
    async decrease(key:K,amount:any=1) {
        let val = await this.getCheckd(key,0);
        ///@ts-ignore
        return await this.put(key,val-amount);
    }
    async getCheckd(key:K,defaultval:any=undefined) {
        if(!await this.exists(key)) {
            await this.put(key,defaultval);
        }
        return await this.get(key);
    }
    async exists(key:K) {
        return !!(await this.get(key));
    }
}