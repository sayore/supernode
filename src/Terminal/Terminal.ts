import * as tty from 'tty';

// --- Enums & Types ---

export enum KeyName {
    Up = 'up', Down = 'down', Left = 'left', Right = 'right',
    Enter = 'enter', Escape = 'escape', Backspace = 'backspace', Tab = 'tab',
    Home = 'home', End = 'end', PageUp = 'pageup', PageDown = 'pagedown',
    Delete = 'delete', Insert = 'insert', 
    F1 = 'f1', F2 = 'f2', F3 = 'f3', F4 = 'f4',
    F5 = 'f5', F6 = 'f6', F7 = 'f7', F8 = 'f8', 
    F9 = 'f9', F10 = 'f10', F11 = 'f11', F12 = 'f12'
}

export type KeyData = {
    name: string;
    char?: string; // The actual character produced (if any)
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    meta: boolean;
    raw: string;
};

export type MouseData = {
    type: 'press' | 'release' | 'drag' | 'scroll';
    button: 'left' | 'middle' | 'right' | 'wheelUp' | 'wheelDown' | 'none';
    r: number;
    c: number;
    ctrl: boolean;
};

// --- Main Class ---

export class Terminal {
    private stdin = process.stdin;
    private stdout = process.stdout;
    private commandQueue: string[] = [];
    private queryResolvers: ((pos: { r: number; c: number }) => void)[] = [];

    private keyCallbacks: ((data: KeyData) => void)[] = [];
    private mouseCallbacks: ((data: MouseData) => void)[] = [];

    constructor() {
        this.setup();
    }

    private setup() {
        if (this.stdin.isTTY) {
            this.stdin.setRawMode(true);
        }
        this.stdin.resume();
        this.stdin.setEncoding('utf8');

        // Enable Mouse SGR (1006) + Any Event (1003)
        // Hide Cursor initially (?25l)
        this.stdout.write('\x1b[?1000h\x1b[?1003h\x1b[?1006h\x1b[?25l');

        this.stdin.on('data', (data: string) => this.handleInput(data));
        
        // Safety: Ensure terminal is reset on crash/exit
        process.on('exit', () => this.dispose());
    }

    public dispose() {
        // Restore cursor, disable mouse
        this.stdout.write('\x1b[?1000l\x1b[?1003l\x1b[?1006l\x1b[?25h');
        if (this.stdin.isTTY) {
            this.stdin.setRawMode(false);
        }
        this.stdin.pause();
    }

    public onKey(cb: (data: KeyData) => void) {
        this.keyCallbacks.push(cb);
    }

    public onMouse(cb: (data: MouseData) => void) {
        this.mouseCallbacks.push(cb);
    }

