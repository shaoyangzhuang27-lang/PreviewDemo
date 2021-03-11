//单个英雄子模块

// import { Item } from '../../core/control/Item';
import { BaseHeroData } from "./BaseHeroData";
import { GameModel } from "../GameModel";
import { TableName, ValueMgr } from "../ValueMgr";
import { XConsts } from "../const/XConsts";
import { XShare } from "../const/XShare";

export class HeroData extends BaseHeroData {
    private _recordSkill : Config.skill.Record = new Config.skill.Record();    //记录的技能
    // private _isOwner : any = null;
    private _heroInfo : Msg.HeroInfo = new Msg.HeroInfo();
    private _record :Config.heroes.Record = new Config.heroes.Record();

    private _equipPropertyList:Map<Msg.THeroPropertyType,number> = new Map<Msg.THeroPropertyType,number>();     //装备属性
    private _suitPropertyList:Map<Msg.THeroPropertyType,number> = new Map<Msg.THeroPropertyType,number>();      //套装属性
    private _equipOnList = new Map<Msg.TEquipLocationType, Config.equip.Record>();
    private _crystalPropertyList = new Map<Msg.THeroPropertyType, number>();
    
    private  _talentSkillPropertyList = new Map<Msg.THeroPropertyType, number>();
    private _suitActiveList = new Map<number, number>();
    private _gameModel:GameModel = null as unknown as GameModel;//待修改
    
    
    public initDataByKnight(pi:Msg.PlayerInfo,gameModel:GameModel){
        this._heroInfo.id = 0;
        this._heroInfo.level = pi.level;
        this._heroInfo.tier = 0;
        this._record = ValueMgr.getInstance().getItemByField(TableName.heroes, pi.armorID*100+pi.star) as Config.heroes.Record;
        
        this._recordSkill = ValueMgr.getInstance().getItemByField(TableName.skill,this._record.skillId) as Config.skill.Record;

        this._equipOnList = new Map<Msg.TEquipLocationType, Config.equip.Record>();
        this._crystalPropertyList = new Map<Msg.THeroPropertyType, number>();

        this._gameModel = gameModel;
        this.refreshEquipProperty();

    }
    public initDataByHero(heroInfo : Msg.HeroInfo,gameModel:GameModel){

        this._heroInfo = heroInfo;
        this._record = ValueMgr.getInstance().getItemByField(TableName.heroes, heroInfo.staticID) as Config.heroes.Record;
        this._recordSkill = ValueMgr.getInstance().getItemByField(TableName.skill,this._record.skillId) as Config.skill.Record;
        this._equipOnList = new Map<Msg.TEquipLocationType, Config.equip.Record>();
        this._gameModel = gameModel;

        for (let index = 0; index < this._heroInfo.equipOnList.length; index++) {
            let equipId = this._heroInfo.equipOnList[index];
            let equipRecord = ValueMgr.getInstance().getItemByField(TableName.equip,equipId) as Config.equip.Record;
            this._equipOnList.set(equipId as number, equipRecord);
        }
        this._crystalPropertyList = new Map<Msg.THeroPropertyType, number>();
        this.setCrystalInfo(this._heroInfo.crystal?.level as number, this._heroInfo.crystal?.propertyList as Msg.THeroPropertyType[])
        
        this.refreshEquipProperty();
    }


    private _crystalLevel:number = 0;
    public setCrystalInfo(level:number,proList:Array<Msg.THeroPropertyType>) {
        this._crystalLevel = level;
        this._crystalPropertyList.clear();
        let record =  ValueMgr.getInstance().getItemByField(TableName.crystal,this._crystalLevel) as Config.crystal.Record;// CfgMgr.GetTable<crystal>().GetRecordById(_crystalLevel);
        if (record == null)
            return;
        
        for (let i = 0; i < proList.length; i++) {
            let proType = proList[i];
            this._crystalPropertyList.set(proType, XShare.getInstance().GetCrystalProperty(proType, record.cost, proList.length));
            // this._crystalPropertyList.set(proType, (float) XLuaFunc.instance.GetCrystalProperty((int) proType, record.Cost, proList.Count));
        }
    }

    

