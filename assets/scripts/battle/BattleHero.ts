import { _decorator, Component, Node, SkeletalAnimation, AnimationState, Vec3, BoxCollider, RigidBody, Enum, instantiate, Prefab, macro, director } from 'cc';
const { ccclass, property } = _decorator;


import { HeroBase } from "../core/base/HeroBase";
import { BaseHeroData } from "../game/model/datas/BaseHeroData";

import { BattleResMgr } from "./BattleResMgr";
import { BattleCtrl } from "./BattleCtrl";
import { DamageType, BattleTitleBar } from "./BattleTitleBar";
import { TableName, ValueMgr } from '../game/model/ValueMgr';

// TODO
import { BattleTest } from './test/BattleTest';
import { BattleBuffer } from './BattleBuffer';


const RunSpeed = 7;

const AttackPowerUp = 10;
const BeHitPowerUp = 5;
const KillPowerUp = 20;

/*
TODO
1.  目标找完后，正在接近目标时候，目标发生移动或死了。
2.  找完目标后，锁定的移动位置可能已被占用。
*/


export enum EHeroType {
    None,       // 无
    LEADER,     // 主角
    HERO,       // 英雄
    MONSTER,    // 小怪
    BOSS,       // BOSS
}
Enum(EHeroType);

enum ESkillTargetType {
    Null,
    CurrentTarget,              // 当前攻击目标
    Self,                       // 自身
    AOERandomEnemyBySelf,       // 自身范围内AOE随机敌方
    AOERandomTeammateBySelf,    // 自身范围内AOE血少己方
    AOELineRangeBySelf,         // 自身前方直线范围AOE随机敌方
    RandomEnemy,                // 每个随机敌方
    LowerHpTeammate,            // 每个血少己方
    LowerHpEnemy,               // 每个血少敌方
    BackEnemy,                  // 优先后排每个敌方
    FrontEnemy,                 // 优先前排每个敌方
    RandomEnemyByTarget,        // 目标范围内的敌方单位
    BackTeammate,               // 优先后排每个己方
    FrontTeammate,              // 优先前排每个己方
    LowerHpTeammateExceptSelf,  // 每个血少已方单位不算自身
    RoleSelf,                   // 己方主角
}
// Enum(ESkillTargetType);

enum EEffectTargetType {
    SameToSkill,        // 同技能目标 = 0,
    Self,               // 自身 = 1,
    TeammateHPLowest    // 己方血量少的 = 2,
}

enum EEffectCondType {
    Null,
    TargetClasses,          // 目标职业 = 1, 职业类型
    TargetStatus,           // 目标状态 = 2, 状态类型(燃烧、中毒、冰冻等)
    TargetHPMoreThanSelf,   // 目标生命高于自身 = 3
    TargetDead,             // 目标死亡 = 4
    FormationLoc,           // 上阵位置 = 5, 1前排2后排
    EveryHPLostX,           // 每损失百分之X生命 = 6, 百分比
    TargetHPLessThanSelf    // 目标生命低于自身 = 7
}

enum EEffectType {
    Null,
    Damage,                     // 伤害 = 1, 攻击百分比	
    Heal,                       // 加血 = 2, 攻击百分比	
    AddBuff,                    // 生成buff = 3, buffID	
    AddPower,                   // 加能量 = 4, 数值	
    SubPower,                   // 减能量 = 5, 数值	
    KnockOff,                   // 击飞 = 6	
    DamageMulti,                // 多段伤害 = 7, 攻击百分比	伤害次数
    RemoveBuff,                 // 移除BUFF = 8, BUFF类型
    MoveToTargetBack,           // 移动到目标位置身后 = 9,
    PassiveProperty,            // 被动加属性 = 10, 属性数值 属性枚举
    AddBuffTime,                // 加强BUFF时间 = 11, buffID	
    SureCrit,                   // 伤害或治疗必定暴击 = 12,
    AttackMultiTarget,          // 普通攻击多目标 = 13, 额外目标数量 伤害
    TeleportWhenBattleStart,    // 战斗开始时瞬移位置 = 14
    FirstTargetHPLowest,        // 优先攻击血量最低敌方目标 = 15
    DamageUpToClasses,          // 对特定职业目标伤害提高 = 16, 职业类型，伤害提高
    DamageUpToStatus,           // 对特定状态目标伤害提高 = 17, 状态类型，伤害提高
    AttackDamageUp,             // 普通攻击伤害提高 = 18
    Reborn,                     // 复活 = 19
    HealHPPct,                  // 百分比加血 = 20
    CampSkillExtraTarget,       // 阵营技能额外目标 = 21
    CampUltimateExtraTarget     // 阵营技能大招额外目标 = 22
}



