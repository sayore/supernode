import { Logging, LogLevel, LogTarget } from "./Base";
import { Trace } from "./Debug";
import { Item } from "./Game";
import { System } from "./main";

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