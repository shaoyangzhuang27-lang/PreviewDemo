import { assetManager,AssetManager,Prefab,resources,instantiate, director, SpriteFrame } from 'cc';

export enum ResType{
    screen,//场景预加载,加载完成后,切换场景自动释放
    prefab,//当前场景必要资源,切换场景后手动释放
    spriteframes,//每个场景都需要使用到的通用资源,加载一次,后期不做释放操作
    single//临时使用资源,随用随删,不在场景加载界面中使用
}

interface LoadData{
    resUrl:string,  //资源路径
    resType:ResType,//资源类型
    isRef:boolean,  //是否控制引用
    res:any,        //资源对象
    resName:string, //资源名
    haveloaded:boolean,//是否加载完成

}
//push资源去重--完成
//资源整理获取接口--未完成

export class ResCore{

    // protected prefab_ui:any = null;
    // protected prefab_city:any = null;
    // protected loadArr:Array<[string,ResType,boolean,any,string]> = [];
    protected _loadArr:Array<LoadData> = [];
    protected _tempArr:Map<string,Map<string,any>> =  new Map();


    public getSpriteFrameByName(name:string){
        for (let i = 0; i < this._loadArr.length; i++) {
            let loadData = this._loadArr[i];
            if(loadData.resType == ResType.spriteframes && loadData.res.get(name)){
                return loadData.res.get(name) as SpriteFrame
            }
        }
        return null;
    }
    public getPrefabByUrl(url:string){
        
        for (let i = 0; i < this._loadArr.length; i++) {
            let loadData = this._loadArr[i];
            if(loadData.resType == ResType.prefab && loadData.resUrl == url){
                return loadData.res as Prefab;
            }
        }
        return null;
    }
    public loadSpriteFrame(spriteFrameName:string,com_callback:(err: Error | null, data: SpriteFrame | null) => void){
        
        let strs = spriteFrameName.split("/");
        let realName = spriteFrameName;
        if(strs.length > 1){
            realName = strs[strs.length-2];
        }

        let spriteFrame = this.getSpriteFrameByName(realName);
        if(spriteFrame){
            com_callback(null,spriteFrame);
        }else{
            resources.load(spriteFrameName,SpriteFrame,(err:any,obj:SpriteFrame)=>{
                com_callback(null,obj);
            });
        }
    }
    public loadPrefab(url:string,com_callback:(err: Error | null, data: Prefab | null) => void){
        let prefab = this.getPrefabByUrl(url)
        if(prefab){
            com_callback(null,prefab);
        }else{
            resources.load(url,Prefab,(err:any,obj:Prefab)=>{
                com_callback(null,obj);
            });
        }
    }
    /*
    * @method loadTempRes
    * @for ResMgr
    * @param{string}resUrl 资源url
    * @param{(data: any)=>void}com_callback 回调函数,返回资源内容
    * @param{string}key 当前场景下资源key,一般情况是每个使用对象对应一个key
    */
    public loadTempRes(resUrl:string,com_callback:(data: any)=>void, key:string = "default"){
        // let data = this.tempArr.get(resUrl);

        resources.load(resUrl,(err:any, obj:any) => {
            let data = this._tempArr.get(resUrl);
            if(!data){
                let map:Map<string,any> = new Map();
                this._tempArr.set(resUrl,map);

                map.set(key,obj);
                data = map;
            }

            let dataChild = data.get(key);
            if(!dataChild){
                dataChild.set(key,obj);
                obj.addRef();
            }else{
                // 重复加载
                // console.log("您重复加载资源,请检查代码")
            }

            com_callback(obj);
        });
    }
    
    /*
    * @method releaseTempRes
    * @for ResMgr
    * @param{string}resUrl 资源url
    * @param{string}key 当前场景下资源key,一般情况是每个场景对应一个key
    * 只要在场景或所在对象里有调用上面的loadTempRes,就需要在当前场景或所在对象里的onDistroy方法里调用releaseTempRes方法来释放资源
    */
    public releaseTempRes(resUrl:string,key:string = "default"){
        
        let data = this._tempArr.get(resUrl);
        if(data){
            let dataChild = data.get(key)
            if(dataChild){
                dataChild.decRef();
                data.delete(key);
            }else{
                //多余删除
                // console.log("您重复删除资源,请检查代码")
            }
        }
    }


    public startLoad(pro_callback:any,com_callback:any){
        let load_fun = (loadArr:Array<LoadData>,index:number)=> {
            let loadData = this._loadArr[index];

            //如果已经加载,不重复加载---
            if(loadData.haveloaded){
                this._judgeComplete(index,com_callback,load_fun);
                return;
            }

            switch(loadData.resType){
                case ResType.screen:
                    
                    director.preloadScene(loadData.resUrl,(finished:number,total:number)=>{
                        pro_callback(finished + total*index,total*this._loadArr.length,loadData.resName);
                    },(err, obj) => {
                        this._judgeComplete(index,com_callback,load_fun);
                        // this.loadArr.splice(index, 1);
                    })

                break;
                case ResType.prefab:
                    
                    resources.load(loadData.resUrl,(finished,total)=>{
                        pro_callback(finished + total*index,total*this._loadArr.length,loadData.resName);
                    },
                    (err, obj) => {
                        loadData.res = obj;
                        if(loadData.isRef){
                            loadData.res.addRef();
                        }

                        this._judgeComplete(index,com_callback,load_fun);
                    });
                break;
                case ResType.spriteframes:
                    
                    resources.loadDir(loadData.resUrl,SpriteFrame,(finished,total)=>{
                        pro_callback(finished + total*index,total*this._loadArr.length,loadData.resName);
                    },(err, obj:SpriteFrame[])=>{
                        console.log("fjfjfjfj::");
                        console.log(obj);
                        let resMap:Map<string,SpriteFrame> = new Map<string,SpriteFrame>();
                        for (let i = 0; i < obj.length; i++) {
                            let spriteFrame = obj[i];
                            spriteFrame.addRef();
                            resMap.set(spriteFrame.name,spriteFrame);
                        }
                        loadData.res = resMap;

                        this._judgeComplete(index,com_callback,load_fun);
                    });

                break;
            }
        }
  
        load_fun(this._loadArr,0);
        
    }

    private _judgeComplete(index:number,com_callback:any,goon_callback:any){
        this._loadArr[index].haveloaded = true;
        index++;
        if(this._loadArr.length == index){
            com_callback(this._loadArr);
        }else{
            goon_callback(this._loadArr,index);
        }
    }

    
    protected pushRes(resUrl:string,resType:ResType,isRef:boolean,res:any = null,resName:string = ""){
        let item = this.getLoadArrItem(resUrl)
        if(!item){
            let d:LoadData = {
                resUrl:resUrl,
                resType:resType,
                isRef:true,
                res:null,
                resName:resName,
                haveloaded:false,
            }
            this._loadArr.push(d);
        }
    }
    protected popRes(resUrl:string){
        this.removeLoadArrItem(resUrl);
    }

    private getLoadArrItem(str:string){
        for (let i = 0; i < this._loadArr.length; i++) {
            const element = this._loadArr[i];
            if(element.resUrl == str){
                return element;
            }
        }
        return null;
    }
    private removeLoadArrItem(str:string){
        for (let i = 0; i < this._loadArr.length; i++) {
            const element = this._loadArr[i];
            if(element.resUrl == str){
                element.res.decRef();
                this._loadArr.splice(i, 1);
                break;
            }
        }
    }


}