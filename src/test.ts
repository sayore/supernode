import { Environment } from "./Base/Environment";
import * as fs from "fs-extra";


Environment.save("testEnvironment.json",{hello:"World!"})