import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import { Logging, LogLevel, LogTarget } from './Logging';
import * as fs from 'fs-extra';
import * as chalk from 'chalk';

// Mock für chalk
jest.mock('chalk', () => ({
  blue: jest.fn((str) => str),
  green: jest.fn((str) => str),
  yellow: jest.fn((str) => str),
  red: jest.fn((str) => str),
  magenta: jest.fn((str) => str),
  cyan: jest.fn((str) => str),
  gray: jest.fn((str) => str),
}));

// Mock für fs-extra
jest.mock('fs-extra', () => ({
  appendFileSync: jest.fn(),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

describe('Logging', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Leeren Sie die Protokollierungseinstellungen vor jedem Test
    Logging.loggingActiveOn = [];
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('should log to console with different log levels', () => {
    // Aktivieren Sie die Protokollierung für alle Ebenen auf die Konsole
    Logging.setLogTarget(LogLevel.Trace, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Debug, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Info, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Warn, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Error, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Fatal, LogTarget.Console);

    // Protokollieren Sie Nachrichten verschiedener Ebenen
    Logging.log(LogLevel.Trace, 'Trace message');
    Logging.log(LogLevel.Debug, 'Debug message');
    Logging.log(LogLevel.Info, 'Info message');
    Logging.log(LogLevel.Warn, 'Warn message');
    Logging.log(LogLevel.Error, 'Error message');
    Logging.log(LogLevel.Fatal, 'Fatal message');

    // Überprüfen Sie, ob console.log für jede Nachricht aufgerufen wurde
    expect(consoleSpy).toHaveBeenCalledTimes(6);
  });

  test('should log to file with different log levels', () => {
    // Aktivieren Sie die Protokollierung für alle Ebenen in eine Datei
    Logging.setLogTarget(LogLevel.Trace, LogTarget.File);
    Logging.setLogTarget(LogLevel.Debug, LogTarget.File);
    Logging.setLogTarget(LogLevel.Info, LogTarget.File);
    Logging.setLogTarget(LogLevel.Warn, LogTarget.File);
    Logging.setLogTarget(LogLevel.Error, LogTarget.File);
    Logging.setLogTarget(LogLevel.Fatal, LogTarget.File);

    // Protokollieren Sie Nachrichten verschiedener Ebenen
    Logging.log(LogLevel.Trace, 'Trace message');
    Logging.log(LogLevel.Debug, 'Debug message');
    Logging.log(LogLevel.Info, 'Info message');
    Logging.log(LogLevel.Warn, 'Warn message');
    Logging.log(LogLevel.Error, 'Error message');
    Logging.log(LogLevel.Fatal, 'Fatal message');

    // Überprüfen Sie, ob fs.appendFileSync für jede Nachricht aufgerufen wurde
    expect(fs.appendFileSync).toHaveBeenCalledTimes(6);
  });

  test('should handle mixed log targets', () => {
    // Aktivieren Sie die Protokollierung für einige Ebenen auf die Konsole und andere in eine Datei
    Logging.setLogTarget(LogLevel.Info, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Error, LogTarget.File);

    // Protokollieren Sie Nachrichten
    Logging.log(LogLevel.Info, 'Info message');
    Logging.log(LogLevel.Error, 'Error message');

    // Überprüfen Sie, ob die richtigen Funktionen aufgerufen wurden
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(fs.appendFileSync).toHaveBeenCalledTimes(1);
  });

  test('should not log if log level is not activated', () => {
    // Stellen Sie sicher, dass keine Protokollierungsziele aktiv sind
    Logging.loggingActiveOn = [];

    // Versuchen Sie, eine Nachricht zu protokollieren
    Logging.log(LogLevel.Info, 'This should not be logged');

    // Überprüfen Sie, ob weder console.log noch fs.appendFileSync aufgerufen wurde
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    expect(fs.appendFileSync).toHaveBeenCalledTimes(0);
  });

  test('should handle interactive mode', () => {
    // Aktivieren Sie den interaktiven Modus
    Logging.interactiveMode = true;

    // Protokollieren Sie eine Nachricht
    Logging.log(LogLevel.Info, 'Interactive message');

    // Überprüfen Sie, ob console.log aufgerufen wurde
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  test('should properly format log messages', () => {
    // Aktivieren Sie die Protokollierung auf die Konsole
    Logging.setLogTarget(LogLevel.Info, LogTarget.Console);

    // Protokollieren Sie eine Nachricht
    Logging.log(LogLevel.Info, 'Formatted message');

    // Überprüfen Sie, ob console.log mit der korrekten Formatierung aufgerufen wurde
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[INFO]'),
      expect.stringContaining('Formatted message')
    );
  });
});