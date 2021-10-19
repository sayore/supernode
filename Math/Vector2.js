"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector2 = void 0;
const MathExt_1 = require("./MathExt");
class Vector2 {
    constructor(x = 0, y) {
        this.x = x;
        this.y = y;
        if (x != 0 && y == undefined)
            this.y = x;
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    static get Zero() { return this._Zero; }
    static get One() { return this._One; }
    static get Up() { return this._Up; }
    static get Left() { return this._Left; }
    static get Down() { return this._Down; }
    static get Right() { return this._Right; }
    static add(a, b) { return new Vector2(a.x + b.x, a.y + b.y); }
    static sub(a, b) { return new Vector2(a.x - b.x, a.y - b.y); }
    static mul(a, b) { return new Vector2(a.x * b.x, a.y * b.y); }
    static div(a, b) { return new Vector2(a.x / b.x, a.y / b.y); }
    static mod(a, b) { return new Vector2(a.x % b.x, a.y % b.y); }
    static addNumber(a, b) { return new Vector2(a.x + b, a.y + b); }
    static subNumber(a, b) { return new Vector2(a.x - b, a.y - b); }
    static mulNumber(a, b) { return new Vector2(a.x * b, a.y * b); }
    static divNumber(a, b) { return new Vector2(a.x / b, a.y / b); }
    static modNumber(a, b) { return new Vector2(a.x % b, a.y % b); }
    static atan2(a) { return Math.atan2(a.y, a.x); }
    /**
     * Returns radian Direction from a to b.
     * @param a
     * @param b
     * @returns
     */
    static direction(a, b) { return Math.atan2(b.y - a.y, b.x - a.x); }
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a Vector to add to this one.
     * @returns this
     */
    add(a) { this.x = this.x + a.x; this.y = this.y + a.y; return this; }
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a number to add to this one.
     * @returns this
     */
    addNumber(a) { this.x = this.x + a; this.y = this.y + a; return this; }
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a Vector to mul to this one.
     * @returns this
     */
    mul(a) { this.x = this.x * a.x; this.y = this.y * a.y; return this; }
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a number to mul to this one.
     * @returns this
     */
    mulNumber(a) { this.x = this.x * a; this.y = this.y * a; return this; }
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a Vector to sub from this one.
     * @returns this
     */
    sub(a) { this.x = this.x - a.x; this.y = this.y - a.y; return this; }
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a number to sub from this one.
     * @returns this
     */
    subNumber(a) { this.x = this.x - a; this.y = this.y - a; return this; }
    div(a) { this.x = this.x / a.x; this.y = this.y / a.y; return this; }
    divNumber(a) { this.x = this.x / a; this.y = this.y / a; return this; }
    mod(a) { this.x = this.x % a.x; this.y = this.y % a.y; return this; }
    modNumber(a) { this.x = this.x % a; this.y = this.y % a; return this; }
    /**
     * Normalizes this vector.
     * @returns this
     */
    normalize() {
        var len = this.length();
        if (len > 0) {
            this.scale(1 / len);
        }
        return this;
    }
    ;
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    ;
    /**
     * Returns the radian direction from this to target Vector..
     * @param target Vector to look at.
     * @returns
     */
    directionTo(target) {
        return Math.atan2(target.y - this.y, target.x - this.x);
    }
    ;
    /**
     * Returns the radian direction from this to target Vector..
     * @param target Vector to look at.
     * @returns
     */
    directionToDeg(target) {
        return (Math.atan2(target.y - this.y, target.x - this.x) / (Math.PI * 2)) * 360;
    }
    ;
    /**
     * Vector will be rotated 45 degree to the right.
     * @param a the Vector
     */
    static rotateByEightOfPi(a) {
        return a.mul(this.eigthOfPiRadian);
    }
    /**
     * Faster Direction calulcation for UpLeft, UpRight, DownUp and DownRight approximation. (rotate by45deg, to instead get 4D L,R,U,D)
     */
    directionTo4D() {
        return new Vector2((this.x == 0 ? 0 : (this.x < 0 ? 1 : -1)), (this.y == 0 ? 0 : (this.y < 0 ? 1 : -1)));
    }
    scale(f) {
        this.x *= f;
        this.y *= f;
        return this;
    }
    ;
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns
     */
    distance(target) {
        var a = this.x - target.x;
        var b = this.y - target.y;
        return Math.sqrt(a * a + b * b);
    }
    ;
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    ;
    clamp(clamtorMin, clamptorMax) {
        this.x = MathExt_1.MathExt.clamp(this.x, clamtorMin.x, clamptorMax.x);
        this.y = MathExt_1.MathExt.clamp(this.y, clamtorMin.y, clamptorMax.y);
        return this;
    }
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    ;
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    ;
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns
     */
    distanceSqrt(target) {
        var a = this.x - target.x;
        var b = this.y - target.y;
        return a * a + b * b;
    }
    ;
    /**
     * For a given vector it returns a copied version.
     * @param {Vector2} vector Vector to clone.
     * @returns {Vector2}
    
     */
    clone() {
        return new Vector2(this.x, this.y);
    }
    /**
     * Serializes a Vector(which needs to be Int!!), into a 2 character wide String.
     * Maximum size of an serialized Vector in this format is 65535.
     * Everything larger will result in undefined behaviour.
     * @returns
     */
    serializeInto2char() {
        return String.fromCharCode(this.x) + String.fromCharCode(this.y);
    }
    deserializeFrom2char(data) {
        this.x = data.charCodeAt(0);
        this.y = data.charCodeAt(1);
    }
    static deserializeFrom2char(data) {
        let retVec = new Vector2(0, 0);
        retVec.deserializeFrom2char(data);
        return retVec;
    }
    asString() {
        return this.x.toFixed(2) + ", " + this.y.toFixed(2);
    }
}
exports.Vector2 = Vector2;
Vector2._Zero = new Vector2(0, 0);
Vector2._One = new Vector2(1, 1);
Vector2._Up = new Vector2(0, -1);
Vector2._Left = new Vector2(-1, 0);
Vector2._Down = new Vector2(0, 1);
Vector2._Right = new Vector2(1, 0);
Vector2.eigthOfPiRadian = new Vector2(Math.sin(Math.PI / 8), Math.cos(Math.PI / 8));
//# sourceMappingURL=Vector2.js.map