@ccclass('BattleHero')
export class BattleHero extends Component {

    private _battleTitleBar: BattleTitleBar = null as unknown as BattleTitleBar
    private _heroBase: HeroBase = null as unknown as HeroBase
    private _battleCtrl: BattleCtrl = null as unknown as BattleCtrl


    private _heroSkeletalAnimation: SkeletalAnimation = null as unknown as SkeletalAnimation
    private _heroBoxCollider: BoxCollider = null as unknown as BoxCollider
    private _heroRigidBody: RigidBody = null as unknown as RigidBody


    private _tmpPos: Vec3 = new Vec3()
    private _targetPos: Vec3 = new Vec3()
    private _dirVector: Vec3 = new Vec3()

    private _targetList: Array<BattleHero> = []
    private _target: BattleHero = null as unknown as BattleHero

    private _armyList: Array<BattleHero> = []

    
    private _heroData: BaseHeroData = null as unknown as BaseHeroData


    private _leaderNode: any = null

    private _actTime: number = 0
    private _curActFunc: any = null


    private _heroType: EHeroType = EHeroType.HERO;
    private maxHp: number = 0
    private maxPow: number = 100
    

    public embattleedSite: number = 0

    public hp: number = 0
    public pow: number = 0
    public atk: number = 0
    public def: number = 0
    public spd: number = 0
    public skillSpd: number = 0
    public crt: number = 0
    public crtDmg: number = 0
    public hitRat: number = 0
    public dodge: number = 0
    public defBreak: number = 0

    public range: number = 0

    private _buffPropertyMap = new Map<Msg.THeroPropertyType, number>();

    private _recordSkill: Config.skill.Record | null = null;
    private _skillPrefab: Prefab | null = null;
    

    private _buffList: BattleBuffer[] = [];
    // public static Event = {
    //     DIE: "DIE",
    // }
    // private _battleEvents = {}
    onLoad() { 
        this._battleTitleBar = this.node.getChildByName("battle_ui_title_pot")?.getComponent("BattleTitleBar") as BattleTitleBar;
        // this.startSeekEnemy()
    }

    start() {

        // console.log(this.idleNode.getComponent(SkeletalAnimation)?.clips);

        // this.idleNode.getComponent(SkeletalAnimation)?.on(SkeletalAnimation.EventType.LASTFRAME, function (a: any, b: any, c: any) {
        //     // this.idleNode.getComponent(SkeletalAnimation)?.off(SkeletalAnimation.EventType.LASTFRAME)
        //     console.log(a, b, c)
        // }.bind(this))

    }

    update(dt: number) {
        // this.node.getPosition(this._tmpPos);
        // this._tmpPos.z += -0.2
        // this.node.setPosition(this._tmpPos);

        // this._battleTitleBar.setHpPercent(Math.random())
        // this._battleTitleBar.setPowPercent(Math.random())

        if (this._curActFunc) {
            this._curActFunc.call(this, dt);
        }  
    }

    initHero(battleCtrl: BattleCtrl, heroData: any, heroType: EHeroType): void {
        this._battleCtrl = battleCtrl;
        this._heroData = heroData;
        this._heroType = heroType;

        this.initBattleData();
        this.initHeroBase();
        this.initTitleBar();

        this.refreshData();
        this.refreshAttackSpeed();
    }

    initHeroBase(): void {
        let heroBaseNode = instantiate(BattleResMgr.getInstance().getRes(this._heroData.getPrefabPath()));
        heroBaseNode.name = "heroBase";
        heroBaseNode.setPosition(0, 0, 0);
        this.node.addChild(heroBaseNode);
    
        this._heroBase = heroBaseNode.getComponent("HeroBase") as HeroBase;
        this._heroSkeletalAnimation = this._heroBase.getSkeletalAnimation();
        let heroBoxCollider = heroBaseNode.getComponent(BoxCollider) as BoxCollider;
        this.node.addComponent(BoxCollider);
        this._heroBoxCollider = this.node.getComponent(BoxCollider) as BoxCollider;
        this._heroBoxCollider.center = heroBoxCollider.center;
        this._heroBoxCollider.size = heroBoxCollider.size;
        heroBoxCollider.destroy();
        this._heroBoxCollider.enabled = false;

        let heroRigidBody = heroBaseNode.getComponent(RigidBody) as RigidBody;
        this.node.addComponent(RigidBody);
        this._heroRigidBody = this.node.getComponent(RigidBody) as RigidBody;
        this._heroRigidBody.mass = heroRigidBody.mass;
        this._heroRigidBody.linearDamping = heroRigidBody.linearDamping;
        this._heroRigidBody.angularDamping = heroRigidBody.angularDamping;
        this._heroRigidBody.useGravity = heroRigidBody.useGravity;
        this._heroRigidBody.linearFactor = heroRigidBody.linearFactor;
        this._heroRigidBody.angularFactor = heroRigidBody.angularFactor;
        heroRigidBody.destroy();
        this._heroRigidBody.enabled = false;

        this._heroBase.setSkillEventCallBack(() => {
            this.onSkill();
        })

        this._heroBase.setAttackEventCallBack(() => {
            this.onAttack();
        })
    }

