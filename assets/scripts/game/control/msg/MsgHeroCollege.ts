/*
 * @Description: 英雄学院协议收发处理
 * @Author: 徐涛
 * @Date: 2021-04-01 11:32:09
 * @LastEditTime: 2021-04-01 20:36:06
 */
import { NetCallFunc } from "../../../core/network/NetInterface";
import { GameModel } from "../../model/GameModel";
import { MsgBase } from "./MsgBase";

export class MsgHeroCollege extends MsgBase {

    public initData() {
        this.responeMap = new Map<number, [any, NetCallFunc, any]>([
            [Msg.MsgType.TheSetCollegeHeroA, [Msg.SetCollegeHeroA, this.responeSetCollegeHero, this]],
            [Msg.MsgType.TheOpenCollegeBlockA, [Msg.OpenCollegeBlockA, this.responeOpenCollegeBlock, this]],
        ]);
    }

    //设置英雄到书院槽位
    public requestSetCollegeHero(heroId: number, isAdd: boolean, pos: number) {
        console.log("设置学院英雄-----请求");
        const buffer_data = Msg.SetCollegeHeroR.encode({ heroId: heroId, isAdd: isAdd, pos: pos }).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheSetCollegeHeroR, buffer_data);
    }

    public responeSetCollegeHero(msgId: number, msgData: any) {
        console.log("设置学院英雄-----响应", msgId);
        let newMsgData = msgData as Msg.SetCollegeHeroA;
        if (newMsgData) {
            GameModel.getInstance().getHeroesModel().setCollegeHeroInfo(newMsgData);
        }
    }

    //英雄书院开启新格
    public requestOpenCollegeBlock(isUseVrmb: boolean) {
        console.log("英雄书院开启新格-----请求");
        const buffer_data = Msg.OpenCollegeBlockR.encode({ useVrmb: isUseVrmb }).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheOpenCollegeBlockR, buffer_data);
    }

    public responeOpenCollegeBlock(msgId: number, msgData: any) {
        console.log("英雄书院开启新格-----响应", msgId);
        let newMsgData = msgData as Msg.OpenCollegeBlockA;
        if (newMsgData) {
            GameModel.getInstance().getHeroesModel().openCollegeBlock(newMsgData);
        }
    }

}