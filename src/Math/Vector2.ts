import { MathExt } from "./MathExt";

export class Vector2 {
    negate(): Vector2 {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    constructor(
        public x: number = 0,
        public y: number = x) {
    }

    static from(props: {
        x?: number,
        y?: number
    }){
        if(!props.x) props.x=0;
        if(!props.y) props.y=props.x;
        Object.assign(this,props);
    }

    static equals(vec1:Vector2,vec2:Vector2) {
        return vec1.y==vec2.y && vec1.x==vec2.x;
    }
    equals(vec:Vector2) {
        return  Vector2.equals(this,vec);
    }

    private static _Zero: Vector2 = new Vector2(0, 0);
    static get Zero(): Vector2 { return this._Zero; }
    private static _One: Vector2 = new Vector2(1, 1);
    static get One(): Vector2 { return this._One; }
    private static _Up: Vector2 = new Vector2(0, -1);
    static get Up(): Vector2 { return this._Up; }
    private static _Left: Vector2 = new Vector2(-1, 0);
    static get Left(): Vector2 { return this._Left; }
    private static _Down: Vector2 = new Vector2(0, 1);
    static get Down(): Vector2 { return this._Down; }
    private static _Right: Vector2 = new Vector2(1, 0);
    static get Right(): Vector2 { return this._Right; }


    static add(a: Vector2, b: Vector2): Vector2 { return new Vector2(a.x + b.x, a.y + b.y); }
    static sub(a: Vector2, b: Vector2): Vector2 { return new Vector2(a.x - b.x, a.y - b.y); }
    static mul(a: Vector2, b: Vector2): Vector2 { return new Vector2(a.x * b.x, a.y * b.y); }
    static div(a: Vector2, b: Vector2): Vector2 { return new Vector2(a.x / b.x, a.y / b.y); }
    static mod(a: Vector2, b: Vector2): Vector2 { return new Vector2(a.x % b.x, a.y % b.y); }
    static addNumber(a: Vector2, b: number): Vector2 { return new Vector2(a.x + b, a.y + b); }
    static subNumber(a: Vector2, b: number): Vector2 { return new Vector2(a.x - b, a.y - b); }
    static mulNumber(a: Vector2, b: number): Vector2 { return new Vector2(a.x * b, a.y * b); }
    static divNumber(a: Vector2, b: number): Vector2 { return new Vector2(a.x / b, a.y / b); }
    static modNumber(a: Vector2, b: number): Vector2 { return new Vector2(a.x % b, a.y % b); }
    static atan2(a: Vector2): number { return Math.atan2(a.y, a.x); }
    /**
     * Returns radian Direction from a to b.
     * @param a 
     * @param b 
     * @returns 
     */
    static direction(a: Vector2, b: Vector2): number { return Math.atan2(b.y - a.y, b.x - a.x); }


    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a Vector to add to this one.
     * @returns this
     */
    add(a: Vector2): Vector2 { this.x = this.x + a.x; this.y = this.y + a.y; return this; }
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a number to add to this one.
     * @returns this
     */
    addNumber(a: number): Vector2 { this.x = this.x + a; this.y = this.y + a; return this; }
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a Vector to mul to this one.
     * @returns this
     */
    mul(a: Vector2): Vector2 { this.x = this.x * a.x; this.y = this.y * a.y; return this; }
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a number to mul to this one.
     * @returns this
     */
    mulNumber(a: number): Vector2 { this.x = this.x * a; this.y = this.y * a; return this; }
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a Vector to sub from this one.
     * @returns this
     */
    sub(a: Vector2): Vector2 { this.x = this.x - a.x; this.y = this.y - a.y; return this; }
    /**
     * Even though these functions have callback, the original WILL be modified.
     * Use Vector's static functions to not modify original Values, or rather use a clone for calculation.
     * @param a number to sub from this one.
     * @returns this
     */
    subNumber(a: number): Vector2 { this.x = this.x - a; this.y = this.y - a; return this; }
    div(a: Vector2): Vector2 { this.x = this.x / a.x; this.y = this.y / a.y; return this; }
    divNumber(a: number): Vector2 { this.x = this.x / a; this.y = this.y / a; return this; }
    mod(a: Vector2): Vector2 { this.x = this.x % a.x; this.y = this.y % a.y; return this; }
    modNumber(a: number): Vector2 { this.x = this.x % a; this.y = this.y % a; return this; }

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
    };

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    /**
     * Returns the radian direction from this to target Vector..
     * @param target Vector to look at.
     * @returns 
     */
    directionTo(target: Vector2) {
        return Math.atan2(target.y - this.y, target.x - this.x);
    };
    /**
     * Returns the radian direction from this to target Vector..
     * @param target Vector to look at.
     * @returns 
     */
    directionToDeg(target: Vector2) {
        return (Math.atan2(target.y - this.y, target.x - this.x) / (Math.PI * 2)) * 360;
    };

    static eigthOfPiRadian: Vector2 = new Vector2(Math.sin(Math.PI / 8), Math.cos(Math.PI / 8))

    /**
     * Vector will be rotated 45 degree to the right.
     * @param a the Vector
     */
    static rotateByEightOfPi(a: Vector2): Vector2 {
        return a.mul(this.eigthOfPiRadian);
    }

    /**
     * Faster Direction calulcation for UpLeft, UpRight, DownUp and DownRight approximation. (rotate by45deg, to instead get 4D L,R,U,D)
     */
    directionTo4D() {
        return new Vector2((this.x == 0 ? 0 : (this.x < 0 ? 1 : -1)), (this.y == 0 ? 0 : (this.y < 0 ? 1 : -1)));
    }

    scale(f: number) {
        this.x *= f;
        this.y *= f;

        return this;
    };

    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns 
     */
    distance(target: Vector2) {
        var a = this.x - target.x;
        var b = this.y - target.y;
        return Math.sqrt(a * a + b * b);
    };
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns 
     */
    round(): Vector2 {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    };

    clamp(clamtorMin: Vector2, clamptorMax: Vector2) {
        this.x = MathExt.clamp(this.x, clamtorMin.x, clamptorMax.x);
        this.y = MathExt.clamp(this.y, clamtorMin.y, clamptorMax.y);
        return this;
    }
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns 
     */
    floor(): Vector2 {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    };
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns 
     */
    ceil(): Vector2 {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    };
    /**
     * Calculates the distance(1d) to the other Vector.
     * @param target Vector to look at.
     * @returns 
     */
    distanceSqrt(target: Vector2) {
        var a = this.x - target.x;
        var b = this.y - target.y;
        return a * a + b * b;
    };
    /**
     * For a given vector it returns a copied version.
     * @param {Vector2} vector Vector to clone.
     * @returns {Vector2} 
    
     */
    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    /**
     * Serializes a Vector(which needs to be Int!!), into a 2 character wide String. 
     * Maximum size of an serialized Vector in this format is 65535.
     * Everything larger will result in undefined behaviour.
     * @returns 
     */
    serializeInto2char(): string {
        return String.fromCharCode(this.x) + String.fromCharCode(this.y);
    }

    deserializeFrom2char(data: string) {
        this.x = data.charCodeAt(0);
        this.y = data.charCodeAt(1);
    }

    static deserializeFrom2char(data: string): Vector2 {
        let retVec = new Vector2(0, 0);
        retVec.deserializeFrom2char(data);
        return retVec;
    }

    asString() {
        return this.x.toFixed(2) + ", " + this.y.toFixed(2);
    }

}