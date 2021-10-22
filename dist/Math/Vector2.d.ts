export declare class Vector2 {
    x: number;
    y: number;
    negate(): Vector2;
    constructor(x: number, y: number);
    private static _Zero;
    static get Zero(): Vector2;
    private static _One;
    static get One(): Vector2;
    private static _Up;
    static get Up(): Vector2;
    private static _Left;
    static get Left(): Vector2;
    private static _Down;
    static get Down(): Vector2;
    private static _Right;
    static get Right(): Vector2;
    static add(a: Vector2, b: Vector2): Vector2;
    static sub(a: Vector2, b: Vector2): Vector2;
    static mul(a: Vector2, b: Vector2): Vector2;
    static div(a: Vector2, b: Vector2): Vector2;
    static mod(a: Vector2, b: Vector2): Vector2;
    static addNumber(a: Vector2, b: number): Vector2;
    static subNumber(a: Vector2, b: number): Vector2;
    static mulNumber(a: Vector2, b: number): Vector2;
    static divNumber(a: Vector2, b: number): Vector2;
    static modNumber(a: Vector2, b: number): Vector2;
    static atan2(a: Vector2): number;
    /**
     * Returns radian Direction from a to b.
     * @param a
     * @param b
     * @returns
     */
    static direction(a: Vector2, b: Vector2): number;
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a Vector to add to this one.
     * @returns this
     */
    add(a: Vector2): Vector2;
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a number to add to this one.
     * @returns this
     */
    addNumber(a: number): Vector2;
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a Vector to mul to this one.
     * @returns this
     */
    mul(a: Vector2): Vector2;
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a number to mul to this one.
     * @returns this
     */
    mulNumber(a: number): Vector2;
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a Vector to sub from this one.
     * @returns this
     */
    sub(a: Vector2): Vector2;
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a number to sub from this one.
     * @returns this
     */
    subNumber(a: number): Vector2;
    div(a: Vector2): Vector2;
    divNumber(a: number): Vector2;
    mod(a: Vector2): Vector2;
    modNumber(a: number): Vector2;
    /**
     * Normalizes this vector.
     * @returns this
     */
    normalize(): this;
    length(): number;
    /**
     * Returns the radian direction from this to target Vector..
     * @param target Vector to look at.
     * @returns
     */
    directionTo(target: Vector2): number;
    /**
     * Returns the radian direction from this to target Vector..
     * @param target Vector to look at.
     * @returns
     */
    directionToDeg(target: Vector2): number;
    static eigthOfPiRadian: Vector2;
    /**
     * Vector will be rotated 45 degree to the right.
     * @param a the Vector
     */
    static rotateByEightOfPi(a: Vector2): Vector2;
    /**
     * Faster Direction calulcation for UpLeft, UpRight, DownUp and DownRight approximation. (rotate by45deg, to instead get 4D L,R,U,D)
     */
    directionTo4D(): Vector2;
    scale(f: number): this;
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns
     */
    distance(target: Vector2): number;
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns
     */
    round(): Vector2;
    clamp(clamtorMin: Vector2, clamptorMax: Vector2): this;
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns
     */
    floor(): Vector2;
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns
     */
    ceil(): Vector2;
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns
     */
    distanceSqrt(target: Vector2): number;
    /**
     * For a given vector it returns a copied version.
     * @param {Vector2} vector Vector to clone.
     * @returns {Vector2}
    
     */
    clone(): Vector2;
    /**
     * Serializes a Vector(which needs to be Int!!), into a 2 character wide String.
     * Maximum size of an serialized Vector in this format is 65535.
     * Everything larger will result in undefined behaviour.
     * @returns
     */
    serializeInto2char(): string;
    deserializeFrom2char(data: string): void;
    static deserializeFrom2char(data: string): Vector2;
    asString(): string;
}
