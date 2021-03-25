/*
 * @Description: 
 * @Author: xxxxxx
 * @Date: 2021-03-01 16:08:56
 * @LastEditTime: 2021-03-23 15:33:28
 */
import { NotifyMgr } from "../../control/NotifyMgr";
import { GameModel } from "../GameModel";
import { BaseModel } from "./BaseModel";
import { HeroData } from "./HeroData";

export class PlayerModel extends BaseModel {

    private _playerInfo: Msg.PlayerInfo = null as unknown as Msg.PlayerInfo;
    private _gameConf: Msg.GameConfig = null as unknown as Msg.GameConfig;
    private _roleHero: HeroData = null as unknown as HeroData;

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
        // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.PlayerInfoChange);
        // if (BokeEvent.instance != null && GameConfigManager.instance.IsChannelBoke)
        //     BokeEvent.instance.SendEvent ("cost_coins", money, subType.ToString (), 0);
    }
    
    /**
     * @description:  钻石减少
     * @param {number} vrmb
     * @param {Msg} subType
     */
    public subVrmb (vrmb: number, subType: Msg.TVRmbSubType) {
        this._playerInfo.vrmb -= vrmb;
        if (this._playerInfo.vrmb < 0)
        this._playerInfo.vrmb = 0;

        // 通知钻石减少
        // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.PlayerInfoChange);
        // if (BokeEvent.instance != null && GameConfigManager.instance.IsChannelBoke)
        //     BokeEvent.instance.SendEvent ("cost_diamond", vrmb, subType.ToString (), 0);
    }
    
    /**
     * @description: 消耗东西
     * @param {Msg} objectType
     * @param {number} num
     * @param {Msg} consumeType
     */
    public consumeObjectEx (objectType:Msg.TObjectType, num:number, consumeType:Msg.TObjectConsumeType) {
        this.consumeObject (objectType, 0, 0, 0, num, consumeType);
    }
    
    /**
     * @description: 消耗东西带参数具体执行
     * @param {Msg} objectType
     * @param {number} param1
     * @param {number} param2
     * @param {number} param3
     * @param {number} num
     * @param {Msg} consumeType
     */
    public consumeObject (objectType:Msg.TObjectType, param1:number, param2:number, param3:number, num:number,consumeType: Msg.TObjectConsumeType) {
        switch (objectType) {
            case Msg.TObjectType.EObject_Money:
                let moneySubType:Msg.TMoneySubType = Msg.TMoneySubType.EMoneySubType_NULL;
                if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_HeroLevelUp)
                    moneySubType = Msg.TMoneySubType.EMoneySubType_HeroLevelUp;
                else if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_HeroTierUp)
                    moneySubType = Msg.TMoneySubType.EMoneySubType_HeroTierUp;
                else if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_CrystalUpgrade)
                    moneySubType = Msg.TMoneySubType.EMoneySubType_CrystalUpgrade;
                else if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_CrystalConvert)
                    moneySubType = Msg.TMoneySubType.EMoneySubType_CrystalConvert;
                else if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_PetUpgrade)
                    moneySubType = Msg.TMoneySubType.EMoneySubType_PetUpgrade;
                else if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_PetStarUp)
                    moneySubType = Msg.TMoneySubType.EMoneySubType_PetStarUp;
                else if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_PetSkillUp)
                    moneySubType = Msg.TMoneySubType.EMoneySubType_PetSkillUp;
                else if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_IapChargeback)
                    moneySubType = Msg.TMoneySubType.EMoneySubType_IapChargeback;

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
                if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_CrystalUpgrade)
                    vrmbSubType = Msg.TVRmbSubType.EVRmbSubType_CrystalUpgrade;
                else if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_HeroSummon)
                    vrmbSubType = Msg.TVRmbSubType.EVRmbSubType_Summon;
                else if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_HeroMisstionRefresh)
                    vrmbSubType = Msg.TVRmbSubType.EVRmbSubType_RefreshHeroMission;
                else if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_BuyShopGoods)
                    vrmbSubType = Msg.TVRmbSubType.EVRmbSubType_BuyShopGoods;
                else if (consumeType == Msg.TObjectConsumeType.EObjectConsumeType_IapChargeback)
                    vrmbSubType = Msg.TVRmbSubType.EVRmbSubType_IapChargeback;
                
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
                this._playerInfo.magicDust -= num;
                if (this._playerInfo.magicDust < 0)
                    this._playerInfo.magicDust = 0;
                break;
            case Msg.TObjectType.EObject_AdvanceExp:
                this._playerInfo.heroAdvanceExp -= num;
                if (this._playerInfo.heroAdvanceExp < 0)
                this._playerInfo.heroAdvanceExp = 0;
                break;
            case Msg.TObjectType.EObject_BaseSummonScroll:
                this._playerInfo.basicSummonScroll -= num;
                if (this._playerInfo.basicSummonScroll < 0)
                    this._playerInfo.basicSummonScroll = 0;
                break;
            case Msg.TObjectType.EObject_HeroicSummonScroll:
                this._playerInfo.heroicSummonScroll -= num;
                if (this._playerInfo.heroicSummonScroll < 0)
                    this._playerInfo.heroicSummonScroll = 0;
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.RPCity);
                break;
            case Msg.TObjectType.EObject_BaseMissionScroll:
                this._playerInfo.basicHeroMissionScroll -= num;
                if (this._playerInfo.basicHeroMissionScroll < 0)
                    this._playerInfo.basicHeroMissionScroll = 0;
                break;
            case Msg.TObjectType.EObject_HeroicMissionScroll:
                this._playerInfo.heroicHeroMissionScroll -= num;
                if (this._playerInfo.heroicHeroMissionScroll < 0)
                    this._playerInfo.heroicHeroMissionScroll = 0;
                break;
            case Msg.TObjectType.EObject_SoulStone:
                this._playerInfo.soulStone -= num;
                if (this._playerInfo.soulStone < 0)
                    this._playerInfo.soulStone = 0;
                break;
            case Msg.TObjectType.EObject_MiracleGem:
                this._playerInfo.miracleGem -= num;
                if (this._playerInfo.miracleGem < 0)
                    this._playerInfo.miracleGem = 0;
                break;
            case Msg.TObjectType.EObject_MiracleShard:
                this._playerInfo.miracleShard -= num;
                if (this._playerInfo.miracleShard < 0)
                    this._playerInfo.miracleShard = 0;
                break;
            case Msg.TObjectType.EObject_FriendGift:
                this._playerInfo.friendGift -= num;
                if (this._playerInfo.friendGift < 0)
                    this._playerInfo.friendGift = 0;
                break;
            case Msg.TObjectType.EObject_PVPTicket:
                // _pvpTicket -= num;
                // if (_pvpTicket < 0)
                //     _pvpTicket = 0;
                break;
            case Msg.TObjectType.EObject_SkillMaterial:
                this._playerInfo.roleSkillMaterial -= num;
                if (this._playerInfo.roleSkillMaterial < 0)
                    this._playerInfo.roleSkillMaterial = 0;
                break;
            case Msg.TObjectType.EObject_NormalChip:
                this._playerInfo.normalChip -= num;
                if (this._playerInfo.normalChip < 0)
                    this._playerInfo.normalChip = 0;
                break;
            case Msg.TObjectType.EObject_AdvancedChip:
                this._playerInfo.advancedChip -= num;
                if (this._playerInfo.advancedChip < 0)
                    this._playerInfo.advancedChip = 0;
                break;
            case Msg.TObjectType.EObject_Reputation:
                this._playerInfo.reputation -= num;
                if (this._playerInfo.reputation < 0)
                    this._playerInfo.reputation = 0;
                break;
            case Msg.TObjectType.EObject_LuckyCoin:
                this._playerInfo.luckyCoin -= num;
                if (this._playerInfo.luckyCoin < 0)
                    this._playerInfo.luckyCoin = 0;
                break;
            case Msg.TObjectType.EObject_Soldier:
                break;
            case Msg.TObjectType.EObject_TrailPoint:
                this._playerInfo.trailPoint -= num;
                if (this._playerInfo.trailPoint < 0)
                    this._playerInfo.trailPoint = 0;
                break;
            case Msg.TObjectType.EObject_TrailItem:
                // TrailItem -= num;
                // if (TrailItem < 0)
                //     TrailItem = 0;
                break;
            case Msg.TObjectType.EObject_GuildCoin:
                this._playerInfo.guildGold -= num;
                if (this._playerInfo.guildGold < 0)
                    this._playerInfo.guildGold = 0;
                break;
            case Msg.TObjectType.EObject_PetExp:
                this._playerInfo.PetExp -= num;
                if (this._playerInfo.PetExp < 0)
                    this._playerInfo.PetExp = 0;
                break;
            case Msg.TObjectType.EObject_PetStone:
                this._playerInfo.PetStone -= num;
                if (this._playerInfo.PetStone < 0)
                    this._playerInfo.PetStone = 0;
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
                this._playerInfo.WonderGem -= num;
                if (this._playerInfo.WonderGem < 0)
                    this._playerInfo.WonderGem = 0;
                break;
            case Msg.TObjectType.EObject_ForgeStone:
                this._playerInfo.forgeStone -= num;
                if (this._playerInfo.forgeStone < 0)
                    this._playerInfo.forgeStone = 0;
                break;
            case Msg.TObjectType.EObject_CollegeMoney:
                this._playerInfo.CollegeMoney -= num;
                if (this._playerInfo.CollegeMoney < 0)
                    this._playerInfo.CollegeMoney = 0;
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
     * @description: 更新角色信息——次数属性
     * @param {Xstruct.TimesType} timesType 次数类型
     * @param {number} num     次数值
     */
       public updatePlayerInfoTimesAttribute(timesType:XStruct.TimesType, num:number) {
        switch (timesType) {
            case XStruct.TimesType.TRefreshHeroTalentTimes:
                this._playerInfo.refreshHeroTalentTimes = num;
                break;
            case XStruct.TimesType.TChallengeFailedTimes:
                this._playerInfo.challengeFailedTimes = num;
                break;
            case XStruct.TimesType.TBoughtBagTimes:
                this._playerInfo.BoughtBagTimes = num;
                break;
            case XStruct.TimesType.TSummonScore:
                this._playerInfo.summonScore = num;
                break;
            case XStruct.TimesType.TAdAwardTimes:
                this._playerInfo.adAwardTimes = num;
                break;
            case XStruct.TimesType.THeroComposeTimes:
                this._playerInfo.heroComposeTimes = num;
                break;
            case XStruct.TimesType.TFastBattleTimes:
                this._playerInfo.fastBattleTimes = num;
                break;
            case XStruct.TimesType.THuntingBossTimes:
                this._playerInfo.huntingBossTimes = num;
                break;
            case XStruct.TimesType.TWonderTimes:
                this._playerInfo.WonderTimes = num;
                break;
            case XStruct.TimesType.TAccumulatedCheckInTimes:
                this._playerInfo.AccumulatedCheckInTimes = num;
                break;    
        }
    }
}