    public calcTalentSkillProperty(hdList:Array<HeroData>|null = null) {
        this._talentSkillPropertyList = new Map<Msg.THeroPropertyType, number>();
        for (let i = 0; i < this._record.talentId.length; i++) {
            //判断天赋技能是否解锁
            if (!this.isTalentActive(i, hdList))
                continue;
            let record =ValueMgr.getInstance().getItemByField(TableName.talent,this.getTalentID(i)) as Config.talent.Record;// CfgMgr.GetTable<talent>().GetRecordById(GetTalentID(i));//Config.talent.Record
            if (record != null && record.talentType == Msg.TTalentType.ETalentType_Passive) {
                for (let j = 0; j < record.effectType.length; j++) {
                    if (record.effectType[j] == Msg.TEffectType.EEffectType_AddBuff && record.effectCondType[j] == 0) {
                        let propertyType =  record.effectParam1[j] as Msg.THeroPropertyType;
                        if (this._talentSkillPropertyList.has(propertyType)) {
                            let t = this._talentSkillPropertyList.get(propertyType) as number + record.effectParam2[j] / 100.0;
                            this._talentSkillPropertyList.set(propertyType,t);
                        } else {
                            this._talentSkillPropertyList.set(propertyType, record.effectParam2[j] / 100.0);
                        }
                    }
                }
                
            }
        }
    }
    public getSkillID() {
        let skillID = this._record.skillId;
        return skillID;
    }
    public getTalentID(index:number) {
        let talentID = this._record.talentId[index];
        return talentID;
    }
    public isTalentActive(loc:number, hdList:Array<HeroData>|null = null) {
        if (this.isRoleHero()) {
            return this.level >= this._record.talentUnlockTier[loc];
        } else{
            return this.tier >= this._record.talentUnlockTier[loc];
        }
    }
    public get level(){
        if (!this.isRoleHero()) {
            return 1//Mathf.Min(XLuaFunc.instance.KHeroMaxLevelForTier[_record.Star], PlayerData.instance.HeroCollegeLevel);
        } else
            return this._heroInfo.level;
    }
    public get tier(){
        
        if (!this.isRoleHero()) {
            return 1;// Mathf.Min(GetMaxTier(), PlayerData.instance.HeroCollegeTier);
        } else
            return this._heroInfo.tier;
    }
    public get equipOnList(){
        
        if (!this.isRoleHero()) {
            return null;// Mathf.Min(GetMaxTier(), PlayerData.instance.HeroCollegeTier);
        } else
            return this._equipOnList;
    }
    public get record(){
        return this._record
    }
    public isRoleHero() {
        return this._heroInfo.id == 0;
    }

    public refreshEquipProperty() {
        if (this.isRoleHero())
            this.refreshRoleHeroEquipProperty();
        else
            this.refreshHeroEquipProperty();
    }

    //刷新装备的属性和套装的属性
    private refreshRoleHeroEquipProperty()
    {

        //刷新装备的属性和套装的属性
        if (this._equipPropertyList == null)
            this._equipPropertyList = new Map<Msg.THeroPropertyType, number>();
        this._equipPropertyList.clear();
        if (this._suitPropertyList == null)
            this._suitPropertyList = new Map<Msg.THeroPropertyType, number>();
        this._suitPropertyList.clear();
        let armorLevel = this._gameModel.getArmorLevel();
        let activeQuality = armorLevel / XConsts.KRoleHeroEquipNum;
        //已全部激活的品质
        for (let i = 1; i <= activeQuality; i++) {
            var recordRoleEquip = ValueMgr.getInstance().getItemByField(TableName.equip_role,i) as Config.equip_role.Record;//CfgMgr.GetTable<Config.equip_role>().GetRecordById(i);
            if (recordRoleEquip == null)
                continue;
            for (let j = 0; j < recordRoleEquip.propertyType.length; j++) {
                let proType = recordRoleEquip.propertyType[j] as Msg.THeroPropertyType;
                let proNum = recordRoleEquip.propertyNum[j];
                if (proType > Msg.THeroPropertyType.EHeroPropertyType_DEF)
                    proNum = recordRoleEquip.propertyNum[j] / 100.0;
                if (this._equipPropertyList.has(proType))
                    this._equipPropertyList.set(proType,this._equipPropertyList.get(proType) as number+proNum)
                else
                this._equipPropertyList.set(proType, proNum);
            }
            //激活的套装
            for (let j = 0; j < recordRoleEquip.suitPropertyType.length; j++) {
                let proType = recordRoleEquip.suitPropertyType[j] as Msg.THeroPropertyType;
                let proNum = recordRoleEquip.suitPropertyNum[j] / 100.0;
                if (this._suitPropertyList.has(proType))
                    this._suitPropertyList.set(proType,this._suitPropertyList.get(proType) as number+proNum)
                else
                    this._suitPropertyList.set(proType, proNum);
            }
        }
        //当前未全部激活的品质
        let curQualityLeft = armorLevel % XConsts.KRoleHeroEquipNum;
        if (curQualityLeft != 0) {
            var recordCur = ValueMgr.getInstance().getItemByField(TableName.equip_role,activeQuality + 1) as Config.equip_role.Record;
            if (recordCur != null) {
                for (let i = 0; i < curQualityLeft; i++) {
                    let proType =  recordCur.propertyType[i] as Msg.THeroPropertyType;
                    let proNum = recordCur.propertyNum[i];
                    if (proType > Msg.THeroPropertyType.EHeroPropertyType_DEF)
                        proNum = recordCur.propertyNum[i] / 100.0;
                    if (this._equipPropertyList.has(proType))
                        this._equipPropertyList.set(proType,this._equipPropertyList.get(proType) as number+proNum)
                    else
                       this. _equipPropertyList.set(proType, proNum);
                }
            }
        }
    }

