import { NetCallFunc } from "../../../core/network/NetInterface";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgOffline extends MsgBase{
    public initData(){
        this.responeMap = new Map<number, [any, NetCallFunc, any]>([
            [Msg.MsgType.TheGainOfflineAwardA, [Msg.GainOfflineAwardA, this.responeGainOfflineAwardA, this]],
        ]);
    }

    // 领取离线奖励
    public requestGainOfflineAwardR(){
        let data = new Msg.GainOfflineAwardR()
        const bufferData = Msg.GainOfflineAwardR.encode(data).finish();
        this.msgMgr.sendData(Msg.MsgType.TheGainOfflineAwardR, bufferData);
    }

    // 离线奖励领取返回
    // message GainOfflineAwardA{
    //     TErrorCode err = 1;
    //     string errStr = 2;
    //     repeated LootObject awardList = 3;
    //     int32 offlineTime = 4;
    // }
    public responeGainOfflineAwardA(msgId: number, msgData: Msg.GainOfflineAwardA){
        // if ((msgData as any).TErrorCode != Msg.TErrorCode.ERR_OK) {
        //     console.log("errStr : ", msgData.errStr);
        //     return
        // }
        let offlineModel = GameModel.getInstance().getOfflineModel()
        offlineModel.setBonusInfo(msgData)
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_offline,msgData);
    }
}