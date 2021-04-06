
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
            [Msg.MsgType.TheClassesExchangeConfirmA,[Msg.ClassesExchangeConfirmA,this.responeClassesExchangeConfirmA,this]],
        ]);
    }

    //阵营职业置换请求
    public requestClassesExchangeR(dyncId: number)
    {
        let data = new Msg.ClassesExchangeR()
        data.heroID = dyncId
        const bufferData = Msg.ClassesExchangeR.encode(data).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheClassesExchangeR,bufferData);
    }

    //阵营职业置换应答
    public responeClassesExchangeA(msgId: number, msgData: Msg.ClassesExchangeA){
        if (msgData.err == Msg.TErrorCode.ERR_OK) {
            let playerModel = GameModel.getInstance().getPlayerModel();
            // 消耗物品
            playerModel.consumeObjectByNum(Msg.TObjectType.EObject_MiracleShard, 
                msgData.consumeMiracleShard, Msg.TObjectConsumeType.EObjectConsumeType_HeroExchange)
            
            // 通知英雄置换
            NotifyMgr.getInstance().notify(NotifyMgr.event_net_camp_change, msgData);
        }
        else {
            console.log('responeClassesExchangeA',msgData.err)
        }
    }

    //确定置换英雄请求
    public requestClassesExchangeConfirmR(heroId: number, newDyncId: number)
    {
        let data = new Msg.ClassesExchangeConfirmR()
        data.exchangeInfo = new Msg.ClassesExchangeInfo({
            heroID : heroId,
            newHeroStaticID : newDyncId
        })
    
        const bufferData = Msg.ClassesExchangeConfirmR.encode(data).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheClassesExchangeConfirmR,bufferData);
    }

    //确定置换英雄应答
    public responeClassesExchangeConfirmA(msgId: number, msgData: Msg.ClassesExchangeConfirmA)
    {
        if (msgData.err == Msg.TErrorCode.ERR_OK) {            
            // 通知英雄置换
            NotifyMgr.getInstance().notify(NotifyMgr.event_net_camp_change_confirm, msgData);
        }
        else {
            console.log("responeClassesExchangeConfirmA",msgData.err);
        }
    }    
}
