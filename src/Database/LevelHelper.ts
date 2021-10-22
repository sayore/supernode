import Level from "level-ts";

export class LevelHelper {
    static async increase(db:Level,key:string,amount:number=1) {
        let val = await LevelHelper.getCheckd(db,key,0);
        return await db.put(key,val+amount);
    }
    static async decrease(db:Level,key:string,amount:number=1) {
        let val = await LevelHelper.getCheckd(db,key,0);
        return await db.put(key,val-amount);
    }
    static async getCheckd(db:Level,key:string,defaultval:any=undefined) {
        if(!await db.exists(key)) {
            await db.put(key,defaultval);
        }
        return await db.get(key);
    }
}