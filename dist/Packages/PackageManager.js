"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PackageManager_pkgFileisRead;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageManager = void 0;
const fs = __importStar(require("fs-extra"));
// require.cache lists all loaded modules in a tree
class PackageManager {
    constructor() {
        _PackageManager_pkgFileisRead.set(this, false);
    }
    packageFileExists() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    readPackageFile() {
        this.pkgJSON = fs.readJSONSync("package.json");
        __classPrivateFieldSet(this, _PackageManager_pkgFileisRead, true, "f");
    }
    info() {
        if (!__classPrivateFieldGet(this, _PackageManager_pkgFileisRead, "f"))
            this.readPackageFile();
        return this.pkgJSON.name + " " + this.pkgJSON.version;
    }
}
exports.PackageManager = PackageManager;
_PackageManager_pkgFileisRead = new WeakMap();
//# sourceMappingURL=PackageManager.js.map