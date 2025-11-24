interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class Quadtree {
    private root;
    constructor(rectangles: Rectangle[]);
    getQuadrants(rectangle: Rectangle): QuadtreeNode[];
    getRectangles(quadrant: QuadtreeNode): Rectangle[];
}
declare class QuadtreeNode {
    private x;
    private y;
    private width;
    private height;
    private rectangles;
    private children;
    constructor(rectangles: Rectangle[], x: number, y: number, width: number, height: number);
    getQuadrants(rectangle: Rectangle): QuadtreeNode[];
    getRectangles(): Rectangle[];
    private subdivide;
    private addRectangles;
    private contains;
}
export {};
