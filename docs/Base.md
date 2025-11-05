# Base Module

## Application

The `Application` class is a base class for creating different types of applications within the Supernode framework. It implements the `IApplication` and `ITypeable` interfaces, providing a common structure for applications.

### Properties

-   `Type`: A string or `TypeOfApplication` enum value that specifies the type of the application.
-   `uid`: A unique identifier for the application.
-   `Parent`: An optional `ApplicationCollection` that this application belongs to.
-   `typeOfApplication`: An optional `TypeOfApplication` enum value.
-   `needsSafeMode`: An optional `SafetyMode` enum value.
-   `meta`: An optional object for metadata.

### Methods

-   `error?(eventdata?: any)`: Handles errors.
-   `exit?(eventdata?: any)`: Exits the application.
-   `init?(eventdata?: any)`: Initializes the application.
-   `async run(eventdata?: any)`: Runs the application.
-   `restart?()`: Restarts the application by calling `run()`.

### Enums

#### `TypeOfApplication`

-   `Webserver`: "Webserver Application"
-   `Express`: "Express Application"
-   `BackgroundProcess`: "Background Application"
-   `Database`: "Database Application"
-   `NoInteraction`: "None Application"

#### `SafetyMode`

-   `NeedsCatch`: The application requires a try-catch block.
-   `Safe`: The application is safe to run without a try-catch block.
-   `OnceNeedsCatch`: The application requires a try-catch block for the first run.
-   `Once`: The application runs once.

## ApplicationCollection

The `ApplicationCollection` class is a collection of `Application` instances. It implements the `IApplicationCollection`, `ITypeable`, and `IApplication` interfaces, allowing it to manage a group of applications as a single unit.

### Properties

-   `uid`: A unique identifier for the application collection.
-   `applications`: An array of `Application` instances.
-   `Type`: A string that is always "ApplicationCollection".
-   `meta`: An optional object for metadata.

### Methods

-   `addApps(apps: ApplicationCollection)`: Adds the applications from another `ApplicationCollection` to this one.
-   `error?(eventdata?: any)`: Calls the `error` method on each application in the collection.
-   `exit?(eventdata?: any)`: Calls the `exit` method on each application in the collection.
-   `init?(eventdata?: any)`: Calls the `init` method on each application in the collection.
-   `run(eventdata?: any)`: Calls the `run` method on each application in the collection.
