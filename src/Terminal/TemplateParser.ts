import { TUIElement, TUIStyle } from './TUIElement.js';

export class TemplateParser {
    
    /**
     * Parses a Pug-like string into a TUIElement tree.
     * @param template The multi-line string
     * @returns The root TUIElement
     */
    public parse(template: string): TUIElement {
        // STAGE 1: Remove Block Comments (/* ... */)
        // (This remains safe because block comments rarely appear inside attributes in this syntax)
        let cleanTemplate = template.replace(/\/\*[\s\S]*?\*\//g, '');

        // STAGE 2: Process Lines (Smart Inline Comments)
        const lines = cleanTemplate.split('\n')
            .map(rawLine => {
                // Regex Breakdown:
                // 1. Quoted Strings:  (["']) (?:\\.|[^\\])*? \1
                //    Matches " or ' -> anything escaped OR not a backslash -> matching end quote
                // 2. Comments:        \/\/.*$
                //    Matches // until end of line
                
                const regex = /((["'])(?:\\.|[^\\])*?\2)|(\/\/.*$)/g;
                
                return rawLine.replace(regex, (match, quotedString, _quote, comment) => {
                    // If we matched a string (e.g. "http://google.com"), KEEP IT.
                    if (quotedString) return quotedString;
                    
                    // If we matched a comment (e.g. // TODO), DELETE IT.
                    return ''; 
                }).trimEnd();
            })
            .filter(line => line.trim().length > 0);
        
        const rootStack: { node: TUIElement, indent: number }[] = [];
        let trueRoot: TUIElement | null = null;

        for (const line of lines) {
            const { indent, content } = this.getIndent(line);
            const node = this.parseLine(content);
            
            // --- TREE BUILDING LOGIC ---
            
            if (rootStack.length === 0) {
                // First element
                trueRoot = node;
                rootStack.push({ node, indent });
            } else {
                // Find parent based on indentation
                // We keep popping the stack until we find a node with LESS indent than current
                while (rootStack.length > 0) {
                    const last = rootStack[rootStack.length - 1];
                    if (last.indent < indent) {
                        // Found the parent!
                        last.node.add(node);
                        break;
                    } else {
                        // This element is a sibling or uncle, pop the stack
                        rootStack.pop();
                    }
                }
                // Push current as potential parent for next lines
                rootStack.push({ node, indent });
            }
        }

        if (!trueRoot) throw new Error("Empty template provided");
        return trueRoot;
    }

    /**
     * Returns the indentation level (number of spaces) and the trimmed content
     */
    private getIndent(line: string) {
        const match = line.match(/^(\s*)(.*)/);
        const spaces = match ? match[1].length : 0;
        const content = match ? match[2] : '';
        return { indent: spaces, content };
    }

    /**
     * Parses: "box#main.class(w='100%') Text Content"
     */
    // Inside TemplateParser -> parseLine method

    private parseLine(line: string): TUIElement {
        // 1. Separate Tag/ID/Classes from Attributes
        const attrStart = line.indexOf('(');
        const hasAttrs = attrStart > -1;
        
        let rawTag = '';
        let attrString = '';
        let textPart = '';

        if (hasAttrs) {
            // Case A: attributes exist -> "div(class='a') Hello World"
            rawTag = line.substring(0, attrStart).trim();
            const attrEnd = line.lastIndexOf(')');
            
            // Extract attributes between ( )
            attrString = line.substring(attrStart + 1, attrEnd);
            
            // Extract text AFTER the closing )
            if (attrEnd < line.length - 1) {
                textPart = line.substring(attrEnd + 1).trim();
            }
        } else {
            // Case B: no attributes -> "div Hello World" or just "div"
            // We split by the first space to separate tag from text
            const firstSpace = line.indexOf(' ');
            if (firstSpace > -1) {
                rawTag = line.substring(0, firstSpace).trim();
                textPart = line.substring(firstSpace + 1).trim();
            } else {
                rawTag = line.trim();
            }
        }

        // --- Tag, ID, Class Parsing (Same as before) ---
        const tagMatch = rawTag.match(/^[^.#]+/);
        const tagName = tagMatch ? tagMatch[0] : 'box';

        const idMatch = rawTag.match(/#([^.#]+)/);
        const elementId = idMatch ? idMatch[1] : '';

        const classMatches = rawTag.match(/\.[^.#]+/g);
        const classes = classMatches ? classMatches.map(c => c.substring(1)) : [];

        // 2. Parse Attributes
        const style: any = {};
        const props: any = {};
        
        if (attrString) {
            this.parseAttributes(attrString, style, props);
        }

        // 3. Create Element & Assign Data
        const el = new TUIElement(tagName, style);
        el.props = props; // Attach the props!
        
        if (elementId) el.id = elementId;
        if (classes.length > 0) el.classList = classes;

        // 4. ✅ CRITICAL FIX: Assign the text content
        if (textPart) {
            // We assign to BOTH places to be safe. 
            // The renderer likely uses .textContent, but your logic might use .props.text
            el.textContent = textPart; 
            el.props.text = textPart || "";
        }
        
        return el;
    }

    // Helper to keep parseLine clean
    private parseAttributes(attrString: string, style: any, props: any) {
         // Use a regex to match key="value" or key=123
         const regex = /([a-zA-Z0-9-_]+)=(?:"([^"]*)"|([^ ]+))/g;
         let match;
         
         while ((match = regex.exec(attrString)) !== null) {
             const key = match[1];
             const val = match[2] || match[3];
             this.mapAttributeToStyle(key, val, style, props);
         }
    }

    /**
     * Maps shorthand attributes (pug style) to your internal TUIStyle
     */
    private mapAttributeToStyle(key: string, val: string, style: TUIStyle, props: object) {
        // Numeric conversion helper
        const parseNum = (v: string) => v.endsWith('%') ? v : parseInt(v);

        switch (key) {
            case 'w':
            case 'width':
                style.width = parseNum(val);
                break;
            case 'h':
            case 'height':
                style.height = parseNum(val);
                break;
            case 'bg':
                style.bg = val;
                break;
            case 'color':
                style.color = val;
                break;
            case 'p':
            case 'padding':
                style.padding = parseInt(val);
                break;
            case 'dir':
            case 'direction':
                style.flexDirection = val === 'row' ? 'row' : 'column';
                break;
            case 'border':
                 style.border = (val === 'true' || val === '1');
                 break;
            case 'justify': 
            case 'jc':
                // Fix: Cast val to any
                style.justifyContent = val as any; 
                break;
            case 'flex':
            case 'grow':
                style.flexGrow = parseFloat(val);
                break;
                
            case 'shrink':
                style.flexShrink = parseFloat(val);
                break;
            case 'align':
            case 'ai':
                // Fix: Cast val to any
                style.alignItems = val as any;
                break;

            // --- POSITIONING ---
            case 'pos':
            case 'position':
                // Fix: Cast val to any
                style.position = val as any;
                break;
            case 'top': style.top = parseInt(val); break;
            case 'left': style.left = parseInt(val); break;
            case 'right': style.right = parseInt(val); break;
            case 'bottom': style.bottom = parseInt(val); break;

            // --- GAP ---
            case 'gap': style.gap = parseInt(val); break;
            // ✅ NEW: Default case for generic props
            default:
                // If it's not a style, it's a prop! (e.g. text="Hello", src="...", value="123")
                props[key] = val; 
                break;
        }
    }
}