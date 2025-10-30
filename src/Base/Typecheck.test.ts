import { TypeCheck } from './Typecheck';
import { Item } from '../Game/Item';
import { IDrawable } from './IDrawable';
import { Vector2 } from '../Math/Vector2';

describe('TypeCheck', () => {
  describe('isDrawable', () => {
    it('should return true for an object with a Position property', () => {
      const drawableObject: IDrawable = { Position: new Vector2(0, 0) };
      expect(TypeCheck.isDrawable(drawableObject)).toBe(true);
    });

    it('should return false for an object without a Position property', () => {
      const notDrawableObject = { name: 'test' };
      expect(TypeCheck.isDrawable(notDrawableObject)).toBe(false);
    });

    it('should return false for null', () => {
      expect(TypeCheck.isDrawable(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(TypeCheck.isDrawable(undefined)).toBe(false);
    });
  });

  describe('isItem', () => {
    it('should return true for an object with an Id property', () => {
        const itemObject: Item = new Item({Id: 1, CanonicalId: "test", Name: "Test"});
        expect(TypeCheck.isItem(itemObject)).toBe(true);
    });

    it('should return false for an object without an Id property', () => {
      const notItemObject = { name: 'test' };
      expect(TypeCheck.isItem(notItemObject)).toBe(false);
    });

    it('should return false for null', () => {
      expect(TypeCheck.isItem(null)).toBe(false);
    });

    it('should return false for undefined', () => {
        expect(TypeCheck.isItem(undefined)).toBe(false);
    });
  });
});
