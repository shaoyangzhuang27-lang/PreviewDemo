
import { _decorator, Component, Node,ProgressBarComponent } from 'cc';
import { MsgMgr } from '../control/MsgMgr';
import { NotifyMgr } from '../control/NotifyMgr';
import { SceneMgr } from '../control/SceneMgr';
import { DataMgr } from '../model/DataMgr';
import { BaseScene } from './BaseScene';
const { ccclass, property } = _decorator;

@ccclass('SceneFirst')
export class SceneFirst extends BaseScene {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    
    @property({type: Node})
    public progress_bar:Node | null = null;

    start () {
        // Your initialization goes here.
        this.initNet();
        
        DataMgr.getInstance().loadAllData((loadTotal:number,loadIndex:number)=>{
            // console.log("loadPro!!!")
            // console.log(loadTotal);
            // console.log(loadIndex);
        });
    }
    setProgress(pro:number){
        let p = this.progress_bar?.getComponent(ProgressBarComponent) as ProgressBarComponent;
        p.progress = pro;
    }
    initNet(){
        // MsgMgr.getInstance().initLoginNet();
        MsgMgr.getInstance().initLoginServer();
        MsgMgr.getInstance().connectLoginServer();
        MsgMgr.getInstance().getMsgLogin().requestVersionCheck();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_version_check,this.notifyVersionCheckHandle,this);
    }
    notifyVersionCheckHandle(data:any){
        //进入登陆界面
        SceneMgr.getInstance().changeToLogin();
    }

}
