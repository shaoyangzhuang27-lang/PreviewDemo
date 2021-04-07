import { assetManager,AssetManager,Prefab,resources,director, Scene } from 'cc';
import { SceneLoading } from '../view/SceneLoading';
import {ResMgr} from './ResMgr';
// import {Loading2} from '../../loading2'; 
enum SceneName{
    none        = "none",
    mainscene   = "scene_main",
    battle      = "battle",
    dungeon     = "dungeon",
}
export class SceneMgr{
    private static _instance: SceneMgr = new SceneMgr();
    public static getInstance() {
        return this._instance;
    }

    private _loadingScript:SceneLoading | null = null;
    private _curSceneName:SceneName = SceneName.none;

    public getCurScene(){
        return this._curSceneName;
    }

    public changeToLogin(){
        director.loadScene("scene_login");
    }

    //主界面
    public changeToMain(){
        //通用资源
        //主ui,章节地图,世界地图,主城资源,公会场景资源,英雄图标,技能图标,装备图标,道具图标,碎片图标

        this._enterLoading(()=>{
            ResMgr.getInstance().loadMainUI();
            ResMgr.getInstance().loadMainCity();
            ResMgr.getInstance().loadGameNecessaryRes();
            ResMgr.getInstance().loadCommonPrefabs();
            ResMgr.getInstance().loadMainScene();
        },()=>{
            this._erterScene(SceneName.mainscene);
        })

        //英雄资源,怪物资源
    }
    private releaseMain(){
        //主ui,章节地图,世界地图,主城资源,公会场景资源
    }

    public changeToBattle(){
        
        this._enterLoading(()=>{
            ResMgr.getInstance().loadMainUI();
            ResMgr.getInstance().loadGameNecessaryRes();
            ResMgr.getInstance().loadCommonPrefabs();
            ResMgr.getInstance().loadBattleScene();
        },()=>{
            this._erterScene(SceneName.battle);
        })
    }
    private releaseBattle(){
    }

    //地牢
    public changeToDungeon(){
        //通用资源,地牢资源,,英雄资源,怪物资源
    }
    private _releaseDungeon(){
        //地牢资源
    }

    private _enterLoading(loadFun:Function,comFun:Function){
        
        director.loadScene("scene_loading",(err,scene)=>{
            this._releasePreRes();
            let scriptNode = scene?.getChildByName("core");
            console.log(scriptNode);
            this._loadingScript = scriptNode?.getComponent("SceneLoading") as SceneLoading;
            console.log(this._loadingScript);


            loadFun();
            ResMgr.getInstance().startLoad((finished:number,total:number,resName:string)=>{
                console.log("hhhhfffslkfj;::::;")
                console.log(resName)
                if(this._loadingScript){
                    this._loadingScript.setProgress(finished/total,resName);
                }
            },
            (objArray:any) => {
                //进入主界面
                this._loadingScript = null;
                comFun();
            });
        })

    }

    private _erterScene(sceneName:SceneName){
        this._curSceneName = sceneName;
        director.loadScene(sceneName);
    }
    private _releasePreRes(){
        switch(this._curSceneName){
            case SceneName.mainscene:
                this.releaseMain();
            break;
            case SceneName.battle:
                this.releaseBattle();
            break;
            case SceneName.none:

            break;
        }
    }
}