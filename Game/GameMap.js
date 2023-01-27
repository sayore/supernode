"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        for (let i = 0; i < height; i++) {
            this.tiles[i] = new Array(width);
        }
    }
    // Set the value of a particular tile on the map
    setTile(x, y, value) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.tiles[y][x] = value;
        }
    }
    // Get the value of a particular tile on the map
    getTile(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.tiles[y][x];
        }
    }
    // Check if a particular tile on the map is blocked
    isTileBlocked(x, y) {
        const value = this.getTile(x, y);
        return value !== undefined && value > 0;
    }
    // Check if a particular point is within the bounds of the map
    isPointWithinBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    // Find the shortest path between two points on the map using A* search
    findPath(startX, startY, endX, endY) {
        // Implement A* search here...
        throw new Error("Not implemented yet");
    }
}
//# sourceMappingURL=GameMap.js.map