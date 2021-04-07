/*
 * @Description: 阵容图鉴等协议收发处理
 * @Author: xxxxxx
 * @Date: 2021-03-02 13:53:04
 * @LastEditTime: 2021-04-01 11:39:16
 */

import { NetCallFunc } from "../../../core/network/NetInterface";
import { HeroData } from "../../model/datas/HeroData";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { PopMgr } from "../PopMgr";
import { MsgBase } from "./MsgBase";

export class MsgFormation extends MsgBase {

    public initData() {
        this.responeMap = new Map<number, [any, NetCallFunc, any]>([
            [Msg.MsgType.TheChangeFormationA, [Msg.ChangeFormationA, this.responeChangeBattleTeam, this]],
            [Msg.MsgType.TheHeroBookActiveA, [Msg.HeroBookActiveA, this._responeHeroBookActiveRsp, this]],
            [Msg.MsgType.TheHeroBookLevelUpA, [Msg.HeroBookLevelUpA, this._responeUpgradeHeroBookRsp, this]],
            [Msg.MsgType.TheGetHeroBookAwardA, [Msg.GetHeroBookAwardA, this._responGetBookHeroRewardRsp, this]],
        ]);
    }

    //更换阵容
    public requestChangeBattleTeam(newTeamData: Msg.FormationInfo, defaultNum: number, idleNum: number, _petID: number) {
        const buffer_data = Msg.ChangeFormationR.encode({ newFormation: newTeamData, defaultFormation: defaultNum, idleFormation: idleNum, PetID: _petID }).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheChangeFormationR, buffer_data);
    }
    public responeChangeBattleTeam(msgId: number, msgData: any) {
        console.log("更换阵容数据返回", msgId);
        let newMsgData = msgData as Msg.ChangeFormationA
        if (newMsgData.err == 0) {
            GameModel.getInstance().getFormationModel().setCurFormationChange(newMsgData)
        }
        else {
            console.log("打印输出错误码", newMsgData.err, newMsgData.errStr)
        }

    }
    //更换阵容

    //请求激活图鉴
    public requestHeroBookActive(bookHeroid: number) {
        const buffer_data = Msg.HeroBookActiveR.encode({ heroBookId: bookHeroid }).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroBookActiveR, buffer_data);
    }

    private _responeHeroBookActiveRsp(msgId: number, msgData: any) {
        let newMsgData = msgData as Msg.HeroBookActiveA;
        console.log("激活图鉴返回", msgId, msgData.hbu.heroBookId);
        let bookHeroList = GameModel.getInstance().getHeroesModel().getBookMap();
        if (bookHeroList.has(msgData.hbu.heroBookId)) {
            let bookHeroData = GameModel.getInstance().getHeroesModel().getBookHeroDataByBookId(msgData.hbu.heroBookId);
            bookHeroData = msgData.hbu;
            bookHeroList.delete(bookHeroData.heroBookId);
            bookHeroList.set(bookHeroData.heroBookId, bookHeroData);
            let value = bookHeroList.get(msgData.hbu.heroBookId);

            let heroStaticID = HeroData.getHeroStaticIdByBookId(msgData.hbu.heroBookId)
            PopMgr.getInstance().popBookHeroActiveView(heroStaticID)
            GameModel.getInstance().getHeroesModel().refreshHeroBookProperty()
            //抛通知  界面数据变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_hero_book_active, bookHeroData);
        }
    }

    //请求升级英雄图鉴
    public requestUpgradeHeroBook(bookHeroid: number) {
        const buffer_data = Msg.HeroBookLevelUpR.encode({ heroBookId: bookHeroid }).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroBookLevelUpR, buffer_data);
    }

    private _responeUpgradeHeroBookRsp(msgId: number, msgData: any) {
        let newMsgData = msgData as Msg.HeroBookLevelUpA;
        console.log("升级英雄图鉴返回", msgId, msgData.hbu.heroBookId);
        let bookHeroList = GameModel.getInstance().getHeroesModel().getBookMap();
        if (bookHeroList.has(msgData.hbu.heroBookId)) {
            let bookHeroData = GameModel.getInstance().getHeroesModel().getBookHeroDataByBookId(msgData.hbu.heroBookId);
            bookHeroData = msgData.hbu;
            bookHeroList.delete(bookHeroData.heroBookId);
            bookHeroList.set(bookHeroData.heroBookId, bookHeroData);
            let value = bookHeroList.get(msgData.hbu.heroBookId);

            GameModel.getInstance().getHeroesModel().refreshHeroBookProperty()
            //抛通知  界面数据变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_hero_book_upgrade, bookHeroData);

        }
    }

    //请求领取图鉴奖励
    public requestGetBookHeroReward(staticId: number) {
        const buffer_data = Msg.GetHeroBookAwardR.encode({ heroStaticID: staticId }).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheGetHeroBookAwardR, buffer_data);
    }

    private _responGetBookHeroRewardRsp(msgId: number, msgData: any) {
        let newMsgData = msgData as Msg.GetHeroBookAwardA;
        let bookid = HeroData.GetHeroBookID(newMsgData.heroStaticID);
        let bookHeroList = GameModel.getInstance().getHeroesModel().getBookMap();
        if (bookHeroList.has(bookid)) {
            let bookHeroData = GameModel.getInstance().getHeroesModel().getBookHeroDataByBookId(bookid);
            bookHeroData.isGetAward = true;
            bookHeroList.delete(bookHeroData.heroBookId);
            bookHeroList.set(bookHeroData.heroBookId, bookHeroData);
            let value = bookHeroList.get(bookid);

            let heroStaticID = HeroData.getHeroStaticIdByBookId(bookid)
            //抛通知  界面数据变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_hero_book_upgrade, bookHeroData);
        }
        //获得道具--钻石
        PopMgr.getInstance().popItemRewardView(Msg.TObjectType.EObject_VRmb, newMsgData.vrmb)

    }


}