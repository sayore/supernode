# Database Module

## FlatAdapter

The `FlatAdapter` class is an empty class with `set` and `get` methods that are not implemented.

## TableAdapter

The `TableAdapter` class is an empty class.

## LevelHelper

The `LevelHelper` class provides static helper methods for interacting with a LevelDB database.

### `increase(db: Level, key: string, amount: number = 1)`

Increases the value of a key by a given amount. If the key does not exist, it is created with the value of `amount`.

**Parameters:**

-   `db`: The LevelDB instance.
-   `key`: The key to increase.
-   `amount`: The amount to increase by.

### `decrease(db: Level, key: string, amount: number = 1)`

Decreases the value of a key by a given amount. If the key does not exist, it is created with the value of `-amount`.

**Parameters:**

-   `db`: The LevelDB instance.
-   `key`: The key to decrease.
-   `amount`: The amount to decrease by.

### `getCheckd(db: Level, key: string, defaultval: any = undefined)`

Gets the value of a key. If the key does not exist, it is created with the `defaultval`.

**Parameters:**

-   `db`: The LevelDB instance.
-   `key`: The key to get.
-   `defaultval`: The default value to set if the key does not exist.
