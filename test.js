"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logging_1 = require("./Base/Logging");
const Item_1 = require("./Game/Item");
Logging_1.Logging.loggingActiveOn.push({ ll: Logging_1.LogLevel.Testing, to: Logging_1.LogTarget.Textfile });
Logging_1.Logging.log("Test", Logging_1.LogLevel.Testing);
Logging_1.Logging.log(["Test", 5, undefined]);
Logging_1.Logging.log(JSON.stringify(new Item_1.Item({
    Id: 0,
    CanonicalId: "air",
    Name: "Fish"
})));
/*
process.stdout.write('\n\n\n\n\n\n\n\n\n')
process.stdout.cursorTo(0, 0, () => {
    process.stdout.clearScreenDown(() => {
        process.stdout.cursorTo(7, 5, () => {
            process.stdout.write('1000')
            process.stdout.cursorTo(2, 10, () => {
                process.stdout.write('3999')
                process.stdout.cursorTo(10, 9, () => {
                    process.stdout.write('2000')
                    process.stdout.cursorTo(12, 0)
                    console.log("\n".repeat(process.stdout.rows))
                })
            })
        })
    })
});*/
/** ENVIRONMENT TEST */
/*import { Environment } from "./Base/Environment";
import * as fs from "fs-extra";


Environment.save("testEnvironment.json",{hello:"World!"})*/ 
//# sourceMappingURL=test.js.map