    initBattleData(): void {
        this.maxHp = Math.ceil(this._heroData.getMaxHP());
        
        this.atk = this._heroData.getATK();
        this.def = 0;
        this.range = this._heroData.getRange();
        this.spd = this._heroData.getSpeed();
        this.skillSpd = 0;
        this.crt = 0;
        this.crtDmg = 0;
        this.hitRat = 0;
        this.dodge = 0;
        this.defBreak = 0;

        this._recordSkill = null as unknown as Config.skill.Record;
        
        if (this._heroData.getSkillID()) {
            this._recordSkill = ValueMgr.getInstance().getItemByField(TableName.skill, this._heroData.getSkillID()) as Config.skill.Record;
            if (this._recordSkill) {
                let path = BattleTest.getSkillPrefabPath(this._recordSkill.id);
                if (path) {
                    this._skillPrefab = BattleResMgr.getInstance().getRes(path);
                    if (!this._skillPrefab) {
                        this._recordSkill = null as unknown as Config.skill.Record; 
                    }
                } else {
                    this._recordSkill = null as unknown as Config.skill.Record;
                }
                
            }
        }

        if (this._recordSkill) {
            this.maxPow = 100;
        } else {
            this.maxPow = 0;
            this._skillPrefab = null;
        }
        
    }

    refreshBattleData(): void {
        
    }

    setEmbattleedSite(sit: number): void {
        this.embattleedSite = sit;
    }

    setLeaderNode(leaderNode: Node): void {
        this._leaderNode = leaderNode;
    }

    refreshData(): void {
        this.setHp(this.maxHp);
        this.setPow(0);
    }

    refreshAttackSpeed(): void {
        let a: AnimationState = this._heroSkeletalAnimation.getState("attack");
        a.speed = a.length / this.spd
    }

    revive(): void {
        this.refreshData();
        this._heroBase.playIdle();
    }

    isEnemy(): boolean {
        return this._heroType != EHeroType.LEADER && this._heroType != EHeroType.HERO
    }

    isHero(): boolean {
        return this._heroType == EHeroType.HERO;
    }

    getClasses(): number {
        return this._heroData.getClasses();
    }

    initTitleBar(): void {
           
        this._battleTitleBar.createTitleBar(this._battleCtrl.camera, this._battleCtrl.canvas, !this.isEnemy());
        
        this._battleTitleBar.setHpPercent(1);
        this._battleTitleBar.setPowPercent(0);
    }

    setVisible(b: boolean): void {
        this.node.active = b;
        this._battleTitleBar.setVisible(b);
    }

    startSeekEnemy(): void {
        this._heroBase.playRun();
        this._heroBoxCollider.enabled = true;
        this._heroRigidBody.enabled = true;
        

        this._battleTitleBar.setVisible(false);
        this.node.setRotationFromEuler(0, 0, 0)
        this.seekEnemy();
        this._curActFunc = this.doSeekEnemy; 
    }

    seekEnemy(): void {
        this._heroRigidBody.clearState();

        this._actTime = 1 + Math.random()*2;

        if (this._leaderNode) {
            if (this.node.position.z > this._leaderNode.position.z + 8) {
                this._targetPos.z = -(8 + Math.random());
                this._actTime = 3 + Math.random()*2;
            } else if (this.node.position.z < this._leaderNode.position.z - 12) {
                this._targetPos.z = -(5 + Math.random());
                this._actTime = 3 + Math.random()*2;
            } else {
                this._targetPos.z = -(6 + Math.random()*4);
            }
        } else {
            this._targetPos.z = -(7 + Math.random()*2);
        }
        this._targetPos.x = 1 - Math.random()*2;
        // console.log(this._targetPos)
    }

