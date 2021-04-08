import { _decorator, Component, Node, SkeletalAnimation, AnimationState, Vec3, BoxCollider, RigidBody, Enum, instantiate, Prefab, BASELINE_RATIO } from 'cc';
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
import { BattleDelayDamage } from './BattleDelayDamage';
import { BattleEffect } from './BattleEffect';
import { common } from '../../../base_res/proto/protobuf';


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

export enum EEffectType {
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

    private _battleTitleBar: BattleTitleBar = null as unknown as BattleTitleBar;
    private _heroBase: HeroBase = null as unknown as HeroBase;
    private _battleCtrl: BattleCtrl = null as unknown as BattleCtrl;


    private _heroSkeletalAnimation: SkeletalAnimation = null as unknown as SkeletalAnimation;
    private _heroBoxCollider: BoxCollider = null as unknown as BoxCollider;
    private _heroRigidBody: RigidBody = null as unknown as RigidBody;

    // 内存复用
    private _tmpPos: Vec3 = new Vec3();
    private _tmpDirVec: Vec3 = new Vec3();
    private _tmpTargetPos: Vec3 = new Vec3();

    private _targetPos: Vec3 = new Vec3();
    private _dirVector: Vec3 = new Vec3();

    private _targetList: Array<BattleHero> = [];
    private _target: BattleHero = null as unknown as BattleHero;

    private _armyList: Array<BattleHero> = [];
    private _attackMap: Map<BattleHero, BattleHero> = new Map<BattleHero, BattleHero>();
    
    private _heroData: BaseHeroData = null as unknown as BaseHeroData;


    private _leaderNode: any = null;

    private _actTime: number = 0;
    private _curActFunc: any = null;
    private _bWillChangeTarget: boolean = false;

    private _heroType: EHeroType = EHeroType.HERO;
    public embattleedSite: number = 0;


    private _hpBase: number = 0;
    private _atkBase: number = 0;
    private _defBase: number = 0;
    private _speedBase: number = 0;
    private _critBase: number = 0;
    private _critDamageBase: number = 0;
    private _hitBase: number = 0;
    private _dodgeBase: number = 0;
    private _defBreakBase: number = 0;
    private _damageReduceBase: number = 0;
    private _skillEffectBase: number = 0;
    private _campDamageBase: number = 0;
    private _healEffectBase: number = 0;

    private _skillSpeedBase: number = 0; // 战斗中不会发生改变
    private _rangeBase: number = 0; // 战斗中不会发生改变

    private maxHp: number = 0;
    public atk: number = 0;
    public def: number = 0;
    public speed: number = 0;
    public crit: number = 0;
    public critDmg: number = 0;
    public hitRat: number = 0;
    public dodge: number = 0;
    public defBreak: number = 0;
    public damageReduce: number = 0;
    public skillEffect: number = 0;
    public campDamage: number = 0;
    public healEffect: number = 0;

    private maxPow: number = 100;
    public skillSpeed: number = 0;
    public range: number = 0;

    public hp: number = 0;
    public pow: number = 0;

    private _buffPropertyMap = new Map<Msg.THeroPropertyType, number>();

    private _recordSkill: Config.skill.Record | null = null;

    private _prepareAttackPrefab: Prefab | null = null;
    private _normalAttackPrefab: Prefab | null = null;
    private _prepareSkillPrefab: Prefab | null = null;
    private _skillPrefab: Prefab | null = null;
    

    private _buffList: BattleBuffer[] = [];
    private _flyDamagePool: Map<BattleDelayDamage, BattleDelayDamage> = new Map<BattleDelayDamage, BattleDelayDamage>();
    private _statusMap: Map<string, number> = new Map<string, number>();



    
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

    public initHero(battleCtrl: BattleCtrl, heroData: any, heroType: EHeroType): void {
        this._battleCtrl = battleCtrl;
        this._heroData = heroData;
        this._heroType = heroType;

        this.initBattleData();
        this.initHeroBase();
        this.initTitleBar();

        this.refreshData();

        this.refreshAttackSpeed();
        this.refreshSkillSpeed();
    }

    private initHeroBase(): void {
        let heroBaseNode = instantiate(BattleResMgr.getInstance().getRes(this._heroData.getPrefabPath()));
        this.node.name =  heroBaseNode.name;
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

        this._heroBase.setPrepareAttackEventCallBack(() => {
            this.onPrepareAttack();
        });

        this._heroBase.setAttackEventCallBack(() => {
            this.onAttack();
        });

        this._heroBase.setPrepareSkillEventCallBack(() => {
            this.onPrepareSkill();
        });

        this._heroBase.setSkillEventCallBack(() => {
            this.onSkill();
        });

        
    }

