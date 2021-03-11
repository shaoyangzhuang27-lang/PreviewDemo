import { GameModel } from "../GameModel";
import { HeroData } from "./HeroData";
import { XConsts } from "../const/XConsts";
import { BaseModel } from "./BaseModel";
import { NotifyMgr } from '../../control/NotifyMgr';
import { TableName, ValueMgr } from "../ValueMgr";

export class BagItemModel extends BaseModel{
    private _bagItemList:Map<number,number> = new Map<number,number>(); //道具id 对应数量
    private _bagEquipList:Map<number, number> = new Map<number,number>(); //装备id 对应数量
    // private _fragItemList:Map<number,Map<number,number>> = new Map<number,Map<number,number>>(); //背包索引

    public initBagItemList(msg:Msg.GetPlayerDataA)
    {
        this._bagItemList.clear();
        this._bagEquipList.clear();
        for(let key in msg.equipBagList){
            let value = msg.equipBagList[key];
            this._bagEquipList.set(Number(key), Number(value));
        }
        for(let key in msg.usableItemList){
            let value = msg.usableItemList[key];
            this._bagItemList.set(Number(key), Number(value));
        }
    }

    //获取背包道具
    public getBagItemList()
    {
        return this._bagItemList;
    }

    //获取背包装备
    public getBagEquipList()
    {
        return this._bagEquipList;
    }
}