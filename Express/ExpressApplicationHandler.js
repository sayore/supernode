import { ExpressApplication } from "../Base/ExpressApplication.js";
class _ExpressApplicationHandler extends ExpressApplication {
    static _instance;
    constructor() {
        super(80);
    }
    registerSubApp(appl) {
        this.app.use(appl.getMiddleware());
    }
    async run() {
        this.app.listen(this.port);
        console.log("ExpressApplicationHandler startet on Port 80");
    }
    static get Instance() {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}
export let ExpressApplicationHandler = _ExpressApplicationHandler.Instance;
//# sourceMappingURL=ExpressApplicationHandler.js.map