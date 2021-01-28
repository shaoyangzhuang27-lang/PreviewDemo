// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import {MsgManager} from "./network/msgManager";

import {NotifyManager} from "./network/notifyManager";

//网络相关
// import { WebSock } from "./network/WebSock";
// import { NetManager } from "./network/NetManager";
// import { NetNode } from "./network/NetNode";
// import { DefStringProtocol, NetData, INetworkTips,SupperProtocol } from "./network/NetInterface";



@ccclass('Basescene')
export class Basescene extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
        // this.initNet()
        MsgManager.getInstance().initNet();
        MsgManager.getInstance().requestDataExample();

        // //编码
        // const msg = Msg.DeviceLoginR.encode({deviceId: "hello world", region: "ppppppp"}).finish();
        // console.log(msg);
        // //解码
        // const hello = Msg.DeviceLoginR.decode(msg);
        // console.log(hello);
        NotifyManager.getInstance().addNotifyHandler("test",this.notifyTest,this);
    }
    notifyTest(data){
        console.log("basescene notifyTest!!");
        console.log(data);
    }

    // initNet(){
    //     console.log("initNet!!")
    // }

    // private showGetMsg(data: string){
    //     console.log(data);
    // }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
    popWindow(){

    }
    
}
