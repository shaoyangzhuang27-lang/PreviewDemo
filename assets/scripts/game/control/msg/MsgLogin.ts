import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { DataMgr } from "../../model/DataMgr";
import { SystemModel } from "../../model/datas/SystemModel";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgLogin extends MsgBase{

    
    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheVersionCheckA,[Msg.VersionCheckA,this.responeVersionCheckA,this]],
            [Msg.MsgType.TheDeviceLoginNewA,[Msg.DeviceLoginNewA,this.responeDeviceLoginNewA,this]],
            [Msg.MsgType.ThePlayerLoginA,[Msg.PlayerLoginA,this.responePlayerLoginA,this]],
            [Msg.MsgType.TheGetHeroListA,[Msg.GetHeroListA,this.responeGetHeroListA,this]],
            [Msg.MsgType.TheGetPlayerDataA,[Msg.GetPlayerDataA,this.responeGetPlayerDataA,this]],
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



    
    public requestDeviceLoginNew(){
        let data = new Msg.DeviceLoginNewR();
        // data.deviceId = "73f08c52ad36acf31baecfec8db006b8d1af428a";
        data.deviceId = "2293181038的Redmi K20 Pro_f8482e84c956baa675ed0f048033ee91";
        const buffer_data = Msg.DeviceLoginNewR.encode(data).finish();
        this.msgMgr.sendData(Msg.MsgType.TheDeviceLoginNewR,buffer_data);
        }
    public responeDeviceLoginNewA(msgId: number, msgData: Msg.DeviceLoginNewA){

        //保存所有角色简要信息
        GameModel.getInstance().getSystemModel().setAllPlayerData(msgData.allPlayerList)

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
    }
    //获取游戏数据-----------------------
}