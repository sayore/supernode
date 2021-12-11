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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const fs = __importStar(require("fs-extra"));
const os = __importStar(require("os"));
class Environment {
    static save(name, data) {
        fs.createFileSync(Environment.EnvFileLocations[process.platform] + name);
        fs.writeFileSync(Environment.EnvFileLocations[process.platform] + name, JSON.stringify(data));
    }
    static load(name) {
        return JSON.parse(fs.readFileSync(Environment.EnvFileLocations[process.platform] + name).toString());
    }
}
exports.Environment = Environment;
Environment.EnvFileLocations = {
    "linux": os.userInfo().homedir + "/.config/",
    "win32": os.userInfo().homedir + "/.config/"
};
//# sourceMappingURL=Environment.js.map