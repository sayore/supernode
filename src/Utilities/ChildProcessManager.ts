import { spawn, exec, execFile, fork, ChildProcess, SpawnOptions, ExecOptions, ExecFileOptions } from 'child_process';
import { EventEmitter } from 'events';
import { promisify } from 'util';

/**
 * Options for process execution
 */
export interface ProcessOptions extends SpawnOptions {
  timeout?: number;
  maxBuffer?: number;
  killSignal?: NodeJS.Signals;
}

/**
 * Result of a process execution
 */
export interface ProcessResult {
  stdout: string | Buffer;
  stderr: string | Buffer;
  code: number | null;
  signal: NodeJS.Signals | null;
  duration: number;
}

/**
 * Manages child processes with enhanced functionality
 */
export class ChildProcessManager extends EventEmitter {
  private processes: Map<string, ChildProcess> = new Map();
  private processMetadata: Map<string, { startTime: number; options: ProcessOptions }> = new Map();

  /**
   * Spawns a child process with enhanced management capabilities
   */
  spawn(command: string, args?: readonly string[], options?: ProcessOptions): Promise<ProcessResult> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const spawnOptions = options ? { ...options } : {};
      // Remove killSignal from spawn options as it's not a valid spawn option
      const killSignal = spawnOptions.killSignal;
      delete spawnOptions.killSignal;

      const child = spawn(command, args || [], spawnOptions) as ChildProcess;

      // Generate unique ID for this process
      const pid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Store process reference
      this.processes.set(pid, child);
      this.processMetadata.set(pid, { startTime, options: options || {} });

      let stdout = '';
      let stderr = '';

      // Collect output
      if (child.stdout) {
        child.stdout.on('data', (data) => {
          stdout += data.toString();
          this.emit('stdout', { pid, data: data.toString(), command, args });
        });
      }

      if (child.stderr) {
        child.stderr.on('data', (data) => {
          stderr += data.toString();
          this.emit('stderr', { pid, data: data.toString(), command, args });
        });
      }

      // Handle process completion
      child.on('close', (code, signal) => {
        const duration = Date.now() - startTime;

        const result: ProcessResult = {
          stdout,
          stderr,
          code,
          signal,
          duration
        };

        // Clean up references
        this.processes.delete(pid);
        this.processMetadata.delete(pid);

        this.emit('close', { pid, result, command, args });

        if (signal !== null) {
          reject(new Error(`Process killed with signal ${signal}: ${stderr}`));
        } else if (code !== 0) {
          reject(new Error(`Process exited with code ${code}: ${stderr}`));
        } else {
          resolve(result);
        }
      });

      // Handle process errors
      child.on('error', (error) => {
        this.processes.delete(pid);
        this.processMetadata.delete(pid);
        this.emit('error', { pid, error, command, args });
        reject(error);
      });

