
//网络相关
import { INetworkTips, NetCallFunc, NetData, SupperProtocol } from "../../core/network/NetInterface";
import { NetManager } from "../../core/network/NetManager";
import { NetNode } from "../../core/network/NetNode";
import { WebSock } from "../../core/network/WebSock";

import { PopMgr } from "./PopMgr";
import { SceneMgr } from "./SceneMgr";
import { MsgCore } from "../../core/network/MsgCore";
import { MsgLogin } from "./msg/MsgLogin";
import { MsgGame } from "./msg/MsgGame";

class NetTips implements INetworkTips {
    requestTips(isShow: boolean): void {}
    connectTips(isShow: boolean): void {
        // console.log("MsgMgr connectTips "+isShow)
        PopMgr.getInstance().setNetLoading(isShow,"连接中...");
    }
    reconnectTips(isShow: boolean): void {
        // console.log("MsgMgr reconnectTips "+isShow)
        PopMgr.getInstance().setNetLoading(isShow,"重连中...");
    }
    connectCloseTips():void{
        PopMgr.getInstance().popupSimpleWindow("连接失败","是否重试",()=>{
            MsgMgr.getInstance().connectLoginServer();
            MsgMgr.getInstance().getMsgGame().requestPing();
            PopMgr.getInstance().deleteWindow();
        },()=>{
            PopMgr.getInstance().deleteWindow();
            SceneMgr.getInstance().changeToLogin();
        },false);

    }
}
export class MsgMgr extends MsgCore{
    private static _instance: MsgMgr = new MsgMgr();
    public static getInstance() {
        return this._instance;
    }

    private msgLogin:MsgLogin = new MsgLogin(this);
    public getMsgLogin(){
        return this.msgLogin;
    }

    private msgGame:MsgGame = new MsgGame(this);
    public getMsgGame(){
        return this.msgGame;
    }

    public initLoginServer(){
        this.msgLogin.initData();
        this.msgGame.initData();
        let msgMap = this.getMsgMap([this.msgGame.getResponeMap(),this.msgLogin.getResponeMap()]);

        let node = new NetNode();
        node.init(new WebSock(), new SupperProtocol(msgMap), new NetTips());
        NetManager.getInstance().setNetNode(node);

        this.msgLogin.initHandle();
        this.msgGame.initHandle();
    }
    
    public connectLoginServer(channelId: number = 0){
        NetManager.getInstance().connect({ url: "ws://192.168.15.132:17183" },channelId);//开启连接
    }



}