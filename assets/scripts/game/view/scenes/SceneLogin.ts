// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { MsgMgr } from '../../control/MsgMgr';
import { NotifyMgr } from '../../control/NotifyMgr';
import { ResMgr } from '../../control/ResMgr';
import { SceneMgr } from '../../control/SceneMgr';
import { BaseScene } from './BaseScene';
const { ccclass, property } = _decorator;

@ccclass('SceneLogin')
export class SceneLogin extends BaseScene {
    @property({type: Node})
    public btn_login:Node | null = null;

    start () {
        this.btn_login?.on(Node.EventType.TOUCH_END, this.submitHandle, this);
        ResMgr.getInstance().preloadRes();
    }
    submitHandle(){
        console.log("login");
        this._loginServer();
    }
    onDestroy(){
        super.onDestroy();
    }

}
