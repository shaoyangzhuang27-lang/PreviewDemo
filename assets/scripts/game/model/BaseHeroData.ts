//数据基类

import {  ValueMgr } from "./ValueMgr";

export class BaseHeroData
{

    public GetMaxHP(isAura:boolean = true) { return 0; }            //最大血量
    public GetATK(isAura:boolean = true) { return 0; }              //攻击
    public GetDEF(isAura:boolean = true) { return 0; }              //防御
    public GetSpeed(isAura:boolean = true) { return 0; }            //攻速
    public GetHit(isAura:boolean = true) { return 0; }              //命中率
    public GetCrit(isAura:boolean = true) { return 0; }             //暴击率
    public GetCritDamage(isAura:boolean = true) { return 0; }       //暴击伤害
    public GetDEFBreak(isAura:boolean = true) { return 0; }         //破甲
    public GetDodge(isAura:boolean = true) { return 0; }            //闪避率
    public GetReduceDamage(isAura:boolean = true) { return 0; }     //免伤值
    public GetSkillEffect(isAura:boolean = true) { return 0; }      //技能效果
    public GetCampDamage(isAura:boolean = true) { return 0; }       //阵营伤害
    public GetHealEffect(isAura:boolean = true) { return 0; }       //治疗效果
    public GetSkillSpeed(isAura:boolean = true) { return 0; }       //技能攻速

    public GetProperty(proType:Msg.THeroPropertyType,isAura:boolean = true) { return 0; }       //阵营伤害
    public GetRange(isAura:boolean = true) { return 0; }       //范围
    public GetPrepareAttackParticleName() { return "0"; }       //蓄力攻击粒子名称
    public GetNormalAttackParticleName() { return "0"; }       //普通攻击粒子名称
    public GetActiveTalent() { let talentList : any = []; return talentList; }       //已激活的天赋id

    public Level() { return 0; }       //等级
    public StaticID() { return 0; }       //静态ID
    public DyncID() { return 0; }       //
    public Camp() { return Msg.TCampType.ECampType_NULL; }       //阵营
    public Star() { return 0; }       //星级
    // public set recordSkill(_skill :any) { this._recordSkill = _skill; }
    // public get recordSkill() { return this._recordSkill; }
    public IsOrangeQuality() { return false; }
    public ArmorID() { return 0; }
    public GetFighting() { return 0; }
    public ImageIcon() { return "0"; }
    public MaxPower() { return 0; }
    public set Owner(isOwn : boolean) { }
    public get Owner() { return true; }
}
