import { _decorator, Component, Node, SkeletalAnimation, AnimationState, Vec3, BoxCollider, RigidBody, Enum, instantiate, Prefab, math } from 'cc';
const { ccclass, property } = _decorator;


import { HeroBase } from "../core/base/HeroBase";
import { BaseHeroData } from "../game/model/datas/BaseHeroData";

import { BattleResMgr } from "./BattleResMgr";
import { BattleCtrl } from "./BattleCtrl";
import { BattleTitleBar } from "./BattleTitleBar";
import { TableName, ValueMgr } from '../game/model/ValueMgr';

// TODO
import { BattleTest } from './test/BattleTest';


const RunSpeed = 7;

/*
TODO
1.  目标找完后，正在接近目标时候，目标发生移动或死了。
2.  找完目标后，锁定的移动位置可能已被占用。
*/


export enum EHeroType {
    None,       // 原点
    LEADER,     // 主角
    HERO,       // 英雄
    MONSTER,    // 小怪
    BOSS,       // BOSS
}
Enum(EHeroType);

enum ESkillTargetType {
    None,
    Target,                     // 当前攻击目标
    Self,                       // 自身
    SelfAOERandomEnemy,         // 自身范围内AOE随机敌方
    SelfAOELessHPUs,            // 自身范围内AOE血少己方
    SelfStraightAOERandomEnemy, // 自身前方直线范围AOE随机敌方
    AllRandomEnemy,             // 每个随机敌方
    AllRandomLessHPUs,          // 每个血少己方
    AllRandomLessEnemy,         // 每个血少敌方
    PriorityBackAllEnemy,       // 优先后排每个敌方
    PriorityFrontAllEnemy,      // 优先前排每个敌方
    TargetAOEEnemy,             // 目标范围内的敌方单位
    PriorityBackAllUs,          // 优先后排每个己方
    PriorityFrontAllUs,         // 优先前排每个己方
    AllLessHPUsExceptSelf,      // 每个血少已方单位不算自身
    OurLeader,                  // 己方主角
}
// Enum(ESkillTargetType);


