
import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgHeroPub extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheSummonHeroA,[Msg.SummonHeroA,this.responeSummonHeroA,this]],
            [Msg.MsgType.TheSummonHeroR,[Msg.SummonHeroR,this.responeSummonHeroB,this]],
        ]);
    }

    //钻石召唤
    public requestSummonHeroA(newSummonData:Msg.SummonHeroA)
    {
        const buffer_data = Msg.SummonHeroA.encode(newSummonData).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheSummonHeroA,buffer_data);
    }

    //友情召唤
    public requestSummonHeroF(newSummonData:Msg.SummonHeroR)
    {
        const buffer_data = Msg.SummonHeroR.encode(newSummonData).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheSummonHeroR,buffer_data);
    }
    public responeSummonHeroA(msgId: number, msgData: Msg.SummonHeroA){

    }
    public responeSummonHeroB(msgId: number, msgData: Msg.SummonHeroR){

    }
    
}