    doSeekEnemy(dt: number): void {

        this.node.getPosition(this._tmpPos);
        this._tmpPos.z += this._targetPos.z * dt;
        this._tmpPos.x += this._targetPos.x * dt;

        if (this._leaderNode) {
            if (this._tmpPos.x > 3.5) {
                this._tmpPos.x = 3.5
            } else if (this._tmpPos.x < -3.5) {
                this._tmpPos.x = -3.5
            }

            if (this._tmpPos.z > this._leaderNode.position.z + 14) {
                this._tmpPos.z = this._leaderNode.position.z + 14
            } else if (this._tmpPos.z < this._leaderNode.position.z - 10) {
                this._tmpPos.z = this._leaderNode.position.z - 10
            }
        } else {
            if (this._tmpPos.x > 2) {
                this._tmpPos.x = 2
            } else if (this._tmpPos.x < -2) {
                this._tmpPos.x = -2
            }
        }

        this.node.setPosition(this._tmpPos);

        this._actTime -= dt;
        if (this._actTime <= 0) {
            this.seekEnemy();
        }
    }

    startEmbattle(embattlePos: Vec3, actTime: number): void {
        this._actTime = actTime;
        this._heroBase.playRun();
        this.embattle(embattlePos);
        this._curActFunc = this.doEmbattle;
        this._heroBoxCollider.enabled = false;
        this._heroRigidBody.enabled = false;
        this._heroRigidBody.clearState();
    }

    embattle(embattlePos: Vec3): void {
        this._tmpPos.set(this.node.position);
        this._targetPos.set(embattlePos);
        Vec3.subtract(this._dirVector, this._targetPos, this._tmpPos)
        this._dirVector.x /= this._actTime;
        this._dirVector.z /= this._actTime;
    }

    doEmbattle(dt: number): void {

        this._actTime -= dt;
        if (this._actTime <= 0) {
            this._curActFunc = null; // TODO
            this.node.setPosition(this._targetPos);
        } else {
            this._tmpPos.x += dt * this._dirVector.x
            this._tmpPos.z += dt * this._dirVector.z
            this.node.setPosition(this._tmpPos);
        }
    }

    startRunToBattle(z: number, actTime: number): void {
        this._battleTitleBar.setVisible(true);
        // this._heroRigidBody.clearState();
        // this.node.setPosition(this._targetPos);
        this._heroBase.playRun();
        this._actTime = actTime;
        this.runToBattle(z);
        this._curActFunc = this.doRunToBattle;
    }

    runToBattle(z: number): void {
        this._tmpPos.set(this.node.position);
        this._targetPos.set(this.node.position);
        this._targetPos.z += z;
        this._dirVector.x = 0;
        this._dirVector.z = z / this._actTime;
    }

    doRunToBattle(dt: number): void {
        this._actTime -= dt;
        if (this._actTime <= 0) {
            this._curActFunc = null; // TODO

            // this._heroRigidBody.clearState();
            this.node.setPosition(this._targetPos);

            this._heroBase.playAttack();
        }  else {
            this._tmpPos.z += dt * this._dirVector.z
            this.node.setPosition(this._tmpPos);
        }
    }

    startBattle(targetList: Array<BattleHero>, armyList: Array<BattleHero> ): void {
        this._curActFunc = null;
        this._targetList = targetList;
        this._armyList = armyList;
        this.seekAttackTarget();
    }

    seekAttackTarget(): void {
        this._curActFunc = null;
        this._target = null as unknown as BattleHero;
        this._dirVector.set(Vec3.ZERO);
        let dirVec = new Vec3();
        for (let i = 0; i < this._targetList.length; i++) {
            // if (!this._targetList[i].isDie()) {
                if(this._target) {
                    Vec3.subtract(dirVec, this._targetList[i].node.position, this.node.position);
                    if(dirVec.length() < this._dirVector.length()) {
                        this._target = this._targetList[i];
                        this._dirVector.set(dirVec);
                    }
                } else {
                    this._target = this._targetList[i];
                    Vec3.subtract(this._dirVector, this._target.node.position, this.node.position);
                }
            // }
        }

        if (this._target) {
            if (this.range < this._dirVector.length()) {
                // 先简单处理了
                dirVec.x = this._dirVector.x * this.range / this._dirVector.length()
                dirVec.z = this._dirVector.z * this.range / this._dirVector.length()
                this._dirVector.subtract(dirVec);
                this._targetPos.set(this.node.position);
                this._targetPos.add(this._dirVector);
                this.startRunTo();
            } else {
                // 直接攻击
                this.startAttack();
            }
                
        } else {
            this._heroBase.playIdle();
        }

    }

    startRunTo(): void {
        this._heroBase.playRun();
        this._curActFunc = this.doRunTo;
        this.runTo();
    }

    runTo(): void {
        this.node.lookAt(this._targetPos);
        this._tmpPos.set(this.node.position);
        this._actTime = this._dirVector.length() / RunSpeed;
    }

