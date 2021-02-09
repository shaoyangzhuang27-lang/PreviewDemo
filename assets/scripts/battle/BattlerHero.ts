import { _decorator, Component, Node, SkeletalAnimation, AnimationState, Vec3, BoxCollider, RigidBody } from 'cc';
const { ccclass, property } = _decorator;

import {BattleCtrl} from "./BattleCtrl";
import {BattleTitleBar} from "./BattleTitleBar";


const RunSpeed = 7;

/*
TODO
1.  目标找完后，正在接近目标时候，目标发生移动或死了。
2.  找完目标后，锁定的移动位置可能已被占用。
*/

@ccclass('BattlerHero')
export class BattlerHero extends Component {

    public static STATUS = {
        IDLE: "idle",
        RUN: "run",
        ATTACK: "attack",
        SKILL: "skill",
        VICTORY: "victroy",
        DIE: "die",
    }

    public static HeroType = {
        LEADER: 1,
        HERO: 2,
        MONSTER: 3,
        BOSS: 4
    }

    private _battleTitleBar: BattleTitleBar = null

    private _tmpPos: Vec3 = new Vec3()
    private _targetPos: Vec3 = new Vec3()
    private _dirVector: Vec3 = new Vec3()

    private _targetList: Array<BattlerHero> = []
    private _target: BattlerHero | null = null

    private _bodyNode: any = null
    private _heroInfo: any = null


    private _leaderNode: any = null

    private _status: string = ""
    private _actTime: number = 0
    private _curActFunc: any = null

    private _maxHp: number = 0
    private _maxPow: number = 100
    private _hp: number = 0
    private _pow: number = 0

    public atk: number = 0
    public def: number = 0
    public rng: number = 0
    public spd: number = 0
    public skillSpd: number = 0
    public crt: number = 0
    public crtDmg: number = 0
    public hitRat: number = 0
    public evd: number = 0
    public defBreak: number = 0
    



    private _battleCtrl: BattleCtrl = null

    public static Event = {
        DIE: "DIE",
    }
    private _battleEvents = {}
    onLoad() {

        this._bodyNode = this.node.getChildByName("body");
        this.playAnim(BattlerHero.STATUS.IDLE);

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

    startSeekEnemy(): void {
        this.playAnim(BattlerHero.STATUS.RUN);
        // this.node.getComponent(RigidBody)?.wakeUp();
        this.node.getComponent(BoxCollider).enabled = true;
        this.node.getComponent(RigidBody).enabled = true;
        this._battleTitleBar.setVisible(false);
        this.node.setRotationFromEuler(0, 0, 0)
        this.seekEnemy();
        this._curActFunc = this.doSeekEnemy; 
    }

    seekEnemy(): void {
        this.node.getComponent(RigidBody)?.clearState();
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
        this.playAnim(BattlerHero.STATUS.RUN);
        this.embattle(embattlePos);
        this._curActFunc = this.doEmbattle;
        this.node.getComponent(BoxCollider).enabled = false;
        this.node.getComponent(RigidBody).enabled = false;
        this.node.getComponent(RigidBody).clearState();
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
            // this.node.getComponent(BoxCollider).active = true;
            // this.node.getComponent(RigidBody).active = true;
            // this.node.getComponent(RigidBody).clearState();
            // this.playAnim(BattlerHero.STATUS.IDLE);
            this.node.setPosition(this._targetPos);
        } else {
            this._tmpPos.x += dt * this._dirVector.x
            this._tmpPos.z += dt * this._dirVector.z
            this.node.setPosition(this._tmpPos);
        }
    }

