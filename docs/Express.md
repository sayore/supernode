# Express Module

## ExpressApplicationHandler

The `ExpressApplicationHandler` is a singleton class that manages Express applications. It extends the `ExpressApplication` class and provides a central point for registering and running Express sub-applications.

### `registerSubApp(appl: ExpressApplication)`

Registers an Express application as middleware.

**Parameters:**

-   `appl`: The Express application to register.

### `async run()`

Starts the Express server on port 80.

## ExpressExt

The `ExpressExt` class is an empty class.

## Middleware

The `Middleware` class provides static methods for creating Express middleware.

### `vhost(hostname: string, server: any)`

Creates a vhost middleware.

**Parameters:**

-   `hostname`: The hostname for the vhost.
-   `server`: The server to handle the vhost.

### `session()`

This method is not yet implemented and will throw an error.
