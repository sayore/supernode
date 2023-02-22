"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const fs = __importStar(require("fs"));
class EventHelper {
    constructor() {
        this.events = {};
        this.lastExecutionTimes = {};
    }
    // schedule a function to be called at a specific interval
    schedule(eventName, fn, interval) {
        this.clear(eventName);
        this.events[eventName].timeout = setInterval(() => {
            this.lastExecutionTimes[eventName] = Date.now();
            fn();
        }, interval);
    }
    // clear a previously scheduled event
    clear(eventName) {
        if (this.events[eventName]) {
            clearInterval(this.events[eventName].timeout);
            delete this.events[eventName];
        }
    }
    // retroactively execute an event based on a given timestamp
    execute(eventName, timestamp) {
        if (!this.lastExecutionTimes[eventName]) {
            // if the event has never been executed before, start from now
            this.lastExecutionTimes[eventName] = Date.now();
        }
        const interval = this.events[eventName] ? this.events[eventName]._idleTimeout : 0;
        const elapsedTime = timestamp - this.lastExecutionTimes[eventName];
        const numExecutions = Math.floor(elapsedTime / interval);
        for (let i = 0; i < numExecutions; i++) {
            this.events[eventName].fn();
        }
    }
    // load the last execution times from a file
    load() {
        try {
            this.lastExecutionTimes = JSON.parse(fs.readFileSync("last-execution-times.json", "utf8"));
        }
        catch (err) {
            console.error(err);
        }
    }
    // save the last execution times to a file
    save() {
        try {
            fs.writeFileSync("last-execution-times.json", JSON.stringify(this.lastExecutionTimes));
        }
        catch (err) {
            console.error(err);
        }
    }
}
//# sourceMappingURL=EventHelper.js.map