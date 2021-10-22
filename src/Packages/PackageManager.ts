import * as fs from "fs-extra";
import { IPackageJSON } from "./IPackageJSON";

// require.cache lists all loaded modules in a tree

export class PackageManager {
    pkgJSON: IPackageJSON;
    #pkgFileisRead = false;

    async packageFileExists(): Promise<boolean> {
        return new Promise((res, rej) => {
            fs.readdir(process.cwd(), (err, files) => {
                files.forEach(file => {
                    if (file == "package.json") {
                        res(true);
                    }
                });
                res(false);
            });
        })
    }

    readPackageFile() {
        this.pkgJSON = <IPackageJSON>fs.readJSONSync("package.json");
        this.#pkgFileisRead=true;
    }

    info() {
        if(!this.#pkgFileisRead)
            this.readPackageFile()
        return this.pkgJSON.name+" "+this.pkgJSON.version
    }
}