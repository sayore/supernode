import { ExpressApplication } from "../Base/ExpressApplication";

class _ExpressApplicationHandler extends ExpressApplication
{
    private static _instance: _ExpressApplicationHandler;

    private constructor()
    {
        super(80);
        
    }

    registerSubApp(appl : ExpressApplication) {
        this.app.use(appl.getMiddleware());
    }

    async run() {
        this.app.listen(this.port);
        console.log("ExpressApplicationHandler startet on Port 80")
    }

    public static get Instance()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}

export let ExpressApplicationHandler = _ExpressApplicationHandler.Instance;