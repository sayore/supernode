import Level from "level-ts";
export declare class LevelHelper {
    static increase(db: Level, key: string, amount?: number): Promise<any>;
    static decrease(db: Level, key: string, amount?: number): Promise<any>;
    static getCheckd(db: Level, key: string, defaultval?: any): Promise<any>;
}
