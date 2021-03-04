
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
import { MsgFormation } from "./msg/MsgFormation";
import { MsgHeroPub } from "./msg/MsgHeroPub";
import { MsgBase } from "./msg/MsgBase";


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
    private _msgs:Array<MsgBase> = new Array<MsgBase>();

    //消息定义-------------------------------------------------
    private _msgLogin:MsgLogin = new MsgLogin(this);
    public getMsgLogin(){
        return this._msgLogin;
    }

    private _msgGame:MsgGame = new MsgGame(this);
    public getMsgGame(){
        return this._msgGame;
    }
    //消息定义-------------------------------------------------
    
    //消息注册-------------------------------------------------
    private _initMsg(){
        this._msgs.push(this._msgLogin)
        this._msgs.push(this._msgGame)
        this._msgs.push(this._msgFormation);
        this._msgs.push(this._msgFormation);
    }
    //消息注册-------------------------------------------------

    private _msgFormation : MsgFormation = new MsgFormation(this);
    public getMsgFormation(){
        return this._msgFormation;
    }

    //HeroPub消息注册
    private _msgHeroPub : MsgHeroPub = new MsgHeroPub(this);
    public getMsgHeroPub(){
        return this._msgHeroPub;
    }

    public initLoginServer(){
        this._initMsg()

        let responeMap =Array<Map<number,any> | null>();
        this._msgs.forEach((val,idx)=>{
            val.initData();
            responeMap.push(val.getResponeMap());
        })
        let msgMap = this.getMsgMap(responeMap);

        let node = new NetNode();
        node.init(new WebSock(), new SupperProtocol(msgMap), new NetTips());
        NetManager.getInstance().setNetNode(node);
        
        this._msgs.forEach((val,idx)=>{
            val.initHandle();
        })

    }
    
    public connectLoginServer(channelId: number = 0){
        NetManager.getInstance().connect({ url: "ws://192.168.15.132:17183" },channelId);//开启连接
    }
}