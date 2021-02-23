//单个英雄子模块

// import { Item } from '../../core/control/Item';
import { BaseData } from "./BaseData";
import { TableName, ValueMgr } from "./ValueMgr";

export class HeroItem extends BaseData {
    private _staticID : number = 0;
    private _objectID : number = 100;
    private _heroInfo : any;
    // private _heroLT: any ;
    private _heroLT = ValueMgr.getInstance().getItemByField(TableName.heroes, 100) as Config.heroes.Record;

    private _equipPropertyList:Map<number,Msg.THeroPropertyType> = new Map<number,Msg.THeroPropertyType>();     //装备属性
    private _suitPropertyList:Map<number,Msg.THeroPropertyType> = new Map<number,Msg.THeroPropertyType>();      //套装属性
    private _equipOnList = new Map<Msg.TEquipLocationType, Config.equip.Record>();
    private _suitActiveList = new Map<number, number>();
    ctor(_heroData : Msg.HeroInfo)
    {
        this._heroInfo = _heroData;
        for (let index = 0; index < this._heroInfo.EquipOnList.length; index++) {
            let equipId = this._heroInfo.EquipOnList[index];
            let equipRecord = ValueMgr.getInstance().getItemByField(TableName.equip,equipId) as Config.equip.Record;
            this._equipOnList.set(equipId as number, equipRecord);
        }
        
        
        // this._heroTable = ValueMgr.getInstance().getItemByField(TableName.heroes, this._staticID);
        this._heroLT = ValueMgr.getInstance().getItemByField(TableName.heroes, 100) as Config.heroes.Record;
    }

    RefreshEquipProperty()
    {

    }

    //刷新装备的属性和套装的属性
    refreshRoleHeroEquipProperty()
    {

    }

    //刷新英雄装备信息
    refreshHeroEquipProperty()
    {
        this._equipPropertyList.clear();

        let temp : Map<number,number> = new Map<number,number>();
        for (let record of this._equipOnList.values()) {
            var suitID = record.quality * 100 + record.star;        //套装id
            var suitRecord = ValueMgr.getInstance().getItemByField(TableName.suit,suitID);
            if(suitRecord != null)
            {
                if(temp.has(suitID))
                {
                    temp.get[suitID] += 1;
                }
                else{
                    temp.set(suitID,1);
                }
            }

            //装备属性
            for (let index = 0; index < record.propertyType.length; index++) {
                let propertyType = record.propertyType[index] as Msg.THeroPropertyType;
                if(this._equipPropertyList.has(propertyType))
                {
                    let equipType : Msg.THeroPropertyType = this._equipPropertyList.get(propertyType) as Msg.THeroPropertyType;
                    equipType += record.propertyNum[index] as number;
                }
                else{
                    this._equipPropertyList.set(propertyType, record.propertyNum[index] as number);
                }
            }
        }
        
        for (let v of temp) {
            if(Number(v.values()) > 1)
            {
                this._suitActiveList.set(Number(v.keys()),Number(v.values()));
            }
        }
        this._suitPropertyList.clear();
        for (const iterator of this._suitActiveList) {
            var record = ValueMgr.getInstance().getItemByField(TableName.suit, Number(iterator.keys())) as Config.equip.Record;
            if(record != null)
            {
                let activeProNum : number =  Number(iterator.values()) - 1;
                if(activeProNum > record.propertyType.length)
                {
                    activeProNum = record.propertyType.length;
                }
                for (let index = 0; index < activeProNum; index++) {
                    let propertyType = record.propertyType[index] as Msg.THeroPropertyType;
                    if(this._suitPropertyList.has(propertyType))
                    {
                        let equipType : Msg.THeroPropertyType = this._suitPropertyList.get(propertyType) as Msg.THeroPropertyType;
                        equipType += (record.propertyNum[index] as number) / 100.0;
                    }
                    else{
                        this._suitPropertyList.set(propertyType, (record.propertyNum[index] as number) / 100.0);
                    }
                }
            }
        }
    }

