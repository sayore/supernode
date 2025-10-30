import { Logging, LogLevel, LogTarget } from './Logging';
import * as fs from 'fs-extra';

// Mock fs-extra
jest.mock('fs-extra');

describe('Logging', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    // Spy on console.log to check what's being logged
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // Clear mock history before each test
    (fs.ensureFileSync as jest.Mock).mockClear();
    (fs.appendFileSync as jest.Mock).mockClear();
  });

  afterEach(() => {
    // Restore original console.log
    consoleLogSpy.mockRestore();
  });

  describe('log', () => {
    it('should log to console by default', () => {
      Logging.log('test message', LogLevel.Normal);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log to a file when LogTarget is Textfile', () => {
      Logging.setLogTarget(LogLevel.Normal, LogTarget.Textfile);
      Logging.log('test message', LogLevel.Normal);
      expect(fs.ensureFileSync).toHaveBeenCalledWith('./log/Normal.log');
      expect(fs.appendFileSync).toHaveBeenCalled();
    });

    it('should log to both console and file when LogTarget is All', () => {
      Logging.setLogTarget(LogLevel.Normal, LogTarget.All);
      Logging.log('test message', LogLevel.Normal);
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(fs.ensureFileSync).toHaveBeenCalledWith('./log/Normal.log');
      expect(fs.appendFileSync).toHaveBeenCalled();
    });

    it('should not log to console when LogTarget is Textfile', () => {
        Logging.setLogTarget(LogLevel.Normal, LogTarget.Textfile);
        Logging.log('test message', LogLevel.Normal);
        expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should not log to file when LogTarget is Console', () => {
        Logging.setLogTarget(LogLevel.Normal, LogTarget.Console);
        Logging.log('test message', LogLevel.Normal);
        expect(fs.ensureFileSync).not.toHaveBeenCalled();
        expect(fs.appendFileSync).not.toHaveBeenCalled();
    });

  });

  describe('setLogTarget', () => {
    it('should set the log target for a given log level', () => {
      Logging.setLogTarget(LogLevel.Testing, LogTarget.Textfile);
      Logging.log('test message', LogLevel.Testing);
      expect(fs.ensureFileSync).toHaveBeenCalledWith('./log/Testing.log');
    });

    it('should update the log target if it already exists', () => {
        Logging.setLogTarget(LogLevel.Info, LogTarget.Textfile);
        Logging.log('test message', LogLevel.Info);
        expect(fs.ensureFileSync).toHaveBeenCalledWith('./log/Info.log');

        Logging.setLogTarget(LogLevel.Info, LogTarget.Console);
        Logging.log('another test message', LogLevel.Info);
        expect(consoleLogSpy).toHaveBeenCalled();
      });
  });
});
