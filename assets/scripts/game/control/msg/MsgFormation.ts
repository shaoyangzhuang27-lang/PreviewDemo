/*
 * @Description: 协议收发处理
 * @Author: xxxxxx
 * @Date: 2021-03-02 13:53:04
 * @LastEditTime: 2021-03-19 16:24:31
 */

import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { MsgBase } from "./MsgBase";

export class MsgFormation extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheChangeFormationA,[Msg.ChangeFormationA,this.responeChangeBattleTeam,this]],
            [Msg.MsgType.TheHeroTierUpA,[Msg.HeroTierUpA,this.responeHeroLvUp,this]],
            [Msg.MsgType.TheSyncHeroLocked,[Msg.SyncHeroLocked,this.responeHeroLocked,this]],
            [Msg.MsgType.ThePutOnEquipA,[Msg.PutOnEquipA,this.responeHeroPutOnEquip,this]],
            [Msg.MsgType.TheTakeOffEquipA,[Msg.TakeOffEquipA,this.responeHeroTakeOffEquip,this]],
            
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
    public requestHeroLvUp(heroID:number, consumeAdvanceExp:number,consumeMoney:number,newTier:number)
    {
        console.log("英雄升级请求");
        const buffer_data = Msg.HeroTierUpR.encode({heroID:heroID}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheHeroTierUpR,buffer_data);
    }
    public responeHeroLvUp(msgId: number, msgData: any){
        console.log("英雄升级数据返回",msgId);
        let newMsgData = msgData as Msg.HeroTierUpR;
        if(newMsgData)
        {
            //GameModel.getInstance().getFormationModel().setCurFormationChange(newMsgData)      
        }
        
    }


    public requestHeroLocked(heroID:number, isLocked:boolean){
        console.log("英雄锁定-----请求");
        const buffer_data = Msg.SyncHeroLocked.encode({heroID: heroID, isLocked: isLocked}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheSyncHeroLocked, buffer_data);
    }

    public responeHeroLocked(msgId: number, msgData: any){
        console.log("英雄锁定-----响应",msgId);
        let newMsgData = msgData as Msg.SyncHeroLocked;
        if(newMsgData)
        {
            GameModel.getInstance().getHeroesModel().setHeroLocked(newMsgData);
        }
    }

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
}