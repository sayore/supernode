interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

class Quadtree {
  private root: QuadtreeNode;

  constructor(rectangles: Rectangle[]) {
    this.root = new QuadtreeNode(
      rectangles, 
      0, 0, 
      Number.MAX_SAFE_INTEGER, 
      Number.MAX_SAFE_INTEGER
    );
  }

  public getQuadrants(rectangle: Rectangle): QuadtreeNode[] {
    return this.root.getQuadrants(rectangle);
  }

  public getRectangles(quadrant: QuadtreeNode): Rectangle[] {
    return quadrant.getRectangles();
  }
}

class QuadtreeNode {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private rectangles: Rectangle[];
  private children: QuadtreeNode[];

  constructor(rectangles: Rectangle[], x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rectangles = rectangles;
    this.children = [];

    // If there are too many rectangles in the node, subdivide it
    if (this.rectangles.length > 4) {
      this.subdivide();
    }
  }

  public getQuadrants(rectangle: Rectangle): QuadtreeNode[] {
    let quadrants: QuadtreeNode[] = [];
    for (let child of this.children) {
      if (child.contains(rectangle)) {
        quadrants.push(child);
      }
    }
    return quadrants;
  }

  public getRectangles(): Rectangle[] {
    return this.rectangles;
  }

  private subdivide(): void {
    let x = this.x;
    let y = this.y;
    let width = this.width;
    let height = this.height;
    let halfWidth = width / 2;
    let halfHeight = height / 2;

    // Create the four child nodes
    this.children.push(
      new QuadtreeNode(this.rectangles, x, y, halfWidth, halfHeight),
      new QuadtreeNode(this.rectangles, x + halfWidth, y, halfWidth, halfHeight),
      new QuadtreeNode(this.rectangles, x, y + halfHeight, halfWidth, halfHeight),
      new QuadtreeNode(this.rectangles, x + halfWidth, y + halfHeight, halfWidth, halfHeight)
    );

    // Distribute the rectangles to the child nodes
    for (let rectangle of this.rectangles) {
      for (let child of this.children) {
        if (child.contains(rectangle)) {
          child.addRectangles(rectangle);
        }
      }
    }

    // Clear the rectangles from this node
    this.rectangles = [];
  }

  private addRectangles(rectangle: Rectangle): void {
    this.rectangles.push(rectangle);
  }

  private contains(rectangle: Rectangle): boolean {
    return (
      rectangle.x >= this.x && 
      rectangle.x + rectangle.width <= this.x + this.width &&
      rectangle.y >= this.y &&
      rectangle.y + rectangle.height <= this.y + this.height
    );
  }
}

function QuadtreeCollision(Rectangles: Rectangle[], fn: (rectangle1: Rectangle, rectangle2: Rectangle) => void) {
  // Create a Quadtree
  let quadtree = new Quadtree(Rectangles);

  // Iterate through all the rectangles
  for (let rectangle of Rectangles) {
    // Get the quadrants that the rectangle is in
    let quadrants = quadtree.getQuadrants(rectangle);

    // Iterate through all the quadrants
    for (let quadrant of quadrants) {
      // Get the rectangles in the quadrant
      let quadrant_rectangles = quadtree.getRectangles(quadrant);

      // Iterate through all the rectangles in the quadrant
      for (let quadrant_rectangle of quadrant_rectangles) {
        // Check if the rectangles are colliding
        if (AreRectanglesColliding(rectangle, quadrant_rectangle)) {
          fn(rectangle, quadrant_rectangle)
        }
      }
    }
  }
}

function AreRectanglesColliding(rectangle1: Rectangle, rectangle2: Rectangle): boolean {
  if (
    rectangle1.x < rectangle2.x + rectangle2.width &&
    rectangle1.x + rectangle1.width > rectangle2.x &&
    rectangle1.y < rectangle2.y + rectangle2.height &&
    rectangle1.height + rectangle1.y > rectangle2.y
  ) {
    // Collision
    return true;
  } else {
    // No collision
    return false;
  }
}
