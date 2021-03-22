/*
 * @Author: zsy
 * @Date: 2021-03-22 10:20:03
 * @LastEditTime: 2021-03-22 11:06:55
 * @LastEditors: Please set LastEditors
 * @Description: 英雄背包扩展
 * @FilePath: \PreviewDemo\assets\scripts\game\control\msg\MsgHeroBagExtend.ts
 */
import { NetCallFunc } from "../../../core/network/NetInterface";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgHeroBagExtend extends MsgBase{
    public initData(){
        this.responeMap = new Map<number, [any, NetCallFunc, any]>([
            [Msg.MsgType.TheBuyHeroBagNumA, [Msg.BuyHeroBagNumA, this.responeBuyHeroBagNumA, this]],
        ]);
    }

    // 背包扩展
    public requestBuyHeroBagNumR(){
        let data = new Msg.BuyHeroBagNumR()
        const bufferData = Msg.BuyHeroBagNumR.encode(data).finish();
        this.msgMgr.sendData(Msg.MsgType.TheBuyHeroBagNumR, bufferData);
    }

    // 消息返回
    public responeBuyHeroBagNumA(msgId: number, msgData: Msg.BuyHeroBagNumA){
        // 更新钻石数目和背包购买数目
        // let playerModel = GameModel.getInstance().getPlayerModel()
        // NotifyMgr.getInstance().notify(NotifyMgr.....,msgData);
    }
}