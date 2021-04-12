import { assetManager,AssetManager,Prefab,resources,instantiate, director, SpriteFrame, Asset } from 'cc';

export enum ResType{
    screen,//场景预加载,加载完成后,切换场景自动释放
    prefab,//通用预制体资源,切换场景判断是否需要释放
    spriteframes,//通用图像资源,切换场景判断是否需要释放
    spriteframe,//通用图像资源,切换场景判断是否需要释放
    //single//临时使用资源,随用随删,不在场景加载界面中使用
}

interface LoadData{
    resUrl:string,  //资源路径
    resType:ResType,//资源类型
    isRef:boolean,  //是否控制引用
    res:any,        //资源对象
    resName:string, //资源名
    haveloaded:boolean,//是否加载完成
}

export class ResCore{

    //通用资源
    protected _loadArr:Array<LoadData> = [];
    protected _tempArr:Map<string,Map<string,any>> =  new Map();//弃用-----------------
    //界面资源
    protected _viewArr:Map<string,Map<string,Asset>> =  new Map<string,Map<string,Asset>>();


    /** 
     * 加载图片spriteframe资源
     * @param url           图片资源路径
     * @param com_callback  回调函数,返回需要使用的spriteframe
     * @param key           当前界面唯一关键字,用于关闭界面时清理资源使用标记,各个界面不能重复,通用资源这个关键字无效
     */
    public loadSpriteFrame(url:string,com_callback:(err: Error | null, data: SpriteFrame | null) => void, key:string = "default"){
        

        //通用资源有资源就用通用资源
        let spriteFrame = this._getSpriteFrameByUrl(url);
        if(spriteFrame){
            com_callback(null,spriteFrame);
            return;
        }
        //临时资源有资源就用临时资源
        let asset = this._getViewAsset(url,key)
        if(asset){
            com_callback(null,asset as SpriteFrame);
            return;
        }
        //没有找到缓存资源,下载资源并且记录资源,保证及时清理
        resources.load(url,SpriteFrame,(err:any,obj:SpriteFrame)=>{
            com_callback(null,obj);
            //增加引用并且存下来
            this._recordRes(url,obj,key);
        });
    }
    
    /** 
     * 加载预制体资源
     * @param url           预制体资源路径
     * @param com_callback  回调函数,返回需要使用的prefab
     * @param key           当前界面唯一关键字,用于关闭界面时清理资源使用标记,各个界面不能重复,通用资源这个关键字无效
     */
    public loadPrefab(url:string,com_callback:(err: Error | null, data: Prefab | null) => void, key:string = "default"){
        //通用资源有资源就用通用资源
        let prefab = this._getPrefabByUrl(url)
        if(prefab){
            com_callback(null,prefab);
            return;
        }
        //临时资源有资源就用临时资源
        let asset = this._getViewAsset(url,key)
        if(asset){
            com_callback(null,asset as Prefab);
            return;
        }
        //没有找到缓存资源,下载资源并且记录资源,保证及时清理
        resources.load(url,Prefab,(err:any,obj:Prefab)=>{
            com_callback(null,obj);
            //增加引用并且存下来
            this._recordRes(url,obj,key);
        });
        
    }


    /** 
     * 清理单个资源
     * @param url 资源路径
     * @param key 资源使用界面唯一关键字
     */
    public releaseRes(url:string,key:string){
        let m = this._viewArr.get(key);
        if(m){
            let n = m.get(url)
            if(n){
                n.decRef();
                m.delete(url);
            }
        }
    }
    
    /** 
     * 清理指定关键字界面资源
     * @param key 资源使用界面唯一关键字
     */
    public releaseResAll(key:string){
        let m = this._viewArr.get(key);
        if(m){
            m.forEach(element => {
                element.decRef();
            });
            m.clear();
        }
    }


    //将资源推入加载队列
    protected pushRes(resUrl:string,resType:ResType,isRef:boolean,res:any = null,resName:string = ""){
        let item = this._getLoadArrItem(resUrl);
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
    //切换场景时确定是否需要清理资源
    protected popRes(resUrl:string){
        let item = this._getLoadArrItem(resUrl);
        if(!item )return;
        if(!item.haveloaded)return;

        switch(item.resType){
            case ResType.spriteframes:
                let resMap = item.res as Map<string,SpriteFrame>;
                resMap.forEach((value,key)=>{
                    value.decRef();
                })
            break;
            case ResType.prefab:
                let res = item.res as Prefab;
                res.decRef();
            break;
            case ResType.spriteframe:
                let spriteFrame = item.res as SpriteFrame;
                spriteFrame.decRef();
            break;
        }
        
        for (let i = 0; i < this._loadArr.length; i++) {
            const element = this._loadArr[i];
            if(element.resUrl == resUrl){
                this._loadArr.splice(i, 1);
                break;
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
                        // console.log("fjfjfjfj::");
                        // console.log(obj);
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


    //加载一个资源后,判断是否加载下一个
    private _judgeComplete(index:number,com_callback:any,goon_callback:any){
        this._loadArr[index].haveloaded = true;
        index++;
        if(this._loadArr.length == index){
            com_callback(this._loadArr);
        }else{
            goon_callback(this._loadArr,index);
        }
    }
    //获取通用资源数据
    private _getLoadArrItem(str:string):LoadData | null{
        for (let i = 0; i < this._loadArr.length; i++) {
            const element = this._loadArr[i];
            if(element.resUrl == str){
                return element;
            }
        }
        return null;
    }

    //获取通用资源spriteframe
    private _getSpriteFrameByUrl(url:string){
        let strs = url.split("/");
        let fileName = url;
        if(strs.length > 1){
            fileName = strs[strs.length-2];
        }
        for (let i = 0; i < this._loadArr.length; i++) {
            let loadData = this._loadArr[i];
            if(loadData.resType == ResType.spriteframes && loadData.res.get(fileName)){
                return loadData.res.get(name) as SpriteFrame
            }
        }
        return null;
    }
    //获取通用资源预制体
    private _getPrefabByUrl(url:string){
        for (let i = 0; i < this._loadArr.length; i++) {
            let loadData = this._loadArr[i];
            if(loadData.resType == ResType.prefab && loadData.resUrl == url){
                return loadData.res as Prefab;
            }
        }
        return null;
    }
    //获取临时资源
    private _getViewAsset(url:string,key:string){
        let m = this._viewArr.get(key);
        if(m){
            let n = m.get(url);
            return n;
        }
        return null;
    }
    //记录临时资源
    private _recordRes(url:string,obj:Asset,key:string){
        console.log("res core _recordRes :", url)
        let m = this._viewArr.get(key);
        if(!m){
            m = new Map<string,Asset>();
            this._viewArr.set(key,m);
        }
        let n = m.get(url);
        if(!n){
            n = obj;
            m.set(url,n);
            n.addRef();
        }
    }


    ////弃用------------------------------------------------------------------------------------------------------------
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

}