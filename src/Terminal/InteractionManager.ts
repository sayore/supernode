import { Terminal, KeyData, MouseData } from './Terminal.js'; // Adjust import path as needed
import { TUIDummyElement, TUIElement } from './TUIElement.js';

export class InteractionManager {
    private activeElement: TUIElement | null = null;
    private focusableElements: TUIElement[] = [];

    constructor(private root: TUIElement, private term: Terminal) {
        // 1. Find all inputs immediately
        this.refreshTabOrder();
        this.term.onKey((k) => this.handleGlobalKey(k));
        this.term.onMouse((m) => this.handleMouse(m));

        this.bindInternalEvents(this.root);

        $ = (selector: string) => root.query(selector);
    }

    public $(selector: string): TUIElement | null {
        return this.root.query(selector);
    }
    
    // Optional: Return a safe object that warns if missing
    // similar to how jQuery doesn't crash on null
    public safe(selector: string) {
        const el = this.$(selector);
        if (!el) {
            console.warn(`⚠️ Selector "${selector}" not found!`);
            // Return a dummy object to prevent crash? 
            // Or just return null and let user handle it.
            return null;
        }
        return el;
    }

    private handleMouse(m: MouseData) {
        if (m.type !== 'press' || m.button !== 'left') return;

        const mouseX = m.c - 1;
        const mouseY = m.r - 1;
        
        // 1. Find the deepest node we clicked
        let target = this.hitTest(this.root, 0, 0, mouseX, mouseY);
        
        // 2. DEBUG: Log what we hit (once we have the console)
        // console.log(`Hit: ${target?.tagName}#${target?.id}`);

        if (target) {
            // Logic: Auto-focus inputs if clicked directly
            if (target.tagName === 'input') this.focus(target);
            else if (target.parent?.tagName === 'input') this.focus(target.parent);

            // 3. BUBBLING LOOP
            // Traverse up from the target to the root, triggering 'click' on every parent
            let bubbleTarget: TUIElement | undefined = target;
            
            while (bubbleTarget) {
                // Emit event
                bubbleTarget.emit('click', { x: mouseX, y: mouseY, target: target });
                
                // Move up
                bubbleTarget = bubbleTarget.parent;
            }
        }
    }

    /**
     * Recursive Hit Testing.
     * Calculates absolute position on the fly.
     */
    private hitTest(node: TUIElement, parentAbsX: number, parentAbsY: number, targetX: number, targetY: number): TUIElement | null {
        // 1. Get Node Geometry
        const layout = node.yogaNode.getComputedLayout();
        
        // Calculate Absolute Position of THIS node
        const absX = parentAbsX + layout.left;
        const absY = parentAbsY + layout.top;
        
        // Calculate Bounding Box
        const right = absX + layout.width;
        const bottom = absY + layout.height;

        // 2. Check Collision: Is the mouse inside this box?
        const isInside = (targetX >= absX && targetX < right && 
                          targetY >= absY && targetY < bottom);

        if (!isInside) return null;

        // 3. Check Children (Recursively)
        // We iterate backwards to hit "top" elements (visually) first, 
        // though typically TUI elements don't overlap much.
        for (let i = node.children.length - 1; i >= 0; i--) {
            const child = node.children[i];
            // Pass THIS node's absolute X/Y as the parent offset for the child
            const hitChild = this.hitTest(child, absX, absY, targetX, targetY);
            
            if (hitChild) return hitChild;
        }

        // 4. If no children were hit, but we are inside this node, return THIS node.
        return node;
    }

    public refreshTabOrder() {
        this.focusableElements = [];
        this.findFocusable(this.root);
        
        // Safety: Re-bind events in case new elements were added
        // (Ideally you only bind new ones, but for now this ensures coverage)
        this.bindInternalEvents(this.root); 

        if (this.focusableElements.length > 0 && !this.activeElement) {
            this.focus(this.focusableElements[0]);
        }
    }

    private findFocusable(node: TUIElement) {
        if (node.tagName === 'input') {
            this.focusableElements.push(node);
        }
        node.children.forEach(child => this.findFocusable(child));
    }

    public focus(node: TUIElement) {
        // Unfocus old
        if (this.activeElement) this.activeElement.isFocused = false;
        
        // Focus new
        this.activeElement = node;
        node.isFocused = true;
    }

    private handleGlobalKey(k: KeyData) {
        // --- A. NAVIGATION (Tab) ---
        if (k.name === 'tab') {
            this.cycleFocus(k.shift); // Shift+Tab goes backwards
            return;
        }

        // --- B. INPUT HANDLING ---
        if (this.activeElement) {
            this.handleInput(this.activeElement, k);
        }
    }

    private cycleFocus(reverse: boolean) {
        if (this.focusableElements.length === 0) return;
        
        let idx = this.focusableElements.indexOf(this.activeElement!);
        // If not found, start at 0
        if (idx === -1) idx = 0;

        if (reverse) {
            idx--;
            if (idx < 0) idx = this.focusableElements.length - 1;
        } else {
            idx++;
            if (idx >= this.focusableElements.length) idx = 0;
        }

        this.focus(this.focusableElements[idx]);
    }

    private handleInput(el: TUIElement, k: KeyData) {
        // Only inputs handle text
        if (el.tagName !== 'input') return;

        // 1. Backspace
        if (k.name === 'backspace') {
            if (el.cursorIndex > 0) {
                // Remove char BEFORE cursor
                const left = el.inputValue.slice(0, el.cursorIndex - 1);
                const right = el.inputValue.slice(el.cursorIndex);
                el.inputValue = left + right;
                el.cursorIndex--;
            }
        }
        // 2. Delete
        else if (k.name === 'delete') {
            if (el.cursorIndex < el.inputValue.length) {
                // Remove char AT cursor
                const left = el.inputValue.slice(0, el.cursorIndex);
                const right = el.inputValue.slice(el.cursorIndex + 1);
                el.inputValue = left + right;
            }
        }
        // 3. Arrows
        else if (k.name === 'left') {
            if (el.cursorIndex > 0) el.cursorIndex--;
        }
        else if (k.name === 'right') {
            if (el.cursorIndex < el.inputValue.length) el.cursorIndex++;
        }
        else if (k.name === 'home') {
            el.cursorIndex = 0;
        }
        else if (k.name === 'end') {
            el.cursorIndex = el.inputValue.length;
        }
        // 4. Typing (Regular Chars)
        // We ensure it's a single char (not 'enter' or 'f1')
        else if (k.char && k.char.length === 1 && !k.ctrl && !k.alt) {
            const left = el.inputValue.slice(0, el.cursorIndex);
            const right = el.inputValue.slice(el.cursorIndex);
            
            el.inputValue = left + k.char + right;
            el.cursorIndex++;
        }
        el.emit('change', el.inputValue);
    }

    // Recursively listen for 'focus()' calls on any element
    private bindInternalEvents(node: TUIElement) {
        // Prevent double-binding if called multiple times
        // (You could add a flag on node like node._isBound if you want to be safe)
        
        node.on('__req_focus', () => {
            this.focus(node);
        });

        node.children.forEach(child => this.bindInternalEvents(child));
    }
}

export let $: (selector: string) => TUIElement = () => new TUIDummyElement();;