    doRunTo(dt: number): void {
        this.doBuff(dt);

        if (this._target.isDie()) {
            this.seekAttackTarget();
            return;
        }

        this._actTime -= dt;
        if (this._actTime <= 0) {
            this.node.setPosition(this._tmpPos);
            this.startAttack();
        } else {
            this._tmpPos.x += this._dirVector.x * dt * RunSpeed / this._dirVector.length();
            this._tmpPos.z += this._dirVector.z * dt * RunSpeed / this._dirVector.length();
            this.node.setPosition(this._tmpPos);
        }
    }

    startAttack(): void {
        this._curActFunc = this.doBuff;
        this.attack();
    }

    attack(): void {
        if (!this._target) {
            // TODO
            console.error("call BattleHero.attack fail, this._target is null");
            return;
        }

        this.node.lookAt(this._target.node.position);

        if (this.isFullPow()) {
            this.doSkill();
        } else {
            this.doAttack();
        }

        // 开始发动攻击时计算速度 TODO 有buffer刷新时候再计算
 
        this._heroSkeletalAnimation.on(SkeletalAnimation.EventType.LASTFRAME, (a: any, b: any, c: any) => {
            if (this._target) {
                if (this._target.isDie()) {
                    this._heroSkeletalAnimation.off(SkeletalAnimation.EventType.LASTFRAME)
                    this.seekAttackTarget();
                } else {
                    // 开始发动攻击时计算速度 TODO 有buffer刷新时候再计算
                    if (this._heroBase.isInSkill()) {
                        this.doAttack();
                    }

                    if (this.isFullPow()) {
                        this.doSkill();
                    }
                }
            } else {
                this._heroSkeletalAnimation.off(SkeletalAnimation.EventType.LASTFRAME)
            }
            
            // console.log(a, b, c)
        })
    }

    doSkill(): void {
        this.setPow(0);
        this._heroBase.playSkill();
    }

    onSkill(): void {
        // 到技能关键帧了
        console.log("onSkill+++++++++++++++++++");
        if (this._recordSkill && this._skillPrefab) {
            this._heroBase.playEffect(instantiate(this._skillPrefab));
            let targetList: Array<BattleHero> = [];
            switch (this._recordSkill.targetType) {
                case ESkillTargetType.CurrentTarget: // 当前攻击目标
                case ESkillTargetType.Self: // 自身
                case ESkillTargetType.AOERandomEnemyBySelf: // 自身范围内AOE随机敌方
                case ESkillTargetType.AOERandomTeammateBySelf: // 自身范围内AOE血少己方
                    console.warn("recordSkill.targetType 技能未实现！！！！");
                    break;
                case ESkillTargetType.AOELineRangeBySelf: // 自身前方直线范围AOE随机敌方
                    // 筛选前方目标
                    let dir: Vec3 = new Vec3();
                    let dot = 0;
                    for (let i = 0; i < this._targetList.length; i++) {
                        Vec3.subtract(dir, this._targetList[i].node.position, this.node.position);
                        dot = this.node.forward.dot(dir);
                        if (dot > 0 && dot < this._recordSkill.range[0]) {
                            let radias = Vec3.angle(this.node.forward, dir);
                            let x = dir.length() * Math.sin(radias);
                            if (x < this._recordSkill.range[1]) { 
                                targetList.push(this._targetList[i]);
                            }
                        }
                    }
                    
                    // 剩下中随机
                    let count = targetList.length - this._recordSkill.targetNumber;
                    for (let i = 0; i < count; i++) {
                        let idx = Math.floor(Math.random() * targetList.length);
                        targetList.splice(idx, 1);
                    }
       
                    break;
                case ESkillTargetType.RandomEnemy: // 每个随机敌方
                    console.warn("BattleHero recordSkill.targetType 技能未实现！！！！"); 
                    break;
                case ESkillTargetType.LowerHpTeammate: // 每个血少己方
                    targetList = this._armyList.slice(0, this._armyList.length - 1);
                    if (this._recordSkill.targetNumber >= targetList.length) {
                        break;
                    }

                    targetList.sort((a: BattleHero, b: BattleHero) => {
                        return a.hp - b.hp;
                    });

                    targetList.splice(this._recordSkill.targetNumber, targetList.length - this._recordSkill.targetNumber);
                    break;
                case ESkillTargetType.LowerHpEnemy: // 每个血少敌方
                case ESkillTargetType.BackEnemy: // 优先后排每个敌方
                case ESkillTargetType.FrontEnemy: // 优先前排每个敌方
                case ESkillTargetType.RandomEnemyByTarget: // 目标范围内的敌方单位
                case ESkillTargetType.BackTeammate: // 优先后排每个己方
                case ESkillTargetType.FrontTeammate: // 优先前排每个己方
                case ESkillTargetType.LowerHpTeammateExceptSelf: // 每个血少已方单位不算自身
                case ESkillTargetType.RoleSelf: // 己方主角
                    console.warn("BattleHero recordSkill.targetType 技能未实现！！！！"); 
                    break;
            
                default:
                    console.error("BattleHero recordSkill.targetType 技能配置不存在: " + this._recordSkill.targetType); 
                    break;
            }

            this.doSkillEffect(this._recordSkill, targetList);
        } else {
            console.error("BattleHero 技能效果或技能特效为空");
        }
    }

