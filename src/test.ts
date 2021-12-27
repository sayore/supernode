import { Logging, LogLevel, LogTarget } from "./Base/Logging";
import { Item } from "./Game/Item";

Logging.loggingActiveOn.push({ll:LogLevel.Testing , to:LogTarget.Textfile});
Logging.log("Test",LogLevel.Testing);
Logging.log(["Test",5,undefined])
Logging.log(JSON.stringify(new Item({
    Id:0,
    CanonicalId:"air",
    Name:"Fish"
})))
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