    /*
        //////////////////////////////////
        ///////////英雄属性获取////////////
        //////////////////////////////////
    */
    //英雄HP = 基础HP + HP加值 * 等级 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    GetMaxHP(isAura : boolean = true)
    {

        let allHP : number = 0;
        let baseHeroHP : number = this._heroLT.hpBase + this._heroLT.hpUp * this._heroInfo.level;
        let allEquipHP : number = 0;
        // for (let index = 0; index < this._heroInfo.equipOnList.length; index++) {
        //     const element = this._heroInfo.equipOnList[index];
        //     let _equipLT = ValueMgr.getInstance().getItemByField(TableName.equip,element.)
        // }

        allHP += baseHeroHP;
        return allHP
    }
    
    //英雄攻击 = 基础攻击 + 攻击加值 * 等级 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    GetATK(isAura : boolean = true)
    {
        let allAtk : number = 0;
        let baseHeroAtk : number = this._heroLT.atkBase + this._heroLT.atkUp * this._heroInfo.level;
        let allEquipAtk : number = 0;
        // for (let index = 0; index < this._heroInfo.equipOnList.length; index++) {
        //     const element = this._heroInfo.equipOnList[index];
        //     let _equipLT = ValueMgr.getInstance().getItemByField(TableName.equip,element.)
        // }

        allAtk += baseHeroAtk;
        return allAtk
    }

    //英雄防御 = 基础防御 + 防御加值 * 等级 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    GetDEF(isAura : boolean = true)
    {
        let allDef : number = 0;
        let baseHeroDef : number = this._heroLT.defBase + this._heroLT.defUp * this._heroInfo.level;
        let allEquipDef : number = 0;
        // for (let index = 0; index < this._heroInfo.equipOnList.length; index++) {
        //     const element = this._heroInfo.equipOnList[index];
        //     let _equipLT = ValueMgr.getInstance().getItemByField(TableName.equip,element.)
        // }

        allDef += baseHeroDef;
        return allDef
    }

    //英雄攻速 = 基础攻速 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    GetSpeed(isAura : boolean = true)
    {
        let allSpeed : number = 0;
        let baseHeroSpeed : number = this._heroLT.speed ;
        let allEquipSpeed : number = 0;

        allSpeed += baseHeroSpeed;
        return allSpeed
    }

    //英雄技能攻速
    GetSkillSpeed(isAura : boolean = true)
    {
        let allSkillSpeed : number = 0;
        allSkillSpeed += this._heroLT.skillSpeed;
        return allSkillSpeed;
    }

    //英雄命中率 = 基础命中率 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    GetHit(isAura : boolean = true)
    {
        let allHit : number = 0;
        let baseHeroHit : number = this._heroLT.hit;
        let allEquipHit : number = 0;

        allHit += baseHeroHit;
        return allHit
    }

    //英雄暴击率 = 基础暴击率 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    GetCrit(isAura : boolean = true)
    {
        let allCrit : number = 0;
        let baseHeroCrit : number = this._heroLT.crit;
        let allEquipCrit : number = 0;

        allCrit += baseHeroCrit;
        return allCrit
    }

    //英雄暴击伤害 = 基础暴击伤害 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    GetCritDamage(isAura : boolean = true)
    {
        let allcritDamage : number = 0;
        let baseHerocritDamage : number = this._heroLT.critDamage;
        let allEquipCritDamage : number = 0;

        allcritDamage += baseHerocritDamage;
        return allcritDamage
    }
    
    //英雄破甲率 = 基础破甲率 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    GetDEFBreak(isAura : boolean = true)
    {
        let allDefBreak : number = 0;
        let baseHeroDefBreak : number = this._heroLT.defBreak;
        let allEquipDefBreak : number = 0;

        allDefBreak += baseHeroDefBreak;
        return allDefBreak
    }

    //英雄闪避率 = 基础闪避率 + 装备加成 + 图鉴加成 + 光环加成 + 套装加成 + 工会buff加成 + 称号加成
    GetDodge(isAura : boolean = true)
    {
        let allDodge : number = 0;
        let baseHeroDodge : number = this._heroLT.critDamage;
        let allEquipDodge : number = 0;

        allDodge += baseHeroDodge;
        return allDodge
    }

    //普攻范围
    GetRange(isAura : boolean = true)
    {
        let allRange : number = this._heroLT.range;

        return allRange;
    }

    
}