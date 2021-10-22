"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activateable = void 0;
class Activateable {
    onUse() {
        if (this.Parent)
            this.Parent.onUse();
    }
    onDrop() {
        if (this.Parent)
            this.Parent.onDrop();
    }
}
exports.Activateable = Activateable;
//# sourceMappingURL=Activateable.js.map