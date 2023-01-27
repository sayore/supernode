"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntervalType = void 0;
class Event {
    constructor(when, isInterval) {
        this.when = when;
        this.isInterval = isInterval;
    }
}
/*
export class EventHandler {
    var Events:Event = [];
    registerEvent(fc:(any)=>any) {

    }
    load()
}*/
var IntervalType;
(function (IntervalType) {
    IntervalType[IntervalType["Once"] = -1] = "Once";
    IntervalType[IntervalType["Interval"] = 0] = "Interval";
})(IntervalType = exports.IntervalType || (exports.IntervalType = {}));
//# sourceMappingURL=Event.js.map