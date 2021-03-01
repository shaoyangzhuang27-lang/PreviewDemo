import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgGame extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheGetCacheChatListA,[Msg.GetCacheChatListA,this.responeGetCacheChatListA,this]],
            [Msg.MsgType.ThePong,[Msg.Pong,this.responePong,this]],
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
}
/**
 * 消息类只处理两个事件
 * 1.消息的发送
 * 2.返回消息时,确保对应的model数据绝对正确
 */