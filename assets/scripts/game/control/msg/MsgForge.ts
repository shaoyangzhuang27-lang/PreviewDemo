/*
 * @Author: zsy
 * @Date: 2021-03-22 10:20:03
 * @LastEditTime: 2021-03-24 11:26:30
 * @LastEditors: Please set LastEditors
 * @Description: 锻造
 * @FilePath: \PreviewDemo\assets\scripts\game\control\msg\MsgForge.ts
 */
import { Game } from "cc";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { XConsts } from "../../model/const/XConsts";
import { ForgeModel } from "../../model/datas/ForgeModel";
import { PlayerModel } from "../../model/datas/PlayerModel";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { PopMgr } from "../PopMgr";
import { MsgBase } from "./MsgBase";

export class MsgForge extends MsgBase{
    public initData(){
        this.responeMap = new Map<number, [any, NetCallFunc, any]>([
            [Msg.MsgType.TheComposeEquipA, [Msg.ComposeEquipA, this.responeComposeEquipA, this]],
            [Msg.MsgType.TheComposeEquipMultiA, [Msg.ComposeEquipMultiA, this.responeComposeEquipMultiA, this]],
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
    //     int32 equipID = 3;               // 合成装备id
    //     int32 composeNum = 4;            // 合成的数量
    //     int32 consumeMoney = 5;          // 花费的金币
    // }
    public responeComposeEquipA(msgId: number, msgData: Msg.ComposeEquipA){
        console.log("装备合成成功")

        let bagItemModel = GameModel.getInstance().getBagModel()
        // 添加新装备(通过playerModel还是通过bagitemModel)
        let forgeModel = GameModel.getInstance().getForgeModel()
        let equipData = forgeModel.getConfigEquipDataById(msgData.equipID)
        bagItemModel.changeBagEquipNumber(msgData.equipID, -msgData.composeNum)

        // 删除材料装备
        let costNum = msgData.composeNum * XConsts.KEquipComposeMaterialNum
        bagItemModel.changeBagEquipNumber(equipData.forwardId, costNum)
        
        // 扣除消耗金币 msgData.consumeMoney
        let playerModel = GameModel.getInstance().getPlayerModel()
        playerModel.subMoney(equipData.composeMoney * msgData.composeNum, Msg.TMoneySubType.EMoneySubType_EquipCompose)
        
        // 弹窗
        PopMgr.getInstance().popItemRewardView(msgData.equipID, msgData.composeNum)
        // 广播刷新金币和装备(金币通过playerModel)
        NotifyMgr.getInstance().notify(NotifyMgr.event_equip_compose_suc, msgData);
    }

    // 一键合成
    public requestComposeEquipMultiR(equipType: Msg.TEquipLocationType) {
        let data = new Msg.ComposeEquipMultiR()
        data.equipType = equipType
        const bufferData = Msg.ComposeEquipMultiR.encode(data).finish();
        this.msgMgr.sendData(Msg.MsgType.TheComposeEquipMultiR, bufferData);
    }   

    // message ComposeEquipMultiA {
    //     TErrorCode err = 1;
    //     string strErr = 2;
    //     TEquipLocationType equipType = 3;                    // 位置
    //     int32 consumeMoney = 4;                              // 花费的金币
    //     map < int32, int32 > changedEquipList = 5;           // 合成后的装备<id, number>
    //     map < int32, int32 > composeEquipList = 6;           // 装备数目（成就系统用？）
    // }
    public responeComposeEquipMultiA(msgId: number, msgData: Msg.ComposeEquipMultiA) {
        console.log("装备合成成功")

        let forgeModel = GameModel.getInstance().getForgeModel()
        let bagItemModel = GameModel.getInstance().getBagModel()
        // 获得得装备<id, count>
        let addEquips:Map<number, number>= new Map<number, number>()
        for (let equipId in msgData.changedEquipList){
            // changeBagEquipNumber 里面用 new = old - change -- 服了！！！
            let change = forgeModel.getBagEquipCount(Number(equipId)) - msgData.changedEquipList[equipId]
            bagItemModel.changeBagEquipNumber(Number(equipId), change)
            if(change < 0){// 比原来多
                addEquips.set(Number(equipId), -change)
            }
        }
        // 扣除消耗金币 msgData.consumeMoney
        let playerModel = GameModel.getInstance().getPlayerModel()
        playerModel.subMoney(msgData.consumeMoney, Msg.TMoneySubType.EMoneySubType_EquipCompose)

        // msgData.ComposeEquipList 源代码给成就系统用
        let showEquipArr: XStruct.prop_info.IRecord[] = []
        for(let [id, addCount] of addEquips){
            let equipConfig = forgeModel.getConfigEquipDataById(id)
            let record : XStruct.prop_info.IRecord = {
                nType : Msg.TObjectType.EObject_Equip,
                nPropId : equipConfig.id,
                nLevel : equipConfig.star,
                nPropQuality : equipConfig.quality,
                num : addCount,
            }
            showEquipArr.push(record)
        }
        PopMgr.getInstance().popMultiItemRewardWindow(showEquipArr)

        // 广播刷新金币和装备(金币通过playerModel)
        NotifyMgr.getInstance().notify(NotifyMgr.event_equip_compose_suc, msgData);
    }
    
}