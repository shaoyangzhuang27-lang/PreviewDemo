
// import { loadCsv } from '../tool/ccCsvParser';
import { Asset, resources ,loader, assetManager } from "cc";
import{xxtea} from "../tool/xxtea";

export class ValueCore{

    protected csvNameTab:Array<string> | null = null;
    protected csvData:Map<string,any> = new Map();

    private _loadIndex:number = 0;
    protected loadCallBack:Function |null = null;


    protected initData(tabName:Array<string>,func:Function){
        this.csvNameTab = tabName;
        this.loadCallBack = func;
        for (let index = 0; index < this.csvNameTab.length; index++) {
            const element = this.csvNameTab[index];
            this.loadBytes(element);
        }
    }
    protected getTable(tabName:string){
        return this.csvData.get(tabName);
    }
    protected loadBytes(tableName:string){
        let _xxtea = xxtea.getInstance();    //获取实例
        let fileUrl = this.getUrl(tableName);

        loader.load({ url: fileUrl, type: "binary" },(pro:number,total:number)=>{
            
        },(err:any, data :ArrayBuffer) => {
            data = new Uint8Array(data);
            let decrypt_data = _xxtea.decrypt(data ,  this.getPsw()); //解密
            let tabObj = Config[tableName].decode(decrypt_data);

            // console.log("table "+tableName+":");
            // console.log(tabObj.records);

            this.csvData.set(tableName,tabObj);
            this._loadIndex++;
            if(this.loadCallBack){
                this.loadCallBack(this._loadIndex,this.csvNameTab?.length);
            }
        });
    }
    protected getUrl(tableName:string){
        // let u:string = assetManager.utils.getUuidFromURL("resources/data/"+tableName+".bytes");
        // let u:string = cc.url.raw("resources/data/"+tableName+".bytes");

        let info = assetManager.resources?.getInfoWithPath("./data/"+tableName);
        let url = assetManager.utils.getUrlWithUuid(info?.uuid as string,{isNative: true, nativeExt: '.bytes'});
        return url;

    }
    protected getPsw(){
        return "Kp/QG.V|!j7A=utb";
    }

}