    private initBattleData(): void {
        this.refreshBattleDataBase();
        this.refreshBattleData();

        // 普通攻击蓄力特效
        let prepareAttackParticleName = this._heroData.getPrepareAttackParticleName();
        if (prepareAttackParticleName != "0") {
            this._prepareAttackPrefab = BattleResMgr.getInstance().getRes(prepareAttackParticleName);
        }

        // 普通攻击特效
        let normalAttackParticleName = this._heroData.getNormalAttackParticleName();
        if (normalAttackParticleName != "0") {
            this._normalAttackPrefab = BattleResMgr.getInstance().getRes(normalAttackParticleName);
        }

        // 主动技能果
        this._recordSkill = null as unknown as Config.skill.Record;
        if (this._heroData.getSkillID()) {
            this._recordSkill = ValueMgr.getInstance().getItemByField(TableName.skill, this._heroData.getSkillID()) as Config.skill.Record;
            if (this._recordSkill) {
                let path = BattleTest.getSkillPrefabPath(this._recordSkill.id);
                if (path) {
                    this._skillPrefab = BattleResMgr.getInstance().getRes(path);
                    if (!this._skillPrefab) {
                        this._recordSkill = null as unknown as Config.skill.Record;
                        console.warn("技能id" + this._heroData.getSkillID() + "特效预制体不存在")
                    }
                } else {
                    this._recordSkill = null as unknown as Config.skill.Record;
                    console.warn("技能id" + this._heroData.getSkillID() + "技能特效预制体测试路径不存在")
                }

                path = BattleTest.getPrepareSkillPrefabPath(this._recordSkill.id);
                if (path) {
                    this._prepareSkillPrefab = BattleResMgr.getInstance().getRes(path);
                    if (!this._prepareSkillPrefab) {
                        console.warn("技能id:" + this._heroData.getSkillID() + "技能蓄力特效预制体不存在")
                    }
                }
                
            } else {
                console.warn("技能id" + this._heroData.getSkillID() + "不存在配置表")
            }
        }
        if (this._recordSkill) {
            this.maxPow = 100;
        } else {
            this.maxPow = 0;
            this._skillPrefab = null;
        }
        
    }

    public refreshBattleDataBase(): void {
        this._hpBase = Math.ceil(this._heroData.getMaxHP());
        this._atkBase = this._heroData.getATK();
        this._defBase = this._heroData.getDEF();
        this._speedBase = this._heroData.getSpeed();
        this._critBase = this._heroData.getCrit();
        this._critDamageBase = this._heroData.getCritDamage();
        this._hitBase = this._heroData.getHit();
        this._dodgeBase = this._heroData.getDodge();
        this._defBreakBase = this._heroData.getDEFBreak();
        this._damageReduceBase = this._heroData.getReduceDamage();
        this._skillEffectBase = this._heroData.getSkillEffect();
        this._campDamageBase = this._heroData.getCampDamage();
        this._healEffectBase = this._heroData.getHealEffect();

        this._skillSpeedBase = this._heroData.getSkillSpeed(); // 战斗中不会发生改变
        this._rangeBase = this._heroData.getRange(); // 战斗中不会发生改变
    }

    public refreshBattleData(): void {
        this.maxHp = this._hpBase;
        
        this.atk = this._atkBase
        this.def = this._defBase
        this.speed = this._speedBase;
        this.crit = this._critBase;
        this.critDmg = this._critDamageBase;
        this.hitRat = this._hitBase;
        this.dodge = this._dodgeBase;
        this.defBreak = this._defBreakBase;

        this.skillSpeed = this._skillSpeedBase;
        this.range = this._rangeBase;
    }

    public refreshData(): void {
        this._bWillChangeTarget = false;
        this.removeTarget();
        this.removeBattlePos();

        this.setHp(this.maxHp);
        this.setPow(0);
        this.clearBuff();
        this.clearDelayDamage();
    }

    public refreshAttackSpeed(): void {
        let a: AnimationState = this._heroSkeletalAnimation.getState("attack");
        if (a) {
            a.speed = a.length / this.speed
        }
        
    }

    public refreshSkillSpeed(): void {
        let a: AnimationState = this._heroSkeletalAnimation.getState("skill");
        if (a) {
            a.speed = a.length / this.skillSpeed
        }
    }

    public revive(): void {
        this.refreshBattleData();
        this.refreshData();
        this._heroBase.playIdle();
    }

    public getHeroBase(): HeroBase {
        return this._heroBase;
    }

    public setEmbattleedSite(site: number): void {
        this.embattleedSite = site;
    }

    public setLeaderNode(leaderNode: Node): void {
        this._leaderNode = leaderNode;
    }

    public getActTime() {
        return this._actTime;
    }

    public isEnemy(): boolean {
        return this._heroType != EHeroType.LEADER && this._heroType != EHeroType.HERO
    }

    public isHero(): boolean {
        return this._heroType == EHeroType.HERO;
    }

    public getClasses(): number {
        return this._heroData.getClasses();
    }

    public isRunning(): boolean {
        return this._curActFunc == this.doRunTo;
    }

    private initTitleBar(): void {
           
        this._battleTitleBar.createTitleBar(this._battleCtrl.camera, this._battleCtrl.battleUiNode, !this.isEnemy(), this._heroData.getCamp());
        
        this._battleTitleBar.setHpPercent(1);
        this._battleTitleBar.setPowPercent(0);
    }

    public setVisible(b: boolean): void {
        this.node.active = b;
        this._battleTitleBar.setVisible(b);
    }

    public getTargetPos(): Vec3 {
        return this._targetPos;
    }

    // public setTargetPos(targetPos: Vec3): void {
    //     this._targetPos.set(targetPos);
    // }

    public getTarget(): BattleHero {
        return this._target;
    }

