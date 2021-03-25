/*
 * @Description: 协议收发处理
 * @Author: xxxxxx
 * @Date: 2021-03-02 13:53:04
 * @LastEditTime: 2021-03-25 14:20:56
 */

import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { HeroData } from "../../model/datas/HeroData";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { PopMgr } from "../PopMgr";
import { MsgBase } from "./MsgBase";

export class MsgFormation extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheChangeFormationA,[Msg.ChangeFormationA,this.responeChangeBattleTeam,this]],
            [Msg.MsgType.TheHeroTierUpA,[Msg.HeroTierUpA,this.responeHeroTierUp,this]],
            // [Msg.MsgType.TheHeroUpgradeA,[Msg.HeroUpgradeA,this.responeHeroLvUp,this]],
            // [Msg.MsgType.TheSyncHeroLocked,[Msg.SyncHeroLocked,this.responeHeroLocked,this]],
            [Msg.MsgType.ThePutOnEquipA,[Msg.PutOnEquipA,this.responeHeroPutOnEquip,this]],
            [Msg.MsgType.TheTakeOffEquipA,[Msg.TakeOffEquipA,this.responeHeroTakeOffEquip,this]],
            [Msg.MsgType.TheHeroBookActiveA,[Msg.HeroBookActiveA,this._responeHeroBookActiveRsp,this]],
            [Msg.MsgType.TheHeroBookLevelUpA,[Msg.HeroBookLevelUpA,this._responeUpgradeHeroBookRsp,this]],
            [Msg.MsgType.TheGetHeroBookAwardA,[Msg.GetHeroBookAwardA,this._responGetBookHeroRewardRsp,this]],
        ]);
    }

    //更换阵容
    public requestChangeBattleTeam(newTeamData:Msg.FormationInfo, defaultNum:number,idleNum:number,_petID:number)
    {
        const buffer_data = Msg.ChangeFormationR.encode({newFormation:newTeamData, defaultFormation:defaultNum, idleFormation:idleNum,PetID:_petID}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheChangeFormationR,buffer_data);
    }
    public responeChangeBattleTeam(msgId: number, msgData: any){
        console.log("更换阵容数据返回",msgId);
        let newMsgData = msgData as Msg.ChangeFormationA
        if(newMsgData.err == 0)
        {
            GameModel.getInstance().getFormationModel().setCurFormationChange(newMsgData)
        }
        else{
            console.log("打印输出错误码",newMsgData.err,newMsgData.errStr)
        }
        
    }
    //更换阵容

    //英雄升级,升阶,装备(一键装备,全部卸下)--------------------start    
    public requestHeroTierUp(heroID:number)
    {
        console.log("英雄升阶-----请求");
        const buffer_data = Msg.HeroTierUpR.encode({heroID:heroID}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroTierUpR,buffer_data);
    }
    public responeHeroTierUp(msgId: number, msgData: any){
        console.log("英雄升阶-----返回",msgId);
        let newMsgData = msgData as Msg.HeroTierUpA;
        if(newMsgData)
        {
            GameModel.getInstance().getHeroesModel().setHeroTierUp(newMsgData)      
        }        
    }

    public requestHeroLvUp(heroID:number)
    {
        console.log("英雄升级-----请求");
        const buffer_data = Msg.HeroUpgradeR.encode({heroID:heroID}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheSyncHeroUpgrade,buffer_data);     
    }

    // public responeHeroLvUp(msgId: number, msgData: any){
    //     console.log("英雄升级-----返回",msgId);
    //     let newMsgData = msgData as Msg.HeroUpgradeA;
    //     if(newMsgData)
    //     {
    //         GameModel.getInstance().getHeroesModel().setHeroLvUp(newMsgData)      
    //     }        
    // }

    public requestHeroLocked(heroID:number, isLocked:boolean){
        console.log("英雄锁定-----请求");
        const buffer_data = Msg.SyncHeroLocked.encode({heroID: heroID, isLocked: isLocked}).finish();
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

    // 英雄穿上装备
    public requestHeroPutOnEquip(heroID:number, putonEquipIDList:number[]){
        console.log("英雄穿上装备-----请求");
        const buffer_data = Msg.PutOnEquipR.encode({heroID: heroID, putonEquipIDList: putonEquipIDList}).finish();
        this.msgMgr?.sendData(Msg.MsgType.ThePutOnEquipR, buffer_data);
    }
    public responeHeroPutOnEquip(msgId: number, msgData: any){
        console.log("英雄穿上装备-----响应",msgId);
        let newMsgData = msgData as Msg.PutOnEquipA;
        if(newMsgData)
        {
            GameModel.getInstance().getHeroesModel().setHeroPutOnEquip(newMsgData);
        }
    }

    // 英雄卸下装备
    public requestHeroTakeOffEquip(heroID:number, takeoffEquipLocList:number[]){
        console.log("英雄卸下装备-----请求");
        const buffer_data = Msg.TakeOffEquipR.encode({heroID: heroID, takeoffEquipLocList: takeoffEquipLocList}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheTakeOffEquipR, buffer_data);
    }
    public responeHeroTakeOffEquip(msgId: number, msgData: any){
        console.log("英雄卸下装备-----响应",msgId);
        let newMsgData = msgData as Msg.TakeOffEquipA;
        if(newMsgData)
        {
            GameModel.getInstance().getHeroesModel().setHeroTakeOffEquip(newMsgData);
        }
    }
    //英雄升级,升阶,装备(一键装备,全部卸下)--------------------start


    //请求激活图鉴
    public requestHeroBookActive(bookHeroid:number)
    {
       const buffer_data = Msg.HeroBookActiveR.encode({heroBookId:bookHeroid}).finish();
       this.msgMgr?.sendData(Msg.MsgType.TheHeroBookActiveR,buffer_data);
    }

    private _responeHeroBookActiveRsp(msgId: number, msgData: any)
    {        
        let newMsgData = msgData as Msg.HeroBookActiveA;
        console.log("激活图鉴返回",msgId,msgData.hbu.heroBookId);
        let bookHeroList = GameModel.getInstance().getHeroesModel().getBookMap();
        if(bookHeroList.has(msgData.hbu.heroBookId))
        {
            let bookHeroData = GameModel.getInstance().getHeroesModel().getBookHeroDataByBookId(msgData.hbu.heroBookId);
            bookHeroData = msgData.hbu;
            bookHeroList.delete(bookHeroData.heroBookId);
            bookHeroList.set(bookHeroData.heroBookId,bookHeroData);
            let value = bookHeroList.get(msgData.hbu.heroBookId);

            let heroStaticID = HeroData.getHeroStaticIdByBookId(msgData.hbu.heroBookId)
            PopMgr.getInstance().popBookHeroActiveView(heroStaticID)
            GameModel.getInstance().getHeroesModel().refreshHeroBookProperty()
            //抛通知  界面数据变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_hero_book_active,bookHeroData);
        } 
    }

    //请求升级英雄图鉴
    public requestUpgradeHeroBook(bookHeroid:number)
    {
        const buffer_data = Msg.HeroBookLevelUpR.encode({heroBookId:bookHeroid}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroBookLevelUpR,buffer_data);        
    }

    private _responeUpgradeHeroBookRsp(msgId: number, msgData: any)
    {        
        let newMsgData = msgData as Msg.HeroBookLevelUpA;
        console.log("升级英雄图鉴返回",msgId,msgData.hbu.heroBookId);
        let bookHeroList = GameModel.getInstance().getHeroesModel().getBookMap();
        if(bookHeroList.has(msgData.hbu.heroBookId))
        {
            let bookHeroData = GameModel.getInstance().getHeroesModel().getBookHeroDataByBookId(msgData.hbu.heroBookId);
            bookHeroData = msgData.hbu;
            bookHeroList.delete(bookHeroData.heroBookId);
            bookHeroList.set(bookHeroData.heroBookId,bookHeroData);
            let value = bookHeroList.get(msgData.hbu.heroBookId);

            GameModel.getInstance().getHeroesModel().refreshHeroBookProperty()
            //抛通知  界面数据变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_hero_book_upgrade,bookHeroData);
            
        }
    }

    //请求领取图鉴奖励
    public requestGetBookHeroReward(staticId:number)
    {
        const buffer_data = Msg.GetHeroBookAwardR.encode({heroStaticID:staticId}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheGetHeroBookAwardR,buffer_data);
    }

    private _responGetBookHeroRewardRsp(msgId:number,msgData:any)
    {
        let newMsgData = msgData as Msg.GetHeroBookAwardA;
        let bookid = HeroData.GetHeroBookID(newMsgData.heroStaticID);
        let bookHeroList = GameModel.getInstance().getHeroesModel().getBookMap();
        if(bookHeroList.has(bookid))
        {
            let bookHeroData = GameModel.getInstance().getHeroesModel().getBookHeroDataByBookId(bookid);
            bookHeroData.isGetAward = true;
            bookHeroList.delete(bookHeroData.heroBookId);
            bookHeroList.set(bookHeroData.heroBookId,bookHeroData);
            let value = bookHeroList.get(bookid);

            let heroStaticID = HeroData.getHeroStaticIdByBookId(bookid)
            //抛通知  界面数据变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_hero_book_upgrade,bookHeroData);
        }
        //获得道具--钻石
        PopMgr.getInstance().popItemRewardView(Msg.TObjectType.EObject_VRmb, newMsgData.vrmb)

    }


}