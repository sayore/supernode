import { Level } from "level";
export declare class LevelHelper<K, V> extends Level<K, V> {
    increase(key: K, amount?: any): Promise<void>;
    decrease(key: K, amount?: any): Promise<void>;
    getCheckd(key: K, defaultval?: any): Promise<V>;
    exists(key: K): Promise<boolean>;
}
