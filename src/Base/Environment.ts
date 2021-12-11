import * as fs from "fs-extra";
import * as os from "os";

export class Environment {
    static EnvFileLocations = {
        "linux":os.userInfo().homedir+"/.config/",
        "win32":os.userInfo().homedir+"/.config/"
    }

    static save(name:string, data:any) {
        fs.createFileSync(Environment.EnvFileLocations[process.platform]+name)
        fs.writeFileSync(Environment.EnvFileLocations[process.platform]+name,JSON.stringify(data));
    }
    static load<T>(name:string):T {
        return <T>JSON.parse(fs.readFileSync(Environment.EnvFileLocations[process.platform]+name).toString());
    }
    static checkExists(name:string) {
        return fs.existsSync(Environment.EnvFileLocations[process.platform]+name);
    }
}