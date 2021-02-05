// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { MsgMgr } from '../control/MsgMgr';
import { NotifyMgr } from '../control/NotifyMgr';
import { SceneMgr } from '../control/SceneMgr';
import { BaseScene } from './BaseScene';
const { ccclass, property } = _decorator;

@ccclass('SceneLogin')
export class SceneLogin extends BaseScene {
    @property({type: Node})
    public btn_login:Node | null = null;

    start () {
        this.btn_login?.on(Node.EventType.TOUCH_END, this.submitHandle, this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_player_login,this.notifyPlayerLoginHandle,this);
    }
    submitHandle(){
        console.log("login");
        MsgMgr.getInstance().requestDeviceLoginNew();
    }
    notifyPlayerLoginHandle(data:any){
        MsgMgr.getInstance().requestGetHeroList();
        MsgMgr.getInstance().requestGetPlayerData();
        SceneMgr.getInstance().changeToBattle();
    }

}
