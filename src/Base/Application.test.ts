import { describe, expect, test } from '@jest/globals';
import { Application, TypeOfApplication, SafetyMode } from './Application';

// Mock für ApplicationCollection, da es in Application verwendet wird
class MockApplicationCollection {}

describe('Application', () => {
  test('should initialize with default values', () => {
    const app = new Application();

    expect(app.uid).toBeDefined();
    expect(app.Type).toBe(TypeOfApplication.NoInteraction);
    expect(app.typeOfApplication).toBe(TypeOfApplication.NoInteraction);
    expect(app.needsSafeMode).toBeUndefined();
    expect(app.Parent).toBeUndefined();
  });

  test('should allow setting properties', () => {
    const app = new Application();
    app.Parent = new MockApplicationCollection() as any;

    expect(app.Parent).toBeDefined();
  });

  test('should handle error event', () => {
    const app = new Application();
    // Hier würden wir normalerweise ein Mock für die Fehlerbehandlung erstellen
    // Da die Methode aktuell nur einen Parameter akzeptiert, testen wir einfach den Aufruf
    expect(() => app.error!(new Error('Test error'))).toThrow();
  });

  test('should handle exit event', () => {
    const app = new Application();
    // Ähnlich wie bei error, testen wir nur den Aufruf
    expect(() => app.exit!()).toThrow();
  });

  test('should handle init event', () => {
    const app = new Application();
    // Auch hier testen wir nur den Aufruf
    expect(() => app.init!({})).toThrow();
  });

  test('should handle run event', async () => {
    const app = new Application();
    // Auch hier testen wir nur den Aufruf
    await expect(app.run({})).rejects.toThrow();
  });

  test('should restart correctly', () => {
    const app = new Application();
    const runSpy = jest.spyOn(app, 'run');

    app.restart!();

    expect(runSpy).toHaveBeenCalled();
  });

  test('should have correct TypeOfApplication enum values', () => {
    expect(TypeOfApplication.NoInteraction).toBe('None Application');
    expect(TypeOfApplication.Express).toBe('Express Application');
    expect(TypeOfApplication.Webserver).toBe('Webserver Application');
    expect(TypeOfApplication.BackgroundProcess).toBe('Background Application');
    expect(TypeOfApplication.Database).toBe('Database Application');
  });

  test('should have correct SafetyMode enum values', () => {
    expect(SafetyMode.NeedsCatch).toBe(0);
    expect(SafetyMode.Safe).toBe(1);
    expect(SafetyMode.OnceNeedsCatch).toBe(2);
    expect(SafetyMode.Once).toBe(3);
  });
});