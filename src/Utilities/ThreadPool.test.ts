import { describe, expect, test, jest } from '@jest/globals';
import { ThreadPool } from './ThreadPool';
import { WorkerThreadManager } from './WorkerThreadManager';

// Mock für WorkerThreadManager
jest.mock('./WorkerThreadManager', () => ({
  WorkerThreadManager: jest.fn(() => ({
    createWorker: jest.fn(() => Promise.resolve({ workerId: 1, worker: {} })), // Gibt eine Worker-ID zurück
    postMessageToWorker: jest.fn(),
    terminateWorker: jest.fn(),
    terminateAllWorkers: jest.fn(),
    executeTaskInWorker: jest.fn((id, script, data, options) =>
      Promise.resolve({ success: true, data: 'result', duration: 100 })
    ),
    getWorkerInfo: jest.fn(),
    getActiveWorkerIds: jest.fn(() => []),
    getActiveWorkerCount: jest.fn(() => 0),
    waitForAllWorkers: jest.fn(() => Promise.resolve()),
    cleanupWorker: jest.fn(),
  })),
}));

describe('ThreadPool', () => {
  let threadPool: ThreadPool;

  beforeEach(() => {
    const options = {
      minThreads: 1,
      maxThreads: 4,
      idleTimeout: 30000,
      queueLimit: 10,
    };
    threadPool = new ThreadPool(options);
  });

  afterEach(() => {
    // Stellen Sie sicher, dass der Thread-Pool nach jedem Test heruntergefahren wird
    threadPool.shutdown();
  });

  test('should initialize with correct options', () => {
    const options = {
      minThreads: 2,
      maxThreads: 8,
      idleTimeout: 60000,
      queueLimit: 20,
    };
    const pool = new ThreadPool(options);

    expect(pool['options']).toEqual(options);
    expect(pool['workerManager']).toBeDefined();
  });

  test('should execute a task using the thread pool', async () => {
    const executeTaskInWorkerSpy = jest.spyOn(threadPool['workerManager'], 'executeTaskInWorker');
    const taskData = { message: 'Hello, Worker!' };
    const workerScriptPath = './test-worker.js';

    const result = await threadPool.executeTask(workerScriptPath, taskData, {});

    // Überprüfen Sie, ob die Aufgabe erfolgreich ausgeführt wurde
    expect(executeTaskInWorkerSpy).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.data).toBe('result');
  });

  test('should handle task queue when all workers are busy', async () => {
    // Simulieren Sie, dass alle Worker beschäftigt sind
    const activeWorkers = new Set([1, 2, 3, 4]);
    Object.defineProperty(threadPool, 'activeWorkers', { value: activeWorkers });

    const taskData = { message: 'Hello, Worker!' };
    const workerScriptPath = './test-worker.js';

    // Führen Sie eine Aufgabe aus, während alle Worker beschäftigt sind
    const promise = threadPool.executeTask(workerScriptPath, taskData, {});

    // Die Aufgabe sollte in die Warteschlange gestellt werden
    expect(threadPool['taskQueue'].length).toBe(1);

    // Simulieren Sie, dass ein Worker verfügbar wird
    activeWorkers.delete(1);
    // Die Aufgabe sollte nun vom Worker übernommen werden
    const result = await promise;

    // Überprüfen Sie, ob die Aufgabe erfolgreich ausgeführt wurde
    expect(result.success).toBe(true);
  });

  test('should shut down the thread pool and terminate all workers', () => {
    const terminateAllWorkersSpy = jest.spyOn(threadPool['workerManager'], 'terminateAllWorkers');

    threadPool.shutdown();

    // Überprüfen Sie, ob alle Worker beendet wurden
    expect(terminateAllWorkersSpy).toHaveBeenCalled();
  });

  test('should get statistics about the thread pool', () => {
    // Fügen Sie einige simulierten Worker und Aufgaben hinzu
    threadPool['activeWorkers'].add(1).add(2);
    threadPool['taskQueue'].push({} as any);

    const stats = threadPool.getStats();

    // Überprüfen Sie, ob die Statistiken korrekt sind
    expect(stats.activeWorkers).toBe(2);
    expect(stats.queuedTasks).toBe(1);
    expect(stats.availableWorkers).toBe(0); // Da alle Worker aktiv sind
  });
});