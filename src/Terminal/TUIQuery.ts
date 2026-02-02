import { TUIElement } from './TUIElement.js';

export class TUIQuery {
    constructor(private root: TUIElement) {}

    // The jQuery-like selector
    public $(idOrTag: string): TUIElement | null {
        // ID Selector
        if (idOrTag.startsWith('#')) {
            return this.root.getElementById(idOrTag.substring(1));
        }
        // Basic Tag Selector (Naive implementation)
        // You can expand this to search by tag name recursively if you want
        return null;
    }
}