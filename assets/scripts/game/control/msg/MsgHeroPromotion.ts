/*
 * @Description: 英雄升级升阶装备等协议收发处理
 * @Author: 徐涛
 * @Date: 2021-04-01 11:31:52
 * @LastEditTime: 2021-04-01 11:38:19
 */
import { NetCallFunc } from "../../../core/network/NetInterface";
import { GameModel } from "../../model/GameModel";
import { MsgBase } from "./MsgBase";

export class MsgHeroPromotion extends MsgBase {

    public initData() {
        this.responeMap = new Map<number, [any, NetCallFunc, any]>([
            [Msg.MsgType.TheHeroTierUpA, [Msg.HeroTierUpA, this.responeHeroTierUp, this]],
            [Msg.MsgType.ThePutOnEquipA, [Msg.PutOnEquipA, this.responeHeroPutOnEquip, this]],
            [Msg.MsgType.TheTakeOffEquipA, [Msg.TakeOffEquipA, this.responeHeroTakeOffEquip, this]],
        ]);
    }

    //英雄升级,升阶,装备(一键装备,全部卸下)--------------------start    
    public requestHeroTierUp(heroID: number) {
        console.log("英雄升阶-----请求");
        const buffer_data = Msg.HeroTierUpR.encode({ heroID: heroID }).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroTierUpR, buffer_data);
    }
    public responeHeroTierUp(msgId: number, msgData: any) {
        console.log("英雄升阶-----返回", msgId);
        let newMsgData = msgData as Msg.HeroTierUpA;
        if (newMsgData) {
            GameModel.getInstance().getHeroesModel().setHeroTierUp(newMsgData)
        }
    }

    public requestHeroLvUp(heroID: number) {
        console.log("英雄升级-----请求");
        const buffer_data = Msg.HeroUpgradeR.encode({ heroID: heroID }).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheSyncHeroUpgrade, buffer_data);
    }

    // public responeHeroLvUp(msgId: number, msgData: any){
    //     console.log("英雄升级-----返回",msgId);
    //     let newMsgData = msgData as Msg.HeroUpgradeA;
    //     if(newMsgData)
    //     {
    //         GameModel.getInstance().getHeroesModel().setHeroLvUp(newMsgData)      
    //     }        
    // }

    public requestHeroLocked(heroID: number, isLocked: boolean) {
        console.log("英雄锁定-----请求");
        const buffer_data = Msg.SyncHeroLocked.encode({ heroID: heroID, isLocked: isLocked }).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheSyncHeroLocked, buffer_data);
    }

    // public responeHeroLocked(msgId: number, msgData: any){
    //     console.log("英雄锁定-----响应",msgId);
    //     let newMsgData = msgData as Msg.SyncHeroLocked;
    //     if(newMsgData)
    //     {
    //         GameModel.getInstance().getHeroesModel().setHeroLocked(newMsgData);
    //     }
    // }

    /**
     * @description: 发送聊天
     * @param content 聊天文字
     * @param chatChannel 聊天频道
     */
    public requestChat(content: string, chatChannel: Msg.TChatChannelType) {
        console.log("英雄升级分享发送到聊天-----请求");
        const buffer_data = Msg.SyncChat.encode({ content: content, chatChannel: chatChannel }).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheSyncChat, buffer_data);
    }

    // 英雄穿上装备
    public requestHeroPutOnEquip(heroID: number, putonEquipIDList: number[]) {
        console.log("英雄穿上装备-----请求");
        const buffer_data = Msg.PutOnEquipR.encode({ heroID: heroID, putonEquipIDList: putonEquipIDList }).finish();
        this.msgMgr?.sendData(Msg.MsgType.ThePutOnEquipR, buffer_data);
    }
    public responeHeroPutOnEquip(msgId: number, msgData: any) {
        console.log("英雄穿上装备-----响应", msgId);
        let newMsgData = msgData as Msg.PutOnEquipA;
        if (newMsgData) {
            GameModel.getInstance().getHeroesModel().setHeroPutOnEquip(newMsgData);
        }
    }

    // 英雄卸下装备
    public requestHeroTakeOffEquip(heroID: number, takeoffEquipLocList: number[]) {
        console.log("英雄卸下装备-----请求");
        const buffer_data = Msg.TakeOffEquipR.encode({ heroID: heroID, takeoffEquipLocList: takeoffEquipLocList }).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheTakeOffEquipR, buffer_data);
    }
    public responeHeroTakeOffEquip(msgId: number, msgData: any) {
        console.log("英雄卸下装备-----响应", msgId);
        let newMsgData = msgData as Msg.TakeOffEquipA;
        if (newMsgData) {
            GameModel.getInstance().getHeroesModel().setHeroTakeOffEquip(newMsgData);
        }
    }
    //英雄升级,升阶,装备(一键装备,全部卸下)--------------------end


}