    startRunToBattle(z: number, actTime: number): void {
        this._battleTitleBar.setVisible(true);
        this.node.getComponent(RigidBody).clearState();
        // this.node.setPosition(this._targetPos);

        this.playAnim(BattlerHero.STATUS.RUN);
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
            // this.node.getComponent(BoxCollider).active = true;
            // this.node.getComponent(RigidBody).active = true;
            this.node.getComponent(RigidBody)?.clearState();
            // this.playAnim(BattlerHero.STATUS.IDLE);
            this.node.setPosition(this._targetPos);

            this.playAnim(BattlerHero.STATUS.ATTACK)
        }  else {
            this._tmpPos.z += dt * this._dirVector.z
            this.node.setPosition(this._tmpPos);
        }
    }

    startBattle(targetList: Array<BattlerHero>): void {
        this._curActFunc = null;
        this._targetList = targetList
        this.seekAttackTarget();
    }

    seekAttackTarget(): void {
        // this._curActFunc = null;
        this._target = null;
        this._dirVector.set(Vec3.ZERO);
        let dirVec = new Vec3();
        for (let i = 0; i < this._targetList.length; i++) {
            if (!this._targetList[i].isDie()) {
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
            }
        }

        if (this._target) {
            if (this._heroInfo.range < this._dirVector.length()) {
                // 先简单处理了
                dirVec.x = this._dirVector.x * this._heroInfo.range / this._dirVector.length()
                dirVec.z = this._dirVector.z * this._heroInfo.range / this._dirVector.length()
                this._dirVector.subtract(dirVec);
                this._targetPos.set(this.node.position);
                this._targetPos.add(this._dirVector);
                this.startRunTo();
            } else {
                // 直接攻击
                this.startAttack();
            }
                
        } else {
            this.playAnim(BattlerHero.STATUS.IDLE);
        }

    }

    startRunTo(): void {
        this.playAnim(BattlerHero.STATUS.RUN);
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
        this.attack();
    }

    attack(): void {
        if (!this._target) {
            // TODO
            console.error("call BattlerHero.attack fail, this._target is null");
            return;
        }

        // 开始发动攻击时计算速度 TODO 有buffer刷新时候再计算

        this._curActFunc = this.doAttack;
        this._actTime = this._heroInfo.hitTime;
        this.playAnim(BattlerHero.STATUS.ATTACK);
        this.node.lookAt(this._target.node.position);
        this._bodyNode.getComponent(SkeletalAnimation)?.on(SkeletalAnimation.EventType.LASTFRAME, (a: any, b: any, c: any) => {
            if (this._target) {
                if (this._target.isDie()) {
                    this._bodyNode.getComponent(SkeletalAnimation)?.off(SkeletalAnimation.EventType.LASTFRAME)
                    this.seekAttackTarget();
                } else {
                    // 开始发动攻击时计算速度 TODO 有buffer刷新时候再计算


                    this._curActFunc = this.doAttack;
                    this._actTime = this._heroInfo.hitTime;
                }
            } else {
                this._bodyNode.getComponent(SkeletalAnimation)?.off(SkeletalAnimation.EventType.LASTFRAME)
            }
            
            // console.log(a, b, c)
        })
    }

    // TODO 改成使用事件帧
    doAttack(dt: number) {
        this._actTime -= dt;
        if (this._actTime <= 0) {
            this.hitTarget();
            this._curActFunc = null;
        }

    }

    hitTarget(): void {
        if (this._target && !this._target.isDie()) {
            this._target.addHp(-this._heroInfo.atk);
        } 
    }

    isDie(): boolean {
        return this._hp === 0
    }

    addHp(hp: number) {
        this._hp += hp;
        if (this._hp > this._maxHp) {
            this._hp = this._maxHp;
        } else if (this._hp <= 0) {
            this._hp = 0;
            this.die();
        }
        this._battleTitleBar.setHpPercent(this._hp / this._maxHp);

        this._battleTitleBar.flyWords(hp);
    }

    addPow(pow: number) {
        this._pow += pow;
        if (this._pow > this._maxPow) {
            this._pow = this._maxPow;
        } else if (this._pow <= 0) {
            this._pow = 0;
        }
        this._battleTitleBar.setPowPercent(this._pow / this._maxPow);

    }

    die(): void {
        if (this._status == BattlerHero.STATUS.DIE) {
            return;
        }

        if (this._status == BattlerHero.STATUS.ATTACK) {
            this._bodyNode.getComponent(SkeletalAnimation)?.off(SkeletalAnimation.EventType.LASTFRAME)
        }

        this._curActFunc = null;
        this._battleTitleBar.setVisible(false);
        this.playAnim(BattlerHero.STATUS.DIE);
        this._battleCtrl.onHeroDie(this);
    }

    addBuff() {

    }

    removeBuff() {

    }


    onTargetDie() {

    }

    initHero(battleCtrl: BattleCtrl, heroInfo: any, _leaderNode?: any): void {
        this._battleCtrl = battleCtrl;
        this._heroInfo = heroInfo;
        this._leaderNode = _leaderNode;

        // this._bodyNode.getComponent(SkeletalAnimation)

        this.initBattleData();
        

        // let a: SkeletalAnimation = this._bodyNode.getComponent(SkeletalAnimation) as SkeletalAnimation
        // a.hasEventListener
        // let b: AnimationState = a.getState("attack");
        // b.length
        // console.log(b.length);
        
        this.initTitleBar();

        this.refreshData();
        // this.refreshAttackSpeed();
    }

    initBattleData(): void {
        this.atk = this._heroInfo.atk;
        this.def = 0;
        this.rng = 0;
        this.spd = 0;
        this.skillSpd = 0;
        this.crt = 0;
        this.crtDmg = 0;
        this.hitRat = 0;
        this.evd = 0;
        this.defBreak = 0;
    }

    refreshData(): void {
        this._maxHp = this._heroInfo.hp;
        this._maxPow = 100;
        this._hp = this._maxHp;
        this._pow = 0;

        this._battleTitleBar.setHpPercent(this._hp / this._maxHp);
        this._battleTitleBar.setPowPercent(this._pow / this._maxPow);
    }

     

    revive(): void {
        this.refreshData();
        this.playAnim(BattlerHero.STATUS.IDLE);
    }

    isEnemy(): boolean {
        return this._heroInfo.type != BattlerHero.HeroType.LEADER && this._heroInfo.type != BattlerHero.HeroType.HERO
    }

    initTitleBar(): void {
        this._battleTitleBar = this.node.getChildByName("titleBarNode")?.getComponent("BattleTitleBar") as BattleTitleBar;

        this._battleTitleBar.createTitleBar(this._battleCtrl.camera, this._battleCtrl.canvas, !this.isEnemy());
        
        this._battleTitleBar.setHpPercent(1);
        this._battleTitleBar.setPowPercent(0);
    }

    setVisible(b: boolean): void {
        this.node.active = b;
        this._battleTitleBar.setVisible(b);
    }

    playAnim(status: string): void {
        if (this._status == status) {
            return;
        }

        this._status = status;
        this._bodyNode.getComponent(SkeletalAnimation).play(status);

        // let a = this._bodyNode.getComponent(SkeletalAnimation) as SkeletalAnimation;
        // let b = a.clips[0]
    
        // a.getState(b.name).speed = 1.5;
        // console.log(b, b?.name)
    }


    addEvent(): void {

    }

    removeEvent(): void {

    }

}
