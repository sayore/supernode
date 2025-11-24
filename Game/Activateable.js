export class Activateable {
    Parent;
    onUse() {
        if (this.Parent)
            this.Parent.onUse();
    }
    onDrop() {
        if (this.Parent)
            this.Parent.onDrop();
    }
}
//# sourceMappingURL=Activateable.js.map