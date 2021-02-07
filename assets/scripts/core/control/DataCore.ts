
// import { loadCsv } from '../tool/ccCsvParser';
import { Asset, resources ,loader } from "cc";
import{xxtea} from "../tool/xxtea";

export class DataCore{
    private static _instance: DataCore = new DataCore();
    public static getInstance() {
        return this._instance;
    }

    protected csvNameTab:Array<string> | null = null;
    protected csvData:Map<string,any> = new Map();

    private loadIndex:number = 0;
    protected loadCallBack:Function |null = null;


    // public curSceneName:string = null;

    public initData(tabName:Array<string>,func:Function){
        this.csvNameTab = tabName;
        this.loadCallBack = func;
        for (let index = 0; index < this.csvNameTab.length; index++) {
            const element = this.csvNameTab[index];
            this.loadBytes(element);
        }
    }
    public getTable(tabName:string){
        return this.csvData.get(tabName);
    }
    protected loadBytes(tableName:string){
        let _xxtea = xxtea.getInstance();    //获取实例
        let fileUrl = this.getUrl(tableName);

        loader.load({ url: fileUrl, type: "binary" },(pro:number,total:number)=>{
            
        },(err:any, data :ArrayBuffer) => {
            data = new Uint8Array(data);
            let decrypt_data = _xxtea.decrypt(data ,  this.getPsw()); //解密
            console.log(tableName)
            let tabObj = Config[tableName].decode(decrypt_data);

            console.log(tabObj);
            console.log(tabObj.records[11]);

            this.csvData.set(tableName,tabObj.records);
            this.loadIndex++;
            if(this.loadCallBack){
                this.loadCallBack(this.loadIndex,this.csvNameTab?.length);
            }
        });
    }
    protected getUrl(tableName:string){
        let u:string = cc.url.raw("resources/data/"+tableName+".bytes");
        return u;
    }
    protected getPsw(){
        return "Kp/QG.V|!j7A=utb";
    }

}
