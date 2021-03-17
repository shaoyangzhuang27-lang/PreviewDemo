import { assetManager,AssetManager,Prefab,resources,director } from 'cc';
import { SceneLoading } from '../view/SceneLoading';
import {ResMgr} from './ResMgr';
// import {Loading2} from '../../loading2';
export class SceneMgr{
    private static _instance: SceneMgr = new SceneMgr();
    public static getInstance() {
        return this._instance;
    }

    private loadingScript:SceneLoading | null = null;

    public changeToLogin(){
        director.loadScene("scene_login");
    }

    //主界面
    public changeToMain(){
        //通用资源

        //主ui
        //章节地图
        //世界地图
        //主城资源
        //公会场景资源
        //英雄图标
        //技能图标
        //装备图标
        //道具图标
        //碎片图标

        //进入loading
        director.loadScene("scene_loading",(err,scene)=>{
            let scriptNode = scene?.getChildByName("core");
            console.log(scriptNode);
            this.loadingScript = scriptNode?.getComponent("SceneLoading") as SceneLoading;
            console.log(this.loadingScript);
        })

        ResMgr.getInstance().loadMainUI();
        ResMgr.getInstance().loadMainCity();
        ResMgr.getInstance().loadMainScene();
        ResMgr.getInstance().startLoad((finished:number,total:number,resName:string)=>{
            if(this.loadingScript){
                this.loadingScript.setProgress(finished/total,resName);
            }
        },
        (objArray:any) => {
            //进入主界面
            director.loadScene("scene_main");
            this.loadingScript = null;
        });


        //英雄资源
        //怪物资源
    }
    public releaseMain(){
        //主ui
        //章节地图
        //世界地图
        //主城资源
        //公会场景资源
        
    }

    public changeToBattle(){
        //进入loading
        director.loadScene("scene_loading",(err,scene)=>{
            let scriptNode = scene?.getChildByName("core");
            console.log(scriptNode);
            this.loadingScript = scriptNode?.getComponent("SceneLoading") as SceneLoading;
            console.log(this.loadingScript);
        })
        ResMgr.getInstance().loadMainUI();
        ResMgr.getInstance().loadBattleScene();
        ResMgr.getInstance().startLoad((finished:number,total:number)=>{
            if(this.loadingScript){
                this.loadingScript.setProgress(finished/total);
            }
        },
        (objArray:any) => {
            //进入主界面
            director.loadScene("battle");
            this.loadingScript = null;
        });
    }
    //地牢
    public changeToDungeon(){
        //通用资源

        //地牢资源

        //英雄资源
        //怪物资源
    }
    public releaseDungeon(){
        //地牢资源
    }
}