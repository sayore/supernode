import { describe, expect, test, jest } from '@jest/globals';
import { ChildProcessManager } from './ChildProcessManager';
import { spawn, exec, execFile, fork } from 'child_process';

// Mock für child_process
jest.mock('child_process', () => ({
  spawn: jest.fn(),
  exec: jest.fn(),
  execFile: jest.fn(),
  fork: jest.fn(),
}));

describe('ChildProcessManager', () => {
  let manager: ChildProcessManager;

  beforeEach(() => {
    manager = new ChildProcessManager();
  });

  afterEach(() => {
    // Stellen Sie sicher, dass alle Prozesse nach jedem Test entfernt werden
    manager.killAllProcesses();
  });

  test('should spawn a child process', () => {
    const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    const mockChildProcess = {
      pid: 123,
      on: jest.fn(),
      kill: jest.fn(),
    };
    mockSpawn.mockReturnValue(mockChildProcess as any);

    const promise = manager.spawn('ls', ['-l'], { timeout: 5000 });

    expect(mockSpawn).toHaveBeenCalledWith('ls', ['-l'], { timeout: 5000 });
    expect(manager.getActiveProcessCount()).toBe(1);

    // Beenden Sie den simulierten Prozess
    mockChildProcess.on.mock.calls.find(
      (call) => call[0] === 'close'
    )[1](0); // Simuliert das Schließen des Prozesses mit Exit-Code 0
  });

  test('should execute a command using exec', async () => {
    const mockExec = exec as jest.MockedFunction<typeof exec>;
    const mockCallback = jest.fn();
    mockExec.mockImplementation((command, options, callback) => {
      // Simuliert den Abschluss des Befehls
      setImmediate(() => callback(null, { stdout: 'output', stderr: '', code: 0, signal: null }));
      return {} as any;
    });

    const result = await manager.exec('echo "hello"', {});

    expect(mockExec).toHaveBeenCalledWith('echo "hello"', {}, expect.any(Function));
    expect(result.code).toBe(0);
    expect(result.stdout).toBe('output');
  });

  test('should execute a file using execFile', async () => {
    const mockExecFile = execFile as jest.MockedFunction<typeof execFile>;
    const mockCallback = jest.fn();
    mockExecFile.mockImplementation((file, args, options, callback) => {
      // Simuliert den Abschluss des Befehls
      setImmediate(() => callback(null, { stdout: 'output', stderr: '', code: 0, signal: null }));
      return {} as any;
    });

    const result = await manager.execFile('script.sh', [], {});

    expect(mockExecFile).toHaveBeenCalledWith('script.sh', [], {}, expect.any(Function));
    expect(result.code).toBe(0);
    expect(result.stdout).toBe('output');
  });

  test('should fork a new Node.js process', () => {
    const mockFork = fork as jest.MockedFunction<typeof fork>;
    const mockChildProcess = {
      pid: 456,
      on: jest.fn(),
      kill: jest.fn(),
    };
    mockFork.mockReturnValue(mockChildProcess as any);

    const promise = manager.fork('./worker.js', [], { timeout: 5000 });

    expect(mockFork).toHaveBeenCalledWith('./worker.js', [], { timeout: 5000 });
    expect(manager.getActiveProcessCount()).toBe(1);

    // Beenden Sie den simulierten Prozess
    mockChildProcess.on.mock.calls.find(
      (call) => call[0] === 'close'
    )[1](0); // Simuliert das Schließen des Prozesses mit Exit-Code 0
  });

  test('should kill a specific process', () => {
    const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    const mockChildProcess = {
      pid: 789,
      on: jest.fn(),
      kill: jest.fn(),
    };
    mockSpawn.mockReturnValue(mockChildProcess as any);

    manager.spawn('sleep', ['10'], {});

    // Stellen Sie sicher, dass der Prozess hinzugefügt wurde
    expect(manager.getActiveProcessCount()).toBe(1);

    // Töten Sie den Prozess
    manager.killProcess(789);

    // Überprüfen Sie, ob die kill-Methode aufgerufen wurde
    expect(mockChildProcess.kill).toHaveBeenCalled();

    // Überprüfen Sie, ob der Prozess aus der Liste entfernt wurde
    expect(manager.getActiveProcessCount()).toBe(0);
  });

  test('should kill all processes', () => {
    const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    const mockChildProcess1 = {
      pid: 111,
      on: jest.fn(),
      kill: jest.fn(),
    };
    const mockChildProcess2 = {
      pid: 222,
      on: jest.fn(),
      kill: jest.fn(),
    };
    mockSpawn.mockReturnValueOnce(mockChildProcess1 as any).mockReturnValueOnce(mockChildProcess2 as any);

    manager.spawn('sleep', ['10'], {});
    manager.spawn('sleep', ['10'], {});

    // Stellen Sie sicher, dass beide Prozesse hinzugefügt wurden
    expect(manager.getActiveProcessCount()).toBe(2);

    // Töten Sie alle Prozesse
    manager.killAllProcesses();

    // Überprüfen Sie, ob die kill-Methode für beide Prozesse aufgerufen wurde
    expect(mockChildProcess1.kill).toHaveBeenCalled();
    expect(mockChildProcess2.kill).toHaveBeenCalled();

    // Überprüfen Sie, ob beide Prozesse aus der Liste entfernt wurden
    expect(manager.getActiveProcessCount()).toBe(0);
  });

  test('should get process information', () => {
    const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    const mockChildProcess = {
      pid: 333,
      on: jest.fn(),
      kill: jest.fn(),
    };
    mockSpawn.mockReturnValue(mockChildProcess as any);

    manager.spawn('sleep', ['10'], {});

    // Rufen Sie die Prozessinformationen ab
    const info = manager.getProcessInfo('333');

    // Überprüfen Sie, ob die Informationen korrekt sind
    expect(info).toBeDefined();
    expect(info.pid).toBe(333);
  });

  test('should wait for all processes to complete', async () => {
    const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    const mockChildProcess1 = {
      pid: 444,
      on: jest.fn((event, callback) => {
        if (event === 'close') {
          // Simulieren Sie das Schließen des Prozesses nach einer Verzögerung
          setTimeout(() => callback(0), 100);
        }
      }),
      kill: jest.fn(),
    };
    const mockChildProcess2 = {
      pid: 555,
      on: jest.fn((event, callback) => {
        if (event === 'close') {
          // Simulieren Sie das Schließen des Prozesses nach einer Verzögerung
          setTimeout(() => callback(0), 200);
        }
      }),
      kill: jest.fn(),
    };
    mockSpawn.mockReturnValueOnce(mockChildProcess1 as any).mockReturnValueOnce(mockChildProcess2 as any);

    manager.spawn('sleep', ['10'], {});
    manager.spawn('sleep', ['10'], {});

    // Warten Sie auf alle Prozesse
    await manager.waitForAllProcesses();

    // Überprüfen Sie, ob alle Prozesse abgeschlossen sind
    expect(manager.getActiveProcessCount()).toBe(0);
  });
});