    doSkillEffect(recordSkill: Config.skill.Record, targetList: Array<BattleHero>): void {
        for (let i = 0; i < recordSkill.effectType.length; i++) {
            if (recordSkill.effectTargetType[i] == EEffectTargetType.SameToSkill) {
                for (let j = 0; j < targetList.length; j++) {

                    // if (recordSkill.effectChance[i] != 0 && math.random() > recordSkill.effectChance[i]/100) {
                    //     continue;
                    // }

                    if (targetList[j].isDie()) {
                        continue;
                    }

                    if (!this.checkEffectCondtion(this, targetList[j], recordSkill.effectCondType[i], recordSkill.effectCondParam[i])) {
                        continue;
                    }

                    //执行效果
                    // 执行技能天赋效果(hero_攻击者, target, (TEffectType) record.EffectType[i], record.EffectParam1[i], record.EffectParam2[i], 0, false, is_delay_show);
                    this.doSkillTalentEffect(targetList[j], recordSkill.effectType[i], recordSkill.effectParam1[i], recordSkill.effectParam2[i], 0, false, false);
                    
                    // //如果有粒子，在目标身上创建粒子
                    // if (record.EffectParticle[i] != "0")
                    //     CreateParticle(record.EffectParticle[i], hero_攻击者, target, TParticleType.其他);
                    // //天赋：自身施放技能命中触发
                    // hero_攻击者.TryTriggerTalentEffect(TTalentTriggerType.自身施放技能命中时, 0, hero_攻击者, target);
                }
            } else {
                console.warn("BattleHero.doSkillEffect 功能未实现"); 
            }
        }
    }

    doSkillTalentEffect(target: BattleHero, effectType: number, effectParam1: number, effectParam2: number
        , effect_levelup: number = 0, isGodSkill: boolean = false, isDelayShow: boolean = false): void {
        // Hero hero = attack as Hero;
        // Pet fs = attack as Pet;
        switch (effectType) {
            case EEffectType.Damage: // 伤害
                // if (hero != null)
                    // Hero技能伤害(attack, target, effectParam1, isGodSkill, isDelayShow);
                    this.doSkillDamage(target, effectParam1);
                // else if (fs != null)
                //     Pet技能伤害(fs, target, effectParam1, effect_levelup);
                break;
            case EEffectType.Heal: // 加血
                // if (hero != null)
                    // Hero技能加血(attack, target, effectParam1);
                // else if (fs != null)
                //     Pet技能加血(fs, target, effectParam1, effect_levelup);
                break;
            case EEffectType.AddBuff: // 生成buff
                //如果CurrentHp为0，可能是死亡触发天赋产生的BUFF，不应该往上加
                // if (!target.isDie()) {
                    //如果addBuff失败，说明免疫，显示免疫文字
                    // if (!target.addBuff(attack, effectParam1)) { //!#buff
                    //     target.ui_hat.SetHitInfo(LanguageManager.instance.GetString("UI_BattleImmune"), HitInfo.免疫);
                    // }
                    target.addBuff(this, effectParam1);
                // }
                break;
            case EEffectType.AddPower: // 加能量
                if (!target.isDie()) {
                    target.addPow(effectParam1);
                    // target.ui_hat.SetHitInfo(effectParam1.ToString(), HitInfo.能量加);
                }
                break;
            case EEffectType.SubPower: // 减能量
                if (!target.isDie()) {
                    target.addPow(-effectParam1);
                    // target.ui_hat.SetHitInfo(effectParam1.ToString(), HitInfo.能量减);
                }
                break;
            case EEffectType.KnockOff: // 击飞
                // if (target != null && !target.bool_是死亡状态吗 && !target.bool_是假死状态吗)
                //     target.被击飞();
                break;
            case EEffectType.DamageMulti: // 多段伤害
                // if (attack != null)
                //     StartCoroutine(多段技能伤害(attack, target, effectParam1, effectParam2));
                break;
            case EEffectType.RemoveBuff: // 移除BUFF
                // if (target != null && !target.bool_是死亡状态吗 && !target.bool_是假死状态吗)
                //     target.removeMultiBuff(effectParam1, effectParam2);
                break;
            case EEffectType.MoveToTargetBack: // 移动到目标位置身后
                break;
            case EEffectType.AddBuffTime: // 加强BUFF时间
                // if (target != null && !target.bool_是死亡状态吗 && !target.bool_是假死状态吗)
                //     target.addBuffTime(effectParam1, effectParam2);
                break;
            case EEffectType.SureCrit: // 伤害或治疗必定暴击
                // if (attack != null)
                //     attack.Is下次伤害或治疗必定暴击 = true;
                break;
            case EEffectType.Reborn: // 复活
                // if (target != null)
                //     target.复活(effectParam1 / 100.0f);
                break;
            case EEffectType.HealHPPct: // 百分比加血
                // if (target != null)
                //     技能百分比加血(attack, target, effectParam1, effect_levelup);
                break;
            case EEffectType.TeleportWhenBattleStart: // 战斗开始时瞬移位置
                // if (attack != null && target != null) {
                //     attack.战斗开始瞬移到目标身后(target);
                // }
                break;
        }
    }

