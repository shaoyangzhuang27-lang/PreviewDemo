import { assetManager,AssetManager,Prefab,resources,instantiate, director } from 'cc';

export enum ResType{
    screenstatic,//场景预加载,加载完成后,切换场景自动释放
    screendynamic,//当前场景必要资源,切换场景后手动释放
    common,//每个场景都需要使用到的通用资源,加载一次,后期不做释放操作
    single//临时使用资源,随用随删,不在场景加载界面中使用
}

export class ResCore{

    protected prefab_ui:any = null;
    protected prefab_city:any = null;
    //[资源路径,资源类型,是否控制引用,资源对象,资源名]
    protected loadArr:Array<[string,ResType,boolean,any,string]> = [];
    protected tempArr:Map<string,Map<string,any>> =  new Map();

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
            let data = this.tempArr.get(resUrl);
            if(!data){
                let map:Map<string,any> = new Map();
                this.tempArr.set(resUrl,map);

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
        
        let data = this.tempArr.get(resUrl);
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


    //[0资源路径,1资源类型,2是否控制引用,3资源对象]
    public startLoad(pro_callback:any,com_callback:any){
        let fun = (loadArr:Array<[string,ResType,boolean,any,string]>,index:number)=> {
            let curArr = this.loadArr[index];
            let resurl = curArr[0];
            let resType = curArr[1];
            let isAddRef = curArr[2];
            let resName = curArr[4];

            switch(resType){
                case ResType.screenstatic:
                    
                    director.preloadScene(resurl,(finished:number,total:number)=>{
                        pro_callback(finished + total*index,total*3,resName);
                    },(err, obj) => {
                        com_callback(this.loadArr);
                        this.loadArr.splice(index, 1);
                    })

                    break;
                case ResType.screendynamic:
                case ResType.common:
                    
                    resources.load(resurl,(finished,total)=>{
                        pro_callback(finished + total*index,total*3,resName)                
                    },
                    (err, obj) => {
                        if(index < loadArr.length - 1){
                            curArr[3] = obj;
                            if(isAddRef){
                                curArr[3].addRef();
                            }
        
                            index++;
                            fun(loadArr,index);
                        }else{ 
                            curArr[3] = obj;
                            if(isAddRef){
                                curArr[3].addRef();
                            }

                            com_callback(this.loadArr);
                        }
                        
                    });

                    break;
            }
        }
  
        fun(this.loadArr,0);
        
    }
    
    protected pushRes(resUrl:string,resType:ResType,isRef:boolean,res:any = null,resName:string = ""){
        let item = this.getLoadArrItem(resUrl)
        if(!item){
            this.loadArr.push([resUrl,resType,true,null,resName]);
        }
    }
    protected popRes(resUrl:string){
        this.removeLoadArrItem(resUrl);
    }

    private getLoadArrItem(str:string){
        for (let i = 0; i < this.loadArr.length; i++) {
            const element = this.loadArr[i];
            if(element[0] == str){
                return element;
            }
        }
        return null;
    }
    private removeLoadArrItem(str:string){
        for (let i = 0; i < this.loadArr.length; i++) {
            const element = this.loadArr[i];
            if(element[0] == str){
                element[3].decRef();
                element.splice(i, 1);
                break;
            }
        }
    }


}