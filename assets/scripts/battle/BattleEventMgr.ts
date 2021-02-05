import { _decorator, Component, Node, Enum } from 'cc';

export class BattleEventMgr {
    private static _instance: BattleEventMgr = new BattleEventMgr()

     
    public static getInstance() {
        return this._instance;
    }

    // public static EventName = {
    //     ""
    // }


    private _events: {[eventName: string]: [[Function, any]]} = {}
    
    addEvent(eventName: string, eventFunc: Function, target: any) {
        if (!this._events[eventName]) {
            this._events[eventName] = [[
                eventFunc,
                target
            ]]
        } else {
            this._events[eventName].push([
                eventFunc,
                target
            ])
        }
    }

    removeEvent(eventName: string, target: any): void {
        let eventList = this._events[eventName];
        if(eventList) {
            for (var i = 0; i < eventList.length; i++) {
                if (eventList[i][1] == target) {
                    eventList.splice(i, 1);
                    break;// 理论上一个target只会有一个eventName对应事件，存在多个表示逻辑有问题。为了加快战斗逻辑效率，不做冗余判断
                }
            }
        }
    }
    
    removeEventByTarget(target: any): void {
        for (let eventName in this._events) {
            let eventList = this._events[eventName];
            for (var i = 0; i < eventList.length; i++) {
                if (eventList[i][1] == target) {
                    eventList.splice(i, 1);
                    break;// 理论上一个target只会有一个eventName对应事件，存在多个表示逻辑有问题。为了加快战斗逻辑效率，不做冗余判断
                }
            }
        }
    }

    removeAll() {
        this._events = {};
    }

    dispatchEvent(eventName: string) {
        let eventList = this._events[eventName];
        if(eventList) {
            for (var i = 0; i < eventList.length; i++) {
                eventList[i][0].apply(eventList[i][1], arguments);
            }
        }
    }
}