    doSkillDamage(target: BattleHero, effectParam1: number) {
        if (!target.isDie()) {
            target.addHp(-this.atk*effectParam1/100, DamageType.Skill);
            // target.addPow(BeHitPowerUp);

            // this.addPow(AttackPowerUp);
            if (target.isDie()) {
                this.addPow(KillPowerUp);
            }
        }
    }

    checkEffectCondtion(attack: BattleHero, target: BattleHero, condType: number, condParam: number) {
        switch (condType) {
            case EEffectCondType.Null:
                return true;
            case EEffectCondType.TargetClasses:
                if (target.getClasses() == condParam) {
                    return true;
                }  
            case EEffectCondType.TargetStatus:
                // if (target.getBuffStatus((TBuffStatus) condParam)) {
                    return true;
                // } 
            case EEffectCondType.TargetHPMoreThanSelf:
                if (target.hp > attack.hp) {
                    return true;
                }
            case EEffectCondType.TargetDead:
                if (target.isDie()) {
                    return true;
                }
            case EEffectCondType.EveryHPLostX:
                if (condParam == 1) {
                    if (attack.embattleedSite >= 1 && attack.embattleedSite <= 3) {
                        return true;
                    }
                } else if (condParam == 2) {
                    if (attack.embattleedSite >= 4 && attack.embattleedSite <= 6) {
                        return true;
                    }
                }
                console.error("BattleHero.checkEffectCondtion EEffectCondType.EveryHPLostX condParam 配置了未实现的功能：" + condParam);
                return false;
            case EEffectCondType.TargetHPLessThanSelf:
                if (target.hp < attack.hp) {
                    return true;
                }
                    
        }

        console.error("BattleHero.checkEffectCondtion condType 配置了未实现的功能：" + condType);
        return false;
    }

    doAttack(): void {
        this._heroBase.playAttack();
    }

    onAttack(): void {    
        this.doHitDamager();
    }

    doHitDamager(): void {
        if (this._target && !this._target.isDie()) {


            this._target.addHp(-this.atk, DamageType.Hit);
            this._target.addPow(BeHitPowerUp);

            this.addPow(AttackPowerUp);
            if (this._target.isDie()) {
                this.addPow(KillPowerUp);
            }

        } 
    }

    isDie(): boolean {
        return this.hp === 0;
    }

    addBuff(attack: BattleHero, buffID: number): void {
        let record: Config.buff_new.Record = ValueMgr.getInstance().getItemByField(TableName.buff_new, buffID) as Config.buff_new.Record;
        if (!record) {
            console.error("数据表中buffID: " + buffID + " 不存在");
            return;
        }

        
        // TODO 处理免疫
        // foreach (var item in _buffs) //寻找免疫
        // {
        //     var buff = item.Value;
        //     if ((TBuffType) buff._record.EffectType == TBuffType.EbuffTypeImmune) {
        //         if ((record.BuffStatus & buff._record.EffectParam1) != 0) {
        //             return false;
        //         }
        //     }
        // }
        
        let buff: BattleBuffer = new BattleBuffer(this, record);

        if (this._buffList.length == 0) {
            this._buffList.push(buff);
        } else {

            if (this._buffList[this._buffList.length -1].time < buff.time) {
                this._buffList.push(buff);
            } else {
                for (let i = 0; i < this._buffList.length; i++) {
                    if (this._buffList[0].time > buff.time) {
                        this._buffList.splice(i, 0, buff);
                        break;
                    }
                }
            }
        }
    }

