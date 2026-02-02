// TUIRenderer.ts
import { Terminal } from './Terminal.js'; // Your class
import { TUIElement } from './TUIElement.js';
import chalk from 'chalk'; // Optional: for coloring

export class TUIRenderer {
    constructor(private term: Terminal) {}

    public render(root: TUIElement) {
        // 1. Calculate Geometry
        // We assume full screen for the root, but you could limit it
        const { columns, rows } = process.stdout;
        root.computeLayout(columns, rows);

        // 2. Draw Recursive
        this.drawNode(root, 0, 0);

        // 3. Flush the buffer (Your existing method)
        this.term.flush();
    }

    private drawNode(node: TUIElement, parentX: number, parentY: number) {
        const layout = node.yogaNode.getComputedLayout();
        
        // Calculate Absolute Position
        const absX = parentX + layout.left;
        const absY = parentY + layout.top;
        const width = layout.width;
        const height = layout.height;

        // --- DRAW BACKGROUND ---
        if (node.style.bg) {
            // Very basic fill: loop through height/width
            // You can optimize this with repeat()
            const bgCode = this.getBgColorCode(node.style.bg); 
            for (let y = 0; y < height; y++) {
                // writeAt(row, col, text) -> Your API uses 1-based indexing typically? 
                // Let's assume your writeAt is 1-based.
                const row = Math.floor(absY + y + 1);
                const col = Math.floor(absX + 1);
                const fill = ' '.repeat(Math.floor(width));
                
                this.term.writeAt(row, col, fill, bgCode);
            }
        }

        // --- DRAW TEXT & CURSOR ---
        // We handle both 'text' labels and 'input' fields here
        if ((node.tagName === 'text' || node.tagName === 'input') && node.renderedText) {
            const content = node.renderedText;
            const startX = Math.floor(absX + 1);
            const startY = Math.floor(absY + 1);
            
            const fg = this.getFgColorCode(node.style.color || 'white');
            const bg = node.style.bg ? this.getBgColorCode(node.style.bg) : '';

            // Split content into lines
            const lines = content.split('\n');

            // Loop through each line (Y-axis)
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const currentY = startY + i;

                // Stop drawing if we go outside the element's height
                if (i >= height) break;

                // 1. Text (Label) Mode
                if (!node.isFocused || node.tagName !== 'input') {
                     // Ensure we don't overflow width
                     const safeText = line.substring(0, Math.floor(width));
                     this.term.writeAt(currentY, startX, safeText, `${fg}${bg}`);
                } 
                // 2. Input Mode (Cursor Logic)
                else {
                    // (Your existing cursor loop logic goes here)
                    // Note: Inputs are usually single-line, but if you support multi-line inputs later,
                    // you would need to calculate which line the cursor is on.
                    // For now, you can just render the first line for inputs:
                    if (i === 0) {
                        for (let j = 0; j < line.length && j < width; j++) {
                            const char = line[j] || ' ';
                            const isCursor = (j === node.cursorIndex);
                            const style = isCursor ? `${fg}${bg}\x1b[7m` : `${fg}${bg}\x1b[27m`;
                            this.term.writeAt(currentY, startX + j, char, style);
                        }
                    }
                }
            }
        }

        // --- RECURSE ---
        for (const child of node.children) {
            this.drawNode(child, absX, absY);
        }
    }

    // Helper: Convert Hex to ANSI TrueColor string directly
    // Format: \x1b[38;2;R;G;Bm (Foreground) or \x1b[48;2;R;G;Bm (Background)
    // Inside TUIRenderer.ts

    private hexToAnsi(hex: string, isBg: boolean): string {
        let clean = hex.replace('#', '');

        // Fix Short Hex (e.g. "F0A" -> "FF00AA")
        if (clean.length === 3) {
            clean = clean.split('').map(c => c + c).join('');
        }

        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);
        
        const type = isBg ? 48 : 38;
        return `\x1b[${type};2;${r};${g};${b}m`;
    }

    private getBgColorCode(color: string): string {
        if (color.startsWith('#')) {
            return this.hexToAnsi(color, true);
        }
        // Fallback for named colors (like 'blue') using a safe 'any' cast
        // or you can implement a simple name mapper if you want zero deps
        return (chalk as any).bgKeyword(color)._styler?.open || '';
    }

    private getFgColorCode(color: string): string {
        if (color.startsWith('#')) {
            return this.hexToAnsi(color, false);
        }
        return (chalk as any).keyword(color)._styler?.open || '';
    }
}