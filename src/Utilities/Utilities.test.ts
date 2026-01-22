import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ChildProcessManager } from './ChildProcessManager.js';
import { WorkerThreadManager } from './WorkerThreadManager.js';
import { ThreadPool } from './ThreadPool.js';

describe('ChildProcessManager', () => {
  let manager: ChildProcessManager;

  beforeEach(() => {
    manager = new ChildProcessManager();
  });

  afterEach(() => {
    manager.killAllProcesses();
  });

  it('should execute a simple command successfully', async () => {
    const result = await manager.exec('echo "hello world"');
    const stdoutStr = typeof result.stdout === 'string' ? result.stdout : result.stdout.toString();
    expect(stdoutStr.trim()).toBe('hello world');
    expect(result.code).toBe(0);
    expect(typeof result.duration).toBe('number');
  });

  it('should handle command execution errors', async () => {
    const result = await manager.exec('sh -c "exit 1"'); // Cross-platform way to trigger exit code 1
    expect(result.code).toBeGreaterThan(0);
  });

  it('should spawn a process and collect output', async () => {
    const result = await manager.spawn('echo', ['test-spawn']);
    const stdoutStr = typeof result.stdout === 'string' ? result.stdout : result.stdout.toString();
    expect(stdoutStr.trim()).toBe('test-spawn');
    expect(result.code).toBe(0);
  });
});

describe('WorkerThreadManager', () => {
  let manager: WorkerThreadManager;

  beforeEach(() => {
    manager = new WorkerThreadManager();
  });

  afterEach(async () => {
    await manager.terminateAllWorkers();
  });

  it('should get correct worker counts', () => {
    expect(manager.getActiveWorkerCount()).toBe(0);
    expect(manager.getActiveWorkerIds()).toEqual([]);
  });
});

describe('ThreadPool', () => {
  it('should create and manage a thread pool', async () => {
    const pool = new ThreadPool({ minThreads: 1, maxThreads: 2 });

    expect(pool.getStats().totalWorkers).toBeGreaterThanOrEqual(1);

    await pool.shutdown();
  });
});