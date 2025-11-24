import { Logging, LogLevel, LogTarget } from "./Base/Logging.js";
import { Trace } from "./Debug/Trace.js";
import { Item } from "./Game/Item.js";
import { System } from "./main.js";

Logging.setLogTarget(LogLevel.Testing , LogTarget.All);
Logging.log("Test",LogLevel.Testing);
Logging.log(["Test",5,undefined])


Logging.log(JSON.stringify(new Item({
    Id:0,
    CanonicalId:"air",
    Name:"Fish"
})));


async function test() {
  await Logging.log("Send out Test notification")
  await System.Notification.send("Test","Test")
  await Logging.log("Done")
}
  
await test();