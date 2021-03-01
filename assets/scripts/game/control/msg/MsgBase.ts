import {MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { NotifyMgr } from "../NotifyMgr";

export class MsgBase{

    protected msgMgr:MsgCore = null as unknown as MsgCore;
    protected  responeMap:Map<number,[any,NetCallFunc,any]> | null = null;


    constructor(msgMgr:MsgCore){
        this.msgMgr = msgMgr;
    }
    public initData(){
        // this.responeMap = new Map<number,[any,NetCallFunc,any]>([
        //     [Msg.MsgType.TheGetCacheChatListA,[Msg.GetCacheChatListA,this.responeGetCacheChatListA,this]],
        //     [Msg.MsgType.ThePong,[Msg.Pong,this.responePong,this]],
        // ]);
    }
    public getResponeMap(){
        return this.responeMap;
    }
    public initHandle(channelId: number = 0){
        this.responeMap?.forEach((value:any, key:number) => {
            NetManager.getInstance().getNetNode(channelId).addResponeHandler(key, value[1],value[2]);
        })
    }
    
}