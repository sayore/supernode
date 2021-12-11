import * as fs from "fs-extra";
import * as os from "os";

export class Environment {
    static EnvFileLocations = {
        "linux":os.userInfo().homedir+"/.config/",
        "win32":os.userInfo().homedir+"/.config/"
    }

    static save(envfilename:string, data:any) {
        fs.createFileSync(Environment.EnvFileLocations[process.platform]+envfilename)
        fs.writeFileSync(Environment.EnvFileLocations[process.platform]+envfilename,JSON.stringify(data));
    }
    static load<T>(envfilename:string):T {
        return <T>JSON.parse(fs.readFileSync(Environment.EnvFileLocations[process.platform]+envfilename).toString());
    }
    static checkExists(envfilename:string) {
        return fs.existsSync(Environment.EnvFileLocations[process.platform]+envfilename);
    }
    static getEnvFilePath(envfilename:string) {
        return Environment.EnvFileLocations[process.platform]+envfilename;
    }
}