# Super NODE

Super NODE is a personal library for TypeScript in Node.js, designed to include many of the helpful features and utilities often found in larger frameworks.

## Table of Contents

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Usage](#usage)
-   [Running Tests](#running-tests)

## Features

-   A collection of useful modules for everyday development.
-   Strongly typed with TypeScript.
-   Includes a variety of helpers for different domains like `Base`, `Database`, `Discord`, `Math`, and more.

## Tech Stack

-   **Language:** TypeScript
-   **Runtime:** Node.js
-   **Testing:** Jest

## Prerequisites

-   Node.js (v16 or higher)
-   npm

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/super-node.git
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

## Configuration

This project uses environment variables for configuration.

1.  Create a `.env` file in the root of the project.
2.  Copy the contents of `.env.example` to your new `.env` file.
3.  Fill in the required environment variables:

| Variable      | Description                               |
| ------------- | ----------------------------------------- |
| `APP_PORT`    | The port the application will run on.     |
| `NODE_ENV`    | The environment (e.g., `development`).    |

## Usage

To compile the TypeScript code, run the following command:

```bash
npx tsc
```

To run the compiled code, use:

```bash
node main.js
```

## Running Tests

To run the test suite, use the following command:

```bash
npm test
```
