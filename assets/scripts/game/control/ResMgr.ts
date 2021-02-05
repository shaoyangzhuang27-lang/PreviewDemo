import { assetManager,AssetManager,Prefab,resources,instantiate, director } from 'cc';
import {ResCore} from "../../core/control/ResCore";

export class ResMgr extends ResCore{
    private static _instance: ResMgr = new ResMgr();
    public static getInstance() {
        return this._instance;
    }
    //加载登陆必要资源

    //加载游戏必要资源(主ui资源,其他ui资源[是否另外加载待定])
    public loadGameNecessaryRes(){
        let item = this.getLoadArrItem("common")
        if(!item){
            this.loadArr.push(["common","common",true,null]);
        }
    }
    //卸载游戏必要资源(主ui资源)
    public releaseGameNecessaryRes(){
        this.removeLoadArrItem("common");
    }

    //加载主ui资源-------------------------
    public loadMainUI(){
        let item = this.getLoadArrItem("prefabs_ui/main_ui")
        if(!item){
            this.loadArr.push(["prefabs_ui/main_ui","screendynamic",true,null]);
        }
    }
    public releaseMainUI(){
        this.removeLoadArrItem("prefabs_ui/main_ui");
    }
    //加载主ui资源-------------------------

    //加载主城资源-----------------------------
    public loadMainCity(){
        let item = this.getLoadArrItem("prefabs_ui/main_city")
        if(!item){
            this.loadArr.push(["prefabs_ui/main_city","screendynamic",true,null]);
        }
    }
    public releaseMainCity(){
        this.removeLoadArrItem("prefabs_ui/main_city");
    }
    //加载主城资源-----------------------------

    //加载主界面场景---------------------------
    public loadMainScene(){
        this.loadArr.push(["scene_main","screenstatic",false,null]);
    }
    //加载主界面场景---------------------------

    //加载战斗场景------------------------------
    public loadBattleScene(){
        this.loadArr.push(["battle","screenstatic",false,null]);
    }
    //加载战斗场景------------------------------

    //加载挂机关卡资源(当前关卡资源)
    public loadChapter(chapter:number){

    }
    //卸载挂机关上资源(当前关卡资源)
    public releaseChapter(chapter:number){
        
    }



    


    //加载地牢资源(地牢相关资源)
    public loadDungeonRes(){
        
    }
    //卸载地牢资源(地牢相关资源)
    public releaseDungeonRes(){
        
    }

    //加载巨龙资源
    public loadDragonRes(){
        
    }
    //卸载巨龙资源
    public releaseDragonRes(){
        
    }

    //加载远古秘境资源mystery
    public loadMysteryRes(){
        
    }
    //卸载远古秘境资源
    public releaseMysteryRes(){
        
    }

}