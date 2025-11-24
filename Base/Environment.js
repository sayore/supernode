import * as fs from "fs-extra";
import * as os from "os";
export class Environment {
    static EnvFileLocations = {
        "linux": os.userInfo().homedir + "/.config/",
        "win32": os.userInfo().homedir + "/.config/"
    };
    static save(envfilename, data) {
        fs.createFileSync(Environment.EnvFileLocations[process.platform] + envfilename);
        fs.writeFileSync(Environment.EnvFileLocations[process.platform] + envfilename, JSON.stringify(data));
    }
    static load(envfilename) {
        return JSON.parse(fs.readFileSync(Environment.EnvFileLocations[process.platform] + envfilename).toString());
    }
    static checkExists(envfilename) {
        return fs.existsSync(Environment.EnvFileLocations[process.platform] + envfilename);
    }
    static getEnvFilePath(envfilename) {
        return Environment.EnvFileLocations[process.platform] + envfilename;
    }
}
//# sourceMappingURL=Environment.js.map