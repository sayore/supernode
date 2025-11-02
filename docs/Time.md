# Time Module

## EventHelper

The `EventHelper` class provides methods for scheduling and managing events.

### `schedule(eventName: string, fn: () => void, interval: number)`

Schedules a function to be called at a specific interval.

**Parameters:**

-   `eventName`: The name of the event.
-   `fn`: The function to be called.
-   `interval`: The interval in milliseconds.

### `clear(eventName: string)`

Clears a previously scheduled event.

**Parameters:**

-   `eventName`: The name of the event.

### `execute(eventName: string, timestamp: number)`

Retroactively executes an event based on a given timestamp.

**Parameters:**

-   `eventName`: The name of the event.
-   `timestamp`: The timestamp to execute the event at.

### `load()`

Loads the last execution times from a file.

### `save()`

Saves the last execution times to a file.
