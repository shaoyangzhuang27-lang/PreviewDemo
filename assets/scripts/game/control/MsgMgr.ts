
//网络相关
import { INetworkTips, NetData, SupperProtocol } from "../../core/network/NetInterface";
import { NetManager } from "../../core/network/NetManager";
import { NetNode } from "../../core/network/NetNode";
import { WebSock } from "../../core/network/WebSock";

import { NotifyMgr } from "./NotifyMgr";
import { PopMgr } from "./PopMgr";
import { SceneMgr } from "./SceneMgr";
import { MsgCore } from "../../core/network/MsgCore";

class NetTips implements INetworkTips {
    requestTips(isShow: boolean): void {}
    connectTips(isShow: boolean): void {
        PopMgr.getInstance().setNetLoading(isShow,"连接中...");
    }
    reconnectTips(isShow: boolean): void {
        PopMgr.getInstance().setNetLoading(isShow,"重连中...");
    }
    connectCloseTips():void{
        PopMgr.getInstance().popupSimpleWindow("连接失败","是否重试",()=>{
            MsgMgr.getInstance().connectLoginServer();
            MsgMgr.getInstance().requestPingPong();
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

    protected initLoginServer(){
        let node = new NetNode();
        node.init(new WebSock(), new SupperProtocol(), new NetTips());
        NetManager.getInstance().setNetNode(node);
    }
    public connectLoginServer(){
        NetManager.getInstance().connect({ url: "ws://192.168.15.132:17183" });//开启连接
    }
    protected initLoginResponeHandle(){
        NetManager.getInstance().getNetNode().addResponeHandler(Msg.MsgType.TheVersionCheckA, this.responeVersionCheck,this);
        NetManager.getInstance().getNetNode().addResponeHandler(Msg.MsgType.TheDeviceLoginNewA, this.responeDeviceLoginNew,this);
        NetManager.getInstance().getNetNode().addResponeHandler(Msg.MsgType.ThePlayerLoginA, this.responePlayerLogin,this);
        NetManager.getInstance().getNetNode().addResponeHandler(Msg.MsgType.TheGetHeroListA, this.responeGetHeroList,this);
        NetManager.getInstance().getNetNode().addResponeHandler(Msg.MsgType.TheGetPlayerDataA, this.responeGetPlayerData,this);
        NetManager.getInstance().getNetNode().addResponeHandler(Msg.MsgType.TheGetCacheChatListA, this.responeGetCacheChatList,this);
    }
    //版本信息获取-------------------
    public requestVersionCheck(){
        const buffer_data = Msg.VersionCheckR.encode({main: 1, minor: 2,build :1,channel:1}).finish();
        this.sendData(Msg.MsgType.TheVersionCheckR,buffer_data);
    }

    public responeVersionCheck(msgId: number, data: NetData){
        const msgData = Msg.VersionCheckA.decode(data);
        console.log("respone id:"+msgId);
        console.log(msgData);

        MsgMgr.getInstance().requestDeviceLoginNew();
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_version_check,msgData);

    }
    //版本信息获取-------------------
    public requestDeviceLoginNew(){
        const buffer_data = Msg.DeviceLoginNewR.encode({deviceId:"dfasfasf",region:"eafas",mac:"asdfsaf"}).finish();
        this.sendData(Msg.MsgType.TheDeviceLoginNewR,buffer_data);
        }
    public responeDeviceLoginNew(msgId: number, data: NetData){
        const msgData = Msg.DeviceLoginNewA.decode(data);
        console.log("respone id:"+msgId);
        console.log(msgData);
        
        MsgMgr.getInstance().requestPlayerLogin(msgData.loginPlayerID);
    }
    //角色登陆------------------------------------
    public requestPlayerLogin(pid:number){
        // let test = {}
        // test.playerID = 1;
        const buffer_data = Msg.PlayerLoginR.encode({playerID:1,Channel:"",OsVer:"",TerminInfo:"",Mac:"",Imei:"",ClientVersion:"",loginIp:"",language:1}).finish();
        this.sendData(Msg.MsgType.ThePlayerLoginR,buffer_data);
    }
    public responePlayerLogin(msgId: number, data: NetData){
        const msgData = Msg.PlayerLoginA.decode(data);
        console.log("respone id:"+msgId);
        console.log(msgData);
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_player_login,msgData);
    }
    //角色登陆------------------------------------
    //获取游戏数据-----------------------
    public requestGetHeroList(){
        const buffer_data = Msg.GetHeroListR.encode({}).finish();
        this.sendData(Msg.MsgType.TheGetHeroListR,buffer_data);
    }
    public responeGetHeroList(msgId: number, data: NetData){
        const msgData = Msg.GetHeroListA.decode(data);
        console.log("respone id:"+msgId);
        console.log(msgData);
    }
        
    public requestGetPlayerData(){
        const buffer_data = Msg.GetPlayerDataR.encode({}).finish();
        this.sendData(Msg.MsgType.TheGetPlayerDataR,buffer_data);
    }
    public responeGetPlayerData(msgId: number, data: NetData){
        const msgData = Msg.GetPlayerDataA.decode(data);
        console.log("respone id:"+msgId);
        console.log(msgData);
        MsgMgr.getInstance().requestSyncChat();
        // MsgMgr.getInstance().requestGetCacheChatList();
    }
    //获取游戏数据-----------------------
    
    //聊天-------------------------
    public requestSyncChat(){
        const buffer_data = Msg.SyncChat.encode({chatChannel:Msg.TChatChannelType.EChatChannelType_World,content:"gg",isFace:false}).finish();
        this.sendData(Msg.MsgType.TheSyncChat,buffer_data);
    }
    public requestGetCacheChatList(){
        const buffer_data = Msg.GetCacheChatListR.encode({}).finish();
        this.sendData(Msg.MsgType.TheGetCacheChatListR,buffer_data);
    }
    public responeGetCacheChatList(msgId: number, data: NetData){
        const msgData = Msg.GetCacheChatListA.decode(data);
        console.log("respone id:"+msgId);
        console.log(msgData);
    }
    //聊天-------------------------
    //心跳
    public requestPingPong(){
        const buffer_data = Msg.Ping.encode({sendTime:1}).finish();
        this.sendData(Msg.MsgType.ThePing,buffer_data);
    }
    



}