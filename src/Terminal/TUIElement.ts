// TUIElement.ts
import Yoga, { YogaNode } from 'yoga-layout-prebuilt';

// src/Terminal/TUIElement.ts

export type TUIStyle = {
    // Basic
    color?: string;
    bg?: string;
    width?: number | string;
    height?: number | string;
    padding?: number;
    border?: boolean;
    
    // Flexbox Layout (New)
    flexDirection?: 'row' | 'column';
    justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
    alignItems?: 'start' | 'center' | 'end' | 'stretch';
    gap?: number;
    flexGrow?: number; // <--- Add this
    flexShrink?: number;

    // Positioning (New)
    position?: 'absolute' | 'relative';
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};

export class TUIElement {
    public yogaNode: YogaNode;
    public children: TUIElement[] = [];
    public parent?: TUIElement;
    
    // Content
    public tagName: string; // 'box' | 'text'
    private _textContent: string = '';
    public id: string = ''; // Add this
    // Interaction Flags
    public focusable: boolean = false; // Can this receive focus? (tabIndex)
    public isFocused: boolean = false; // Is it currently active?
    
    // Input Specifics
    public inputValue: string = '';    // The text in the field
    public cursorIndex: number = 0;    // Where is the cursor? (0 to length)
    
    // Styles
    public style: TUIStyle = {};

    constructor(tagName: string = 'box', style: TUIStyle = {}) {
        this.tagName = tagName;
        this.yogaNode = Yoga.Node.create();
        this.setStyle(style);

        if (tagName === 'text' || tagName === 'input') {
            this.yogaNode.setMeasureFunc((width, widthMode, height, heightMode) => {
                // 1. Get the content
                // For inputs, we might want a fixed width (defined by style.width), 
                // but if width is 'auto', we use the text length.
                const text = this.renderedText || this.textContent || '';
                
                // 1. Split by newlines to find dimensions
                const lines = text.split('\n');
                
                // Width = Length of the longest line
                let measuredWidth = 0;
                lines.forEach(line => {
                    if (line.length > measuredWidth) measuredWidth = line.length;
                });

                // Input fallback
                if (tagName === 'input' && measuredWidth === 0) measuredWidth = 10;

                // 3. Return dimensions
                return { width: measuredWidth, height: lines.length };
            });
        }
    }

    public remove(child: TUIElement) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            // 1. Remove from JS Array
            this.children.splice(index, 1);
            
            // 2. Remove from Yoga Tree (The critical missing piece)
            this.yogaNode.removeChild(child.yogaNode);
            