    //刷新英雄装备信息
    private refreshHeroEquipProperty()
    {

        this._equipPropertyList = new Map<Msg.THeroPropertyType, number>();
        this._equipPropertyList.clear();
        this._equipOnList.forEach((record)=>{
            
            for (let i = 0; i < record.propertyType.length; i++) {
                let propertyType =  record.propertyType[i] as Msg.THeroPropertyType;
                if (this._equipPropertyList.has(propertyType))
                    this._equipPropertyList.set(propertyType,this._equipPropertyList.get(propertyType) as number + record.propertyNum[i]);
                else
                    this._equipPropertyList.set(propertyType, record.propertyNum[i]);
            }
        })
        
        //刷新激活的套装
        if (this._suitActiveList == null)
            this._suitActiveList = new Map<number, number>();
        this._suitActiveList.clear();
        let temp = new Map<number, number>();
        this._equipOnList.forEach((v)=>{
            var suitID = v.quality * 100 + v.star;
            var record = ValueMgr.getInstance().getItemByField(TableName.suit,suitID) as Config.suit.Record;
            if (record != null) {
                if (temp.has(suitID))
                temp.set(suitID,temp.get(suitID) as number + 1);
                else
                    temp.set(suitID, 1);
            }
        })
        temp.forEach((value,key)=>{
            if (value > 1)
                this._suitActiveList.set(key, value);
        })
        //刷新套装的属性
        if (this._suitPropertyList == null)
            this._suitPropertyList = new Map<Msg.THeroPropertyType, number>();
        this._suitPropertyList.clear();
        this._suitActiveList.forEach((value,key)=>{
            
            let record = ValueMgr.getInstance().getItemByField(TableName.suit,key) as Config.suit.Record;//CfgMgr.GetTable<suit>().GetRecordById(v.Key);
            if (record != null) {
                let activeProNum = value - 1;
                if (activeProNum > record.propertyType.length)
                    activeProNum = record.propertyType.length;
                for (let i = 0; i < activeProNum; i++) {
                    let propertyType = record.propertyType[i] as Msg.THeroPropertyType;
                    if (this._suitPropertyList.has(propertyType))
                        this._suitPropertyList.set(propertyType, this._suitPropertyList.get(propertyType) as number + record.propertyNum[i] / 100.0);
                    else
                        this._suitPropertyList.set(propertyType, record.propertyNum[i] / 100.0);
                }
            }
        })

    }


    private getPropertyUpByTier() {
        let n = 1//Tier;
        if (n < XShare.getInstance().KHeroPropertyUpByTier.length){
            return XShare.getInstance().KHeroPropertyUpByTier[n] / 100.0;
        }
        return 0;
    }

    private getEquipProperty( propertyType:Msg.THeroPropertyType) {
        if (this._equipPropertyList.has(propertyType)){
            return this._equipPropertyList.get(propertyType) as number;
        }
        return 0;
    }

