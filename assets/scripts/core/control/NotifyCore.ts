

// 回调对象
export type NotifyCallFunc = (data: any) => void;
export interface NotifyCallbackObj {
    target: any,                // 回调对象，不为null时调用target.callback(xxx)
    callback: NotifyCallFunc,      // 回调函数
}

// @ccclass('NotifyManager')
export class NotifyCore {
    // private static _instance: NotifyManager = new NotifyManager();
    // public static getInstance() {
    //     return this._instance;
    // }

    protected _listener: { [key: string]: NotifyCallbackObj[] } = {}           // 监听者列表

    public addNotifyHandler(key: string, callback: NotifyCallFunc, target?: any): boolean {
        if (callback == null) {
            console.error(`addNotifyHandler error ${key}`);
            return false;
        }
        let rspObject = { target, callback };
        if (null == this._listener[key]) {
            this._listener[key] = [rspObject];
        } else {
            let index = this.getListenersIndex(key, rspObject);
            if (-1 == index) {
                this._listener[key].push(rspObject);
            }
        }
        return true;
    }

    public notify(key:string,data:any=null){

        let listeners = this._listener[key];
        if (null != listeners) {
            for (const rspObject of listeners) {
                console.log(`execute listener cmd ${key}`);
                rspObject.callback.call(rspObject.target ,data);
            }
        }
    }

    public removeNotifyHandler(key: string, callback: NotifyCallFunc, target?: any) {
        if (null != this._listener[key] && callback != null) {
            let index = this.getListenersIndex(key, { target, callback });
            if (-1 != index) {
                this._listener[key].splice(index, 1);
            }
        }
    }

    protected getListenersIndex(key: string, rspObject: NotifyCallbackObj): number {
        let index = -1;
        for (let i = 0; i < this._listener[key].length; i++) {
            let iterator = this._listener[key][i];
            if (iterator.callback == rspObject.callback
                && iterator.target == rspObject.target) {
                index = i;
                break;
            }
        }
        return index;
    }
}