    private handleInput(data: string) {
        // 1. Cursor Position Response: \x1b[row;colR
        const cursorMatch = data.match(/^\x1b\[(\d+);(\d+)R$/);
        if (cursorMatch) {
            const res = this.queryResolvers.shift();
            if (res) res({ r: parseInt(cursorMatch[1]), c: parseInt(cursorMatch[2]) });
            return;
        }

        // 2. Mouse Event (SGR): \x1b[<ID;x;y;TYPE
        const mouseMatch = data.match(/^\x1b\[<(\d+);(\d+);(\d+)([Mm])/);
        if (mouseMatch && this.mouseCallbacks) {
            this.parseMouse(mouseMatch);
            return;
        }

        // 3. Keyboard Events
        this.parseKey(data);
    }

    private parseMouse(match: RegExpMatchArray) {
        const [_, codeStr, cStr, rStr, typeChar] = match;
        let code = parseInt(codeStr);
        const c = parseInt(cStr);
        const r = parseInt(rStr);
        const isRelease = typeChar === 'm';

        let type: MouseData['type'] = isRelease ? 'release' : 'press';
        let button: MouseData['button'] = 'left';

        // Decode bitmask
        const isDrag = (code & 32) !== 0;
        const isScroll = (code & 64) !== 0;
        const isCtrl = (code & 16) !== 0;

        if (isScroll) {
            type = 'scroll';
            button = (code & 1) ? 'wheelDown' : 'wheelUp'; // simplified
        } else if (isDrag) {
            type = 'drag';
        }

        // Extract clean button ID (0=Left, 1=Middle, 2=Right)
        // We filter out Drag(32), Ctrl(16), Scroll(64)
        const btnId = code & 3; 
        
        if (!isScroll) {
            if (btnId === 0) button = 'left';
            else if (btnId === 1) button = 'middle';
            else if (btnId === 2) button = 'right';
            else button = 'none';
        }

        this.mouseCallbacks.forEach(cb => cb({ type, button, r, c, ctrl: isCtrl }));
    }

    private parseKey(data: string) {
        if (!this.keyCallbacks) return;

        const k: KeyData = { 
            name: '', char: undefined, 
            ctrl: false, alt: false, shift: false, meta: false, 
            raw: data 
        };

        // Handle single control chars (CTRL+A to CTRL+Z)
        if (data.length === 1) {
            const code = data.charCodeAt(0);
            if (code >= 1 && code <= 26) {
                k.name = String.fromCharCode(code + 96); // a-z
                k.ctrl = true;
                if (k.name === 'i') k.name = KeyName.Tab;
                if (k.name === 'm') k.name = KeyName.Enter;
                if (k.name === 'h') k.name = KeyName.Backspace; // often Ctrl+H
            } else if (code === 27) {
                k.name = KeyName.Escape;
            } else if (code === 127) {
                k.name = KeyName.Backspace;
            } else {
                k.name = data;
                k.char = data;
            }
        } 
        // Handle Escape Sequences
        else if (data.startsWith('\x1b')) {
            // Remove the ESC
            const seq = data.slice(1);

            if (seq.startsWith('[') || seq.startsWith('O')) {
                // Parse standard CSI sequences
                // Example: \x1b[1;5A (Ctrl+Up)
                const parts = seq.match(/(\[|O)(\d+)?(?:;(\d+))?([A-Za-z~])/);
                
                if (parts) {
                    const [_, _prefix, p1, modifier, letter] = parts;
                    
                    // Modifiers (xterm style): 2=Shift, 3=Alt, 5=Ctrl, 6=Ctrl+Shift
                    const mod = parseInt(modifier || '1');
                    k.shift = (mod & 1) === 0; // rough check (2, 4, 6)
                    k.alt = (mod === 3 || mod === 4);
                    k.ctrl = (mod === 5 || mod === 6);

                    // Map letters to names
                    switch(letter) {
                        // Standard Cursor Keys (xterm)
                        case 'A': k.name = KeyName.Up; break;
                        case 'B': k.name = KeyName.Down; break;
                        case 'C': k.name = KeyName.Right; break;
                        case 'D': k.name = KeyName.Left; break;
                        
                        // Standard Navigation
                        case 'H': k.name = KeyName.Home; break;
                        case 'F': k.name = KeyName.End; break;
                        
                        // F1-F4 (SS3 Mode: \x1bOP etc.)
                        case 'P': k.name = KeyName.F1; break;
                        case 'Q': k.name = KeyName.F2; break;
                        case 'R': k.name = KeyName.F3; break;
                        case 'S': k.name = KeyName.F4; break;
                        
                        // VT sequences (Tilde group)
                        case '~': 
                            // Navigation / Editing
                            if (p1 === '1') k.name = KeyName.Home; // Alternative
                            if (p1 === '2') k.name = KeyName.Insert;
                            if (p1 === '3') k.name = KeyName.Delete;
                            if (p1 === '4') k.name = KeyName.End;  // Alternative
                            if (p1 === '5') k.name = KeyName.PageUp;
                            if (p1 === '6') k.name = KeyName.PageDown;

                            // Extended Function Keys
                            if (p1 === '15') k.name = KeyName.F5;
                            if (p1 === '17') k.name = KeyName.F6;
                            if (p1 === '18') k.name = KeyName.F7;
                            if (p1 === '19') k.name = KeyName.F8;
                            if (p1 === '20') k.name = KeyName.F9;
                            if (p1 === '21') k.name = KeyName.F10;
                            if (p1 === '23') k.name = KeyName.F11;
                            if (p1 === '24') k.name = KeyName.F12; // <--- The one you need for Debug!
                            break;
                    }
                }
            } else {
                // Alt + Char (e.g. \x1ba)
                k.alt = true;
                k.name = seq;
                k.char = seq;
            }
        }

        if (k.name) {
            this.keyCallbacks.forEach(cb => cb(k));
        }
    }

    // --- Drawing ---

    /**
     * @param clearLine if true, clears the rest of the line (safe for full rows, unsafe for partial updates)
     */
    writeAt(r: number, c: number, text: string, style: string = '', clearLine: boolean = false) {
        const clearCode = clearLine ? '\x1b[K' : '';
        this.commandQueue.push(`\x1b[${r};${c}H${style}${text}\x1b[0m${clearCode}`);
    }

    flush() {
        if (this.commandQueue.length === 0) return;
        
        // Use Synchronized Output (?2026) for flicker-free rendering
        // Wrap in save/restore cursor (sc/rc or s/u)
        const buffer = this.commandQueue.join('');
        
        // Note: \x1b[s is ANSI, \x1b7 is DEC. \x1b[s is widely supported now.
        this.stdout.write(`\x1b[?2026h\x1b[s${buffer}\x1b[u\x1b[?2026l`);
        
        this.commandQueue = [];
    }

    async getCursor(): Promise<{ r: number; c: number }> {
        return new Promise(res => {
            this.queryResolvers.push(res);
            this.stdout.write('\x1b[6n');
        });
    }

    exit() {
        this.dispose();
        process.exit();
    }
}