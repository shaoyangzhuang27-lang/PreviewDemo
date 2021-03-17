
import { MsgCore} from "../../../core/network/MsgCore";
import { NetCallFunc } from "../../../core/network/NetInterface";
import { NetManager } from "../../../core/network/NetManager";
import { GameModel } from "../../model/GameModel";
import { NotifyMgr } from "../NotifyMgr";
import { PopMgr } from "../PopMgr";
import { MsgBase } from "./MsgBase";

export class MsgBag extends MsgBase{

    public initData(){
        this.responeMap = new Map<number,[any,NetCallFunc,any]>([
            [Msg.MsgType.TheSellEquipA,[Msg.SellEquipA,this.responeSellEquip,this]],
            [Msg.MsgType.TheUseUsableItemA,[Msg.UseUsableItemA,this.responeUseItemBack,this]],
        ]);
    }

    //出售装备
    public requestSellEquip(equipId:number,num:number)
    {
        const buffer_data = Msg.SellEquipR.encode({equipID:equipId, sellNum:num}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheSellEquipR,buffer_data);
    }
    
    public responeSellEquip(msgId: number, msgData: any)
    {
        console.log("出售装备数据返回",msgId,msgData);
        let newMsgData = msgData as Msg.SellEquipA;

        GameModel.getInstance().getBagModel().changeBagEquipNumber(newMsgData.equipID,newMsgData.sellNum);
    }
    
    //使用道具
    public requestUseItem(goodid:number,num:number,typeNum:number)
    {
        const buffer_data = Msg.UseUsableItemR.encode({itemID:goodid, itemNum:num, param:typeNum}).finish();
        this.msgMgr?.sendData(Msg.MsgType.TheUseUsableItemR,buffer_data);
    }
    
    public responeUseItemBack(msgId: number, msgData: any)
    {
        console.log("使用道具数据返回",msgId,msgData);
        let newMsgData = msgData as Msg.UseUsableItemA;
        let objList:Msg.LootObject[] = new Array<Msg.LootObject>();
        for (let index = 0; index < newMsgData.gainObjList.length; index++) {
            let element = newMsgData.gainObjList[index] as Msg.LootObject;
            // PlayerData.instance.GainObject(msg.GainObjList[i], Msg.TObjectSourceType.EobjectSourceTypeUsableItem);
            objList.push(element);
        }
        //显示获取
        if(objList.length > 1)
        {   //获得多个

        }
        else{   //获得一个
            PopMgr.getInstance().popItemRewardView(newMsgData.gainObjList[0].objType as number,Number(newMsgData.gainObjList[0].num))
            GameModel.getInstance().getBagModel().changeBagEquipNumber(newMsgData.itemID,newMsgData.itemNum);
        }
        
        
        
        
    }
}