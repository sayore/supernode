import { Terminal, KeyData, MouseData, KeyName } from './Terminal.js'; // Adjust import path as needed
import { TUIElement } from './TUIElement.js';

export class InteractionManager {
    private activeElement: TUIElement | null = null;
    private focusableElements: TUIElement[] = [];
    private clipboard: string = "";

    constructor(private root: TUIElement, private term: Terminal) {
        // 1. Find all inputs immediately
        this.refreshTabOrder();
        this.term.onKey((k) => this.handleGlobalKey(k));
        this.term.onMouse((m) => this.handleMouse(m));

        this.bindInternalEvents(this.root);

        this.$ = (selector: string) => root.query(selector);
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

    private capturingElement: TUIElement | null = null;
    private captureOffset: number = 0;
    private lastMouseX: number = 0;

    private handleMouse(m: MouseData) {
        // 1. Filter out pure noise (unwanted hover events)
        // If your API sends 'none' for hover, we generally ignore it for logic 
        // unless you want hover-styles (like CSS :hover). 
        // For CURSOR movement, definitely ignore it.
        if (m.button === 'none') {
            // Optional: Handle visual hover state here if you want later
            return; 
        }

        const mouseX = m.c - 1;
        const mouseY = m.r - 1;
        this.lastMouseX = mouseX;

        // 2. Resolve Target (Capturing vs HitTest)
        let target = this.capturingElement;
        let captureOffset = this.captureOffset;

        if (!target) {
            const hit = this.hitTest(this.root, 0, 0, mouseX, mouseY);
            if (hit) {
                target = hit.node;
                captureOffset = hit.x;
            }
        }

        if (!target) return;

        // 3. Handle Input Specifics
        if (target.tagName === 'input') {
            // Calculate relative X based on the captured offset
            const localX = mouseX - captureOffset;

            // --- PRESS (Start Selection) ---
            if (m.type === 'press') {
                this.capturingElement = target; 
                this.captureOffset = captureOffset; // Remember where the element started
                
                // ✅ ONLY NOW do we move the cursor and focus
                target.onLocalClick(localX);    
                target.selectionAnchor = target.cursorPosition; 
                this.focus(target);
            }

            // --- DRAG (Update Selection) ---
            else if (m.type === 'drag') {
                // ✅ ONLY Update cursor during explicit drag
                if (this.capturingElement === target) {
                    target.onLocalClick(localX); 
                }
            }

            // --- RELEASE (End Selection) ---
            else if (m.type === 'release') {
                this.capturingElement = null;
                if (target.selectionAnchor === target.cursorPosition) {
                    target.selectionAnchor = -1;
                }
            }
        }
    }

    /**
     * Recursive Hit Testing.
     * Calculates absolute position on the fly.
     */
    private hitTest(node: TUIElement, parentAbsX: number, parentAbsY: number, targetX: number, targetY: number): { node: TUIElement, x: number, y: number } | null {
        // 1. Get Node Geometry
        const layout = node.yogaNode.getComputedLayout();

        // Calculate Absolute Position of THIS node
        const absX = parentAbsX + layout.left;
        const absY = parentAbsY + layout.top;

        // Calculate Bounding Box
        const right = absX + layout.width;
        const bottom = absY + layout.height;

        // 2. Check Collision
        const isInside = (targetX >= absX && targetX < right &&
            targetY >= absY && targetY < bottom);

        if (!isInside) return null;

        // 3. Check Children (Recursively)
        for (let i = node.children.length - 1; i >= 0; i--) {
            const child = node.children[i];
            const hitChild = this.hitTest(child, absX, absY, targetX, targetY);

            if (hitChild) return hitChild;
        }

        // 4. Return the NODE plus its calculated ABSOLUTE POSITION
        return { node, x: absX, y: absY };
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

        const checkClearSelection = () => {
            if (!k.shift) {
                el.selectionAnchor = -1;
            } else if (el.selectionAnchor === -1) {
                // If Shift IS held but we had no selection, drop anchor now!
                el.selectionAnchor = el.cursorPosition;
            }
        };

        if (k.name === KeyName.Insert) {
            const range = el.getSelectionRange();
            let start = el.cursorPosition;
            let end = el.cursorPosition;

            if (range) {
                start = range[0];
                end = range[1];
            }

            const left = el.inputValue.slice(0, start);
            const right = el.inputValue.slice(end);

            el.inputValue = left + this.clipboard + right;
            el.cursorPosition = start + this.clipboard.length;
            el.selectionAnchor = -1; // Clear selection after paste
        }

        if (k.ctrl) {
            if (k.name === 'c') {
                // COPY
                const range = el.getSelectionRange();
                if (range) {
                    const [start, end] = range;
                    this.clipboard = el.inputValue.substring(start, end);
                    console.log("Copied:", this.clipboard);
                }
                return;
            }
            else if (k.name === 'x') {
                // CUT
                const range = el.getSelectionRange();
                if (range) {
                    const [start, end] = range;
                    this.clipboard = el.inputValue.substring(start, end);
                    // Delete the extracted part
                    el.inputValue = el.inputValue.slice(0, start) + el.inputValue.slice(end);
                    el.cursorPosition = start;
                    el.selectionAnchor = -1;
                }
                return;
            }
            else if (k.name === 'v') {
                // PASTE
                if (this.clipboard) {
                    // If there is a selection, replace it. If not, insert at cursor.
                    const range = el.getSelectionRange();
                    let start = el.cursorPosition;
                    let end = el.cursorPosition;

                    if (range) {
                        start = range[0];
                        end = range[1];
                    }

                    const left = el.inputValue.slice(0, start);
                    const right = el.inputValue.slice(end);

                    el.inputValue = left + this.clipboard + right;
                    el.cursorPosition = start + this.clipboard.length;
                    el.selectionAnchor = -1; // Clear selection after paste
                }
                return;
            }
        }
        const resetSelection = () => {
            if (!k.shift) el.selectionAnchor = -1;
        };

        if (k.name === 'left') {
            if (k.shift && el.selectionAnchor === -1) el.selectionAnchor = el.cursorPosition;
            resetSelection();
            if (el.cursorPosition > 0) el.cursorPosition--;
        }
        else if (k.name === 'right') {
            if (k.shift && el.selectionAnchor === -1) el.selectionAnchor = el.cursorPosition;
            resetSelection();
            if (el.cursorPosition < el.inputValue.length) el.cursorPosition++;
        }
        else if (k.char && !k.ctrl && !k.alt) {
            // Typing a character replaces any active selection!
            const range = el.getSelectionRange();
            let leftPart = el.inputValue.slice(0, el.cursorPosition);
            let rightPart = el.inputValue.slice(el.cursorPosition);

            if (range) {
                // If text is selected, typing 'a' should delete the selection and insert 'a'
                const [start, end] = range;
                leftPart = el.inputValue.slice(0, start);
                rightPart = el.inputValue.slice(end);
                el.cursorPosition = start; // Reset cursor to start of overwrite
            }

            el.inputValue = leftPart + k.char + rightPart;
            el.cursorPosition++;
            el.selectionAnchor = -1; // Reset selection
        }

        else if (k.name === 'backspace') {
            // If we have a selection, delete the WHOLE selection
            const range = el.getSelectionRange();
            if (range) {
                const [start, end] = range;
                el.inputValue = el.inputValue.slice(0, start) + el.inputValue.slice(end);
                el.cursorPosition = start;
                el.selectionAnchor = -1; // Selection is gone
            } else {
                // Standard backspace
                if (el.cursorPosition > 0) {
                    const left = el.inputValue.slice(0, el.cursorPosition - 1);
                    const right = el.inputValue.slice(el.cursorPosition);
                    el.inputValue = left + right;
                    el.cursorPosition--;
                }
            }
        }
        else if (k.name === 'home') {
            el.cursorPosition = 0;
        }
        else if (k.name === 'end') {
            el.cursorPosition = el.inputValue.length;
        }
        // 4. Typing (Regular Chars)
        // We ensure it's a single char (not 'enter' or 'f1')
        else if (k.char && k.char.length === 1 && !k.ctrl && !k.alt) {
            const left = el.inputValue.slice(0, el.cursorPosition);
            const right = el.inputValue.slice(el.cursorPosition);

            // Update the text
            el.inputValue = left + k.char + right;

            // Manually advance cursor (Since we removed the auto-jump from the setter)
            el.cursorPosition++;
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