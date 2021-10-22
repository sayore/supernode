export class Activateable {
    Parent: Activateable;
  
    onUse() {
      if (this.Parent)
        this.Parent.onUse();
    }
    onDrop() {
      if (this.Parent)
        this.Parent.onDrop();
    }
  }