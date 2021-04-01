/*
 * @Description: 
 * @Author: xxxxxx
 * @Date: 2021-03-01 16:08:56
 * @LastEditTime: 2021-04-01 10:57:22
 */
import { NotifyMgr } from "../../control/NotifyMgr";
import { GameModel } from "../GameModel";
import { BaseModel } from "./BaseModel";
import { HeroData } from "./HeroData";

export class PlayerModel extends BaseModel {

    private _playerInfo: Msg.PlayerInfo = null as unknown as Msg.PlayerInfo;
    private _gameConf: Msg.GameConfig = null as unknown as Msg.GameConfig;
    private _roleHero: HeroData = null as unknown as HeroData;
    
    // private _heroIDInCollege: Map<number, number> = new Map<number, number>();//英雄学院前5名等级最高英雄
    // private _collegeBlockLastAt:Map<number, number> = new Map<number, number>();//英雄学院槽位英雄

    public initPlayerData(msg: Msg.PlayerLoginA) {
        this._playerInfo = msg.playerInfo as Msg.PlayerInfo;
        this._gameConf = msg.conf as Msg.GameConfig;
        this._roleHero = new HeroData();
        this._roleHero.initDataByKnight(this._playerInfo, this._gameModel);
        //默认自动施放技能开启
        this._playerInfo.isAutoSkill = true;
    }
    public getPlayerInfo() {
        return this._playerInfo
    }
    public getRoleHero() {
        return this._roleHero
    }

    //金币钻石操作-----------------------------------------------------------------------------------------
    /**
     * 
     * @param money 金币数量
     * @param addType 获得金币方式
     * @param isRefresh 是否刷新
     * @param price 礼包价格？
     */
     public addMoney(money:number, addType:Msg.TMoneyAddType, isRefresh:boolean = true, price:number=0)
    {
        this._playerInfo.money += money;
        NotifyMgr.getInstance().notify(NotifyMgr.event_coin_diamond_level_change);
        //sdk埋点记录   金币数量变化 类型
    }
    
    public addVrmb(vrmb:number, addType:Msg.TVRmbAddType, isRefresh:boolean = true, price:number = 0) {
        this._playerInfo.vrmb += vrmb;
        NotifyMgr.getInstance().notify(NotifyMgr.event_coin_diamond_level_change);
        // if (BokeEvent.instance != null && GameConfigManager.instance.IsChannelBoke)
        //     BokeEvent.instance.SendEvent ("get_diamond", vrmb, addType.ToString (), price);
    }

    /**
     * @description: 金币减少
     * @param {number} money
     * @param {Msg} subType
     */
     public subMoney(money: number, subType: Msg.TMoneySubType) {
        this._playerInfo.money -= money;
        if (this._playerInfo.money < 0) {
            this._playerInfo.money = 0;
        }

        //通知金币减少
        NotifyMgr.getInstance().notify(NotifyMgr.event_coin_diamond_level_change);
        // if (BokeEvent.instance != null && GameConfigManager.instance.IsChannelBoke)
        //     BokeEvent.instance.SendEvent ("cost_coins", money, subType.ToString (), 0);
    }
    
    /**
     * @description:  钻石减少
     * @param {number} vrmb
     * @param {Msg} subType
     */
     public subVrmb(vrmb: number, subType: Msg.TVRmbSubType) {
        this._playerInfo.vrmb -= vrmb;
        if (this._playerInfo.vrmb < 0){
            this._playerInfo.vrmb = 0;
        }

        NotifyMgr.getInstance().notify(NotifyMgr.event_coin_diamond_level_change);
        // if (BokeEvent.instance != null && GameConfigManager.instance.IsChannelBoke)
        //     BokeEvent.instance.SendEvent ("cost_diamond", vrmb, subType.ToString (), 0);
    }
    //金币钻石操作-----------------------------------------------------------------------------------------
    
