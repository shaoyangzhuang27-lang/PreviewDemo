
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
import { MsgStarUp } from "./msg/MsgStarUp";
import { MsgBag } from "./msg/MsgBag";
import { MsgBase } from "./msg/MsgBase";
import { MsgOffline } from "./msg/MsgOffline";


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
    private _ip:string = "";
    public getMsgLogin(){
        return this._msgLogin;
    }

    private _msgGame:MsgGame = new MsgGame(this);
    public getMsgGame(){
        return this._msgGame;
    }

    private _msgFormation : MsgFormation = new MsgFormation(this);
    public getMsgFormation(){
        return this._msgFormation;
    }

    private _msgBag : MsgBag = new MsgBag(this);
    public getMsgBag(){
        return this._msgBag;
    }

    private _msgStarUp : MsgStarUp = new MsgStarUp(this);
    public getMsgStarUp(){
        return this._msgStarUp;
    }
    //消息定义-------------------------------------------------
    
    //消息注册-------------------------------------------------
    private _initMsg(){
        this._msgs.push(this._msgLogin)
        this._msgs.push(this._msgGame)
        this._msgs.push(this._msgFormation);
        this._msgs.push(this._msgBag);
        this._msgs.push(this._msgStarUp);
        this._msgs.push(this._msgOffline);
    }
    //消息注册-------------------------------------------------

    

    private _msgOffline : MsgOffline = new MsgOffline(this);
    public getMsgOffline() {
        return this._msgOffline
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
    
    public connectLoginServer(ip:string | null = null,channelId: number = 0){
        if(ip){
            this._ip = ip;
        }
        let serverUrl = "ws://"+this._ip+":17183";
        NetManager.getInstance().connect({ url:  serverUrl},channelId);//开启连接
        // NetManager.getInstance().connect({ url: "ws://localhost:17183" },channelId);//开启本地连接
    }
}