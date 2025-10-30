export declare class GameMap {
    width: number;
    height: number;
    tiles: number[][];
    constructor(width: number, height: number);
    setTile(x: number, y: number, value: number): void;
    getTile(x: number, y: number): number | undefined;
    isTileBlocked(x: number, y: number): boolean;
    isPointWithinBounds(x: number, y: number): boolean;
    findPath(startX: number, startY: number, endX: number, endY: number): [number, number][];
}
