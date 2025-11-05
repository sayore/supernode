# String Module

## StringExt

The `StringExt` class provides extended string functions.

### `replaceAll(str: string, find: string, replace: string): string`

Replaces all occurrences of a substring in a string.

**Parameters:**

- `str`: The original string.
- `find`: The substring to replace.
- `replace`: The replacement string.

**Returns:**

The new string with all occurrences replaced.

**Example:**

```typescript
import { StringExt } from 'supernode/String';

const newString = StringExt.replaceAll('hello world, hello', 'hello', 'hi');
console.log(newString); // Output: hi world, hi
```