    //物品操作-----------------------------------------------------------------------------------
    /**
     * @description: 消耗物品-by奖励
     * @param {Msg} objectType  消耗奖励类型
     * @param {Msg} consumeType 消耗方式类型
     */
     public consumeObjectByLoot(lootObject:Msg.LootObject, consumeType:Msg.TObjectConsumeType) {
        this._consumeObject(lootObject.objType, lootObject.param1, lootObject.param2, lootObject.param3, lootObject.num, consumeType);

        // if (BokeEvent.instance != null && GameConfigManager.instance.IsChannelBoke)
        //     BokeEvent.instance.SendEvent ("cost_item", lootObject.Num, consumeType.ToString (), lootObject.ObjType, lootObject.ObjType.ToString (), 0);
    }

    /**
     * @description: 消耗物品-by数量
     * @param {Msg} objectType  消耗物品类型
     * @param {number} num      消耗物品数量
     * @param {Msg} consumeType 消耗方式类型
     */
    public consumeObjectByNum(objectType:Msg.TObjectType, num:number, consumeType:Msg.TObjectConsumeType) {
        this._consumeObject(objectType, 0, 0, 0, num, consumeType);
    }
    
    /**
     * @description: 获得物品-by奖励
     * @param {Msg} objectType  消耗奖励类型
     * @param {Msg} consumeType 消耗方式类型
     */
    public gainObjectByLoot(lootObj:Msg.LootObject, sourceType:Msg.TObjectSourceType = Msg.TObjectSourceType.EObjectSourceType_NULL, isRefrush:boolean = true, price:number = 0) {
        if (lootObj == null)return;
        this._gainObject(lootObj.objType, lootObj.param1, lootObj.param2, lootObj.param3, lootObj.num, lootObj.extent, sourceType, isRefrush);

        // if (BokeEvent.instance != null && GameConfigManager.instance.IsChannelBoke)
        //     BokeEvent.instance.SendEvent ("get_item", lootObj.Num, sourceType.ToString (), lootObj.ObjType, lootObj.ObjType.ToString (), price);
    }

    /**
     * @description: 获得物品-by数量
     * @param {Msg} objectType  获得物品类型
     * @param {number} num      获得物品数量
     * @param {Msg} consumeType 获得方式类型
     */
    public gainObjectByNum(objectType:Msg.TObjectType, num:number, sourceType:Msg.TObjectSourceType = Msg.TObjectSourceType.EObjectSourceType_NULL) {
        this._gainObject(objectType, 0, 0, 0, num, null, sourceType, false);
    }

    //物品操作-----------------------------------------------------------------------------------




      /**
     * @description: 更新角色信息——次数属性
     * @param {XMsg.TimesType} timesType 次数类型
     * @param {number} num     次数值
     */
       public updatePlayerInfoTimesAttribute(timesType:XMsg.TimesType, num:number) {
        switch (timesType) {
            case XMsg.TimesType.TRefreshHeroTalentTimes:
                this._playerInfo.refreshHeroTalentTimes = num;
                break;
            case XMsg.TimesType.TChallengeFailedTimes:
                this._playerInfo.challengeFailedTimes = num;
                break;
            case XMsg.TimesType.TBoughtBagTimes:
                this._playerInfo.BoughtBagTimes = num;
                break;
            case XMsg.TimesType.TSummonScore:
                this._playerInfo.summonScore = num;
                break;
            case XMsg.TimesType.TAdAwardTimes:
                this._playerInfo.adAwardTimes = num;
                break;
            case XMsg.TimesType.THeroComposeTimes:
                this._playerInfo.heroComposeTimes = num;
                break;
            case XMsg.TimesType.TFastBattleTimes:
                this._playerInfo.fastBattleTimes = num;
                break;
            case XMsg.TimesType.THuntingBossTimes:
                this._playerInfo.huntingBossTimes = num;
                break;
            case XMsg.TimesType.TWonderTimes:
                this._playerInfo.WonderTimes = num;
                break;
            case XMsg.TimesType.TAccumulatedCheckInTimes:
                this._playerInfo.AccumulatedCheckInTimes = num;
                break;    
        }
    }

    public updateSummonScore(value : number)
    {
        this._playerInfo.summonScore = value;
    }