      // Setup timeout if specified
      if (options?.timeout) {
        setTimeout(() => {
          if (this.processes.has(pid)) {
            this.killProcess(pid, killSignal || 'SIGTERM');
            reject(new Error(`Process timed out after ${options.timeout}ms`));
          }
        }, options.timeout);
      }
    });
  }

  /**
   * Executes a command using shell execution
   */
  async exec(command: string, options?: ProcessOptions): Promise<ProcessResult> {
    const startTime = Date.now();

    try {
      // Extract custom options that aren't valid for exec
      const execOptions: ExecOptions = { encoding: 'utf8' };
      if (options) {
        // Copy only valid ExecOptions properties
        execOptions.timeout = options.timeout;
        execOptions.maxBuffer = options.maxBuffer;
        execOptions.cwd = options.cwd;
        execOptions.env = options.env;
        if (typeof options.shell === 'string') {
          execOptions.shell = options.shell;
        }
        execOptions.signal = options.signal;
        // Add other valid ExecOptions as needed
      }

      const execPromise = promisify(exec);
      const { stdout, stderr } = await execPromise(command, execOptions);

      const duration = Date.now() - startTime;

      return {
        stdout,
        stderr,
        code: 0,
        signal: null,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      return {
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        code: error.code || 1,
        signal: error.signal || null,
        duration
      };
    }
  }

  /**
   * Executes a file directly
   */
  async execFile(file: string, args?: readonly string[], options?: ProcessOptions): Promise<ProcessResult> {
    const startTime = Date.now();

    try {
      // Extract custom options that aren't valid for execFile
      const execFileOptions: ExecFileOptions = { encoding: 'utf8' };
      if (options) {
        // Copy only valid ExecFileOptions properties
        execFileOptions.timeout = options.timeout;
        execFileOptions.maxBuffer = options.maxBuffer;
        execFileOptions.cwd = options.cwd;
        execFileOptions.env = options.env;
        if (typeof options.shell === 'string') {
          execFileOptions.shell = options.shell;
        }
        execFileOptions.signal = options.signal;
        // Add other valid ExecFileOptions as needed
      }

      const execFilePromise = promisify(execFile);
      const { stdout, stderr } = await execFilePromise(file, args || [], execFileOptions);

      const duration = Date.now() - startTime;

      return {
        stdout,
        stderr,
        code: 0,
        signal: null,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      return {
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        code: error.code || 1,
        signal: error.signal || null,
        duration
      };
    }
  }

  /**
   * Forks a new Node.js process
   */
  fork(modulePath: string, args?: readonly string[], options?: ProcessOptions): ChildProcess {
    // Extract custom options that aren't valid for fork
    const forkOptions = options ? { ...options } : {};
    delete (forkOptions as any).killSignal;

    const child = fork(modulePath, args, forkOptions);

    // Generate unique ID for this process
    const pid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store process reference
    this.processes.set(pid, child);
    this.processMetadata.set(pid, {
      startTime: Date.now(),
      options: options || {}
    });

    // Clean up when process exits
    child.on('close', () => {
      this.processes.delete(pid);
      this.processMetadata.delete(pid);
    });

    child.on('error', () => {
      this.processes.delete(pid);
      this.processMetadata.delete(pid);
    });

    return child;
  }

  /**
   * Kills a specific process by PID
   */
  killProcess(pid: string, signal: NodeJS.Signals = 'SIGTERM'): boolean {
    const process = this.processes.get(pid);
    if (process) {
      try {
        process.kill(signal);
        return true;
      } catch (error) {
        console.error(`Failed to kill process ${pid}:`, error);
        return false;
      }
    }
    return false;
  }

  /**
   * Kills all managed processes
   */
  killAllProcesses(signal: NodeJS.Signals = 'SIGTERM'): void {
    for (const [pid, process] of this.processes.entries()) {
      try {
        process.kill(signal);
      } catch (error) {
        console.error(`Failed to kill process ${pid}:`, error);
      }
    }
    this.processes.clear();
    this.processMetadata.clear();
  }

  /**
   * Gets information about a specific process
   */
  getProcessInfo(pid: string): { pid: string; startTime: number; options: ProcessOptions; active: boolean } | null {
    const metadata = this.processMetadata.get(pid);
    if (!metadata) {
      return null;
    }
    
    return {
      pid,
      startTime: metadata.startTime,
      options: metadata.options,
      active: this.processes.has(pid)
    };
  }

  /**
   * Gets list of all managed process IDs
   */
  getActiveProcessIds(): string[] {
    return Array.from(this.processes.keys());
  }

  /**
   * Gets count of active processes
   */
  getActiveProcessCount(): number {
    return this.processes.size;
  }

  /**
   * Waits for all active processes to complete
   */
  async waitForAllProcesses(): Promise<void> {
    if (this.processes.size === 0) {
      return;
    }
    
    const promises: Promise<any>[] = [];
    
    for (const [pid, process] of this.processes.entries()) {
      promises.push(new Promise((resolve) => {
        process.on('close', () => resolve(null));
        process.on('error', () => resolve(null)); // Resolve even on error
      }));
    }
    
    await Promise.all(promises);
  }
}