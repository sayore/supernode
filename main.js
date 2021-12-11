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
exports.Database = exports.Express = exports.Discord = exports.Packages = exports.Math = exports.Game = exports.String = exports.Base = void 0;
exports.Base = __importStar(require("./Base/mod"));
exports.String = __importStar(require("./String/mod"));
exports.Game = __importStar(require("./Game/mod"));
exports.Math = __importStar(require("./Math/mod"));
exports.Packages = __importStar(require("./Packages/mod"));
exports.Discord = __importStar(require("./Discord/mod"));
exports.Express = __importStar(require("./Express/mod"));
exports.Database = __importStar(require("./Database/mod"));
//export * as Server from './Server/mod' 
//# sourceMappingURL=main.js.map