    removeBuff(buff: BattleBuffer): void {
        for (let i = 0; i < this._buffList.length; i++) {
            if (this._buffList[0] == buff) {
                this._buffList.splice(i, 1);
                break;
            }
        }
    }

    getBuffList(): BattleBuffer[] {
        return this._buffList;
    }


    doBuff(dt: number) {
        let now = Date.now();
        if (this._buffList.length == 0 || this._buffList[0].time > now) {
            return;
        }

        let l: BattleBuffer[] = []
        let i = 0;
        for (; i < this._buffList.length; i++) {
            if (now > this._buffList[i].time) {
                if (this._buffList[i].doBuff(this._buffList, i+1)) {
                    l.push(this._buffList[i]);
                }
            } else {
                break;
            }
        }
        
        this._buffList.splice(0, i);
        if (l.length > 0) {  
            if (this._buffList.length == 0) {
                this._buffList.push(l[0]);
                i = 1;
            } else {
                i = 0;
            }

            for (; i < l.length; i++) {
                if (this._buffList[this._buffList.length -1].time < l[i].time) {
                    this._buffList.push(l[i]);
                } else {
                    for (let j = 0; j < this._buffList.length; j++) {
                        if (this._buffList[0].time > l[i].time) {
                            this._buffList.splice(j, 0, l[i]);
                            break;
                        }
                    }
                }
            }
        }

    }

    // damage正数为加血
    addHp(damage: number, damageType: number): void {
        damage = Math.ceil(damage);

        // 处理护盾 TODO 之后内优化内存换时间
        if (damage < 0) {
            for (let i = 0; i < this._buffList.length; i++) {
                if (this._buffList[i].isShield()) {
                    let hitDamage = this._buffList[i].doDamageShield(damage);
                    this._battleTitleBar.flyWords(hitDamage, DamageType.ShieldAbsorption);
                    damage -= hitDamage;
                }
            }
        }
        
        if (damage == 0) {
            return;
        }

        this.hp += damage;
        if (this.hp > this.maxHp) {
            damage = damage - this.hp + this.maxHp;
            this.hp = this.maxHp;
        } else if (this.hp <= 0) {
            if (this.hp < 0) {
                damage -= this.hp;
                this.hp = 0;
            }
            this.die();
        }
        this._battleTitleBar.setHpPercent(this.hp / this.maxHp);

        this._battleTitleBar.flyWords(damage, damageType);
    }

    setHp(hp: number): void {
        hp = Math.ceil(hp);
        this.hp = hp;
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        } else if (this.hp <= 0) {
            this.hp = 0;
        }

        if (this.maxHp == 0) {
            this._battleTitleBar.setHpPercent(hp);
        } else {
            this._battleTitleBar.setHpPercent(this.hp / this.maxHp);
        }     
    }

    isFullPow(): boolean {
        return this.maxPow > 0 && this.pow == this.maxPow;
    }

    addPow(pow: number): void {
        if (this.maxPow == 0) {
            return;
        }

        this.pow += pow;
        if (this.pow > this.maxPow) {
            this.pow = this.maxPow;
        } else if (this.pow <= 0) {
            this.pow = 0;
        }
        this._battleTitleBar.setPowPercent(this.pow / this.maxPow);
    }

    setPow(pow: number): void {
        this.pow = pow;
        if (this.pow > this.maxPow) {
            this.pow = this.maxPow;
        } else if (this.pow <= 0) {
            this.pow = 0;
        }

        if (this.maxPow == 0) {
            this._battleTitleBar.setPowPercent(0);
        } else {
            this._battleTitleBar.setPowPercent(this.pow / this.maxPow);
        }
        
    }

    die(): void {
        if (this._heroBase.isInDie()) {
            return;
        }

        this._heroSkeletalAnimation.off(SkeletalAnimation.EventType.LASTFRAME)

        this._curActFunc = null;
        this._battleTitleBar.setVisible(false);
        this._heroBase.playDie();

        for (let i = 0; i < this._buffList.length; i++) {
            this._buffList[i].onClear();
        }
        this._buffList = [];
        this._battleCtrl.onHeroDie(this);
    }

    playEffect(effectNode: Node): void {
        this._heroBase.playEffect(effectNode);
    }

    stopAnim(): void {
        this._heroBase.stopAnim();
    }

    onTargetDie() {

    }

   

    addEvent(): void {

    }

    removeEvent(): void {

    }

}
