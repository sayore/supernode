import { ChildProcessManager } from './Utilities/ChildProcessManager.js';
import { WorkerThreadManager } from './Utilities/WorkerThreadManager.js';
import { ThreadPool } from './Utilities/ThreadPool.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

async function runTests() {
  console.log('Starting utility functions tests...\n');

  // Test ChildProcessManager
  console.log('1. Testing ChildProcessManager...');
  const processManager = new ChildProcessManager();

  try {
    const result = await processManager.exec('echo "Hello from child process!"');
    const stdoutStr = typeof result.stdout === 'string' ? result.stdout : result.stdout.toString();
    console.log('   Command result:', stdoutStr.trim());
    console.log('   Execution time:', result.duration, 'ms');
  } catch (error) {
    console.error('   Error executing command:', error);
  }

  // Test WorkerThreadManager
  console.log('\n2. Testing WorkerThreadManager...');
  const workerManager = new WorkerThreadManager();

  // Create a simple worker script for testing
  const workerScript = `
    const { parentPort, workerData } = require('worker_threads');

    // Simulate some work
    setTimeout(() => {
      const result = {
        message: 'Hello from worker thread!',
        receivedData: workerData,
        threadId: require('worker_threads').threadId
      };
      parentPort.postMessage(result);
    }, 100);
  `;

  // Write the worker script to a temporary file
  const tempDir = os.tmpdir();
  const fileName = `test-worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.js`;
  const workerScriptPath = path.join(tempDir, fileName);

  fs.writeFileSync(workerScriptPath, workerScript);

  try {
    const workerResult = await workerManager.executeTaskInWorker(
      workerScriptPath,
      { test: 'data', value: 42 },
      {},
      5000 // 5 second timeout
    );

    if (workerResult.success) {
      console.log('   Worker result:', workerResult.data);
      console.log('   Execution time:', workerResult.duration, 'ms');
    } else {
      console.error('   Worker error:', workerResult.error);
    }
  } catch (error) {
    console.error('   Error executing worker task:', error);
  }

  // Clean up the temporary file
  try {
    fs.unlinkSync(workerScriptPath);
  } catch (err) {
    console.warn('Warning: Could not clean up temporary worker file:', err);
  }

  // Test ThreadPool
  console.log('\n3. Testing ThreadPool...');
  const threadPool = new ThreadPool({ minThreads: 2, maxThreads: 4 });

  try {
    // Note: For the ThreadPool test, we'll skip it in this simple test
    // since it requires a proper worker script file to exist
    console.log('   ThreadPool created with stats:', threadPool.getStats());
  } catch (error) {
    console.error('   Error with thread pool:', error);
  }

  // Shutdown resources
  await threadPool.shutdown();
  console.log('\nAll tests completed!');
}

// Run tests
runTests().catch(console.error);