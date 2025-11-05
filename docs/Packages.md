# Packages Module

## IPackageJSON

The `IPackageJSON` interface defines the structure of a `package.json` file.

## PackageManager

The `PackageManager` class provides methods for reading and interacting with a `package.json` file.

### `async packageFileExists(): Promise<boolean>`

Checks if a `package.json` file exists in the current working directory.

### `readPackageFile()`

Reads the `package.json` file and stores it in the `pkgJSON` property.

### `info()`

Returns the name and version of the package.
