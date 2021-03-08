//数据基类

import {  ValueMgr } from "../ValueMgr";

export class BaseHeroData
{

    public getMaxHP(isAura:boolean = true) { return 0; }            //最大血量
    public getATK(isAura:boolean = true) { return 0; }              //攻击
    public getDEF(isAura:boolean = true) { return 0; }              //防御
    public getSpeed(isAura:boolean = true) { return 0; }            //攻速
    public getHit(isAura:boolean = true) { return 0; }              //命中率
    public getCrit(isAura:boolean = true) { return 0; }             //暴击率
    public getCritDamage(isAura:boolean = true) { return 0; }       //暴击伤害
    public getDEFBreak(isAura:boolean = true) { return 0; }         //破甲
    public getDodge(isAura:boolean = true) { return 0; }            //闪避率
    public getReduceDamage(isAura:boolean = true) { return 0; }     //免伤值
    public getSkillEffect(isAura:boolean = true) { return 0; }      //技能效果
    public getCampDamage(isAura:boolean = true) { return 0; }       //阵营伤害
    public getHealEffect(isAura:boolean = true) { return 0; }       //治疗效果
    public getSkillSpeed(isAura:boolean = true) { return 0; }       //技能攻速

    public getProperty(proType:Msg.THeroPropertyType,isAura:boolean = true) { return 0; }       //阵营伤害
    public getRange(isAura:boolean = true) { return 0; }       //范围
    public getPrepareAttackParticleName() { return "0"; }       //蓄力攻击粒子名称
    public getNormalAttackParticleName() { return "0"; }       //普通攻击粒子名称
    public getActiveTalent() { let talentList : any = []; return talentList; }       //已激活的天赋id

    public getLevel() { return 0; }      //等级
    public getStaticID() { return 0; }   //静态ID
    public getDyncID() { return 0; }     //
    public getCamp() { return Msg.TCampType.ECampType_NULL; }       //阵营
    public getClasses() { return Msg.TClassesType.EClassesType_NULL; }   // 职业
    public getStar() { return 0; }      //星级
    // public set recordSkill(_skill :any) { this._recordSkill = _skill; }
    // public get recordSkill() { return this._recordSkill; }
    public isOrangeQuality() { return false; }
    public getArmorID() { return 0; }
    public getFighting() { return 0; }
    public getImageIcon() { return "0"; }
    public getMaxPower() { return 0; }
    // public set Owner(isOwn : boolean) { }
    // public get Owner() { return true; }






    //////////////////////////////  分割线  //////////////////////////////
    // 模型预制体路径
    public getPrefabPath(): string { return ""; }
    // 获得主动技能ID
    public getSkillID(): number { return 0; }
    
}
