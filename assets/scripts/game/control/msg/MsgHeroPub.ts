
import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgHeroPub extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheSummonHeroA,[Msg.SummonHeroA,this.responeSummonHeroA,this]],
            [Msg.MsgType.TheHeroDecomposeA,[Msg.HeroDecomposeA,this.responeHeroDecomposeA,this]],
            [Msg.MsgType.TheWonderSummonHeroA,[Msg.WonderSummonHeroA,this.responeWonderSummonHeroA,this]],
            [Msg.MsgType.TheWonderHeroSelectA,[Msg.WonderHeroSelectA,this.responeWonderHeroSelectA,this]],
        ]);
    }

    //召唤请求
    public requestSummonHeroR(newSummonData:Msg.SummonHeroR)
    {
        console.log("requestSummonHeroR",newSummonData);
        const buffer_data = Msg.SummonHeroR.encode(newSummonData).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheSummonHeroR,buffer_data);
    }

     //召唤回复
    public responeSummonHeroA(msgId: number, msgData: Msg.SummonHeroA){
        console.log("responeSummonHeroA",msgId,msgData);
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_pub_summon_hero,msgData);
    }


    //分解英雄请求
    public requestHeroDecomposeR(newHeroDecomposeData : Msg.HeroDecomposeR)
    {
        console.log("requestHeroDecomposeR",newHeroDecomposeData);
        const buffer_data = Msg.HeroDecomposeR.encode(newHeroDecomposeData).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroDecomposeR,buffer_data);
    }

    //分解英雄回复
    public responeHeroDecomposeA(msgId: number, msgData: Msg.HeroDecomposeA)
    {
        console.log("requestHeroDecomposeA",msgId,msgData);
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_pub_hero_decompose,msgData);
    }


    //奇迹召唤请求
    public requestWonderSummonHeroR(newSummonData:Msg.WonderSummonHeroR)
    {
        console.log("requestWonderSummonHeroR",newSummonData);
        const buffer_data = Msg.WonderSummonHeroR.encode(newSummonData).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheWonderSummonHeroR,buffer_data);
    }

    //奇迹召唤回复
    public responeWonderSummonHeroA(msgId: number, msgData: Msg.WonderSummonHeroA){
        console.log("responeWonderSummonHeroA",msgId,msgData);
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_pub_wonder_summon_hero,msgData);
    }

     //奇迹心愿英雄请求
     public requestWonderHeroSelectR(newSummonData:Msg.WonderHeroSelectR)
     {
         console.log("requestWonderHeroSelectR",newSummonData);
         const buffer_data = Msg.WonderHeroSelectR.encode(newSummonData).finish();
         this.msgMgr?.sendData(Msg.MsgType.TheWonderHeroSelectR,buffer_data);
     }
 
     //奇迹心愿回复
     public responeWonderHeroSelectA(msgId: number, msgData: Msg.WonderHeroSelectA){
         console.log("responeWonderHeroSelectA",msgId,msgData);
         NotifyMgr.getInstance().notify(NotifyMgr.event_net_pub_wonder_hero_select,msgData);
     }
    
}
