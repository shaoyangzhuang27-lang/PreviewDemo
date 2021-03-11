
import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgHeroPub extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheSummonHeroR,[Msg.SummonHeroR,this.responeSummonHeroR,this]],
        ]);
    }

    public requestSummonHeroR(newSummonData:Msg.SummonHeroR)
    {
        const buffer_data = Msg.SummonHeroR.encode(newSummonData).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheSummonHeroR,buffer_data);
    }

    public responeSummonHeroR(msgId: number, msgData: Msg.SummonHeroR){
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_pub_summon_hero,msgData);
    }

    
}
