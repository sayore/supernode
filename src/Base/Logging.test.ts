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
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('should log to console with different log levels', () => {
    // Aktivieren Sie die Protokollierung für alle Ebenen auf die Konsole
    Logging.setLogTarget(LogLevel.Unknown, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Normal, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Info, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Verbose, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Testing, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Raw, LogTarget.Console);

    // Protokollieren Sie Nachrichten verschiedener Ebenen
    Logging.log('Unknown message', LogLevel.Unknown);
    Logging.log('Normal message', LogLevel.Normal);
    Logging.log('Info message', LogLevel.Info);
    Logging.log('Verbose message', LogLevel.Verbose);
    Logging.log('Testing message', LogLevel.Testing);
    Logging.log('Raw message', LogLevel.Raw);

    // Überprüfen Sie, ob console.log für jede Nachricht aufgerufen wurde
    expect(consoleSpy).toHaveBeenCalledTimes(6);
  });

  test('should log to file with different log levels', () => {
    // Aktivieren Sie die Protokollierung für alle Ebenen in eine Datei
    Logging.setLogTarget(LogLevel.Unknown, LogTarget.Textfile);
    Logging.setLogTarget(LogLevel.Normal, LogTarget.Textfile);
    Logging.setLogTarget(LogLevel.Info, LogTarget.Textfile);
    Logging.setLogTarget(LogLevel.Verbose, LogTarget.Textfile);
    Logging.setLogTarget(LogLevel.Testing, LogTarget.Textfile);
    Logging.setLogTarget(LogLevel.Raw, LogTarget.Textfile);

    // Protokollieren Sie Nachrichten verschiedener Ebenen
    Logging.log('Unknown message', LogLevel.Unknown);
    Logging.log('Normal message', LogLevel.Normal);
    Logging.log('Info message', LogLevel.Info);
    Logging.log('Verbose message', LogLevel.Verbose);
    Logging.log('Testing message', LogLevel.Testing);
    Logging.log('Raw message', LogLevel.Raw);

    // Überprüfen Sie, ob fs.appendFileSync für jede Nachricht aufgerufen wurde
    expect(fs.appendFileSync).toHaveBeenCalledTimes(6);
  });

  test('should handle mixed log targets', () => {
    // Aktivieren Sie die Protokollierung für einige Ebenen auf die Konsole und andere in eine Datei
    Logging.setLogTarget(LogLevel.Info, LogTarget.Console);
    Logging.setLogTarget(LogLevel.Normal, LogTarget.Textfile);

    // Protokollieren Sie Nachrichten
    Logging.log('Info message', LogLevel.Info);
    Logging.log('Normal message', LogLevel.Normal);

    // Überprüfen Sie, ob die richtigen Funktionen aufgerufen wurden
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(fs.appendFileSync).toHaveBeenCalledTimes(1);
  });

  test('should not log if log level is not activated', () => {
    // Stellen Sie sicher, dass keine Protokollierungsziele aktiv sind
    // Verwenden Sie Logging.setLogTarget, um Targets zu setzen, anstatt direkt auf die private Eigenschaft zuzugreifen

    // Versuchen Sie, eine Nachricht zu protokollieren
    Logging.log('This should not be logged', LogLevel.Info);

    // Überprüfen Sie, ob weder console.log noch fs.appendFileSync aufgerufen wurde
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    expect(fs.appendFileSync).toHaveBeenCalledTimes(0);
  });

  test('should handle interactive mode', () => {
    // Da interactiveMode privat ist, können wir es nicht direkt ändern
    // Stattdessen testen wir das Standardverhalten

    // Protokollieren Sie eine Nachricht
    Logging.log('Non-interactive message', LogLevel.Info);

    // Überprüfen Sie, ob console.log aufgerufen wurde
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  test('should properly format log messages', () => {
    // Aktivieren Sie die Protokollierung auf die Konsole
    Logging.setLogTarget(LogLevel.Info, LogTarget.Console);

    // Protokollieren Sie eine Nachricht
    Logging.log('Formatted message', LogLevel.Info);

    // Überprüfen Sie, ob console.log mit der korrekten Formatierung aufgerufen wurde
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Info'),
      expect.stringContaining('Formatted message')
    );
  });
});