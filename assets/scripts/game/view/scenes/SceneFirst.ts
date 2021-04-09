
import { _decorator, Component, Node,ProgressBarComponent, assetManager, macro, dynamicAtlasManager, EditBox } from 'cc';
import { MsgMgr } from '../../control/MsgMgr';
import { NotifyMgr } from '../../control/NotifyMgr';
import { SceneMgr } from '../../control/SceneMgr';
import { ValueMgr, TableName } from '../../model/ValueMgr';
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
    
    @property({type: EditBox})
    public txt_ip:EditBox = null as unknown as EditBox;
    
    @property({type: Node})
    public btn_enter:Node = null as unknown as Node;

    private isVersionComplete = false;
    private isConfigComplete = false;

    start () {
        // macro.CLEANUP_IMAGE_CACHE = false;
        dynamicAtlasManager.enabled = false;
        // this._checkVersion();
        // this._initNet();
        ValueMgr.getInstance().loadData((cur:number,total:number)=>{this.setProgress(cur,total)});
        this.btn_enter.on(Node.EventType.TOUCH_END, this._enterGame, this);
    }
    // private _checkVersion(){
        // assetManager.downloader._remoteServerAddress = window.SERVER_PATH;
        // console.log("checkVersion---1");
        // console.log(assetManager.downloader._remoteServerAddress);
        // console.log(assetManager.downloader.remoteServerAddress);
        // console.log("checkVersion---2");
    // }

    private _enterGame(){
        this._initNet();
    }
    public setProgress(cur:number,total:number){
        let p = this.progress_bar?.getComponent(ProgressBarComponent) as ProgressBarComponent;
        p.progress = cur/total;
        if(cur == total){
            this.isConfigComplete = true;
            ValueMgr.getInstance().setInit(true);
        }
        this._checkComplete();
    }
    private _initNet(){

        let ip = "192.168.15.132";
        if(this.txt_ip.string!=""){
            ip = this.txt_ip.string;
        }

        MsgMgr.getInstance().initLoginServer();
        MsgMgr.getInstance().connectLoginServer(ip);
        MsgMgr.getInstance().getMsgLogin().requestVersionCheck();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_version_check,this._notifyVersionCheckHandle,this);
    }
    private _checkComplete(){
        if(this.isConfigComplete){
            ValueMgr.getInstance().optimizationTable();
        }
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
    private _notifyVersionCheckHandle(data:any){
        //进入登陆界面
        this.isVersionComplete = true;
        this._checkComplete();
    }


}
