# Math Module

## MathExt

The `MathExt` class provides extended mathematical functions.

### `clamp(num: number, min: number, max: number): number`

Clamps a number between a minimum and maximum value.

**Parameters:**

- `num`: The number to clamp.
- `min`: The minimum value.
- `max`: The maximum value.

**Returns:**

The clamped number.

**Example:**

```typescript
import { MathExt } from 'supernode/Math';

const clampedValue = MathExt.clamp(15, 0, 10);
console.log(clampedValue); // Output: 10
```

## Vector2

The `Vector2` class represents a 2D vector with `x` and `y` components. It provides a comprehensive set of methods for vector operations.

### `constructor(x: number = 0, y: number = x)`

Creates a new `Vector2` instance.

**Parameters:**

- `x`: The x-component of the vector.
- `y`: The y-component of the vector.

**Example:**

```typescript
import { Vector2 } from 'supernode/Math';

const vec1 = new Vector2(3, 4);
const vec2 = new Vector2(5); // x = 5, y = 5
```

### Static Properties

- `Zero`: A vector with components (0, 0).
- `One`: A vector with components (1, 1).
- `Up`: A vector with components (0, -1).
- `Left`: A vector with components (-1, 0).
- `Down`: A vector with components (0, 1).
- `Right`: A vector with components (1, 0).

### Static Methods

The `Vector2` class provides a variety of static methods for performing vector operations without modifying the original vectors.

**Example:**

```typescript
import { Vector2 } from 'supernode/Math';

const vec1 = new Vector2(1, 2);
const vec2 = new Vector2(3, 4);

const sum = Vector2.add(vec1, vec2);
console.log(sum); // Output: Vector2 { x: 4, y: 6 }
```

### Instance Methods

The instance methods of the `Vector2` class modify the vector they are called on.

**Example:**

```typescript
import { Vector2 } from 'supernode/Math';

const vec = new Vector2(1, 2);
vec.add(new Vector2(3, 4));
console.log(vec); // Output: Vector2 { x: 4, y: 6 }
```
