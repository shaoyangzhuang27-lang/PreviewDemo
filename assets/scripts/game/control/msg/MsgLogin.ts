import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { DataMgr } from "../../model/DataMgr";
import { SystemModel } from "../../model/datas/SystemModel";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgLogin extends MsgBase{

    // private _tempDeviceId:string = "001_c6c5fb6886887901329e39bbd40f45f6";
    private _tempDeviceId:string = "000111_7d7785ab654adff39122f535393bc9d6";
    
    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheVersionCheckA,[Msg.VersionCheckA,this.responeVersionCheckA,this]],
            [Msg.MsgType.TheDeviceLoginNewA,[Msg.DeviceLoginNewA,this.responeDeviceLoginNewA,this]],
            [Msg.MsgType.ThePlayerLoginA,[Msg.PlayerLoginA,this.responePlayerLoginA,this]],
            [Msg.MsgType.TheGetHeroListA,[Msg.GetHeroListA,this.responeGetHeroListA,this]],
            [Msg.MsgType.TheGetPlayerDataA,[Msg.GetPlayerDataA,this.responeGetPlayerDataA,this]],
            [Msg.MsgType.TheChangeServerA,[Msg.ChangeServerA,this.responeChangeServerA,this]],
        ]);
    }
    
    //版本信息获取-------------------
    public requestVersionCheck(){
        let data = new Msg.VersionCheckR()
        data.main = 1;
        data.minor = 1;
        data.build = 1;
        data.channel = "1";
        const buffer_data = Msg.VersionCheckR.encode(data).finish();
        this.msgMgr.sendData(Msg.MsgType.TheVersionCheckR,buffer_data);
    }

    public responeVersionCheckA(msgId: number, msgData: Msg.VersionCheckA){
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_version_check,msgData);
    }
    //版本信息获取-------------------



    //设备登陆-------------------------
    public requestDeviceLoginNew(){
        let data = new Msg.DeviceLoginNewR();
        // data.deviceId = "73f08c52ad36acf31baecfec8db006b8d1af428a";
        data.deviceId = this._tempDeviceId;
        const buffer_data = Msg.DeviceLoginNewR.encode(data).finish();
        this.msgMgr.sendData(Msg.MsgType.TheDeviceLoginNewR,buffer_data);
        }
    public responeDeviceLoginNewA(msgId: number, msgData: Msg.DeviceLoginNewA){

        //保存所有角色简要信息
        // GameModel.getInstance().getSystemModel().setAllPlayerData(msgData.allPlayerList);
        GameModel.getInstance().getSystemModel().setDeviceLoginNew(msgData);
        GameModel.getInstance().getSystemModel().setDeviceId(this._tempDeviceId);

        this.requestPlayerLogin(msgData.loginPlayerID);
    }
    //角色登陆------------------------------------
    public requestPlayerLogin(pid:number){
        let data = new Msg.PlayerLoginR();
        console.log("ididididid:::");
        console.log(pid)
        data.playerID = pid;
        // data.Channel = "";
        // data.OsVer = "";
        // data.TerminInfo = "";
        // data.Mac = "";
        // data.Imei = "";
        // data.ClientVersion = "";
        // data.loginIp = "";
        // data.language = 1;
        const buffer_data = Msg.PlayerLoginR.encode(data).finish();
        this.msgMgr.sendData(Msg.MsgType.ThePlayerLoginR,buffer_data);
    }
    public responePlayerLoginA(msgId: number, msgData: Msg.PlayerLoginA){
        DataMgr.getInstance().setPlayerLogin(msgData);
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_player_login,msgData);
        
        GameModel.getInstance().initPlayerData(msgData);
    }
    //角色登陆------------------------------------
    //获取游戏数据-----------------------
    public requestGetHeroList(){
        const buffer_data = Msg.GetHeroListR.encode({}).finish();
        this.msgMgr.sendData(Msg.MsgType.TheGetHeroListR,buffer_data);
    }
    public responeGetHeroListA(msgId: number, msgData: Msg.GetHeroListA){
        console.log("herodata------")
        console.log(msgData)
        DataMgr.getInstance().setHeroList(msgData);
        // GameModel.getInstance().initHeroList(DataMgr.getInstance().getHeroList());
        GameModel.getInstance().initHeroList(msgData);
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_getherolist);
    }

    public requestGetPlayerData(){
        const buffer_data = Msg.GetPlayerDataR.encode({}).finish();
        this.msgMgr.sendData(Msg.MsgType.TheGetPlayerDataR,buffer_data);
    }
    public responeGetPlayerDataA(msgId: number, msgData: Msg.GetPlayerDataA){
        DataMgr.getInstance().setPlayerData(msgData);
        // this.requestSyncChat();
        // MsgMgr.getInstance().requestGetCacheChatList();
        GameModel.getInstance().initPlayerBag(msgData);
        GameModel.getInstance().initPlayerItem(msgData);
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_getplayerdata);
    }
    //获取游戏数据-----------------------
    // private _accountId:string;
    // private _deviceId:string;
    // private _playerId:number;
    public requestChangeServer(serverID:number){
        let accountId = GameModel.getInstance().getSystemModel().getAccountId();
        let deviceId = GameModel.getInstance().getSystemModel().getDeviceId();
        let playerId = GameModel.getInstance().getSystemModel().getPlayerId();

        let msg:Msg.ChangeServerR = {
            accountId : accountId,
            deviceId : deviceId,
            serverID : serverID,
            playerId : playerId,
        }
        const buffer_data = Msg.ChangeServerR.encode(msg).finish();
        this.msgMgr.sendData(Msg.MsgType.TheChangeServerR,buffer_data);
    }
    public responeChangeServerA(msgId: number, msgData: Msg.ChangeServerA){
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_changeserver,msgData.loginPlayerID);
    }
}