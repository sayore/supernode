# Game Module

## Activateable

The `Activateable` class is a base class for objects that can be used and dropped. It provides a `Parent` property and `onUse` and `onDrop` methods that can be overridden by subclasses.

### Properties

-   `Parent`: An `Activateable` object that is the parent of this object.

### Methods

-   `onUse()`: This method is called when the object is used.
-   `onDrop()`: This method is called when the object is dropped.

## Entity

The `Entity` class is a base class for game entities. It implements the `ITypeable` interface and provides a basic structure for game entities.

### Properties

-   `Type`: A string that defaults to "CommonEntity".
-   `Game`: A property that can hold any value.

### Methods

-   `initialize()`: Initializes the entity.
-   `preUpdate(progress: number)`: Called before the entity is updated.
-   `update(progress: number)`: Updates the entity.
-   `postUpdate(progress: number)`: Called after the entity is updated.
-   `unload()`: Unloads the entity.
