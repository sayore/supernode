import * as fs from "fs";
class EventHelper {
    events = {};
    lastExecutionTimes = {};
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