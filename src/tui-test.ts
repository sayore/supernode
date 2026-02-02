import { Terminal } from './Terminal/Terminal.js';
import { TUIRenderer } from './Terminal/TUIRenderer.js';
import { TemplateParser } from './Terminal/TemplateParser.js';
import { InteractionManager } from './Terminal/InteractionManager.js';
import { TUIElement } from './Terminal/TUIElement.js';
import { DebugConsole } from './Terminal/DebugConsole.js';

const term = new Terminal();
const renderer = new TUIRenderer(term);
const parser = new TemplateParser();

// main.ts
// 1. Define Form
const layout = `
box(dir="column" w="100%" h="100%" bg="#111")
  
  // --- TOP BAR ---
  box(h=3 bg="blue" jc="between" ai="center" padding=1)
    text(color="white") 👤 USER MANAGEMENT
    text(color="#AAA") v1.0.4

  // --- MAIN CONTENT AREA ---
  box(dir="row" flex=1)
    
    // SIDEBAR
    box(w=20 bg="#222" padding=1)
      text(color="white" mb=1) [ MENU ]
      text(color="green") > Edit Profile
      text(color="#666")   Settings
      text(color="#666")   Logs
      text(color="#666")   Logout

    box(dir="row" flex=1)
      // FORM CONTAINER
      box(flex=1 bg="#111" padding=2)
        text(color="yellow" h=2 mb=1) EDIT USER PROFILE
        box(dir="row" h=2 ai="center")
          text(w=15 color="white") First Name:
          input#fname(w=33 h=1 bg="#333" color="white" padding=0) George
        box(dir="row" h=2 ai="center")
          text(w=15 color="white") Last Name:
          input#lname(w=33 h=1 bg="#333" color="white" padding=0)
        box(dir="row" h=2 ai="center")
          text(w=15 color="white") Email Addr:
          input#email(w=33 h=1 bg="#333" color="white" padding=0)
        box(dir="row")
          text(w=15 color="white") Bio:
          input#bio(w=33 h=3 bg="#333" color="#AAA" padding=1) Write something...
        box(mt=1)
          text(color="#555") * Click fields to edit. Press Tab to cycle.
      // FORM CONTAINER
      box#addHere(flex=1 bg="#111" padding=2)
        text(color="yellow" h=2 mb=1) EDIT USER PROFILE
        box(dir="row" h=2 ai="center")
          text(w=15 color="white") First Name:
          input#a(w=33 h=1 bg="#333" color="white" padding=0) George
        box(dir="row" h=2 ai="center")
          text(w=15 color="white") Last Name:
          input#b(w=33 h=1 bg="#333" color="white" padding=0) Blimp!
        box(dir="row" h=2 ai="center")
          text(w=15 color="white") Email Addr:
          input#c(w=33 h=1 bg="#333" color="white" padding=0)
        box(dir="row")
          text(w=15 color="white") Bio:
          input#c(w=33 h=3 bg="#333" color="#AAA" padding=1) Write something...
        box(mt=1)
          text(color="#555") * Click fields to edit. Press Tab to cycle.

  // --- STATUS BAR ---
  box(h=1 bg="#000")
    text(color="white")  Ready.
`;

const root = parser.parse(layout);

const app = new InteractionManager(root, term);

const debug = new DebugConsole(root, app);
console.log("System started. Press F12 for logs.");

// 1. Direct Selection
app.$('#fname')?.focus();

// 2. Event Binding
const btn = app.$('#b');
btn?.onClick(() => {
    console.log("Button clicked! Adding Fish...");
    const fish = new TUIElement('input');
    fish.setStyle({bg:"blue",color:"white"})
    fish.textContent="Fisch1"
    fish.props.text="Fisch2"
    fish.inputValue="fishy 3"
    
    let addHere = app.$('#addHere')
    if(addHere){
        addHere.add(fish);
        //addHere.textContent=(app.$('#fname')?.textContent ?? "FISH")+" Fish"
    }
    else console.log("name nicht gefunden")
    // CRITICAL: Tell Manager to scan for the new element
    app.refreshTabOrder();
    
    // Now you can focus it
    //fish.focus();
});

//console.log("PrtTree")
//console.log(root.printTree(0))
//console.log(btn)

// 3. Render Loop
term.onKey(k => {
    if (k.name === 'escape') process.exit(0);
    // Force a re-render on every keypress for instant feedback

    // Toggle Debugger
    if (k.name === 'f12') {
        debug.toggle();
        renderer.render(root); // Force re-render to show/hide immediately
        return; 
    }

    renderer.render(root);
});

term.onMouse((m) => {
    //console.log("mouse "+JSON.stringify(m));
    if(m.button == "left") { 
        console.log(app.$('#b')?.toString(),m);
    }

    renderer.render(root)
});

// 3. Render Loop
setInterval(() => {
    renderer.render(root);
}, 100);