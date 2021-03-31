
import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgHeroReplace extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheClassesExchangeA,[Msg.ClassesExchangeA,this.responeClassesExchangeA,this]],
            // [Msg.MsgType.TheHeroDecomposeA,[Msg.HeroDecomposeA,this.responeHeroDecomposeA,this]],
        ]);
    }

    //阵营职业置换请求
    // message ClassesExchangeR {
    //     int64 heroID = 1;
    // }
    public requestClassesExchangeR(dyncId: number)
    {
        let data = new Msg.ClassesExchangeR()
        data.heroID = dyncId
        const bufferData = Msg.ClassesExchangeR.encode(data).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheClassesExchangeR,bufferData);
    }

    //阵营职业置换应答
    // message ClassesExchangeA {
    //     TErrorCode err = 1;
    //     string errStr = 2;
    //     ClassesExchangeInfo exchangeInfo = 3;
    //     int32 consumeMiracleShard = 4;
    // }
    public responeClassesExchangeA(msgId: number, msgData: Msg.ClassesExchangeA){
        if (msgData.err == Msg.TErrorCode.ERR_OK) {
            let playerModel = GameModel.getInstance().getPlayerModel();
            // 消耗物品
            playerModel.consumeObjectEx(Msg.TObjectType.EObject_MiracleShard, 
                msgData.consumeMiracleShard, Msg.TObjectConsumeType.EObjectConsumeType_HeroExchange)
            
            // 通知英雄置换
            NotifyMgr.getInstance().notify(NotifyMgr.event_net_camp_change, msgData);
        }
        else {
            console.log('responeClassesExchangeA',msgData.err)
        }

        
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_pub_summon_hero,msgData);
    }


    //分解英雄请求
    // public requestHeroDecomposeR(newHeroDecomposeData : Msg.HeroDecomposeR)
    // {
    //     console.log("requestHeroDecomposeR",newHeroDecomposeData);
    //     const buffer_data = Msg.HeroDecomposeR.encode(newHeroDecomposeData).finish();
    //     this.msgMgr?.sendData(Msg.MsgType.TheHeroDecomposeR,buffer_data);
    // }

    // //分解英雄回复
    // public responeHeroDecomposeA(msgId: number, msgData: Msg.HeroDecomposeA)
    // {
    //     console.log("requestHeroDecomposeA",msgId,msgData);
    //     NotifyMgr.getInstance().notify(NotifyMgr.event_net_pub_hero_decompose,msgData);
    // }    
}
