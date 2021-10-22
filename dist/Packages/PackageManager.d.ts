import { IPackageJSON } from "./IPackageJSON";
export declare class PackageManager {
    #private;
    pkgJSON: IPackageJSON;
    packageFileExists(): Promise<boolean>;
    readPackageFile(): void;
    info(): string;
}
