import { WorkerThreadManager, WorkerOptions, WorkerResult } from './WorkerThreadManager';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Configuration options for the thread pool
 */
export interface ThreadPoolOptions {
  minThreads?: number;
  maxThreads?: number;
  idleTimeout?: number;
  queueLimit?: number;
}

/**
 * A task to be executed in the thread pool
 */
export interface Task<T = any, R = any> {
  id: string;
  workerScriptPath: string;
  taskData: T;
  options?: WorkerOptions;
  resolve: (result: WorkerResult<R>) => void;
  reject: (error: Error) => void;
  createdAt: number;
}

/**
 * A thread pool for managing worker threads efficiently
 */
export class ThreadPool {
  private workerManager: WorkerThreadManager;
  private options: ThreadPoolOptions;
  private activeWorkers: Set<number> = new Set();
  private taskQueue: Task[] = [];
  private availableWorkers: number[] = [];
  private taskTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private tempWorkerScripts: string[] = []; // Track temporary worker scripts for cleanup

  constructor(options?: ThreadPoolOptions) {
    this.options = {
      minThreads: options?.minThreads ?? 2,
      maxThreads: options?.maxThreads ?? 10,
      idleTimeout: options?.idleTimeout ?? 30000, // 30 seconds
      queueLimit: options?.queueLimit ?? 100,
      ...options
    };

    this.workerManager = new WorkerThreadManager();

    // Initialize minimum number of workers
    this.initializeWorkers();
  }

  /**
   * Initializes the minimum number of workers
   */
  private async initializeWorkers(): Promise<void> {
    for (let i = 0; i < this.options.minThreads!; i++) {
      await this.createWorker();
    }
  }

  /**
   * Creates a new worker and adds it to the pool
   */
  private async createWorker(): Promise<number> {
    const workerScriptPath = this.createTempWorkerScript();
    const { workerId } = await this.workerManager.createWorker(workerScriptPath);

    this.availableWorkers.push(workerId);
    return workerId;
  }

  /**
   * Creates a temporary worker script file
   */
  private createTempWorkerScript(): string {
    const workerScript = `
      const { parentPort, workerData } = require('worker_threads');

      parentPort.on('message', (task) => {
        // Execute the task in the worker
        try {
          // In a real implementation, this would dynamically execute the task
          // For now, we'll just return the task data as-is
          parentPort.postMessage({ success: true, data: task.taskData });
        } catch (error) {
          parentPort.postMessage({ success: false, error: error.message });
        }
      });
    `;

    // Write the worker script to a temporary file
    const tempDir = os.tmpdir();
    const fileName = `threadpool-worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.js`;
    const filePath = path.join(tempDir, fileName);

    fs.writeFileSync(filePath, workerScript);

    // Track the file for cleanup
    this.tempWorkerScripts.push(filePath);

    return filePath;
  }

  /**
   * Executes a task using the thread pool
   */
  async executeTask<T = any, R = any>(
    workerScriptPath: string, 
    taskData: T, 
    options?: WorkerOptions,
    timeoutMs?: number
  ): Promise<WorkerResult<R>> {
    return new Promise((resolve, reject) => {
      // Check if queue is at limit
      if (this.taskQueue.length >= this.options.queueLimit!) {
        reject(new Error('Task queue is at maximum capacity'));
        return;
      }

      const taskId = this.generateTaskId();
      const task: Task<T, R> = {
        id: taskId,
        workerScriptPath,
        taskData,
        options,
        resolve,
        reject,
        createdAt: Date.now()
      };

      // If there's an available worker, execute immediately
      if (this.availableWorkers.length > 0) {
        this.executeTaskOnAvailableWorker(task, timeoutMs);
      } else if (this.activeWorkers.size < this.options.maxThreads!) {
        // If we can create more workers, do so
        this.createWorker().then(() => {
          this.executeTaskOnAvailableWorker(task, timeoutMs);
        }).catch(reject);
      } else {
        // Otherwise, queue the task
        this.taskQueue.push(task);
        
        // Set timeout for the queued task
        if (timeoutMs) {
          const timeoutId = setTimeout(() => {
            this.removeTaskFromQueue(taskId);
            reject(new Error(`Task ${taskId} timed out in queue after ${timeoutMs}ms`));
          }, timeoutMs);
          
          this.taskTimeouts.set(taskId, timeoutId);
        }
      }
    });
  }

  /**
   * Executes a task on an available worker
   */
  private async executeTaskOnAvailableWorker<T, R>(task: Task<T, R>, timeoutMs?: number): Promise<void> {
    const workerId = this.availableWorkers.pop()!;
    this.activeWorkers.add(workerId);

    try {
      // In a real implementation, we would send the task to the worker
      // For now, we'll simulate by executing directly
      const result = await this.workerManager.executeTaskInWorker<T, R>(
        task.workerScriptPath,
        task.taskData,
        task.options,
        timeoutMs
      );

      task.resolve(result);
    } catch (error) {
      task.reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      // Return worker to available pool or clean up
      this.activeWorkers.delete(workerId);
      
      if (this.activeWorkers.size >= this.options.minThreads!) {
        // If we have more than min threads, terminate this one
        await this.workerManager.terminateWorker(workerId);
      } else {
        // Otherwise, return to available pool
        this.availableWorkers.push(workerId);
        
        // Process next queued task if available
        if (this.taskQueue.length > 0) {
          const nextTask = this.taskQueue.shift();
          if (nextTask) {
            const timeoutId = this.taskTimeouts.get(nextTask.id);
            if (timeoutId) {
              clearTimeout(timeoutId);
              this.taskTimeouts.delete(nextTask.id);
            }
            
            this.executeTaskOnAvailableWorker(nextTask, undefined);
          }
        }
      }
    }
  }

  /**
   * Generates a unique task ID
   */
  private generateTaskId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Removes a task from the queue
   */
  private removeTaskFromQueue(taskId: string): boolean {
    const index = this.taskQueue.findIndex(task => task.id === taskId);
    if (index !== -1) {
      this.taskQueue.splice(index, 1);
      
      const timeoutId = this.taskTimeouts.get(taskId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.taskTimeouts.delete(taskId);
      }
      
      return true;
    }
    return false;
  }

  /**
   * Gets statistics about the thread pool
   */
  getStats(): {
    activeWorkers: number;
    availableWorkers: number;
    queuedTasks: number;
    totalWorkers: number;
  } {
    return {
      activeWorkers: this.activeWorkers.size,
      availableWorkers: this.availableWorkers.length,
      queuedTasks: this.taskQueue.length,
      totalWorkers: this.activeWorkers.size + this.availableWorkers.length
    };
  }

  /**
   * Shuts down the thread pool and terminates all workers
   */
  async shutdown(): Promise<void> {
    // Clear all timeouts
    for (const timeoutId of this.taskTimeouts.values()) {
      clearTimeout(timeoutId);
    }
    this.taskTimeouts.clear();

    // Reject all queued tasks
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      if (task) {
        task.reject(new Error('ThreadPool shutting down'));
      }
    }

    // Terminate all workers
    await this.workerManager.terminateAllWorkers();

    // Clean up temporary worker script files
    for (const filePath of this.tempWorkerScripts) {
      try {
        fs.unlinkSync(filePath); // Synchronous cleanup
      } catch (error) {
        console.warn(`Could not clean up temporary worker script: ${filePath}`, error);
      }
    }
    this.tempWorkerScripts = [];
  }
}