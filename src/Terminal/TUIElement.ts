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
    protected _value: string = "";
    public id: string = ''; // Add this
    public classList: string[] = []; // Add this
    public props: any = {}; // Add this
    // Interaction Flags
    public focusable: boolean = false; // Can this receive focus? (tabIndex)
    public isFocused: boolean = false; // Is it currently active?

    public cursorPosition: number = 0;
    
    // Styles
    public style: TUIStyle = {};

    constructor(tagName: string = 'box', style: TUIStyle = {}) {
        this.tagName = tagName;
        this.yogaNode = Yoga.Node.create();
        this.setStyle(style);

        if (this.props?.text) {
            this.value = this.props.text; // Use the setter!
        }

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

    get value(): string {
        return this._value;
    }

    set value(v: string) {
        if (this._value !== v) {
            this._value = v;
            
            // 1. Tell Yoga the content size changed!
            // This forces it to recalculate width/height on the next render.
            this.yogaNode.markDirty(); 

            // 2. Cursor logic (if you want to keep it safe, though Manager handles it mostly)
            // this.cursorPosition = v.length; // (Keep this commented out as discussed)
        }
    }

    // Making textContent just point to value
    get textContent(): string { return this.value; }
    set textContent(v: string) { this.value = v; }

    // Making inputValue just point to value
    get inputValue(): string { return this.value; }
    set inputValue(v: string) { this.value = v; }

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
    public query(selector: string): TUIElement | null {
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
        return null;
    }

    // Alias for jQuery lovers
    public $(selector: string): TUIElement | null {
        return this.$(selector);
    }

    //public safe(selector: string) {
    //    const el = this.$(selector);
    //    if (!el) {
    //        return new TUIDummyElement();
    //    }
    //    return el;
    //}

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

        return "printTree is not a console logable command"
    }

    /**
     * Updates the cursor position based on a click relative to the element.
     * @param localX The X position of the click relative to the element's left edge.
     * (e.g., if Element starts at 10 and Mouse is at 12, localX is 2)
     */
    public onLocalClick(localX: number) {
        if (this.tagName === 'input') {
            // 1. Account for padding (if your style has it)
            // (Yoga stores padding in the layout, but we can check style for simplicity)
            const padding = this.style.padding || 0;
            
            // 2. Calculate raw character index
            const charIndex = Math.round(localX - padding);

            // 3. Clamp: Don't let cursor go before 0 or after text length
            this.cursorPosition = Math.max(0, Math.min(charIndex, this.value.length));
            
            this.isFocused = true;
        }
    }

    // Inside TUIElement class
    public selectionAnchor: number = -1; // -1 means "No text selected"

    // Helper to get the clean range (Low to High) for the renderer
    public getSelectionRange(): [number, number] | null {
        if (this.selectionAnchor === -1 || this.selectionAnchor === this.cursorPosition) {
            return null;
        }
        const start = Math.min(this.selectionAnchor, this.cursorPosition);
        const end = Math.max(this.selectionAnchor, this.cursorPosition);
        return [start, end];
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