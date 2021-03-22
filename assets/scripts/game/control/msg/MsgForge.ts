/*
 * @Author: zsy
 * @Date: 2021-03-22 10:20:03
 * @LastEditTime: 2021-03-22 15:13:44
 * @LastEditors: Please set LastEditors
 * @Description: 锻造
 * @FilePath: \PreviewDemo\assets\scripts\game\control\msg\MsgForge.ts
 */
import { NetCallFunc } from "../../../core/network/NetInterface";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { PopMgr } from "../PopMgr";
import { MsgBase } from "./MsgBase";

export class MsgForge extends MsgBase{
    public initData(){
        this.responeMap = new Map<number, [any, NetCallFunc, any]>([
            [Msg.MsgType.TheComposeEquipA, [Msg.ComposeEquipA, this.responeComposeEquipA, this]],
        ]);
    }

    // 装备合成
    public requestComposeEquipR(equipId: number, composeCount: number){
        let data = new Msg.ComposeEquipR()
        data.composeNum = composeCount
        data.equipID = equipId
        const bufferData = Msg.ComposeEquipR.encode(data).finish();
        this.msgMgr.sendData(Msg.MsgType.TheComposeEquipR, bufferData);
    }

    // 装备合成返回
    //     message ComposeEquipA{
    //     TErrorCode err = 1;
    //     string errStr = 2;
    //     int32 equipID = 3;
    //     int32 composeNum = 4;
    //     int32 consumeMoney = 5;
    // }
    public responeComposeEquipA(msgId: number, msgData: Msg.ComposeEquipA){
        console.log("装备合成成功")
        // 删除材料装备
        // 添加新装备
        // 扣除消耗金币 msgData.consumeMoney
        // 刷新金币
        PopMgr.getInstance().popItemRewardView(msgData.equipID, msgData.composeNum)

        // let playerModel = GameModel.getInstance().getPlayerModel()
        // NotifyMgr.getInstance().notify(NotifyMgr.....,msgData);
    }

    // 一键合成
}