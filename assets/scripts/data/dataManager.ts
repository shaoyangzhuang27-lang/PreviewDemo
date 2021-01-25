
import { loadCsv } from '../base/ccCsvParser';

export class DataManager{
    private static _instance: DataManager = new DataManager();
    public static getInstance() {
        return this._instance;
    }

    private activityData:Array[] = [];
    private startRowIndex:number = 3;
    private csvNameTab:Array[] = ["activity"];
    private csvData:Map = new Map();
    private loadIndex:number = 0;
    private loadCallBack:Function = null;

    public getTable(key){
        //返回游戏列表数据:[行Array,从0开始记](列Map,通过key获取,data与表中标明数据类型一样)
        return csvData.get(key);
    }

    public loadAllData(finishCallBack) {
        // Your initialization goes here.
        // this.initCsv('data/activity',this.activityData)// 这里是你要加载的 csv 文件的路径 （相对于项目 resources 目录的路径）
        this.loadCallBack = finishCallBack
        for (var i = 0; i < this.csvNameTab.length; i++) {
            this.initCsv('data/'+this.csvNameTab[i],this.csvNameTab[i])// 这里是你要加载的 csv 文件的路径 （相对于项目 resources 目录的路径）
        }
    }

    private initCsv(url,key){
        loadCsv(url)
        .then((ccCsv) => { // 这个函数返回 Promise， Promise 的回调函数参数是一个 CCcsv 对象，其 getParsedData 方法返回被解析的数据（二维数组）
            let csvDataBaseData = ccCsv.getParsedData();
            let data = this.parsingLogicData(csvDataBaseData)
            this.csvData.set(key,data);

            this.loadIndex ++;
            if(this.loadCallBack){
                this.loadCallBack(this.csvNameTab.length,this.loadIndex);
            }
        })
    }
    private parsingLogicData(csvDataBaseData){
        let logicData = []
        for (var i = 0; i < csvDataBaseData.length - this.startRowIndex; ++i) {
            logicData.push(new Map())
            for (var j = 0; j < csvDataBaseData[i].length; ++j) {
                let key = csvDataBaseData[0][j]
                let dataType = csvDataBaseData[1][j]
                let data = csvDataBaseData[i][j]
                logicData[i].set(key,this.getRealData(data,dataType))
            }
        }
        return logicData
    }

    private getRealData(data,dataType){
        if(dataType == "init32"){
            return Number(data)
        }else if(dataType == "string"){
            return data
        }else if(dataType == "list<init32>"){
            let dataArrTemp = data.split(","); 
            let dataArr = []
            for (var i = 0; i < dataArrTemp.length; i++) {
                dataArr.push(Number(dataArrTemp[i]))
            }
            return dataArr
        }
    }

}




    // getRowByIndex(rowIndex){
    //     return this.activityData[rowIndex]
    // }
    // getRowLenght(){
    //     return this.activityData.length
    // }
    // getColumnIndexByKey(key){
    //     for (var i = 0; i < this.activityData[0].length; i++) {
    //         if(this.activityData[0][i] == key){
    //             return i
    //         }
    //     }
    // }
    // getItem(rowIndex,key){
    //     let columnIndex = this.getColumnIndexByKey(key)
    //     let dataType = this.activityData[1][columnIndex]
    //     let data = this.activityData[rowIndex+startRowIndex][columnIndex]
    //     if(dataType == "init32"){
    //         return Number(data)
    //     }elseif(dataType == "string"){
    //         return data
    //     }elseif(dataType == "list<init32>"){
    //         let dataArrTemp = data.split(","); 
    //         let dataArr = []
    //         for (var i = 0; i < dataArrTemp.length; i++) {
    //             dataArr.push(Number(dataArrTemp[i]))
    //         }
    //         return dataArr
    //     }
    //     return data
    // }
    // getColumnTypeByKey(key){
    //     let columnIndex = this.getColumnIndexByKey(key)
    //     return this.activityData[1][columnIndex]
    // }


    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }