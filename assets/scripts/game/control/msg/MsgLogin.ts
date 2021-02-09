import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
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
        const buffer_data = Msg.VersionCheckR.encode({main: 1, minor: 2,build :1,channel:1}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheVersionCheckR,buffer_data);
    }

    public responeVersionCheckA(msgId: number, msgData: any){
        this.requestDeviceLoginNew();
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_version_check,msgData);
    }
    //版本信息获取-------------------

    public requestDeviceLoginNew(){
        const buffer_data = Msg.DeviceLoginNewR.encode({deviceId:"dfasfasf",region:"eafas",mac:"asdfsaf"}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheDeviceLoginNewR,buffer_data);
        }
    public responeDeviceLoginNewA(msgId: number, msgData: any){
        this.requestPlayerLogin(msgData.loginPlayerID);
    }
    //角色登陆------------------------------------
    public requestPlayerLogin(pid:number){
        // let test = {}
        // test.playerID = 1;
        const buffer_data = Msg.PlayerLoginR.encode({playerID:pid,Channel:"",OsVer:"",TerminInfo:"",Mac:"",Imei:"",ClientVersion:"",loginIp:"",language:1}).finish();
        this.msgMgr?.sendData(Msg.MsgType.ThePlayerLoginR,buffer_data);
    }
    public responePlayerLoginA(msgId: number, msgData: any){
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_player_login,msgData);
    }
    //角色登陆------------------------------------
    //获取游戏数据-----------------------
    public requestGetHeroList(){
        const buffer_data = Msg.GetHeroListR.encode({}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheGetHeroListR,buffer_data);
    }
    public responeGetHeroListA(msgId: number, msgData: any){
    }
        
    public requestGetPlayerData(){
        const buffer_data = Msg.GetPlayerDataR.encode({}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheGetPlayerDataR,buffer_data);
    }
    public responeGetPlayerDataA(msgId: number, msgData: any){
        // this.requestSyncChat();
        // MsgMgr.getInstance().requestGetCacheChatList();
    }
    //获取游戏数据-----------------------
}