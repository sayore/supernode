import { Terminal } from './Terminal.js';
import { TUIElement } from './TUIElement.js';
import chalk from 'chalk';

export class TUIRenderer {
    constructor(private term: Terminal) {}

    public render(root: TUIElement) {
        // 1. Calculate Geometry
        const { columns, rows } = process.stdout;
        root.computeLayout(columns, rows);

        // 2. Draw Recursive
        this.drawNode(root, 0, 0);

        // 3. Flush
        this.term.flush();
    }

    private drawNode(node: TUIElement, parentX: number, parentY: number) {
        const layout = node.yogaNode.getComputedLayout();
        
        // Absolute Position
        const absX = parentX + layout.left;
        const absY = parentY + layout.top;
        const width = layout.width;
        const height = layout.height;

        // --- 1. DRAW BACKGROUND BOX ---
        if (node.style.bg) {
            const bgCode = this.getBgColorCode(node.style.bg); 
            // Only necessary if the box is bigger than the text content
            for (let y = 0; y < height; y++) {
                const row = Math.floor(absY + y + 1);
                const col = Math.floor(absX + 1);
                const fill = ' '.repeat(Math.floor(width));
                this.term.writeAt(row, col, fill, bgCode);
            }
        }

        // --- 2. DRAW TEXT (Unified Logic) ---
        // This now handles Labels AND Inputs using the same visual logic
        if ((node.tagName === 'text' || node.tagName === 'input') && node.renderedText) {
            const content = node.renderedText;
            const startX = Math.floor(absX + 1);
            const startY = Math.floor(absY + 1);
            
            // Base Colors
            const baseFg = this.getFgColorCode(node.style.color || 'white');
            const baseBg = node.style.bg ? this.getBgColorCode(node.style.bg) : '';

            // Get Selection Range (returns [start, end] or null)
            // We assume TUIElement has this method now.
            const selection = node.getSelectionRange();

            const lines = content.split('\n');
            let charGlobalIndex = 0; // Track index across lines

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const currentY = startY + i;

                // Clip to element height
                if (i >= height) break;

                // Iterate characters in this line
                for (let j = 0; j < Math.floor(width); j++) {
                    // Handle short lines (pad with space if needed, or just stop)
                    if (j >= line.length && node.tagName !== 'input') break;

                    const char = line[j] || ' '; // ' ' handles input placeholders/padding
                    const charCurrentIndex = charGlobalIndex + j;

                    // --- VISUAL PRIORITY SYSTEM ---
                    
                    let style = `${baseFg}${baseBg}`; // Default

                    // A. Check Selection
                    const isSelected = selection && 
                                       charCurrentIndex >= selection[0] && 
                                       charCurrentIndex < selection[1];

                    // B. Check Cursor (Only if focused)
                    const isCursor = node.isFocused && 
                                     node.tagName === 'input' && 
                                     charCurrentIndex === node.cursorPosition;

                    if (isCursor) {
                        // Cursor Style: Invert + maybe blinking (handled by terminal usually, but manual here)
                        // \x1b[7m = Reverse Video (Swap FG/BG)
                        style = `${baseFg}${baseBg}\x1b[7m`; 
                    } else if (isSelected) {
                        // Selection Style: Distinct background (e.g., Blue or Inverse)
                        // Browser style: White text on Blue background
                        const selBg = '\x1b[48;5;27m'; // ANSI Blue
                        const selFg = '\x1b[38;5;255m'; // ANSI White
                        style = `${selFg}${selBg}`;
                    }

                    // Reset style (\x1b[0m) isn't used per char to optimize, 
                    // we rely on the next write or end of loop. 
                    // But for safety in complex TUI, we often reset properties:
                    
                    this.term.writeAt(currentY, startX + j, char, `\x1b[0m${style}`);
                }
                
                // Account for newline char in global index
                charGlobalIndex += line.length + 1; 
            }
        }

        // --- 3. RECURSE ---
        for (const child of node.children) {
            this.drawNode(child, absX, absY);
        }
    }

    // --- COLOR HELPERS (Same as before) ---

    private hexToAnsi(hex: string, isBg: boolean): string {
        let clean = hex.replace('#', '');
        if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);
        const type = isBg ? 48 : 38;
        return `\x1b[${type};2;${r};${g};${b}m`;
    }

    private getBgColorCode(color: string): string {
        if (color.startsWith('#')) return this.hexToAnsi(color, true);
        return (chalk as any).bgKeyword(color)._styler?.open || '';
    }

    private getFgColorCode(color: string): string {
        if (color.startsWith('#')) return this.hexToAnsi(color, false);
        return (chalk as any).keyword(color)._styler?.open || '';
    }
}