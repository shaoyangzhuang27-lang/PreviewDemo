import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";
import { GameModel } from '../../model/GameModel';

export class MsgGame extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheGetCacheChatListA,[Msg.GetCacheChatListA,this.responeGetCacheChatListA,this]],
            [Msg.MsgType.ThePong,[Msg.Pong,this.responePong,this]],
            [Msg.MsgType.TheNotifyLevelUpAward,[Msg.NotifyLevelUpAward,this._responeNotifyLevelUpAward,this]],
            [Msg.MsgType.TheGiftCodeAwardA,[Msg.GiftCodeAwardA,this._responeReceiveGiftCodeAward,this]],
        ]);
    }
    
    //聊天-------------------------
    public requestSyncChat(){
        const buffer_data = Msg.SyncChat.encode({chatChannel:Msg.TChatChannelType.EChatChannelType_World,content:"gg",isFace:false}).finish();
        this.msgMgr.sendData(Msg.MsgType.TheSyncChat,buffer_data);
    }
    public requestGetCacheChatList(){
        const buffer_data = Msg.GetCacheChatListR.encode({}).finish();
        this.msgMgr.sendData(Msg.MsgType.TheGetCacheChatListR,buffer_data);
    }
    public responeGetCacheChatListA(msgId: number, msgData: Msg.GetCacheChatListA){
        
    }
    //聊天-------------------------
    
    //心跳
    public requestPing(){
        const buffer_data = Msg.Ping.encode({sendTime:1}).finish();
        this.msgMgr.sendData(Msg.MsgType.ThePing,buffer_data);
    }
    public responePong(msgId: number, msgData: Msg.Pong){
    }

    //广播通知玩家等级升级消息
    private _responeNotifyLevelUpAward(msgId: number, msgData: any){
        let newMsgData = msgData as Msg.NotifyLevelUpAward;
        // newMsgData.unlockedFunctionList
        let playerData = GameModel.getInstance().getPlayerModel()
        let roleHero = playerData.getRoleHero();
        roleHero.level = newMsgData.newLevel;
        playerData.addVrmb(newMsgData.vrmb,Msg.TVRmbAddType.EVRmbAddType_LevelUp);
        NotifyMgr.getInstance().notify(NotifyMgr.event_player_levelup,newMsgData);
    }

    //--------------------兑换 ----begin-----------------------------
    private _responeReceiveGiftCodeAward(msgId: number, msgData: any){
        let newMsgData = msgData as Msg.GiftCodeAwardA;
        NotifyMgr.getInstance().notify(NotifyMgr.event_giftCode_award,newMsgData);
    }

    //兑换请求
    public requestGiftCodeAward(giftCode :string){
        const buffer_data = Msg.GiftCodeAwardR.encode({code : giftCode}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheGiftCodeAwardR,buffer_data);
    }

   //-------------------兑换------end------------------------
}
/**
 * 消息类只处理两个事件
 * 1.消息的发送
 * 2.返回消息时,确保对应的model数据绝对正确
 */