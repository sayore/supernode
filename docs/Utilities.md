# Supernode Utilities - Child Process and Thread Management

This module provides advanced utilities for managing child processes and worker threads in Node.js applications.

## ChildProcessManager

The `ChildProcessManager` class provides enhanced functionality for spawning and managing child processes.

### Features:
- Promise-based API for easy async/await usage
- Automatic process tracking and cleanup
- Timeout handling
- Real-time output monitoring
- Process lifecycle management

### Example Usage:

```typescript
import { ChildProcessManager } from 'supernode/Utilities';

const processManager = new ChildProcessManager();

// Execute a command
const result = await processManager.exec('ls -la');
console.log('Output:', result.stdout);

// Spawn a process with real-time output
processManager.on('stdout', ({ data }) => {
  console.log('Real-time output:', data);
});

const spawnResult = await processManager.spawn('ping', ['-c', '4', 'google.com']);
```

## WorkerThreadManager

The `WorkerThreadManager` class provides enhanced functionality for managing worker threads.

### Features:
- Worker lifecycle management
- Message passing between main thread and workers
- Worker pooling capabilities
- Error handling and monitoring

### Example Usage:

```typescript
import { WorkerThreadManager } from 'supernode/Utilities';

const workerManager = new WorkerThreadManager();

// Create and manage a worker
const { workerId, worker } = await workerManager.createWorker('./my-worker.js');

// Send message to worker
workerManager.postMessageToWorker(workerId, { task: 'calculate', data: [1, 2, 3, 4] });

// Listen for messages from worker
workerManager.on('message', ({ workerId, message }) => {
  console.log(`Worker ${workerId} responded:`, message);
});
```

## ThreadPool

The `ThreadPool` class provides a thread pool implementation for efficiently managing multiple worker threads.

### Features:
- Configurable min/max thread counts
- Task queuing when all threads are busy
- Automatic thread reuse
- Resource cleanup

### Example Usage:

```typescript
import { ThreadPool } from 'supernode/Utilities';

const threadPool = new ThreadPool({ minThreads: 2, maxThreads: 10 });

// Execute a task in the thread pool
const result = await threadPool.executeTask(
  './compute-worker.js',
  { operation: 'fibonacci', n: 40 },
  {},
  10000 // 10 second timeout
);

console.log('Computation result:', result);
```

## API Reference

### ChildProcessManager

#### Methods:
- `spawn(command, args?, options?)` - Spawn a child process
- `exec(command, options?)` - Execute a command in shell
- `execFile(file, args?, options?)` - Execute a file directly
- `fork(modulePath, args?, options?)` - Fork a new Node.js process
- `killProcess(pid, signal?)` - Kill a specific process
- `killAllProcesses(signal?)` - Kill all managed processes
- `getProcessInfo(pid)` - Get information about a process
- `getActiveProcessIds()` - Get list of active process IDs
- `getActiveProcessCount()` - Get count of active processes
- `waitForAllProcesses()` - Wait for all processes to complete

### WorkerThreadManager

#### Methods:
- `createWorker(workerScriptPath, options?)` - Create a new worker
- `postMessageToWorker(workerId, message, transferList?)` - Send message to worker
- `broadcastMessageToWorkers(message, transferList?)` - Broadcast message to all workers
- `terminateWorker(workerId)` - Terminate a specific worker
- `terminateAllWorkers()` - Terminate all workers
- `executeTaskInWorker(workerScriptPath, taskData, options?, timeoutMs?)` - Execute a task in a worker
- `getWorkerInfo(workerId)` - Get information about a worker
- `getActiveWorkerIds()` - Get list of active worker IDs
- `getActiveWorkerCount()` - Get count of active workers
- `waitForAllWorkers()` - Wait for all workers to complete

### ThreadPool

#### Methods:
- `executeTask(workerScriptPath, taskData, options?, timeoutMs?)` - Execute a task in the pool
- `getStats()` - Get pool statistics
- `shutdown()` - Shut down the thread pool

## Events

Both `ChildProcessManager` and `WorkerThreadManager` extend `EventEmitter` and emit the following events:

- `stdout` - Emitted when a process produces stdout
- `stderr` - Emitted when a process produces stderr
- `close` - Emitted when a process closes
- `error` - Emitted when an error occurs
- `message` - Emitted when a worker sends a message (WorkerThreadManager only)
- `exit` - Emitted when a worker exits (WorkerThreadManager only)
- `online` - Emitted when a worker becomes online (WorkerThreadManager only)