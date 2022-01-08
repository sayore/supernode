
class Event {
    constructor (
        public when:number,
        public isInterval?:{intervalType:IntervalType,intlen:number}) {

    }
}
/*
export class EventHandler {
    var Events:Event = [];
    registerEvent(fc:(any)=>any) {

    }
    load()
}*/

export enum IntervalType {
    Once=-1,
    Interval
}