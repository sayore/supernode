import { describe, expect, test } from '@jest/globals';
import { Vector2 } from './Vector2';

describe('Vector2', () => {
  test('should initialize with x and y values', () => {
    const vector = new Vector2(3, 4);
    expect(vector.x).toBe(3);
    expect(vector.y).toBe(4);
  });

  test('should create a vector from another vector', () => {
    const originalVector = new Vector2(3, 4);
    const newVector = Vector2.from(originalVector);
    expect(newVector.x).toBe(3);
    expect(newVector.y).toBe(4);
  });

  test('should check equality between vectors', () => {
    const vector1 = new Vector2(3, 4);
    const vector2 = new Vector2(3, 4);
    const vector3 = new Vector2(1, 2);

    expect(vector1.equals(vector2)).toBeTruthy();
    expect(vector1.equals(vector3)).toBeFalsy();
  });

  test('should add two vectors', () => {
    const vector1 = new Vector2(1, 2);
    const vector2 = new Vector2(3, 4);
    const result = Vector2.add(vector1, vector2);

    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  test('should subtract two vectors', () => {
    const vector1 = new Vector2(3, 4);
    const vector2 = new Vector2(1, 2);
    const result = Vector2.sub(vector1, vector2);

    expect(result.x).toBe(2);
    expect(result.y).toBe(2);
  });

  test('should multiply two vectors', () => {
    const vector1 = new Vector2(2, 3);
    const vector2 = new Vector2(4, 5);
    const result = Vector2.mul(vector1, vector2);

    expect(result.x).toBe(8);
    expect(result.y).toBe(15);
  });

  test('should divide two vectors', () => {
    const vector1 = new Vector2(8, 12);
    const vector2 = new Vector2(2, 3);
    const result = Vector2.div(vector1, vector2);

    expect(result.x).toBe(4);
    expect(result.y).toBe(4);
  });

  test('should calculate the length of a vector', () => {
    const vector = new Vector2(3, 4);
    const length = vector.length();

    expect(length).toBe(5); // sqrt(3^2 + 4^2) = 5
  });

  test('should normalize a vector', () => {
    const vector = new Vector2(3, 4);
    const normalized = vector.normalize();

    // Die Länge des normalisierten Vektors sollte 1 sein
    expect(normalized.length()).toBeCloseTo(1);
  });

  test('should calculate the distance between two vectors', () => {
    const vector1 = new Vector2(0, 0);
    const vector2 = new Vector2(3, 4);
    const distance = vector1.distance(vector2);

    expect(distance).toBe(5); // sqrt((3-0)^2 + (4-0)^2) = 5
  });

  test('should calculate the direction between two vectors', () => {
    const vector1 = new Vector2(0, 0);
    const vector2 = new Vector2(1, 0);
    const direction = Vector2.direction(vector1, vector2);

    // Die Richtung von (0,0) zu (1,0) sollte 0 sein (rechts)
    expect(direction).toBeCloseTo(0);
  });

  test('should return the zero vector', () => {
    const zeroVector = Vector2.Zero;

    expect(zeroVector.x).toBe(0);
    expect(zeroVector.y).toBe(0);
  });

  test('should return the one vector', () => {
    const oneVector = Vector2.One;

    expect(oneVector.x).toBe(1);
    expect(oneVector.y).toBe(1);
  });

  test('should return the up vector', () => {
    const upVector = Vector2.Up;

    expect(upVector.x).toBe(0);
    expect(upVector.y).toBe(-1);
  });

  test('should return the down vector', () => {
    const downVector = Vector2.Down;

    expect(downVector.x).toBe(0);
    expect(downVector.y).toBe(1);
  });

  test('should return the left vector', () => {
    const leftVector = Vector2.Left;

    expect(leftVector.x).toBe(-1);
    expect(leftVector.y).toBe(0);
  });

  test('should return the right vector', () => {
    const rightVector = Vector2.Right;

    expect(rightVector.x).toBe(1);
    expect(rightVector.y).toBe(0);
  });

  test('should clone a vector', () => {
    const originalVector = new Vector2(3, 4);
    const clonedVector = originalVector.clone();

    expect(clonedVector.x).toBe(originalVector.x);
    expect(clonedVector.y).toBe(originalVector.y);
    expect(clonedVector).not.toBe(originalVector); // Stellt sicher, dass es eine andere Instanz ist
  });

  test('should round a vector', () => {
    const vector = new Vector2(3.7, 4.2);
    const rounded = vector.round();

    expect(rounded.x).toBe(4);
    expect(rounded.y).toBe(4);
  });

  test('should floor a vector', () => {
    const vector = new Vector2(3.7, 4.2);
    const floored = vector.floor();

    expect(floored.x).toBe(3);
    expect(floored.y).toBe(4);
  });

  test('should ceil a vector', () => {
    const vector = new Vector2(3.2, 4.7);
    const ceiled = vector.ceil();

    expect(ceiled.x).toBe(4);
    expect(ceiled.y).toBe(5);
  });

  test('should clamp a vector', () => {
    const vector = new Vector2(5, 10);
    const min = new Vector2(0, 0);
    const max = new Vector2(3, 7);
    const clamped = vector.clamp(min, max);

    expect(clamped.x).toBe(3);
    expect(clamped.y).toBe(7);
  });

  test('should serialize and deserialize a vector', () => {
    const vector = new Vector2(100, 200);
    const serialized = vector.serializeInto2char();
    const deserialized = Vector2.deserializeFrom2char(serialized);

    expect(deserialized.x).toBe(100);
    expect(deserialized.y).toBe(200);
  });

  test('should convert vector to string representation', () => {
    const vector = new Vector2(3, 4);
    const stringRepresentation = vector.asString();

    expect(stringRepresentation).toBe('(3,4)');
  });
});