
//网络相关
import { WebSock } from "./WebSock";
import { NetManager } from "./NetManager";
import { NetNode } from "./NetNode";
import { DefStringProtocol, NetData, INetworkTips,IProtocolHelper,SupperProtocol } from "./NetInterface";

import {NotifyManager} from "./notifyManager";



class NetTips implements INetworkTips {
    // private getLabel(): cc.Label {
    //     let label = null;
    //     let node = cc.director.getScene().getChildByName("@net_tip_label");
    //     if (node) {
    //         label = node.getComponent(cc.Label);
    //     } else {
    //         node = new cc.Node("@net_tip_label");
    //         label = node.addComponent(cc.Label);
    //         node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    //     }
    //     return label;
    // }

    connectTips(isShow: boolean): void {
        //连接中...
    }

    reconnectTips(isShow: boolean): void {
        //重连中...
    }

    requestTips(isShow: boolean): void {
    }
}
export class MsgManager{
    private static _instance: MsgManager = new MsgManager();
    public static getInstance() {
        return this._instance;
    }

    public initHandle(){

    }

    private encodeMessage(id,buffer_data){
        const buffer_all = new ArrayBuffer(2+buffer_data.byteLength);
        const dv_all = new DataView(buffer_all)
        dv_all.setInt16(0,id);
        for (var i = 0; i < buffer_data.length; i++) {
            dv_all.setInt8(i+2,buffer_data[i]);
        }

        console.log(buffer_all);
        console.log(dv_all);
        return buffer_all;
    }

    public initNet(){
        this.initLogicServer();
        this.connectLogicServer();
    }
    public dataExampleHandle(cmd: number, data: NetData){
        console.log("respone");
        const hello = Msg.DeviceLoginR.decode(data);
        console.log(cmd);
        console.log(hello);
        NotifyManager.getInstance().notify("test",hello);
    }

    public requestDataExample(){
        //编码
        let msgId = Msg.MsgType.TheServerInfoR;
        const buffer_data = Msg.DeviceLoginR.encode({deviceId: "hello world", region: "ppppppp"}).finish();
        console.log("request!!!");
        console.log(msgId);
        console.log(buffer_data);

        let buffer_all = this.encodeMessage(msgId,buffer_data)

        NetManager.getInstance().send(buffer_all);//发送信息
    }

    public initLogicServer(){
        let node = new NetNode();
        node.init(new WebSock(), new SupperProtocol(), new NetTips());
        NetManager.getInstance().setNetNode(node);
        node.addResponeHandler(Msg.MsgType.TheServerInfoR, this.dataExampleHandle,this);
    }

    public connectLogicServer(){
        NetManager.getInstance().connect({ url: "ws://echo.websocket.org" });//开启连接
        // NetManager.getInstance().connect({ url: "ws://121.40.165.18:8800" });//开启连接
        // NetManager.getInstance().close();//关闭连接
    }

}