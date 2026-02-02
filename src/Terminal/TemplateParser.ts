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
            const parsed = this.parseLine(content);
            
            // Create the node
            const node = new TUIElement(parsed.tagName, parsed.style);
            if (parsed.id) node.id = parsed.id;
            if (parsed.text) node.textContent = parsed.text;
            
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
    private parseLine(lineStr: string) {
        // Regex Breakdown:
        // ^([\w-]+)       -> Tag name (start of line)
        // ([#.\w-]*)      -> Optional ID/Classes string (e.g. #id.class.class)
        // (?:\(([^)]+)\))? -> Optional Attributes inside parens (captured group 3)
        // (?:\s+(.*))?    -> Optional Text content after space (captured group 4)
        
        const regex = /^([\w-]+)([#.\w-]*)(?:\(([^)]+)\))?(?:\s+(.*))?$/;
        const match = lineStr.match(regex);

        if (!match) {
            // Fallback for plain text or errors
            return { tagName: 'text', style: {}, text: lineStr };
        }

        const [_, tagName, idClassStr, attrStr, textContent] = match;
        
        const style: TUIStyle = {};

        const idMatch = idClassStr ? idClassStr.match(/#([\w-]+)/) : null;
        const parsedId = idMatch ? idMatch[1] : '';

        // 1. Parse Attributes (w="100%" color="red")
        if (attrStr) {
            // Match key="value" or key='value' or key=value
            const attrRegex = /([\w-]+)=["']?([^"'\s]+)["']?/g;
            let attrMatch;
            while ((attrMatch = attrRegex.exec(attrStr)) !== null) {
                const key = attrMatch[1];
                const val = attrMatch[2];
                this.mapAttributeToStyle(key, val, style);
            }
        }

        // 2. Parse Text
        let finalTagName = tagName;
        let finalText = textContent || '';
        
        // Convenience: If tag is 'text', content is implicit?
        // Actually pug treats space after tag as content.

        return { tagName: finalTagName, id: parsedId, style, text: finalText };
    }

    /**
     * Maps shorthand attributes (pug style) to your internal TUIStyle
     */
    private mapAttributeToStyle(key: string, val: string, style: TUIStyle) {
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
            // Add more shorthands here!
        }
    }
}