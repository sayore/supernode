# Discord Module

## MessageHelper

The `MessageHelper` class provides static helper methods for working with Discord messages.

### `getSendersVisibleName(msg: Discord.Message)`

Gets the visible name of the sender of a message.

**Parameters:**

-   `msg`: The Discord message.

### `getRepliantsVisibleName(msg: Discord.Message)`

Gets the visible name of the user that was replied to.

**Parameters:**

-   `msg`: The Discord message.

### `isRepliant(msg: Discord.Message, userid: string)`

Checks if a message is a reply to a specific user.

**Parameters:**

-   `msg`: The Discord message.
-   `userid`: The ID of the user to check.

### `hasRepliant(msg: Discord.Message)`

Checks if a message is a reply.

**Parameters:**

-   `msg`: The Discord message.
