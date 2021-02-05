
import { loadCsv } from '../tool/ccCsvParser';

export class DataCore{
    // private static _instance: DataManager = new DataManager();
    // public static getInstance() {
    //     return this._instance;
    // }

    // private activityData:Array[] = [];
    private startRowIndex:number = 3;
    protected csvNameTab:Array<string> = ["activity"];
    protected csvData:Map<string,any> = new Map();
    private loadIndex:number = 0;
    protected loadCallBack:Function |null = null;


    // public curSceneName:string = null;

    protected initCsv(url:string,key:string){
        loadCsv(url)
        .then((ccCsv:any) => { // 这个函数返回 Promise， Promise 的回调函数参数是一个 CCcsv 对象，其 getParsedData 方法返回被解析的数据（二维数组）
            let csvDataBaseData = ccCsv.getParsedData();
            let data = this.parsingLogicData(csvDataBaseData)
            this.csvData.set(key,data);

            this.loadIndex ++;
            if(this.loadCallBack){
                this.loadCallBack(this.csvNameTab.length,this.loadIndex);
            }
        })
    }
    private parsingLogicData(csvDataBaseData:any){
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

    private getRealData(data,dataType:string){
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