    public updateWonderTimes(value :number)
    {
        this._playerInfo.WonderTimes = value;
    }

    
    /**
     * @description: 消耗物品
     */
     private _consumeObject(objectType:Msg.TObjectType, param1:number, param2:number, param3:number, num:number,consumeType: Msg.TObjectConsumeType) {
        switch (objectType) {
            case Msg.TObjectType.EObject_Money:
                let moneySubType:Msg.TMoneySubType = Msg.TMoneySubType.EMoneySubType_NULL;

                let t = new Map<Msg.TObjectConsumeType, Msg.TMoneySubType>([
                    [Msg.TObjectConsumeType.EObjectConsumeType_HeroLevelUp,     Msg.TMoneySubType.EMoneySubType_HeroLevelUp],
                    [Msg.TObjectConsumeType.EObjectConsumeType_HeroTierUp,      Msg.TMoneySubType.EMoneySubType_HeroTierUp],
                    [Msg.TObjectConsumeType.EObjectConsumeType_CrystalUpgrade,  Msg.TMoneySubType.EMoneySubType_CrystalUpgrade],
                    [Msg.TObjectConsumeType.EObjectConsumeType_CrystalConvert,  Msg.TMoneySubType.EMoneySubType_CrystalConvert],
                    [Msg.TObjectConsumeType.EObjectConsumeType_PetUpgrade,      Msg.TMoneySubType.EMoneySubType_PetUpgrade],
                    [Msg.TObjectConsumeType.EObjectConsumeType_PetStarUp,       Msg.TMoneySubType.EMoneySubType_PetStarUp],
                    [Msg.TObjectConsumeType.EObjectConsumeType_PetSkillUp,      Msg.TMoneySubType.EMoneySubType_PetSkillUp],
                    [Msg.TObjectConsumeType.EObjectConsumeType_IapChargeback,   Msg.TMoneySubType.EMoneySubType_IapChargeback],
                ]);

                moneySubType = t.get(consumeType) as Msg.TMoneySubType;
                this.subMoney (num, moneySubType);
                break;
            case Msg.TObjectType.EObject_Exp:

                break;
            case Msg.TObjectType.EObject_UpgradePoint:
                this._playerInfo.heroUpgradeExp -= num;
                if (this._playerInfo.heroUpgradeExp < 0)
                this._playerInfo.heroUpgradeExp = 0;
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.PlayerInfoChange);

                break;
            case Msg.TObjectType.EObject_VRmb:
                let vrmbSubType:Msg.TVRmbSubType = Msg.TVRmbSubType.EVRmbSubType_NULL;
                
                let t2 = new Map<Msg.TObjectConsumeType, Msg.TVRmbSubType>([
                    [Msg.TObjectConsumeType.EObjectConsumeType_CrystalUpgrade,      Msg.TVRmbSubType.EVRmbSubType_CrystalUpgrade],
                    [Msg.TObjectConsumeType.EObjectConsumeType_HeroSummon,          Msg.TVRmbSubType.EVRmbSubType_Summon],
                    [Msg.TObjectConsumeType.EObjectConsumeType_HeroMisstionRefresh, Msg.TVRmbSubType.EVRmbSubType_RefreshHeroMission],
                    [Msg.TObjectConsumeType.EObjectConsumeType_BuyShopGoods,        Msg.TVRmbSubType.EVRmbSubType_BuyShopGoods],
                    [Msg.TObjectConsumeType.EObjectConsumeType_IapChargeback,       Msg.TVRmbSubType.EVRmbSubType_IapChargeback],
                ]);
                vrmbSubType = t2.get(consumeType) as Msg.TVRmbSubType;
                this.subVrmb (num, vrmbSubType);

                break;
            case Msg.TObjectType.EObject_Hero:
                break;
            case Msg.TObjectType.EObject_Fragment:
                // SubFragment ((Msg.TFragmentType) param1, param2, param3, num);
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.BagFragmentChange);
                break;
            case Msg.TObjectType.EObject_Equip:
                // SubEquipBag (param1, num);
                break;
            case Msg.TObjectType.EObject_SkillBook:
                // SubSkillBook (param1, num);
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.RoleSkillAdvance);
                break;
            case Msg.TObjectType.EObject_MagicDust:
                this._playerInfo.magicDust = this.getSubValue(this._playerInfo.magicDust,num);
                break;
            case Msg.TObjectType.EObject_AdvanceExp:
                this._playerInfo.heroAdvanceExp = this.getSubValue(this._playerInfo.heroAdvanceExp,num);
                break;
            case Msg.TObjectType.EObject_BaseSummonScroll:
                this._playerInfo.basicSummonScroll = this.getSubValue(this._playerInfo.basicSummonScroll,num);
                break;
            case Msg.TObjectType.EObject_HeroicSummonScroll:
                this._playerInfo.heroicSummonScroll = this.getSubValue(this._playerInfo.heroicSummonScroll,num);
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.RPCity);
                break;
            case Msg.TObjectType.EObject_BaseMissionScroll:
                this._playerInfo.basicHeroMissionScroll = this.getSubValue(this._playerInfo.basicHeroMissionScroll,num);
                break;
            case Msg.TObjectType.EObject_HeroicMissionScroll:
                this._playerInfo.heroicHeroMissionScroll = this.getSubValue(this._playerInfo.heroicHeroMissionScroll,num);
                break;
            case Msg.TObjectType.EObject_SoulStone:
                this._playerInfo.soulStone = this.getSubValue(this._playerInfo.soulStone,num);
                break;
            case Msg.TObjectType.EObject_MiracleGem:
                this._playerInfo.miracleGem = this.getSubValue(this._playerInfo.miracleGem,num);
                break;
            case Msg.TObjectType.EObject_MiracleShard:
                this._playerInfo.miracleShard = this.getSubValue(this._playerInfo.miracleShard,num);
                break;
            case Msg.TObjectType.EObject_FriendGift:
                this._playerInfo.friendGift = this.getSubValue(this._playerInfo.friendGift,num);
                break;
            case Msg.TObjectType.EObject_PVPTicket:
                // _pvpTicket -= num;
                // if (_pvpTicket < 0)
                //     _pvpTicket = 0;
                break;
            case Msg.TObjectType.EObject_SkillMaterial:
                this._playerInfo.roleSkillMaterial = this.getSubValue(this._playerInfo.roleSkillMaterial,num);
                break;
            case Msg.TObjectType.EObject_NormalChip:
                this._playerInfo.normalChip = this.getSubValue(this._playerInfo.normalChip,num);
                break;
            case Msg.TObjectType.EObject_AdvancedChip:
                this._playerInfo.advancedChip = this.getSubValue(this._playerInfo.advancedChip,num);
                break;
            case Msg.TObjectType.EObject_Reputation:
                this._playerInfo.reputation = this.getSubValue(this._playerInfo.reputation,num);
                break;
            case Msg.TObjectType.EObject_LuckyCoin:
                this._playerInfo.luckyCoin = this.getSubValue(this._playerInfo.luckyCoin,num);
                break;
            case Msg.TObjectType.EObject_Soldier:
                break;
            case Msg.TObjectType.EObject_TrailPoint:
                this._playerInfo.trailPoint = this.getSubValue(this._playerInfo.trailPoint,num);
                break;
            case Msg.TObjectType.EObject_TrailItem:
                // TrailItem -= num;
                // if (TrailItem < 0)
                //     TrailItem = 0;
                break;
            case Msg.TObjectType.EObject_GuildCoin:
                this._playerInfo.guildGold = this.getSubValue(this._playerInfo.guildGold,num);
                break;
            case Msg.TObjectType.EObject_PetExp:
                this._playerInfo.PetExp = this.getSubValue(this._playerInfo.PetExp,num);
                break;
            case Msg.TObjectType.EObject_PetStone:
                this._playerInfo.PetStone = this.getSubValue(this._playerInfo.PetStone,num);
                break;
            case Msg.TObjectType.EObject_LoopQuestMoney:
                // _loopQuests.LoopQuestMoney -= num;
                // if (_loopQuests.LoopQuestMoney < 0)
                //     _loopQuests.LoopQuestMoney = 0;
                break;
            case Msg.TObjectType.EObject_LoopQuest2Money:
                // _loopQuests2.LoopQuest2Money -= num;
                // if (_loopQuests2.LoopQuest2Money < 0)
                //     _loopQuests2.LoopQuest2Money = 0;
                break;
            case Msg.TObjectType.EObject_UsableItem:
                // SubUsableItem (param1, num);
                break;
            case Msg.TObjectType.EObject_WonderGem:
                this._playerInfo.WonderGem = this.getSubValue(this._playerInfo.WonderGem,num);
                break;
            case Msg.TObjectType.EObject_ForgeStone:
                this._playerInfo.forgeStone = this.getSubValue(this._playerInfo.forgeStone,num);
                break;
            case Msg.TObjectType.EObject_CollegeMoney:
                this._playerInfo.CollegeMoney = this.getSubValue(this._playerInfo.CollegeMoney,num);
                break;
            case Msg.TObjectType.EObject_PortraitSpecial:
                // if (_portrailList.ContainsKey (param1))
                    // _portrailList.Remove (param1);
                break;
            case Msg.TObjectType.EObject_PortraitFrame:
                // if (_frameList.ContainsKey (param1))
                //     _frameList.Remove (param1);
                break;
            case Msg.TObjectType.EObject_Title:
                // if (_titleList.ContainsKey (param1)) {
                //     _titleList.Remove (param1);
                //     RefreshTitleProperty ();
                // }
                break;
        }
    }
    /**
     * @description: 获得物品
     */
    private _gainObject(objectType:Msg.TObjectType, param1:number, param2:number, param3:number, num:number, extent:Msg.HeroInfo | null,sourceType:Msg.TObjectSourceType = Msg.TObjectSourceType.EObjectSourceType_NULL,  isRefrush:boolean = true) {
        switch (objectType) {
            case Msg.TObjectType.EObject_Money:
                let addType:Msg.TMoneyAddType = Msg.TMoneyAddType.EMoneyAddType_NULL;
                if (sourceType == Msg.TObjectSourceType.EObjectSourceType_CopyPassAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_CopyPassAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_OfflineAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_OfflineAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_RandomAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_RandomAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_DailyQuestAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_DailyQuestAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_HeroMissionAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_HeroMissionAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_AchievementAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_AchievementAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_Mail) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_Mail;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_LoginAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_LoginAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_PVPBattle) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_PVPBattleLoot;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_RookieAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_RookieAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_RookieCheckIn) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_RookieCheckIn;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_RookieQuestAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_RookieQuestAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_CopyExtraAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_CopyExtraAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_Iap) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_IAP;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_RankingAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_RankingAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_DailyAdAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_DailyAdAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_GuildBossLoot) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_GuildBossLoot;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_IapPackage) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_IapPackage;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_HuntingBoss) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_HuntingBoss;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_NewPlayerPay) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_NewPlayerPay;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_VipAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_VipAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_VipPack) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_VipPack;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_StarterPackAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_StarterPackAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_BattlePass) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_BattlePass;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_Trail) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_Trail;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_ChallengeExtraAward) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_ChallengeExtraAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_UsableItem) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_UsableItem;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_ActivityAccumulation) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_ActivityAccumulation;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_CheckInAccumulation) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_CheckInAccumulation;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_BattlePass2) {
                    addType = Msg.TMoneyAddType.EMoneyAddType_BattlePass2;
                }
                this.addMoney(num, addType, isRefrush);
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.PlayerInfoChange, this, new EventOneBool (bool_需要刷新金币钻石吗));
                break;
            case Msg.TObjectType.EObject_Exp:
                // this.RoleHeroGainExp(num);
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.PlayerInfoChange, this, new EventOneBool (bool_需要刷新金币钻石吗));
                break;
            case Msg.TObjectType.EObject_UpgradePoint:
                this._playerInfo.heroUpgradeExp += num;
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.PlayerInfoChange, this, new EventOneBool (bool_需要刷新金币钻石吗));
                break;
            case Msg.TObjectType.EObject_VRmb:
                let vrmbAddType:Msg.TVRmbAddType = Msg.TVRmbAddType.EVRmbAddType_NULL;
                if (sourceType == Msg.TObjectSourceType.EObjectSourceType_RandomLoot) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_RandomLoot;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_CopyPassAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_CopyPassAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_OfflineAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_OfflineAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_LimitTaskAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_LimitTaskAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_RandomAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_RandomAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_DailyQuestAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_DailyQuestAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_HeroMissionAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_HeroMissionAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_AchievementAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_AchievementAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_Mail) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_Mail;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_LoginAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_LoginAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_PVPBattle) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_PVPBattleLoot;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_RookieAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_RookieAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_RookieCheckIn) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_RookieCheckIn;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_RookieQuestAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_RookieQuestAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_CopyExtraAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_CopyExtraAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_Iap) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_IAP;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_RankingAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_RankingAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_DailyAdAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_DailyAdAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_GuildBossLoot) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_GuildBossLoot;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_IapPackage) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_IapPackage;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_HuntingBoss) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_HuntingBoss;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_NewPlayerPay) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_NewPlayerPay;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_VipAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_VipAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_VipPack) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_VipPack;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_StarterPackAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_StarterPackAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_BattlePass) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_BattlePass;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_Trail) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_Trail;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_ChallengeExtraAward) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_ChallengeExtraAward;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_UsableItem) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_UsableItem;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_ActivityAccumulation) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_ActivityAccumulation;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_CheckInAccumulation) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_CheckInAccumulation;
                } else if (sourceType == Msg.TObjectSourceType.EObjectSourceType_BattlePass2) {
                    vrmbAddType = Msg.TVRmbAddType.EVRmbAddType_BattlePass2;
                }
                this.addVrmb(num, vrmbAddType, isRefrush);
                break;
            case Msg.TObjectType.EObject_Hero:
                if (extent != null) {
                    //加入背包
                    // HeroData hd = this.addHeroToUnBattle(extent);
                    // //成就
                    // PlayerData.instance.AddAchievementProgress(Msg.TAchievementType.EAchievementType_GainHero, 0, 1);
                    // PlayerData.instance.AddAchievementProgress(Msg.TAchievementType.EAchievementType_GainHero, hd.Record.Star, 1);
                    // //活动任务
                    // PlayerData.instance.AddActivityQuestProgress (Msg.TActivityQuestType.EActivityQuestType_HeroCollection, hd.Record.Star, hd.Record.Camp, 1);
                    // PlayerData.instance.AddRookieQuestProgress (Msg.TRookieQuestType.ERookieQuestType_GainHero, hd.Record.Star, 1);
                    // SortHeroList();

                    // if (BokeEvent.instance != null && GameConfigManager.instance.IsChannelBoke)
                    //     BokeEvent.instance.SendEvent ("get_hero", hd.Record.Id, hd.Record.Star, "TObjectSourceType:" + sourceType);
                }
                break;
            case Msg.TObjectType.EObject_Fragment:
                // AddFragment ((Msg.TFragmentType) param1, param2, param3, num);
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.BagFragmentChange);
                break;
            case Msg.TObjectType.EObject_Equip:
                // AddEquipBag (param1, num);
                // equip.Types.Record record = CfgMgr.GetTable<equip> ().GetRecordById (param1);
                // if (record != null) {
                //     if (BokeEvent.instance != null && GameConfigManager.instance.IsChannelBoke)
                //         BokeEvent.instance.SendEvent ("get_equip", param1, record.Quality, sourceType);
                // }
                //成就
                // var recordEquip = CfgMgr.GetTable<equip> ().GetRecordById (param1);
                // if (recordEquip != null)
                    // PlayerData.instance.AddAchievementProgress (Msg.TAchievementType.EachievementTypeGainEquip, recordEquip.Quality, num);
                break;
            case Msg.TObjectType.EObject_SkillBook:
                // AddSkillBook (param1, num);
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.RoleSkillAdvance);
                break;
            case Msg.TObjectType.EObject_MagicDust:
                this._playerInfo.magicDust += num;
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.PlayerInfoChange, this, new EventOneBool (bool_需要刷新金币钻石吗));
                break;
            case Msg.TObjectType.EObject_AdvanceExp:
                this._playerInfo.heroAdvanceExp += num;
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.PlayerInfoChange, this, new EventOneBool (bool_需要刷新金币钻石吗));
                break;
            case Msg.TObjectType.EObject_BaseSummonScroll:
                this._playerInfo.basicSummonScroll += num;
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.RPCity);
                break;
            case Msg.TObjectType.EObject_HeroicSummonScroll:
                this._playerInfo.heroicSummonScroll += num;
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.RPCity);
                break;
            case Msg.TObjectType.EObject_BaseMissionScroll:
                this._playerInfo.basicHeroMissionScroll += num;
                break;
            case Msg.TObjectType.EObject_HeroicMissionScroll:
                this._playerInfo.heroicHeroMissionScroll += num;
                break;
            case Msg.TObjectType.EObject_SoulStone:
                this._playerInfo.soulStone += num;
                break;
            case Msg.TObjectType.EObject_MiracleGem:
                this._playerInfo.miracleGem += num;
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.RPCity);
                break;
            case Msg.TObjectType.EObject_MiracleShard:
                this._playerInfo.miracleShard += num;
                break;
            case Msg.TObjectType.EObject_FriendGift:
                this._playerInfo.friendGift += num;
                break;
            case Msg.TObjectType.EObject_PVPTicket:
                // _pvpTicket += num;
                break;
            case Msg.TObjectType.EObject_SkillMaterial:
                this._playerInfo.roleSkillMaterial += num;
                break;
            case Msg.TObjectType.EObject_NormalChip:
                this._playerInfo.normalChip += num;
                break;
            case Msg.TObjectType.EObject_AdvancedChip:
                this._playerInfo.advancedChip += num;
                break;
            case Msg.TObjectType.EObject_Reputation:
                this._playerInfo.reputation += num;
                break;
            case Msg.TObjectType.EObject_LuckyCoin:
                this._playerInfo.luckyCoin += num;
                break;
            case Msg.TObjectType.EObject_Soldier:
                break;
            case Msg.TObjectType.EObject_TrailPoint:
                this._playerInfo.trailPoint += num;
                break;
            case Msg.TObjectType.EObject_TrailItem:
                // TrailItem += num;
                break;
            case Msg.TObjectType.EObject_GuildCoin:
                this._playerInfo.guildGold += num;
                break;
            case Msg.TObjectType.EObject_PetExp:
                this._playerInfo.PetExp += num;
                break;
            case Msg.TObjectType.EObject_PetStone:
                this._playerInfo.PetStone += num;
                break;
            case Msg.TObjectType.EObject_LoopQuestMoney:
                // _loopQuests.LoopQuestMoney += num;
                break;
            case Msg.TObjectType.EObject_LoopQuest2Money:
                // _loopQuests2.LoopQuest2Money += num;
                break;
            case Msg.TObjectType.EObject_UsableItem:
                // AddUsableItem (param1, num);
                break;
            case Msg.TObjectType.EObject_WonderGem:
                this._playerInfo.WonderGem += num;
                break;
            case Msg.TObjectType.EObject_ForgeStone:
                this._playerInfo.forgeStone += num;
                break;
            case Msg.TObjectType.EObject_CollegeMoney:
                this._playerInfo.CollegeMoney += num;
                break;
            case Msg.TObjectType.EObject_PortraitSpecial:
                // if (!_portrailList.ContainsKey (param1))
                //     _portrailList.Add (param1, true);
                break;
            case Msg.TObjectType.EObject_PortraitFrame:
                // if (!_frameList.ContainsKey (param1))
                //     _frameList.Add (param1, true);
                break;
            case Msg.TObjectType.EObject_Title:
                // if (!_titleList.ContainsKey(param1)) {
                //     _titleList.Add (param1, new Msg.TitleUnit() {
                //         Id = param1,
                //             IsNew = true,
                //             Timestamp = GetCurrentTimestamp()
                //     });
                //     RefreshTitleProperty();
                // }

                break;
        }
    }
    
    private getSubValue(oValue:number,num:number){
        oValue = oValue > num ? oValue - num : 0;
        return oValue;
    }


}