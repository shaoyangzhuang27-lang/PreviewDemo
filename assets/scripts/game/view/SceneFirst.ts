
import { _decorator, Component, Node,ProgressBarComponent } from 'cc';
import { MsgMgr } from '../control/MsgMgr';
import { NotifyMgr } from '../control/NotifyMgr';
import { SceneMgr } from '../control/SceneMgr';
import { ValueMgr, TableName } from '../model/ValueMgr';
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

    private isVersionComplete = false;
    private isConfigComplete = false;

    start () {
        this.initNet();
        ValueMgr.getInstance().loadData((cur:number,total:number)=>{this.setProgress(cur,total)});
    }
    setProgress(cur:number,total:number){
        let p = this.progress_bar?.getComponent(ProgressBarComponent) as ProgressBarComponent;
        p.progress = cur/total;
        if(cur == total){
            this.isConfigComplete = true;
        }
        // console.log("loading files:")
        // console.log(cur)
        // console.log(total) 
        this.checkComplete();
    }
    initNet(){
        MsgMgr.getInstance().initLoginServer();
        MsgMgr.getInstance().connectLoginServer();
        MsgMgr.getInstance().getMsgLogin().requestVersionCheck();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_version_check,this.notifyVersionCheckHandle,this);
    }
    checkComplete(){
        if(this.isConfigComplete && this.isVersionComplete){
            //let tab = ValueMgr.getInstance().getTableByName(TableName.achievement) as Config.achievement;
            //console.log("data::::::::::::::")
            //console.log(tab)
            //console.log((tab.records[1].awardNum as number[])[0]);
            //console.log(tab.records[1].id );
            
            //let item = ValueMgr.getInstance().getItemByField(TableName.heroes,100) as Config.heroes.Record;
            //console.log("item::::::::::::::")
            //console.log(item);
            //console.log(item.name);
            

            SceneMgr.getInstance().changeToLogin();

        }
    }
    notifyVersionCheckHandle(data:any){
        //进入登陆界面
        this.isVersionComplete = true;
        this.checkComplete();
    }


}
