import fs from "fs-extra";
// require.cache lists all loaded modules in a tree
export class PackageManager {
    pkgJSON;
    #pkgFileisRead = false;
    async packageFileExists() {
        return new Promise((res, rej) => {
            fs.readdir(process.cwd(), (err, files) => {
                files.forEach(file => {
                    if (file == "package.json") {
                        res(true);
                    }
                });
                res(false);
            });
        });
    }
    readPackageFile() {
        this.pkgJSON = fs.readJSONSync("package.json");
        this.#pkgFileisRead = true;
    }
    info() {
        if (!this.#pkgFileisRead)
            this.readPackageFile();
        return this.pkgJSON.name + " " + this.pkgJSON.version;
    }
}
//# sourceMappingURL=PackageManager.js.map