// enum ESkillEffectTargetType {
// 	SkillTarget,    // 同技能目标 = 0,
// 	Self,           // 自身 = 1,
// 	LessHPUs,       // 己方血量少的 = 2,
// }

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

    private _recordSkill: Config.skill.Record | null = null;
    private _skillPrefab: Prefab | null = null;
    


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
        this.maxHp = this._heroData.getMaxHP();
        
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
        this._curActFunc = null;
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

        console.log("onSkill+++++++++++++++++++");
        if (this._recordSkill && this._skillPrefab) {
            this._heroBase.playEffect(instantiate(this._skillPrefab));

            switch (this._recordSkill.targetType) {
                case ESkillTargetType.Target: // 当前攻击目标
                case ESkillTargetType.Self: // 自身
                case ESkillTargetType.SelfAOERandomEnemy: // 自身范围内AOE随机敌方
                case ESkillTargetType.SelfAOELessHPUs: // 自身范围内AOE血少己方
                    console.warn("recordSkill.targetType 技能未实现！！！！");
                    break;
                case ESkillTargetType.SelfStraightAOERandomEnemy: // 自身前方直线范围AOE随机敌方
                    let targetList: Array<BattleHero> = [];
                
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
                    
                    let count = targetList.length - this._recordSkill.targetNumber;
                    for (let i = 0; i < count; i++) {
                        let idx = Math.floor(Math.random() * targetList.length);
                        targetList.splice(idx, 1);
                    }



                    break;
                case ESkillTargetType.AllRandomEnemy: // 每个随机敌方
                case ESkillTargetType.AllRandomLessHPUs: // 每个血少己方
                case ESkillTargetType.AllRandomLessEnemy: // 当前攻击目标
                case ESkillTargetType.PriorityBackAllEnemy: // 优先后排每个敌方
                case ESkillTargetType.PriorityFrontAllEnemy: // 优先前排每个敌方
                case ESkillTargetType.TargetAOEEnemy: // 目标范围内的敌方单位
                case ESkillTargetType.PriorityBackAllUs: // 优先后排每个己方
                case ESkillTargetType.PriorityFrontAllUs: // 优先前排每个己方
                case ESkillTargetType.AllLessHPUsExceptSelf: // 每个血少已方单位不算自身
                case ESkillTargetType.OurLeader: // 己方主角
                    console.warn("BattleHero recordSkill.targetType 技能未实现！！！！"); 
                    break;
            
                default:
                    console.error("BattleHero recordSkill.targetType 技能配置不存在: " + this._recordSkill.targetType); 
                    break;
            }
        } else {
            console.error("BattleHero 技能效果或技能特效为空");
        }
    }

    // doSkillEffect(recordSkill: Config.skill.Record, targetList: Array<BattleHero>): void {
    //     for (let i = 0; i < recordSkill.effectType.length; i++) {
    //         if (recordSkill.effectType[i] == Msg.TEffectTargetType.EEffectTargetType_SameToSkill) {
    //             for (let j = 0; j < targetList.length; j++) {
    //                 if (recordSkill.effectChance[i] != 0) {
    //                      if (math.random() > recordSkill.effectChance[i]/100) {
    //                          continue;
    //                      }

    //                      if (!this.checkEffectCondtion(this, targetList[i], recordSkill.effectCondType[i], recordSkill.effectCondParam[i])) {
    //                         continue;
    //                      }

    //                     //执行效果
    //                     // 执行技能天赋效果(hero_攻击者, target, (TEffectType) record.EffectType[i], record.EffectParam1[i], record.EffectParam2[i], 0, false, is_delay_show);
    //                     // //如果有粒子，在目标身上创建粒子
    //                     // if (record.EffectParticle[i] != "0")
    //                     //     CreateParticle(record.EffectParticle[i], hero_攻击者, target, TParticleType.其他);
    //                     // //天赋：自身施放技能命中触发
    //                     // hero_攻击者.TryTriggerTalentEffect(TTalentTriggerType.自身施放技能命中时, 0, hero_攻击者, target);
    //                 }
    //             }
    //         } else {
    //             console.warn("BattleHero.doSkillEffect 功能未实现"); 
    //         }
    //     }
    // }

    doSkillTalentEffect(): void {

    }

    // checkEffectCondtion(attack: BattleHero, target: BattleHero, condType: number, condParam: number) {
    //     switch (condType) {
    //         case Msg.TEffectCondType.EEffectCondType_Null:
    //             return true;
    //         case Msg.TEffectCondType.EEffectCondType_TargetClasses:
    //             if (target.getClasses() == condParam) {
    //                 return true;
    //             }  
    //         case Msg.TEffectCondType.EEffectCondType_TargetStatus:
    //             // if (target.getBuffStatus((TBuffStatus) condParam)) {
    //                 return true;
    //             // } 
    //         case Msg.TEffectCondType.EEffectCondType_TargetHPMoreThanSelf:
    //             if (target.hp > attack.hp) {
    //                 return true;
    //             }
    //         case Msg.TEffectCondType.EEffectCondType_TargetDead:
    //             if (target.isDie()) {
    //                 return true;
    //             }
    //         case Msg.TEffectCondType.EEffectCondType_EveryHPLostX:
    //             if (condParam == 1) {
    //                 if (attack.embattleedSite >= 1 && attack.embattleedSite <= 3) {
    //                     return true;
    //                 }
    //             } else if (condParam == 2) {
    //                 if (attack.embattleedSite >= 4 && attack.embattleedSite <= 6) {
    //                     return true;
    //                 }
    //             }
    //             console.error("BattleHero.checkEffectCondtion EEffectCondType_EveryHPLostX condParam 配置了未实现的功能：" + condParam);
    //             return false;
    //         case Msg.TEffectCondType.EEffectCondType_TargetHPLessThanSelf:
    //             if (target.hp < attack.hp) {
    //                 return true;
    //             }
                    
    //     }

    //     console.error("BattleHero.checkEffectCondtion condType 配置了未实现的功能：" + condType);
    //     return false;
    // }

    doAttack(): void {
        this._heroBase.playAttack();
    }

    onAttack(): void {    
        this.hitTarget();
    }

    hitTarget(): void {
        if (this._target && !this._target.isDie()) {
            this._target.addHp(-this.atk);

            this.addPow(30);
            if (this._target.isDie()) {
                this.addPow(20);
            }

        } 
    }

    isDie(): boolean {
        return this.hp === 0
    }

    addHp(hp: number): void {
        this.hp += hp;
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        } else if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }
        this._battleTitleBar.setHpPercent(this.hp / this.maxHp);

        this._battleTitleBar.flyWords(hp);
    }

    setHp(hp: number): void {
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

        if (this._heroBase.isInAttack()) {
            this._heroSkeletalAnimation.off(SkeletalAnimation.EventType.LASTFRAME)
        }

        this._curActFunc = null;
        this._battleTitleBar.setVisible(false);
        this._heroBase.playDie();
        this._battleCtrl.onHeroDie(this);
    }

    addBuff() {

    }

    removeBuff() {

    }


    onTargetDie() {

    }

   

    addEvent(): void {

    }

    removeEvent(): void {

    }

}
