import { GameModel } from "../GameModel";
import { HeroData } from "./HeroData";
import { XConsts } from "../const/XConsts";
import { BaseModel } from "./BaseModel";
import { NotifyMgr } from '../../control/NotifyMgr';
import { TableName, ValueMgr } from "../ValueMgr";
import { ItemEquipType } from '../../view/menu/ItemEquipCell';

export class BagItemModel extends BaseModel{
    private _bagItemList:Map<number,number> = new Map<number,number>(); //道具id 对应数量
    private _bagEquipList:Map<number, number> = new Map<number,number>(); //装备id 对应数量

    //汇总英雄身上所有道具 
    private _allItemList:Array<[Msg.TObjectType, number,number]> = new Array<[Msg.TObjectType,number,number]>();        
    /**
     * 不可出售道具的描述   Array[0]是名称  Array[1]是描述
     */
    private _notSellItemStingList:Map<Msg.TObjectType, Array<string>> = new Map<Msg.TObjectType, Array<string>>();

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

            let tempMap = new Map<number,number>();
            tempMap.set(Number(key), Number(value));
            this._allItemList.push([Msg.TObjectType.EObject_UsableItem, Number(key),Number(value)]);
        }
        this._setNotSellItemStringMap()
    }

    /**
     * 
     * @returns 获取背包可使用道具
     */
    public getBagItemList()
    {
        return this._bagItemList;
    }    

    /**
     * 
     * @returns 获取背包所有装备
     */
    public getBagEquipList()
    {
        return this._bagEquipList;
    }

    /** 账号所有的道具
     *  @param 返回Array<[Msg.TObjectType, number,number]>
     *  @param Array[0] 表示类型
     *  @param Array[1] 表示key
     *  @param Array[2] 表示value
     * */

    public getAllGoods(){
        let playerInfo = this._gameModel.getPlayerModel().getPlayerInfo()
        //英雄升级点
        if(playerInfo.heroUpgradeExp> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_UpgradePoint,0, Number(playerInfo.heroUpgradeExp)]);
        }

        //英雄进阶点
        if(playerInfo.heroAdvanceExp> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_AdvanceExp, 0, Number(playerInfo.heroAdvanceExp)]);
        }
        //魔法尘
        if(playerInfo.magicDust> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_MagicDust, 0, Number(playerInfo.magicDust)]);
        }
        //召唤卷轴
        if(playerInfo.basicSummonScroll> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_BaseSummonScroll, 0, Number(playerInfo.basicSummonScroll)]);
        }
        if(playerInfo.heroicSummonScroll> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_HeroicSummonScroll, 0, Number(playerInfo.heroicSummonScroll)]);
        }
        //任务卷轴
        if(playerInfo.basicHeroMissionScroll> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_BaseMissionScroll, 0, Number(playerInfo.basicHeroMissionScroll)]);
        }
        if(playerInfo.heroicHeroMissionScroll> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_HeroicMissionScroll, 0, Number(playerInfo.heroicHeroMissionScroll)]);
        }
        //灵魂石
        if(playerInfo.soulStone> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_SoulStone, 0, Number(playerInfo.soulStone)]);
        }
        //奇迹宝石
        if(playerInfo.miracleGem> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_MiracleGem, 0, Number(playerInfo.miracleGem)]);
        }
        //奇迹碎片
        if(playerInfo.miracleShard> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_MiracleShard, 0, Number(playerInfo.miracleShard)]);
        }
        //PVP战书
        // if(bagModel.getPVPTicket()> 0)
        // {
        //     this._allItemList.push([Msg.TObjectType.EObject_UpgradePoint, 0, Number(playerInfo.heroUpgradeExp)]);
        //     this._initPrefab(res,0,bagModel.getPVPTicket(),Msg.TObjectType.EObject_PVPTicket);
        // }
        //筹码
        if(playerInfo.normalChip> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_NormalChip, 0, Number(playerInfo.normalChip)]);
        }
        if(playerInfo.advancedChip> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_AdvancedChip, 0, Number(playerInfo.advancedChip)]);
        }
        //声望
        if(playerInfo.reputation> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_Reputation, 0, Number(playerInfo.reputation)]);
        }
        //幸运硬币
        if(playerInfo.luckyCoin> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_LuckyCoin, 0, Number(playerInfo.luckyCoin)]);
        }
        //试炼点
        if(playerInfo.trailPoint> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_TrailPoint, 0, Number(playerInfo.trailPoint)]);
        }
        //公会币
        if(playerInfo.guildGold> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_GuildCoin, 0, Number(playerInfo.guildGold)]);
        }
        //宠物资源
        if(playerInfo.PetExp> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_PetExp, 0, Number(playerInfo.PetExp)]);
        }
        if(playerInfo.PetStone> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_PetStone, 0, Number(playerInfo.PetStone)]);
        }
        //心愿宝石
        if(playerInfo.WonderGem> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_WonderGem, 0, Number(playerInfo.WonderGem)]);
        }
        //锻造石
        if(playerInfo.forgeStone> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_ForgeStone, 0, Number(playerInfo.forgeStone)]);            
        }
        //符文水晶
        if(playerInfo.CollegeMoney> 0)
        {
            this._allItemList.push([Msg.TObjectType.EObject_CollegeMoney, 0, Number(playerInfo.CollegeMoney)]);
        }

        return this._allItemList;
    }

    /**
     * 
     * @param key 道具、装备id
     * @param itemType 类型  区分装备、道具
     * @returns 
     */
    public getItemCountByKey(key:number,itemType:number):number
    {
        let count:number = 0;
        if(itemType == ItemEquipType.goods)
        {
            if(this._bagItemList.has(key))
            {
                count = Number(this._bagItemList.get(key));
            }
        }
        else if(itemType == ItemEquipType.equip)
        {
            if(this._bagEquipList.has(key))
            {
                count = Number(this._bagEquipList.get(key));
            }
        }
        
        return count;
    }

    /**
     * 获取不可使用的道具名称及描述 名字
     * @param objType  道具类型值
     * @returns 
     */
    public getItemDescByType(objType:Msg.TObjectType)
    {
        if(this._notSellItemStingList.has(objType))
        {
            let strArr = this._notSellItemStingList.get(objType) as Array<string>
            return strArr
        }
        else{
            return []
        }
    }

    /**
     * //改变背包道具的数量
     * @param key 装备道具id
     * @param count 数量
     */
    public changeBagItemNumber(key:number,count:number)
    {
        if(this._bagItemList.has(key))
        {
            let oldCount = Number(this._bagItemList.get(key));      
            let newCount = oldCount - count;
            this._bagItemList.delete(key)  
            if(newCount != 0)
            {
                this._bagItemList.set(key,newCount)
            }
            NotifyMgr.getInstance().notify(NotifyMgr.event_equip_item_change,[ItemEquipType.goods,key]);
        }        
    }

    /**
     * //改变背包装备的数量
     * @param key 装备道具id
     * @param count 数量
     */
     public changeBagEquipNumber(key:number,count:number)
     {
         if(this._bagEquipList.has(key))
         {
             let oldCount = Number(this._bagEquipList.get(key));      
             let newCount = oldCount - count;
             this._bagEquipList.delete(key)  
             if(newCount != 0)
             {
                 this._bagEquipList.set(key,newCount)
             }
             NotifyMgr.getInstance().notify(NotifyMgr.event_equip_item_change,[ItemEquipType.equip,key]);
             NotifyMgr.getInstance().notify(NotifyMgr.event_coin_diamond_level_change);
         }        
     }


    ////////////////////////////////////////
    /////////////////私有方法///////////////
    ///////////////////////////////////////
    
     //战书数量
    public _getPVPTicket():number
    {
        return 0;
    }


    private _setNotSellItemStringMap()
    {
        this._notSellItemStingList.clear()

        let templist:string[] = new Array<string>();
        templist = ["UI_Name_Money","UI_Desc_Money"]    //金钱
        this._notSellItemStingList.set(Msg.TObjectType.EObject_Money,templist);

        templist = ["UI_Name_Exp","UI_Desc_Exp"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_Exp,templist);

        templist = ["UI_Name_UpgradePoint","UI_Desc_UpgradePoint"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_UpgradePoint,templist);

        templist = ["UI_Name_Vrmb","UI_Desc_Vrmb"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_VRmb,templist);

        templist = ["UI_Name_MagicDust","UI_Desc_MagicDust"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_MagicDust,templist);

        templist = ["UI_Name_AdvanceExp","UI_Desc_AdvanceExp"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_AdvanceExp,templist);

        templist = ["UI_Name_BaseSummonScroll","UI_Desc_BaseSummonScroll"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_BaseSummonScroll,templist);

        templist = ["UI_Name_HeroicSummonScroll","UI_Desc_HeroicSummonScroll"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_HeroicSummonScroll,templist);

        templist = ["UI_Name_BaseMissionScroll","UI_Desc_BaseMissionScroll"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_BaseMissionScroll,templist);

        templist = ["UI_Name_HeroicMissionScroll","UI_Desc_HeroicMissionScroll"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_HeroicMissionScroll,templist);

        templist = ["UI_Name_SoulStone","UI_Desc_SoulStone"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_SoulStone,templist);

        templist = ["UI_Name_MiracleGem","UI_Desc_MiracleGem"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_MiracleGem,templist);

        templist = ["UI_Name_MiracleShard","UI_Desc_MiracleShard"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_MiracleShard,templist);

        templist = ["UI_Name_SkillMaterial","UI_Desc_SkillMaterial"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_SkillMaterial,templist);

        templist = ["UI_Name_Pvpticket","UI_Desc_Pvpticket"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_PVPTicket,templist);

        templist = ["UI_Name_NormalChip","UI_Desc_NormalChip"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_NormalChip,templist);

        templist = ["UI_Name_AdvancedChip","UI_Desc_AdvancedChip"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_AdvancedChip,templist);

        templist = ["UI_Name_LuckyCoin","UI_Desc_LuckyCoin"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_LuckyCoin,templist);

        templist = ["UI_Name_Reputation","UI_Desc_Reputation"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_Reputation,templist);

        templist = ["UI_Name_TrailPoint","UI_Desc_TrailPoint"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_TrailPoint,templist);

        templist = ["UI_Name_TrailItem","UI_Desc_TrailItem"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_TrailItem,templist);

        templist = ["UI_Name_GuildCoin","UI_Desc_GuildCoin"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_GuildCoin,templist);

        templist = ["UI_Name_GuildExp","UI_Desc_GuildExp"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_GuildExp,templist);

        templist = ["UI_Name_PetExp","UI_Desc_PetExp"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_PetExp,templist);

        templist = ["UI_Name_PetStone","UI_Desc_PetStone"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_PetStone,templist);

        templist = ["UI_Name_LoopQuestMoney","UI_Desc_LoopQuestMoney"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_LoopQuestMoney,templist);

        templist = ["UI_Name_WonderGem","UI_Desc_WonderGem"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_WonderGem,templist);

        templist = ["UI_Name_ForgeStone","UI_Desc_ForgeStone"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_ForgeStone,templist);

        templist = ["UI_Name_CollegeMoney","UI_Desc_CollegeMoney"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_CollegeMoney,templist);

        templist = ["UI_Name_LoopQuest2Money","UI_Desc_LoopQuest2Money"]
        this._notSellItemStingList.set(Msg.TObjectType.EObject_LoopQuest2Money,templist);
    }
}