// src/Terminal/DebugConsole.ts
import { TUIElement } from './TUIElement.js';
import { InteractionManager } from './InteractionManager.js';

export class DebugConsole {
    private logs: string[] = [];
    private visible: boolean = false;
    private container: TUIElement;
    private logText: TUIElement;
    private originalLog: any;

    constructor(private root: TUIElement, private app: InteractionManager) {
        // 1. Create the UI for the Console
        // We use position: absolute to float it over everything
        this.container = new TUIElement('box', {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '50%', // Take up bottom half
            bg: '#111',
            border: true,
            padding: 1,
            flexDirection: 'column'
        });

        // Title Bar
        const title = new TUIElement('box', { height: 1, bg: 'red', width: '100%' });
        const titleText = new TUIElement('text', { color: 'white' });
        titleText.textContent = " 🐞 DEBUG CONSOLE (F12 to Toggle)";
        title.add(titleText);
        this.container.add(title);

        // Content Area
        this.logText = new TUIElement('text', { color: '#0F0' });
        this.container.add(this.logText);

        // 2. Hijack console.log
        this.originalLog = console.log;
        console.log = (...args: any[]) => {
            // Keep original behavior (optional, might mess up TUI if visible)
            // this.originalLog(...args); 
            
            // Format args
            const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
            this.log(msg);
        };
        
        // Capture Errors too
        const origErr = console.error;
        console.error = (...args: any[]) => {
            const msg = args.map(a => String(a)).join(' ');
            this.log(`[ERR] ${msg}`);
        };

        // 3. Listen for F12
        // We listen via the app's global key handler
        // Note: You might need to expose term.onKey or handle this in main
    }

    public log(msg: string) {
        const time = new Date().toISOString().split('T')[1].slice(0, 8);
        this.logs.push(`[][${time}] ${msg}`);
        
        // Keep last 20 lines
        if (this.logs.length > 10) this.logs.shift();
        
        this.updateView();
    }

    // src/Terminal/DebugConsole.ts

    public toggle() {
        this.visible = !this.visible;

        if (this.visible) {
            // Safety: Ensure it's not already attached before adding
            // (This prevents the crash if state gets desynced)
            if (this.container.parent) {
                this.container.parent.remove(this.container);
            }

            this.root.add(this.container);
            this.updateView();
        } else {
            // Use the new safe remove method
            this.root.remove(this.container);
        }
    }

    private updateView() {
        if (!this.visible) return;
        this.logText.textContent = this.logs.join('\n');
    }
}