    public setPosition(pos: Vec3): void {
        this._targetPos.set(pos);
        this.node.setPosition(pos);
    }

    public addAttack(attack: BattleHero): void {
        this._attackMap.set(attack, attack);
    }

    public removeAttack(attack: BattleHero): void {
        this._attackMap.delete(attack);
    }

    public clearAttack(): void {
        this._attackMap.clear();
    }

    private postChangePos(): void {
        this._attackMap.forEach((battleHero: BattleHero) => {
            if (this.getTarget() != battleHero) {
                battleHero.onTargetChangePos();
            }
        }) 
    }

    public startSeekEnemy(): void {
        this._heroBase.playRun();
        this._heroBoxCollider.enabled = true;
        this._heroRigidBody.enabled = true;
        

        this._battleTitleBar.setVisible(false);
        this.node.setRotationFromEuler(0, 0, 0)
        this.seekEnemy();
        this._curActFunc = this.doSeekEnemy; 
    }

    private seekEnemy(): void {
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

    private doSeekEnemy(dt: number): void {

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

        // console.log(this.node.position, this.node.worldPosition);
    }

    public startEmbattle(embattlePos: Vec3, actTime: number): void {
        this._actTime = actTime;
        this._heroBase.playRun();
        this.embattle(embattlePos);
        this._curActFunc = this.doEmbattle;
        this._heroBoxCollider.enabled = false;
        this._heroRigidBody.enabled = false;
        this._heroRigidBody.clearState();
    }

    private embattle(embattlePos: Vec3): void {
        this._tmpPos.set(this.node.position);
        this._targetPos.set(embattlePos);
        Vec3.subtract(this._dirVector, this._targetPos, this._tmpPos)
        this._dirVector.x /= this._actTime;
        this._dirVector.z /= this._actTime;
    }

    private doEmbattle(dt: number): void {

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

    public startRunToBattle(z: number, actTime: number): void {
        this._battleTitleBar.setVisible(true);
        // this._heroRigidBody.clearState();
        // this.node.setPosition(this._targetPos);
        
        this._heroBase.playRun();
        this._actTime = actTime;
        this.runToBattle(z);
        this._curActFunc = this.doRunToBattle;
    }

    private runToBattle(z: number): void {
        this._tmpPos.set(this.node.position);
        this._targetPos.set(this.node.position);
        this._targetPos.z += z;
        this._dirVector.x = 0;
        this._dirVector.z = z / this._actTime;
    }

    private doRunToBattle(dt: number): void {
        this._actTime -= dt;
        if (this._actTime <= 0) {
            this._curActFunc = null; // TODO

            // this._heroRigidBody.clearState();
            this.node.setPosition(this._targetPos);
        }  else {
            this._tmpPos.z += dt * this._dirVector.z
            this.node.setPosition(this._tmpPos);
        }
    }

    public startBattle(targetList: Array<BattleHero>, armyList: Array<BattleHero> ): void {
        this._battleTitleBar.setVisible(true);
        this._targetPos.set(this.node.position);
        this._curActFunc = null;
        this._targetList = targetList;
        this._armyList = armyList;

        // this.seekAttackTarget();
    }

    public seekFirstTarget(): void {

        if (this._targetList.length == 0) {
            console.error("BattleHero-seekFirstTarget this._targetList.length == 0");
            return;
        }

        let target: BattleHero | null = this.getNearTarget();
        if (!target) {
            console.error("BattleHero-seekFirstTarget this.getNearTarget() == null");
            return;
        }


        if (target.getTarget()) {
            // 已经有目标则直接作为目标处理
            Vec3.subtract(this._dirVector, target.getTargetPos(), this.node.position);
            Vec3.lerp(this._tmpTargetPos, this.node.position, target.getTargetPos(), (this._dirVector.length() - this.range) / this._dirVector.length());

        } else if (target.getNearTarget() == this) {
            // 如果对方没目标且两者互为最短目标，则互为目标
            let t1: BattleHero = this;
            let t2: BattleHero = target;                         
            let tmpRange1 = this.range;
            let tmpRange2 = target.range; // TODO 需要做boss修正
            if (tmpRange2 > tmpRange1) {
                t1 = target;
                t2 = this;
                tmpRange1 = tmpRange2;
                tmpRange2 = this.range;
            }

            
            Vec3.subtract(this._tmpDirVec, t2.node.position, t1.node.position);
            // 是否在攻击范围内
            if (tmpRange1 >= this._tmpDirVec.length()) {
                this._tmpTargetPos.set(t1.node.position);
                if (tmpRange2 >= this._tmpDirVec.length()) {
                    this._dirVector.set(t2.node.position);
                } else {
                    Vec3.lerp(this._dirVector, t1.node.position, t2.node.position, tmpRange2 / this._tmpDirVec.length());
                }
            } else {
                Vec3.lerp(this._tmpTargetPos, t1.node.position, t2.node.position, (this._tmpDirVec.length() - tmpRange1) / 2 / this._tmpDirVec.length());
                Vec3.lerp(this._dirVector, t1.node.position, t2.node.position, ((this._tmpDirVec.length() - tmpRange1) / 2 + tmpRange2) / this._tmpDirVec.length());
            }

            if (t2 == this) {
                t1.changeTarget(this._tmpTargetPos, this);
                this._tmpTargetPos.set(this._dirVector);
                
            } else {
                t2.changeTarget(this._dirVector, this);
            }
        } else {
            // 等待第二轮
            return;
        }

        this.changeTarget(this._tmpTargetPos, target);
    }

    public getNearTarget(): BattleHero | null {
        if (this._targetList.length == 0) {
            return null;
        }

        let target: BattleHero = this._targetList[0];
        Vec3.subtract(this._dirVector, target.node.position, this.node.position);

        for (let i = 1; i < this._targetList.length; i++) {
            Vec3.subtract(this._tmpDirVec, this._targetList[i].node.position, this.node.position);
            if(this._tmpDirVec.length() < this._dirVector.length()) {
                target = this._targetList[i];
                this._dirVector.set(this._tmpDirVec);
            }
        }

        return target;
    }

    public seekAttackTarget(): void {
        // 先遍历攻击范围内离自己近的并且没在移动的
        // 遍历目标位置离自己近的
        // 如果没在移动就正常跑过去
        // 互为目标重新算中间点
        // 自己远程单位就跑到直接打了
        // 自己是近战单位，如果是跑的时间比对方跑的时间长，就正常跑过去，否则互为目标，重新计算中间点
        this._curActFunc = null;

        if (this._targetList.length == 0) {
            this.removeTarget();
            this._heroBase.playIdle();
            return;
        }

        let target: BattleHero = null as unknown as BattleHero;
        this._dirVector.set(Vec3.ZERO);
        this._tmpTargetPos.set(this.node.position);
        
        let range: number = this.range; // 先提取出来，有boss要做修正
        for (let i = 0; i < this._targetList.length; i++) {
            if (this._targetList[i].isRunning()) {
                Vec3.subtract(this._tmpDirVec, this._targetList[i].getTargetPos(), this.node.position);
                if (this._tmpDirVec.length() > range) {
                    continue;
                }
            }

            Vec3.subtract(this._tmpDirVec, this._targetList[i].node.position, this.node.position);
            if (this._tmpDirVec.length() > range) {
                continue;
            }

            if(target) {
                if(this._tmpDirVec.length() < this._dirVector.length()) {
                    target = this._targetList[i];
                    this._dirVector.set(this._tmpDirVec);
                }
            } else {
                target = this._targetList[i];
                Vec3.subtract(this._dirVector, target.node.position, this.node.position);
            }
        }

        if (target == null) {
            target = this._targetList[0];
            Vec3.subtract(this._dirVector, target.getTargetPos(), this.node.position);
            // 遍历目标范围最短目标
            for (let i = 1; i < this._targetList.length; i++) {
                Vec3.subtract(this._tmpDirVec, this._targetList[i].getTargetPos(), this.node.position);
                if(this._tmpDirVec.length() < this._dirVector.length()) {
                    target = this._targetList[i];
                    this._dirVector.set(this._tmpDirVec);
                }
            }

            if (target) {
                this._tmpDirVec.x = this._dirVector.x * (this._dirVector.length() - this.range) / this._dirVector.length();
                this._tmpDirVec.z = this._dirVector.z * (this._dirVector.length() - this.range) / this._dirVector.length();

                let bAttackEachOther = false;
                if ((target.isRunning() && (target.getTarget() == this || (range < 8 && this._tmpDirVec.length() / RunSpeed < target.getActTime())))) {
                    bAttackEachOther = true;
                } else if(range < this._dirVector.length()) {
                    // 处理死循环postChangePos
                    if (this._attackMap.size > 0 && target.getTarget() && target.getTarget() != this) {
                        let tmpTarget = target.getTarget();
                        while (tmpTarget.getTarget() && !tmpTarget.getTarget().isDie() && tmpTarget.getTarget().getTarget() != tmpTarget && tmpTarget.getTarget() != this) {
                            tmpTarget = tmpTarget.getTarget();
                        }

                        if (tmpTarget.getTarget() == this) {
                            // 处理死循环
                            target = tmpTarget.getTarget();
                            if (target.isRunning()) {
                                bAttackEachOther = true;
                            } else {
                                Vec3.subtract(this._dirVector, target.getTargetPos(), this.node.position);
                                Vec3.lerp(this._tmpTargetPos, this.node.position, target.getTargetPos(), (this._dirVector.length() - this.range) / this._dirVector.length());
                            }
                        }
                    } else {
                        this._tmpTargetPos.add(this._tmpDirVec);
                    }
                }

                if (bAttackEachOther) {

                    let t1: BattleHero = this;
                    let t2: BattleHero = target;                         
                    let tmpRange1 = range;
                    let tmpRange2 = target.range; // TODO 需要做boss修正
                    if (tmpRange2 > tmpRange1) {
                        t1 = target;
                        t2 = this;
                        tmpRange1 = tmpRange2;
                        tmpRange2 = range;
                    }

                    
                    Vec3.subtract(this._tmpDirVec, t2.node.position, t1.node.position);
                    // 是否在攻击范围内
                    if (tmpRange1 >= this._tmpDirVec.length()) {
                        this._tmpTargetPos.set(t1.node.position);
                        if (tmpRange2 >= this._tmpDirVec.length()) {
                            this._dirVector.set(t2.node.position);
                        } else {
                            Vec3.lerp(this._dirVector, t1.node.position, t2.node.position, tmpRange2 / this._tmpDirVec.length());
                        }
                    } else {
                        Vec3.lerp(this._tmpTargetPos, t1.node.position, t2.node.position, (this._tmpDirVec.length() - tmpRange1) / 2 / this._tmpDirVec.length());
                        Vec3.lerp(this._dirVector, t1.node.position, t2.node.position, ((this._tmpDirVec.length() - tmpRange1) / 2 + tmpRange2) / this._tmpDirVec.length());
                    }

                    if (t2 == this) {
                        t1.changeTarget(this._tmpTargetPos, this)
                        this._tmpTargetPos.set(this._dirVector);
                        
                    } else {
                        t2.changeTarget(this._dirVector, this);
                    }

                }   
            }
        } // else end: this._target != null

        this.changeTarget(this._tmpTargetPos, target);

    }

    public addTarget(target?: BattleHero) {
        if (target) {
            if (target != this._target) {
                this.removeTarget();
                target.addAttack(this);
                this._target = target;
            }
        } else {
            this.removeTarget();
        }
    }

    public removeTarget(): void {
        if (this._target) {
            this._target.removeAttack(this);
            this._target = null as unknown as BattleHero;
        }
    }

    public changeTarget(targetPos: Vec3, target?: BattleHero): void {
        this.addTarget(target);
        if (!target) {
            this._heroBase.playIdle();
            this._curActFunc = null;
            this._targetPos.set(this.node.position);
            return;
        }

        this.changeTargetPos(targetPos);
    }

    private changeTargetPos(targetPos: Vec3): void {
        let bPost = !this._targetPos.equals(targetPos);

        
        if (bPost) {
            // console.log(targetPos, "++++++")
            this._battleCtrl.buildBattlePos(targetPos, this._target.getTargetPos(), this.range, this);
            // console.log(targetPos, "-------")
        }
        
        this._targetPos.set(targetPos);
        if (targetPos.equals(this.node.position)) {
            this.startAttack();
        } else {
            this.startRunTo();
        }

        if (bPost) {
            this.postChangePos();
        }
    }

    public removeBattlePos(): void {
        this._battleCtrl.removeBattlePos(this._targetPos);
    }

    public onTargetChangePos() {
        Vec3.subtract(this._dirVector, this._target.getTargetPos(), this.node.position);
        if (this.isRunning()) {
            if (this.range < this._dirVector.length()) {
                this._tmpTargetPos.x = this.node.position.x + this._dirVector.x * (this._dirVector.length() - this.range) / this._dirVector.length();
                this._tmpTargetPos.z = this.node.position.z + this._dirVector.z * (this._dirVector.length() - this.range) / this._dirVector.length();
            } else {
                this._tmpTargetPos.set(this.node.position);
            }

            // 在seekAttackTarget中避免死循环
            this.changeTargetPos(this._tmpTargetPos);
        } else {
            if (this.range < this._dirVector.length()) {
                this._bWillChangeTarget = true;
            }
        }
    }

    public startRunTo(): void {
        this._heroBase.playRun();
        this._curActFunc = this.doRunTo;
        this.runTo();

        this.postChangePos();
    }

    private runTo(): void {
        this.node.lookAt(this._targetPos);
        this._tmpPos.set(this.node.position);
        Vec3.subtract(this._dirVector, this._targetPos, this._tmpPos);
        this._actTime = this._dirVector.length() / RunSpeed;
    }

    // 注意因为有doBuff, 只能被update调用！！！
    private doRunTo(dt: number): void {
        this.doBuff(dt);

        if (this._target.isDie()) {
            this.seekAttackTarget();
            return;
        }

        this._actTime -= dt;
        if (this._actTime <= 0) {
            this.node.setPosition(this._targetPos);
            
            // Vec3.subtract(this._dirVector, this._target.getTargetPos(), this.node.position);
            // if (this.range < this._dirVector.length()) {
            //     this.seekAttackTarget();
            // } else {
                this.startAttack();
            // }

        } else {
            this._tmpPos.x += this._dirVector.x * dt * RunSpeed / this._dirVector.length();
            this._tmpPos.z += this._dirVector.z * dt * RunSpeed / this._dirVector.length();
            this.node.setPosition(this._tmpPos);
        }
    }

    public startAttack(): void {
        this._curActFunc = this.doBuff;
        this.attack();
    }

    private attack(): void {
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
 
        this._heroSkeletalAnimation.on(SkeletalAnimation.EventType.LASTFRAME, (a: any, b: any, c: any) => {

            if (this._bWillChangeTarget) {
                this._heroSkeletalAnimation.off(SkeletalAnimation.EventType.LASTFRAME)
                this.seekAttackTarget();
                this._bWillChangeTarget = false;
            } else if (this._target) {
                if (this._target.isDie()) {
                    this._heroSkeletalAnimation.off(SkeletalAnimation.EventType.LASTFRAME)
                    this.seekAttackTarget();
                } else {


                    this.node.lookAt(this._target.node.position);

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

    private doSkill(): void {
        this.setPow(0);
        this._heroBase.playSkill();
    }

    private onPrepareSkill(): void {
        if (this._prepareSkillPrefab) {
            this.playEffect(instantiate(this._prepareSkillPrefab));
        }
    }

    private onSkill(): void {
        
        // 到技能关键帧了
        // console.log("onSkill+++++++++++++++++++");
        if (this._recordSkill && this._skillPrefab) {
            
            let targetList: Array<BattleHero> = [];
            switch (this._recordSkill.targetType) {
                case ESkillTargetType.CurrentTarget: // 当前攻击目标
                case ESkillTargetType.Self: // 自身
                case ESkillTargetType.AOERandomEnemyBySelf: // 自身范围内AOE随机敌方
                    console.warn("recordSkill.targetType 技能未实现！！！！");
                    break;
                case ESkillTargetType.AOERandomTeammateBySelf: // 自身范围内AOE血少己方
                    this.buildAOEList(this.node.position, targetList, this._armyList, this._recordSkill.range[0]);
                    this.buildLowerHpList(targetList, this._recordSkill.targetNumber);
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
                    
                    this.buildRandomList(targetList, this._recordSkill.targetNumber);
                    break;
                case ESkillTargetType.RandomEnemy: // 每个随机敌方
                    targetList = this._targetList.slice(0, this._targetList.length);
                    this.buildRandomList(targetList, this._recordSkill.targetNumber);
                    break;
                case ESkillTargetType.LowerHpTeammate: // 每个血少己方
                    targetList = this._armyList.slice(0, this._armyList.length);
                    this.buildLowerHpList(targetList, this._recordSkill.targetNumber);
                    break;
                case ESkillTargetType.LowerHpEnemy: // 每个血少敌方
                    break;
                case ESkillTargetType.BackEnemy: // 优先后排每个敌方
                case ESkillTargetType.FrontEnemy: // 优先前排每个敌方
                    let backupList: Array<BattleHero> = [];
                    for (let i = 0; i < this._targetList.length; i++) {
                        if (this._targetList[i].isFrontSite()) {
                            backupList.push(this._targetList[i]);               
                        } else {
                            targetList.push(this._targetList[i]);
                        }
                    }

                    if (this._recordSkill.targetType == ESkillTargetType.FrontEnemy) {
                        let tmpList = targetList;
                        targetList = backupList;
                        backupList = tmpList;
                    }

                    if (targetList.length < this._recordSkill.targetNumber) {
                        this.buildRandomList(backupList, this._recordSkill.targetNumber - targetList.length);
                        targetList.splice(targetList.length, 0, ...backupList);
                    } else {
                        this.buildRandomList(targetList, this._recordSkill.targetNumber);
                    }
                    break;
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

            let skillEffectNode = instantiate(this._skillPrefab);
            let battleEffect: BattleEffect = skillEffectNode.getComponent("BattleEffect") as BattleEffect;

            if (battleEffect.isImmediately()) {
                this.playEffect(skillEffectNode);
                
                if (targetList.length == 0) {
                    return;
                }

                for (let i = 0; i < targetList.length; i++) {
                    if (battleEffect.endEffectPrefab) {
                        targetList[i].playEffect(instantiate(battleEffect.endEffectPrefab));
                    }
                    
                }

                this.doSkillEffect(this._recordSkill, targetList);
            } else {
                for (let i = 0; i < targetList.length; i++) {
                    if (i > 0) {
                        battleEffect = instantiate(this._skillPrefab).getComponent("BattleEffect") as BattleEffect;
                    }

                    let delayDamage = new BattleDelayDamage(battleEffect, this, targetList[i], (target: BattleHero)=> {
                        target.removeFlyDamagePool(delayDamage);
                        this.doSkillEffect(this._recordSkill as Config.skill.Record, [target]);
                    });
                    
                    
                    targetList[i].addFlyDamagePool(delayDamage);
                }        
            }

        } else {
            console.error("BattleHero 技能效果或技能特效为空");
        }
    }

    private buildRandomList(targetList: Array<BattleHero>, count: number): void {
        count = targetList.length - count;
        for (let i = 0; i < count; i++) {
            let idx = Math.floor(Math.random() * targetList.length);
            targetList.splice(idx, 1);
        }
    }

    private buildAOEList(pos: Vec3, targetList: Array<BattleHero>, allList: Array<BattleHero>, range: number): void {
        for (let i = 0; i < allList.length; i++) {
            if(Vec3.distance(pos, allList[i].node.position) <= range) {
                targetList.push(allList[i]);
            }
        }
    }

    private buildLowerHpList(targetList: Array<BattleHero>, count: number): void {
        if (count >= targetList.length) {
            return;
        }

        targetList.sort((a: BattleHero, b: BattleHero) => a.hp - b.hp);

        targetList.splice(count, targetList.length - count);
    }

    private doSkillEffect(recordSkill: Config.skill.Record, targetList: Array<BattleHero>): void {

        for (let i = 0; i < recordSkill.effectType.length; i++) {
            for (let j = 0; j < targetList.length; j++) {

                if (targetList[j].isDie() || recordSkill.effectChance[i] != 0 && Math.random() > recordSkill.effectChance[i]/100) {
                    continue;
                }
                
                if (recordSkill.effectTargetType[i] == EEffectTargetType.SameToSkill) {
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
                } else {
                    let targetTmpList: Array<BattleHero> = [];
                    if (recordSkill.effectTargetType[i] == EEffectTargetType.Self) {
                        targetTmpList.push(this);
                    } else if (recordSkill.effectTargetType[i] == EEffectTargetType.TeammateHPLowest) {
                        targetTmpList = this._armyList.slice(0, this._armyList.length)
                        this.buildLowerHpList(targetTmpList, recordSkill.effectTargetNum[i]);
                    } else {
                        console.error("BattleHero.doSkillEffect 功能未实现:" + recordSkill.effectTargetType[i]); 
                    }
                    
                    for (let k = 0; k < targetTmpList.length; k++) {
                        if (!this.checkEffectCondtion(this, targetTmpList[k], recordSkill.effectCondType[i], recordSkill.effectCondParam[i])) {
                            continue;
                        }
        
                        //执行效果
                        // 执行技能天赋效果(hero_攻击者, target, (TEffectType) record.EffectType[i], record.EffectParam1[i], record.EffectParam2[i], 0, false, is_delay_show);
                        this.doSkillTalentEffect(targetTmpList[k], recordSkill.effectType[i], recordSkill.effectParam1[i], recordSkill.effectParam2[i], 0, false, false);
                        
                        // //如果有粒子，在目标身上创建粒子
                        // if (record.EffectParticle[i] != "0")
                        //     CreateParticle(record.EffectParticle[i], hero_攻击者, targetList[j], TParticleType.其他);
                        // //天赋：自身施放技能命中触发
                        // hero_攻击者.TryTriggerTalentEffect(TTalentTriggerType.自身施放技能命中时, 0, hero_攻击者, targetList[j]);
                    }
                }

            }

            
        }
    }

    private doSkillTalentEffect(target: BattleHero, effectType: number, effectParam1: number, effectParam2: number
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
                this.doSkillHeal(target, effectParam1);
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

    private doSkillDamage(target: BattleHero, effectParam1: number) {
        if (!target.isDie()) {
            target.addHp(-this.atk*effectParam1/100, DamageType.Skill);
            // target.addPow(BeHitPowerUp);

            // this.addPow(AttackPowerUp);
            if (target.isDie()) {
                this.addPow(KillPowerUp);
            }
        }
    }

    private doSkillHeal(target: BattleHero, effectParam1: number) {
        if (!target.isDie() && !target.isFullHp()) {
            target.addHp(this.atk*effectParam1/100, DamageType.Heal);
        }
    }

    private checkEffectCondtion(attack: BattleHero, target: BattleHero, condType: number, condParam: number) {
        switch (condType) {
            case EEffectCondType.Null:
                return true;
            case EEffectCondType.TargetClasses:
                if (target.getClasses() == condParam) {
                    return true;
                }
                return false;
            case EEffectCondType.TargetStatus:
                // if (target.getBuffStatus((TBuffStatus) condParam)) {
                    return true;
                // } 
                return false;
            case EEffectCondType.TargetHPMoreThanSelf:
                if (target.hp > attack.hp) {
                    return true;
                }
                return false;
            case EEffectCondType.TargetDead:
                if (target.isDie()) {
                    return true;
                }
                return false;
            case EEffectCondType.EveryHPLostX:
                if (condParam == 1 && attack.isFrontSite()) {
                    return true;
                } else if (condParam == 2 && !attack.isFrontSite()) {
                    return true;
                } 
                // console.error("BattleHero.checkEffectCondtion EEffectCondType.EveryHPLostX condParam 配置了未实现的功能：" + condParam);
                return false;
            case EEffectCondType.TargetHPLessThanSelf:
                if (target.hp < attack.hp) {
                    return true;
                }
                return false;
                    
        }

        console.error("BattleHero.checkEffectCondtion condType 配置了未实现的功能：" + condType);
        return false;
    }

    private doAttack(): void {
        this._heroBase.playAttack();
    }

    private onPrepareAttack(): void {
        if (this._prepareAttackPrefab) {
            this.playEffect(instantiate(this._prepareAttackPrefab));
        }
    }

    private onAttack(): void {
        if (!this._target || this._target.isDie()) {
            return;
        }

        if (this._normalAttackPrefab) {
            let normalAttackEffect = instantiate(this._normalAttackPrefab);
            let battleEffect = normalAttackEffect.getComponent("BattleEffect") as BattleEffect;
            if (battleEffect.isImmediately()) {
                // TODO 普通刀光
                this.doHitDamager(this._target);

                this.playEffect(normalAttackEffect);

                if (battleEffect.endEffectPrefab) {
                    this._target.playEffect(instantiate(battleEffect.endEffectPrefab));
                }
            } else {
                let delayDamage = new BattleDelayDamage(battleEffect, this, this._target, (target: BattleHero)=> {
                    this.doHitDamager(target);
                    target.removeFlyDamagePool(delayDamage);
                });

                this._target.addFlyDamagePool(delayDamage);
            }
            
            return;
        }

        this.doHitDamager(this._target);
    }

    private doHitDamager(target: BattleHero): void {
        if (target && !target.isDie()) {
            target.addHp(-this.atk, DamageType.Hit);
            target.addPow(BeHitPowerUp);

            this.addPow(AttackPowerUp);
            if (target.isDie()) {
                this.addPow(KillPowerUp);
            }

        } 
    }

    public isDie(): boolean {
        return this.hp === 0;
    }

    public addFlyDamagePool(flyDelayDamage: BattleDelayDamage): void {
        this._flyDamagePool.set(flyDelayDamage, flyDelayDamage);
    }

    public removeFlyDamagePool(flyDelayDamage: BattleDelayDamage): void {
        this._flyDamagePool.delete(flyDelayDamage);
    }

    public addBuff(attack: BattleHero, buffID: number): void {
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

        let buff: BattleBuffer = null as unknown as BattleBuffer;

        for (let i = 0; i < this._buffList.length; i++) {
            if (this._buffList[i].getBuffID() == record.id) {
                buff = this._buffList[i];
                this._buffList.splice(i, 1);
                buff.refreshBuff(attack);
                break;
            }
        }
        
        if (!buff) {
            buff = new BattleBuffer(this, attack, record);
        }

        if (this._buffList.length == 0) {
            this._buffList.push(buff);
        } else {
            if (this._buffList[this._buffList.length -1].time <= buff.time) {
                this._buffList.push(buff);
            } else {
                for (let i = 0; i < this._buffList.length; i++) {
                    if (this._buffList[i].time > buff.time) {
                        this._buffList.splice(i, 0, buff);
                        break;
                    }
                }
            }
        }

        // this._checkBuffundefined();
    }

    public removeBuff(buff: BattleBuffer): void {
        for (let i = 0; i < this._buffList.length; i++) {
            if (this._buffList[i] == buff) {
                this._buffList.splice(i, 1);
                break;
            }
        }

        // this._checkBuffundefined();
    }

    // 测试代码
    // private _checkBuffundefined(): void {
    //     for (let i = 0; i < this._buffList.length; i++) {
    //         if (!this._buffList[i]) {
    //             console.error("_checkBuffundefined undefined !!!!!!!!!!!!!!!!!!!!!");
    //         }
    //     }
    // }

    public getBuffList(): BattleBuffer[] {
        return this._buffList;
    }


    private doBuff(dt: number) {
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
                } else if (this.isDie()) {
                    return;
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
                if (this._buffList[this._buffList.length -1].time <= l[i].time) {
                    this._buffList.push(l[i]);
                } else {
                    for (let j = 0; j < this._buffList.length; j++) {
                        if (this._buffList[j].time > l[i].time) {
                            this._buffList.splice(j, 0, l[i]);
                            break;
                        }
                    }
                }
            }
        }

        // this._checkBuffundefined();
    }

    public addBuffProperty(record: Config.buff_new.Record, bUp: boolean): void {
        let value = this._buffPropertyMap.get(record.effectParam1);
        if (value == undefined) {
            value = 0;
        }
        value += (bUp ? record.effectParam2 : -record.effectParam2);
        this._buffPropertyMap.set(record.effectParam1, value);
        this._battleTitleBar.addStatusString(BattleTest.getBuffIcon(record.icon));
        this._battleTitleBar.addStatusIco(record.icon)
    }

    public removeBuffProperty(record: Config.buff_new.Record, bUp: boolean): void {
        let value = this._buffPropertyMap.get(record.effectParam1);
        if (value == undefined) {
            return;
        }
        value += (bUp ? -record.effectParam2 : record.effectParam2);
        if (value == 0) {
            this._buffPropertyMap.delete(record.effectParam1);
        } else {
            this._buffPropertyMap.set(record.effectParam1, value);
        }

        this._battleTitleBar.removeStatusString(BattleTest.getBuffIcon(record.icon));
        this._battleTitleBar.removeStatusIco(record.icon)
    }

    public refreshBuffStatus(): void {
        let str = "";
        this._buffPropertyMap.forEach((value: number, key: Msg.THeroPropertyType) => {

        })
    }

    // damage正数为加血
    public addHp(damage: number, damageType: DamageType): void {
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

    public setHp(hp: number): void {
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

    public isFullPow(): boolean {
        return this.maxPow > 0 && this.pow == this.maxPow;
    }

    public isFullHp(): boolean {
        return this.hp == this.maxHp;
    }

    public isFrontSite(): boolean {
        return this.embattleedSite < 3;
    }

    public addPow(pow: number): void {
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

    public setPow(pow: number): void {
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

    public die(): void {
        if (this._heroBase.isInDie()) {
            return;
        }

        this._heroSkeletalAnimation.off(SkeletalAnimation.EventType.LASTFRAME)
        this.removeTarget();
        this.removeBattlePos();
        this._curActFunc = null;
        this._battleTitleBar.setVisible(false);
        this._heroBase.playDie();
        this.clearBuff();
        this.clearDelayDamage();
        this._battleCtrl.onHeroDie(this);
    }

    public clearBuff(): void {
        // this._checkBuffundefined();

        for (let i = 0; i < this._buffList.length; i++) {
            this._buffList[i].onClear();
        }
        this._buffList = [];
    }

    public clearDelayDamage(): void {    
        this._flyDamagePool.forEach((v)=>{
            v.onClear();
        });

        this._flyDamagePool.clear();
    }

    public playEffect(effectNode: Node): void {
        this._heroBase.playEffect(effectNode);
    }

    public stopAnim(): void {
        this._heroBase.stopAnim();
    }

}
