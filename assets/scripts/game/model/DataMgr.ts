
import { DataCore } from '../../core/control/DataCore';

export class DataMgr extends DataCore{
    private static _instance: DataMgr = new DataMgr();
    public static getInstance() {
        return this._instance;
    }

    public getTable(key:string){
        //返回游戏列表数据:[行Array,从0开始记](列Map,通过key获取,data与表中标明数据类型一样)
        return this.csvData.get(key);
    }

    public loadAllData(finishCallBack:any,csvNameTab:Array<string> = ["activity"]) {
        // Your initialization goes here.
        // this.initCsv('data/activity',this.activityData)// 这里是你要加载的 csv 文件的路径 （相对于项目 resources 目录的路径）
        this.csvNameTab = csvNameTab;
        this.loadCallBack = finishCallBack
        for (var i = 0; i < this.csvNameTab.length; i++) {
            this.initCsv('data/'+this.csvNameTab[i],this.csvNameTab[i])// 这里是你要加载的 csv 文件的路径 （相对于项目 resources 目录的路径）
        }
    }

}