    private getTalentSkillBuff(propertyType:Msg.THeroPropertyType) {
        if (this._talentSkillPropertyList == null){
            return 0;
        }

        if (this._talentSkillPropertyList.has(propertyType)){
            return this._talentSkillPropertyList.get(propertyType) as number;
        }
        return 0;
    }
    
    
    private getPetAuraProperty( propertyType:Msg.THeroPropertyType) {
        let ret = 0;
        // if (this._gameModel != null) {
        //     this._gameModel.PetAuraPro.foreach((value:any, key:number) => {
        //         if (key == propertyType) {
        //             if (key == Msg.THeroPropertyType.EHeroPropertyType_ATK || key == Msg.THeroPropertyType.EHeroPropertyType_HP || key == Msg.THeroPropertyType.EHeroPropertyType_DEF)
        //                 ret = value;
        //             else
        //                 ret = value / 100.0;
        //         }
        //     });
        // }
        return ret;
    }
    
    private getAuraProperty(propertyType:Msg.THeroPropertyType) {
        let ret = 0;
        if (this._gameModel != null) {
            ret += this._gameModel.getAuraProperty(propertyType);
        }
        return ret;
    }
    
    private getCrystalProperty(propertyType:Msg.THeroPropertyType) {
        if (this._crystalPropertyList.has(propertyType))
            return this._crystalPropertyList.get(propertyType) as number;
        return 0;
    }
    private getSuitProperty(propertyType:Msg.THeroPropertyType) {
        if (this._suitPropertyList.has(propertyType))
            return this._suitPropertyList.get(propertyType) as number;
        return 0;
    }

