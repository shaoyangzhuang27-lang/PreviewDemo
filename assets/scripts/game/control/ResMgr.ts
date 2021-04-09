import { assetManager,AssetManager,Prefab,resources,instantiate, director, SpriteFrame } from 'cc';
import {ResCore, ResType} from "../../core/control/ResCore";

export class ResMgr extends ResCore{
    private static _instance: ResMgr = new ResMgr();
    public static getInstance() {
        return this._instance;
    }
    //加载登陆必要资源

    //预加载游戏资源
    private _hasPreLoadRes:boolean = false;
    public preloadRes(){
        if(this._hasPreLoadRes)return;
        this._hasPreLoadRes = true;
        resources.preloadDir("prefabs_ui/",Prefab);
        resources.preloadDir("ui/",SpriteFrame);
    }


    //加载游戏必要资源(主ui资源,其他ui资源[是否另外加载待定])
    public loadGameNecessaryRes(){
        this.pushRes("ui/common",ResType.spriteframes,true,null,"通用资源");
    }
    //卸载游戏必要资源(主ui资源)
    public releaseGameNecessaryRes(){
        this.popRes("ui/common");
    }

    public loadCommonPrefabs(){
        this.pushRes("prefabs_ui/common/element_heroicon",ResType.prefab,true,null,"英雄头像");
        this.pushRes("prefabs_ui/main/hero_selecticon",ResType.prefab,true,null,"英雄选择框");
        this.pushRes("prefabs_ui/main/team",ResType.prefab,true,null,"英雄队伍1");
        this.pushRes('prefabs_ui/features/heropromotion/popf_heropromotion',ResType.prefab,true,null,"英雄队伍2");
    }

    //加载主ui资源-------------------------
    public loadMainUI(){
        this.pushRes("prefabs_ui/main_ui",ResType.prefab,true,null,"主界面");
    }
    public releaseMainUI(){
        this.popRes("prefabs_ui/main_ui");
    }
    //加载主ui资源-------------------------

    //加载主城资源-----------------------------
    public loadMainCity(){
        this.pushRes("prefabs_ui/main_city",ResType.prefab,true,null,"主城");
    }
    public releaseMainCity(){
        this.popRes("prefabs_ui/main_city");
    }
    //加载主城资源-----------------------------

    //加载主界面场景---------------------------
    public loadMainScene(){
        this.pushRes("scene_main",ResType.screen,false,null,"主场景");
    }
    //加载主界面场景---------------------------

    //加载战斗场景------------------------------
    public loadBattleScene(){
        this.pushRes("battle",ResType.screen,false,null,"战斗场景");
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