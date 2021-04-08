
import { CircleCollider2D, resources } from 'cc';

export class BattleResMgr {
    private static _instance: BattleResMgr = new BattleResMgr();
    public static getInstance() {
        return this._instance;
    }

    private _tmpResMap: {[path: string]: any} = {}

    isLoaded(path: string): boolean {
        if(resources.get(path)) {
            return true;
        }
        return false;
    }

    getRes(path: string): any {
        return resources.get(path);
    }

    removeRes(path: string) {
        if(this._tmpResMap[path]) {
            this.removeTmpRes(path);
        } else {
            resources.release(path);
        }
        
    }

    removeTmpRes(path: string) {
        this._tmpResMap[path] = undefined;
        delete this._tmpResMap[path];
        resources.release(path);
    }

    load(path: string, cb: (err: any, obj: any)=>void) {
        let res = this.getRes(path);
        if(res) {
            cb(null, res);
            return;
        }

        resources.load(path, cb);
    }

    loadTmp(path: string, cb: (err: any, obj: any)=>void) {
        // 必须是之前其他模块没加载过的
        let res = this.getRes(path);
        if(res) {
            cb(null, res);
            return;
        }

        // 如果出现这种情况，代码出问题了
        if (this._tmpResMap[path]) {
            // TODO
            // cb(null, undefined);
            return
        }

        resources.load(path, (err: any, obj: any)=>{
            if (err) {
                console.error(err);
            } else {
                this._tmpResMap[path] = obj;
            }
            cb(err, obj);
        })

    }

    startLoad(loadResList: Array<any>, onProgress: (c: number, t: number)=>void, onLoaded: ()=>void) {
        let c = 0;
        for(let v of loadResList) {
            this.loadTmp(v, (err, obj)=>{
                c++;
                onProgress(c, loadResList.length);
                if (c == loadResList.length) {
                    onLoaded();
                }
            });
        }
    }

    releaseAllTmp() {
        for(let v in this._tmpResMap) {
            this.removeTmpRes(v);
        }
    }
}