    /*
        //////////////////////////////////
        ///////////英雄属性获取////////////
        //////////////////////////////////
    */
    //英雄HP = 基础HP + HP加值 * 等级 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    public getMaxHP(isAura : boolean = true)
    {

        let maxHp : number = 0;
        if (this._heroInfo != null && this._record != null) {
            maxHp += this._record.hpBase + this._record.hpUp * this.level;
        }


        maxHp *= 1.0 + this.getPropertyUpByTier();
        maxHp += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_HP) + this.getHeroBookPropertyByHero(Msg.THeroPropertyType.EHeroPropertyType_HP);
        maxHp += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_HP) : 0;
        
        let auraPro = isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_HP) : 0;
        maxHp *= (1.0 + auraPro +
            this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_HP) +
            this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_HP) +
            this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_HP) +
            this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_HP) +
            this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_HP) +
            this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_HP));


        return maxHp
    }
    
    //英雄攻击 = 基础攻击 + 攻击加值 * 等级 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    public getATK(isAura : boolean = true)
    {
        
        let atk:number = 0;
        if (this._heroInfo != null && this._record != null) {
            atk += this._record.atkBase + this._record.atkUp * this.level;
        }
        atk *= 1.0 + this.getPropertyUpByTier();
        atk += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_ATK) + this.getHeroBookPropertyByHero(Msg.THeroPropertyType.EHeroPropertyType_ATK);
        atk += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_ATK) : 0;

        let auraPro = isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_ATK) : 0;
        atk *= (1.0 + auraPro +
            this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_ATK) +
            this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_ATK) +
            this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_ATK) +
            this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_ATK) +
            this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_ATK) +
            this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_ATK));

        return atk;
    }

    //英雄防御 = 基础防御 + 防御加值 * 等级 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    public getDEF(isAura : boolean = true)
    {
        let def = 0;
        if (this._heroInfo != null && this._record != null) {
            def += this._record.defBase + this._record.defUp * this.level;
        }
        def *= 1.0 + this.getPropertyUpByTier();
        def += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_DEF) + this.getHeroBookPropertyByHero(Msg.THeroPropertyType.EHeroPropertyType_DEF);
        def += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_DEF) : 0;

        let auraPro = isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_DEF) : 0;
        def *= (1.0 + auraPro +
            this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_DEF) +
            this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_DEF) +
            this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_DEF) +
            this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_DEF) +
            this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_DEF) +
            this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_DEF));

        return def;
    }

    //英雄攻速 = 基础攻速 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    public getSpeed(isAura : boolean = true)
    {
        let num = 0;
        if (this._heroInfo != null && this._record != null) {
            num = this._record.speed;
        }
        let pct = this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_Speed);
        pct += isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_Speed) : 0;
        pct += this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_Speed);
        pct += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_Speed);
        pct += this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_Speed);
        pct += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_Speed) : 0;
        pct += this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_Speed);
        pct += this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_Speed);
        pct += this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_Speed);
        num = num * (1.0 - pct);
        return num;
    }


    //英雄命中率 = 基础命中率 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    public getHit(isAura : boolean = true)
    {
        let num = 0;
        if (this._heroInfo != null && this._record != null) {
            num += this._record.hit / 100.0;
        }
        num += this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_Hit);
        num += isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_Hit) : 0;
        num += this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_Hit);
        num += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_Hit);
        num += this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_Hit);
        num += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_Hit) : 0;
        num += this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_Hit);
        num += this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_Hit);
        num += this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_Hit);
        return num;
    }

    //英雄暴击率 = 基础暴击率 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    public getCrit(isAura : boolean = true)
    {
        let num = 0;
        if (this._heroInfo != null && this._record != null) {
            num += this._record.crit / 100.0;
        }
        num += this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_Crit);
        num += isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_Crit) : 0;
        num += this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_Crit);
        num += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_Crit);
        num += this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_Crit);
        num += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_Crit) : 0;
        num += this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_Crit);
        num += this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_Crit);
        num += this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_Crit);
        return num;
    }

    //英雄暴击伤害 = 基础暴击伤害 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    public getCritDamage(isAura : boolean = true)
    {
        let num = 0;
        if (this._heroInfo != null && this._record != null) {
            num += this._record.critDamage / 100.0;
        }
        num += this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_CritDamage);
        num += isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_CritDamage) : 0;
        num += this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_CritDamage);
        num += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_CritDamage);
        num += this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_CritDamage);
        num += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_CritDamage) : 0;
        num += this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_CritDamage);
        num += this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_CritDamage);
        num += this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_CritDamage);
        return num;
    }
    
    //英雄破甲率 = 基础破甲率 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    public getDEFBreak(isAura : boolean = true)
    {
        let num = 0;
        if (this._heroInfo != null && this._record != null) {
            num += this._record.defBreak / 100.0;
        }
        num += this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_DEFBreak);
        num += isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_DEFBreak) : 0;
        num += this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_DEFBreak);
        num += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_DEFBreak);
        num += this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_DEFBreak);
        num += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_DEFBreak) : 0;
        num += this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_DEFBreak);
        num += this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_DEFBreak);
        num += this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_DEFBreak);
        return num;
    }

    //英雄闪避率 = 基础闪避率 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    public getDodge(isAura : boolean = true)
    {
        let num = 0;
        if (this._heroInfo != null && this._record != null) {
            num += this._record.dodge / 100.0;
        }
        num += this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_Dodge);
        num += isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_Dodge) : 0;
        num += this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_Dodge);
        num += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_Dodge);
        num += this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_Dodge);
        num += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_Dodge) : 0;
        num += this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_Dodge);
        num += this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_Dodge);
        num += this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_Dodge);
        return num;
    }

    
    public getReduceDamage(isAura : boolean = true){
        let num = 0;
        num += this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_DamageReduce);
        num += isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_DamageReduce) : 0;
        num += this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_DamageReduce);
        num += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_DamageReduce);
        num += this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_DamageReduce);
        num += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_DamageReduce) : 0;
        num += this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_DamageReduce);
        num += this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_DamageReduce);
        num += this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_DamageReduce);
        return num;
    }
    public getSkillEffect(isAura : boolean = true){
        let num = 0;
        num += this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_SkillEffect);
        num += isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_SkillEffect) : 0;
        num += this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_SkillEffect);
        num += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_SkillEffect);
        num += this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_SkillEffect);
        num += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_SkillEffect) : 0;
        num += this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_SkillEffect);
        num += this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_SkillEffect);
        num += this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_SkillEffect);
        return num;
    }
    public getCampDamage(isAura : boolean = true){
        let num = XShare.getInstance().KCampDamageBonus/100.0;
        num += this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_CampDamage);
        num += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_CampDamage);
        num += this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_CampDamage);
        num += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_CampDamage) : 0;
        num += this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_CampDamage);
        num += this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_CampDamage);
        num += this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_CampDamage);
        return num;
    }
    public getHealEffect(isAura : boolean = true){
        let num = 0;
        num += this.getCrystalProperty(Msg.THeroPropertyType.EHeroPropertyType_HealEffect);
        num += isAura ? this.getAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_HealEffect) : 0;
        num += this.getTalentSkillBuff(Msg.THeroPropertyType.EHeroPropertyType_HealEffect);
        num += this.getEquipProperty(Msg.THeroPropertyType.EHeroPropertyType_HealEffect);
        num += this.getSuitProperty(Msg.THeroPropertyType.EHeroPropertyType_HealEffect);
        num += isAura ? this.getPetAuraProperty(Msg.THeroPropertyType.EHeroPropertyType_HealEffect) : 0;
        num += this.getHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_HealEffect);
        num += this.getTitleProperty(Msg.THeroPropertyType.EHeroPropertyType_HealEffect);
        num += this.getTechnologyProperty(Msg.THeroPropertyType.EHeroPropertyType_HealEffect);
        return num;
    }
    //英雄技能攻速
    public getSkillSpeed(isAura : boolean = true)
    {
        let num = 0;
        if (this._heroInfo != null && this._record != null) {
            num = this._record.skillSpeed;
        }

        return num;
    }
    
    public getProperty(proType:Msg.THeroPropertyType, isAura : boolean = true) {
        switch (proType) {
            case Msg.THeroPropertyType.EHeroPropertyType_HP:
                return this.getMaxHP(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_ATK:
                return this.getATK(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_DEF:
                return this.getDEF(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_Crit:
                return this.getCrit(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_CritDamage:
                return this.getCritDamage(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_Hit:
                return this.getHit(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_Dodge:
                return this.getDodge(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_DEFBreak:
                return this.getDEFBreak(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_Speed:
                return this.getSpeed(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_DamageReduce:
                return this.getReduceDamage(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_SkillEffect:
                return this.getSkillEffect(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_CampDamage:
                return this.getCampDamage(isAura);
            case Msg.THeroPropertyType.EHeroPropertyType_HealEffect:
                return this.getHealEffect(isAura);
        }
        return 0;
    }

    //普攻范围
    public getRange(isAura : boolean = true)
    {
        if (this._heroInfo != null && this._record != null) {
            return this._record.range;
        }
        return 0;
    }
    
    public  getPrepareAttackParticleName() {
        if (this._heroInfo != null && this._record != null) {
            return this._record.prepareAttack;
        }
        return "0";
    }

    public getNormalAttackParticleName() {
        if (this._heroInfo != null && this._record != null) {
            return this._record.normalAttack;
        }
        return "0";
    }

    public getActiveTalent() {// List<talent.Types.Record>
        let active_talents = new Array<Config.talent.Record>();
        for (let i = 0; i < this._record.talentId.length; i++) {
            if (this.isTalentActive(i)) {
                let record = ValueMgr.getInstance().getItemByField(TableName.talent,this.getTalentID(i)) as Config.talent.Record;//CfgMgr.GetTable<talent>().GetRecordById(GetTalentID(i));
                if (record != null)
                    active_talents.push(record);
            }
        }

        return active_talents;
    }

    //等级
    public getLevel() {
        return this._heroInfo.level; 
    }
    //静态ID
    public getStaticID() {
        return this._heroInfo.staticID; 
    }

    public getDyncID() { 
        return this._heroInfo.id; 
    }
    //阵营
    public getCamp() { 
        return this._record.camp;
    }
    // 职业
    public getClasses() { 
        return this._record.classes;
    }
    //星级   
    public getStar() { 
        return this._record.star;
    }

    public isOrangeQuality() { 
        return this._heroInfo.staticID/1000000 >= 5; 
    }
    
    public getArmorID() {
        if (this.isRoleHero())
            return this._record.id / 100;
        return 0;
    }

    
    public getFighting() {
        //主角和英雄现在战力计算方式相同
        //战力公式不再计算免伤，将防御属性按英雄的攻血比转化为攻击
        //战力 = 血量 / (1-免伤) / (1 - 闪避) * (攻击 + 防御 * 攻防比)/2 /攻速 * (1 + 暴击率 * 暴击伤害) * 命中 * (1 + 破甲 + (技能伤害+治疗效果) / 2)
        let fighting = 0;
        fighting += this.getMaxHP(false) / XShare.getInstance().KRoleFightingParam / (1.0 - this.getDodge(false)) / (1.0 - this.getReduceDamage(false)) *
            (this.getATK(false) + this.getDEF(false) * this.getRatioAtkDef()) / 2.0 / this.getSpeed(false) * (1.0 + (this.getCrit(false) + XShare.getInstance().KBaseCrit / 100.0) * 
            (XShare.getInstance().KBaseCritDmage / 100.0 - 1.0 + this.getCritDamage(false))) * (this.getHit(false) + XShare.getInstance().KBaseHit / 100.0) * 
            (1.0 + this.getDEFBreak(false) + (this.getSkillEffect(false) + this.getHealEffect(false)) / 2);

        let talentFighting = 0;
        for (let i = 0; i < this._record.talentId.length; i++) {
            if (!this.isTalentActive(i))
                continue;
            var recordTalent = ValueMgr.getInstance().getItemByField(TableName.talent,this.getTalentID(i)) as Config.talent.Record;
            if (recordTalent != null) {
                talentFighting += recordTalent.fighting / 100.0;
            }
        }
        //Debug.Log("Talent Fighting: " + talentFighting);
        fighting *= (1 + talentFighting);
        //Debug.Log("Total Fighting: " + fighting);
        return fighting;
    }
    //-----------------------------------end-----------------------------------------

    private getRatioAtkDef() {
        if (this._record != null)
            return this._record.atkBase / this._record.defBase;
        return 1;
    }
    
    public getImageIcon() { 
        return this._record.image;
    }


    public getName() {
        if (this._record != null)
            return (ValueMgr.getInstance().getItemByField(TableName.language_data,this._record.name) as Config.language_data.Record).cn;
        //return _record.Name;
        return "";
    }

    public getSkillName() {
        if (this._recordSkill != null) {
            return (ValueMgr.getInstance().getItemByField(TableName.language_data,this._recordSkill.name) as Config.language_data.Record).cn;
            //return _recordSkill.Name;
        }

        return "";
    }
    
    public  getSkillDesc() {//Color color
        if (this._recordSkill != null)
            return (ValueMgr.getInstance().getItemByField(TableName.language_data,this._recordSkill.desc) as Config.language_data.Record).cn;
            //this._recordSkill.getSkillDesc(color);
        return "";
    }

    public getAnalyticsString() {
        return this._record.star + "星" + this.getName() + ", " + this._heroInfo.level + "级, " + this._heroInfo.tier + "品阶";
    }

    public refreshRoleData( hdList:Array<HeroData> | null = null) {
        this._recordSkill = ValueMgr.getInstance().getItemByField(TableName.skill,this.getSkillID()) as Config.skill.Record;
        this.calcTalentSkillProperty(hdList);
    }
    
    //重置
    public heroReset() {
        this._heroInfo.level = 1;
        this._heroInfo.tier = 0;
        if(this._heroInfo.crystal){
            this._heroInfo.crystal.level = 0;
            if(this._heroInfo.crystal.propertyList)
                this._heroInfo.crystal.propertyList.splice(0,this._heroInfo.crystal.propertyList.length);
                
            this.setCrystalInfo(this._heroInfo.crystal.level, this._heroInfo.crystal.propertyList as Msg.THeroPropertyType[]);
        }
        this._equipOnList.clear();
    }


    public static GetHeroBookID(staticID:number) {
        return Math.floor(staticID / 1000000) * 1000000 + staticID % 10000;
    }
    public static GetHeroStar(staticID:number) {
        return Math.floor(staticID / 10000) % 100;
    }

    private getHeroBookPropertyByHero(proType:Msg.THeroPropertyType) {
        if (this._gameModel != null) {
            return this._gameModel.getHeroBookPropertyByHero(proType);
        }
        return 0;
    }
    private getHeroBookPropertyByBook( proType:Msg.THeroPropertyType) {
        if (this._gameModel != null) {
            return this._gameModel.getHeroBookPropertyByBook(proType);
        }
        return 0;
    }

    private getTitleProperty( proType:Msg.THeroPropertyType) {
        if (this._gameModel != null) {
            return this._gameModel.getTitleProperty(proType);
        }
        return 0;
    }
    
    private getTechnologyProperty( proType:Msg.THeroPropertyType) {
        if (this._gameModel != null) {
            let classes =  this._record.classes as Msg.TClassesType;
            return this._gameModel.getTechnologyProperty(classes, proType);
        }
        return 0;
    }
    
    







    //////////////////////////////  分割线  //////////////////////////////
    // 模型预制体路径
    public getPrefabPath(): string {
        return this._record.prefab;
    }

    //返回英雄头衔
    public getTitleName():string{
        let _title = "";
        if(this._record != null)
        {
            return this._record.title;
        }
        return _title
    }
}