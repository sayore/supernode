import { Worker, isMainThread, parentPort, workerData, threadId, SHARE_ENV } from 'worker_threads';
import { EventEmitter } from 'events';

/**
 * Options for worker thread creation
 */
export interface WorkerOptions {
  workerData?: any;
  transferList?: ArrayBuffer[]; // Simplified for compatibility
  resourceLimits?: {
    maxYoungGenerationSizeMb?: number;
    maxOldGenerationSizeMb?: number;
    maxExecutableSizeMb?: number;
  };
  env?: NodeJS.ProcessEnv | typeof SHARE_ENV;
  execArgv?: string[];
}

/**
 * Result of a worker thread execution
 */
export interface WorkerResult<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
  duration: number;
}

/**
 * Manages worker threads with enhanced functionality
 */
export class WorkerThreadManager extends EventEmitter {
  private workers: Map<number, Worker> = new Map();
  private workerMetadata: Map<number, { startTime: number; options: WorkerOptions }> = new Map();
  private nextWorkerId: number = 1;

  /**
   * Creates and manages a new worker thread
   */
  createWorker(workerScriptPath: string, options?: WorkerOptions): Promise<{ workerId: number; worker: Worker }> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const workerId = this.nextWorkerId++;
      
      try {
        const worker = new Worker(workerScriptPath, {
          workerData: options?.workerData,
          transferList: options?.transferList,
          resourceLimits: options?.resourceLimits,
          env: options?.env,
          execArgv: options?.execArgv
        });
        
        // Store worker reference
        this.workers.set(workerId, worker);
        this.workerMetadata.set(workerId, { 
          startTime, 
          options: options || {} 
        });
        
        // Handle worker messages
        worker.on('message', (message) => {
          this.emit('message', { workerId, message });
        });
        
        // Handle worker errors
        worker.on('error', (error) => {
          this.emit('error', { workerId, error });
          this.cleanupWorker(workerId);
          reject(error);
        });
        
        // Handle worker exit
        worker.on('exit', (code) => {
          this.emit('exit', { workerId, code });
          this.cleanupWorker(workerId);
        });
        
        // Handle worker online event
        worker.on('online', () => {
          this.emit('online', { workerId });
          resolve({ workerId, worker });
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Posts a message to a specific worker
   */
  postMessageToWorker<T = any>(workerId: number, message: T, transferList?: ArrayBuffer[]): boolean {
    const worker = this.workers.get(workerId);
    if (worker) {
      try {
        if (transferList) {
          worker.postMessage(message, transferList);
        } else {
          worker.postMessage(message);
        }
        return true;
      } catch (error) {
        console.error(`Failed to post message to worker ${workerId}:`, error);
        return false;
      }
    }
    return false;
  }

  /**
   * Posts a message to all workers
   */
  broadcastMessageToWorkers<T = any>(message: T, transferList?: ArrayBuffer[]): number {
    let sentCount = 0;

    for (const [workerId, worker] of this.workers.entries()) {
      try {
        if (transferList) {
          worker.postMessage(message, transferList);
        } else {
          worker.postMessage(message);
        }
        sentCount++;
      } catch (error) {
        console.error(`Failed to post message to worker ${workerId}:`, error);
      }
    }

    return sentCount;
  }

  /**
   * Terminates a specific worker
   */
  terminateWorker(workerId: number): Promise<boolean> {
    return new Promise((resolve) => {
      const worker = this.workers.get(workerId);
      if (worker) {
        worker.terminate().then((exitCode) => {
          this.cleanupWorker(workerId);
          resolve(exitCode === 0);
        }).catch((error) => {
          console.error(`Error terminating worker ${workerId}:`, error);
          this.cleanupWorker(workerId);
          resolve(false);
        });
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Terminates all workers
   */
  async terminateAllWorkers(): Promise<boolean[]> {
    const terminationPromises: Promise<boolean>[] = [];
    
    for (const workerId of this.workers.keys()) {
      terminationPromises.push(this.terminateWorker(workerId));
    }
    
    return Promise.all(terminationPromises);
  }

  /**
   * Executes a task in a worker and waits for the result
   */
  async executeTaskInWorker<T = any, R = any>(
    workerScriptPath: string, 
    taskData: T, 
    options?: WorkerOptions,
    timeoutMs?: number
  ): Promise<WorkerResult<R>> {
    const startTime = Date.now();
    
    try {
      const { workerId, worker } = await this.createWorker(workerScriptPath, {
        ...options,
        workerData: taskData
      });
      
      return new Promise<WorkerResult<R>>((resolve, reject) => {
        // Setup timeout if specified
        let timeoutId: NodeJS.Timeout | null = null;
        if (timeoutMs) {
          timeoutId = setTimeout(() => {
            this.terminateWorker(workerId).then(() => {
              resolve({
                success: false,
                error: new Error(`Worker task timed out after ${timeoutMs}ms`),
                duration: Date.now() - startTime
              });
            });
          }, timeoutMs);
        }
        
        // Listen for result
        worker.on('message', (result) => {
          if (timeoutId) clearTimeout(timeoutId);
          
          this.terminateWorker(workerId); // Clean up worker after receiving result
          
          resolve({
            success: true,
            data: result,
            duration: Date.now() - startTime
          });
        });
        
        // Handle worker errors
        worker.on('error', (error) => {
          if (timeoutId) clearTimeout(timeoutId);
          
          this.terminateWorker(workerId); // Clean up worker after error
          
          resolve({
            success: false,
            error,
            duration: Date.now() - startTime
          });
        });
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Gets information about a specific worker
   */
  getWorkerInfo(workerId: number): { workerId: number; startTime: number; options: WorkerOptions; active: boolean } | null {
    const metadata = this.workerMetadata.get(workerId);
    if (!metadata) {
      return null;
    }
    
    return {
      workerId,
      startTime: metadata.startTime,
      options: metadata.options,
      active: this.workers.has(workerId)
    };
  }

  /**
   * Gets list of all managed worker IDs
   */
  getActiveWorkerIds(): number[] {
    return Array.from(this.workers.keys());
  }

  /**
   * Gets count of active workers
   */
  getActiveWorkerCount(): number {
    return this.workers.size;
  }

  /**
   * Waits for all active workers to complete
   */
  async waitForAllWorkers(): Promise<void> {
    if (this.workers.size === 0) {
      return;
    }
    
    const promises: Promise<any>[] = [];
    
    for (const [workerId, worker] of this.workers.entries()) {
      promises.push(new Promise((resolve) => {
        worker.on('exit', () => resolve(null));
        worker.on('error', () => resolve(null)); // Resolve even on error
      }));
    }
    
    await Promise.all(promises);
  }

  /**
   * Cleans up worker resources
   */
  private cleanupWorker(workerId: number): void {
    this.workers.delete(workerId);
    this.workerMetadata.delete(workerId);
  }
}

// Export convenience constants
export { isMainThread, parentPort, workerData, threadId };