            // 3. Unlink parent
            child.parent = undefined;
        }
    }

    // The Unified Selector Method
    public query(selector: string): TUIElement {
        // 1. Handle ID Selectors ("#myId")
        if (selector.startsWith('#')) {
            const cleanId = selector.substring(1);
            if (this.id === cleanId) return this;
            
            for (const child of this.children) {
                const found = child.query(selector);
                if (found) return found;
            }
        } 
        // 2. Handle Tag Selectors ("button", "input")
        else {
            if (this.tagName === selector) return this;
            
            for (const child of this.children) {
                const found = child.query(selector);
                if (found) return found;
            }
        }
        return new TUIDummyElement();;
    }

    // Alias for jQuery lovers
    public $(selector: string): TUIElement {
        return this.safe(selector);
    }

    public safe(selector: string) {
        const el = this.$(selector);
        if (!el) {
            return new TUIDummyElement();
        }
        return el;
    }

    // Add this helper method to find nodes
    public getElementById(id: string): TUIElement | null {
        if (this.id === id) return this;
        
        for (const child of this.children) {
            const found = child.getElementById(id);
            if (found) return found;
        }
        return null;
    }

    get renderedText(): string {
        // If it's an input, show inputValue. Otherwise show textContent.
        // You can add logic here for password masking later (* * *)
        return this.tagName === 'input' ? this.inputValue : this.textContent;
    }

    setStyle(style: TUIStyle) {
        this.style = { ...this.style, ...style };
        const GUTTER_ALL = 2;
        // --- MAP CSS TO YOGA ---
        
        // Width: 100% vs 10px
        if (style.width !== undefined) {
            if (typeof style.width === 'string' && style.width.endsWith('%')) {
                this.yogaNode.setWidthPercent(parseFloat(style.width));
            } else {
                this.yogaNode.setWidth(style.width as number);
            }
        }

        // Height
        if (style.height !== undefined) {
             if (typeof style.height === 'string' && style.height.endsWith('%')) {
                this.yogaNode.setHeightPercent(parseFloat(style.height));
            } else {
                this.yogaNode.setHeight(style.height as number);
            }
        }

        if (style.flexGrow !== undefined) {
            this.yogaNode.setFlexGrow(style.flexGrow);
        }
        if (style.flexShrink !== undefined) {
            this.yogaNode.setFlexShrink(style.flexShrink);
        }

        // Flex Direction
        if (style.flexDirection === 'row') {
            this.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
        } else {
            this.yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
        }

        if (style.gap !== undefined) {
            // Fix: Cast yogaNode to any to bypass the missing type definition
            (this.yogaNode as any).setGap(2, style.gap);
        }

        // Padding
        if (style.padding) {
            this.yogaNode.setPadding(Yoga.EDGE_ALL, style.padding);
        }

        // Justify Content
        if (style.justifyContent) {
            const map: Record<string, any> = {
                'start': Yoga.JUSTIFY_FLEX_START,
                'center': Yoga.JUSTIFY_CENTER,
                'end': Yoga.JUSTIFY_FLEX_END,
                'between': Yoga.JUSTIFY_SPACE_BETWEEN,
                'around': Yoga.JUSTIFY_SPACE_AROUND
            };
            if (map[style.justifyContent]) this.yogaNode.setJustifyContent(map[style.justifyContent]);
        }

        // Align Items
        if (style.alignItems) {
            const map: Record<string, any> = {
                'start': Yoga.ALIGN_FLEX_START,
                'center': Yoga.ALIGN_CENTER,
                'end': Yoga.ALIGN_FLEX_END,
                'stretch': Yoga.ALIGN_STRETCH
            };
            if (map[style.alignItems]) this.yogaNode.setAlignItems(map[style.alignItems]);
        }   

        // Position Type
        if (style.position === 'absolute') {
            this.yogaNode.setPositionType(Yoga.POSITION_TYPE_ABSOLUTE);
        } else if (style.position === 'relative') {
            this.yogaNode.setPositionType(Yoga.POSITION_TYPE_RELATIVE);
        }

        // Position Coordinates
        if (style.top !== undefined)    this.yogaNode.setPosition(Yoga.EDGE_TOP, style.top);
        if (style.bottom !== undefined) this.yogaNode.setPosition(Yoga.EDGE_BOTTOM, style.bottom);
        if (style.left !== undefined)   this.yogaNode.setPosition(Yoga.EDGE_LEFT, style.left);
        if (style.right !== undefined)  this.yogaNode.setPosition(Yoga.EDGE_RIGHT, style.right);
    }

    add(child: TUIElement) {
        child.parent = this;
        this.children.push(child);
        this.yogaNode.insertChild(child.yogaNode, this.children.length - 1);
    }
    get textContent(): string {
        return this._textContent;
    }

    set textContent(val: string) {
        this._textContent = val;
        // Tell Yoga this node needs to be re-measured
        this.yogaNode.markDirty(); 
    }

    public focus() {
        // We emit a special event that the Manager will listen for
        this.emit('__req_focus'); 
    }

    public printTree(depth = 0) {
        const indent = '  '.repeat(depth);
        const info = this.id ? `#${this.id}` : '';
        // Use original console.log to bypass the TUI overlay for this boot check
        process.stdout.write(`${indent}${this.tagName}${info}\n`);
        
        this.children.forEach(c => c.printTree(depth + 1));
    }
    
    // Event Registry
    private listeners: Record<string, ((data: any) => void)[]> = {};

    // 1. Register Event
    public on(event: string, cb: (data: any) => void) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(cb);
        return this; // Allow chaining
    }

    // 2. Trigger Event
    public emit(event: string, data?: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
    
    // 3. Chainable Helpers (optional, for that jQuery feel)
    public onClick(cb: () => void) { return this.on('click', cb); }
    public onChange(cb: (val: string) => void) { return this.on('change', cb); }
    
    // Crucial: Calculate layout starting from this node
    computeLayout(screenWidth: number, screenHeight: number) {
        this.yogaNode.calculateLayout(screenWidth, screenHeight, Yoga.DIRECTION_LTR);
    }
}

export class TUIDummyElement extends TUIElement {
    toString() {
        return "[Dummy Element]";
    }
}