import { _decorator, Component, Node, SkeletalAnimation, Camera, Vec3, BoxCollider, RigidBody, TERRAIN_HEIGHT_BASE } from 'cc';
const { ccclass, property } = _decorator;


const RunSpeed = 7;

@ccclass('HeroBase')
export class HeroBase extends Component {

    public static STATUS = {
        NONE: 0,    // 无动作
        IDLE: 1,    // 待机
        RUN: 2,     // 奔跑
        ATTACK: 3,  // 攻击
        VICTORY: 4, // 胜利
        DIE: 5,     // 死亡
    }

    public static HeroType = {
        LEADER: 1,
        HERO: 2,
        MONSTER: 3,
        BOSS: 4
    }

    @property(Node)
    private attackNode: Node = null

    @property(Node)
    private dieNode: Node = null

    @property(Node)
    private idleNode: Node = null

    @property(Node)
    private runNode: Node = null

    @property(Node)
    private victoryNode: Node = null



    private _battleTitleBar: any = null

    private _tmpPos: Vec3 = new Vec3()
    private _targetPos: Vec3 = new Vec3()
    private _dirVector: Vec3 = new Vec3()

    private _targetList: any = null
    private _targetNode: any = null

    private _curNode: any = null
    private _heroInfo: any = null


    private _leaderNode: any = null

    private _status: number = 0
    private _actTime: any = null
    private _curActFunc: any = null

    private _maxHp: number = 0
    private _maxPow: number = 100
    private _hp: number = 0
    private _pow: number = 0


    onLoad() {
        
        this.attackNode.active = false;
        this.dieNode.active = false;
        this.idleNode.active = false;
        this.runNode.active = false;
        this.victoryNode.active = false;

        this._curNode = this.idleNode;
        this.playAnim(HeroBase.STATUS.IDLE);

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
        this.playAnim(HeroBase.STATUS.RUN);
        // this.node.getComponent(RigidBody)?.wakeUp();
        this.node.getComponent(BoxCollider).enabled = true;
        this.node.getComponent(RigidBody).enabled = true;
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
        this.playAnim(HeroBase.STATUS.RUN);
        this.embattle(embattlePos);
        this._curActFunc = this.doEmbattle;
        this.node.getComponent(BoxCollider).enabled = false;
        this.node.getComponent(RigidBody).enabled = false;
        this.node.getComponent(RigidBody).clearState();
        this.node.getComponent(RigidBody)?.sleep();
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
            // this.playAnim(HeroBase.STATUS.IDLE);
            this.node.setPosition(this._targetPos);
        } else {
            this._tmpPos.x += dt * this._dirVector.x
            this._tmpPos.z += dt * this._dirVector.z
            this.node.setPosition(this._tmpPos);
        }
    }

    startRunToBattle(z: number, actTime: number): void {
        this.node.getComponent(RigidBody).clearState();
        this.node.setPosition(this._targetPos);

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
            this.node.getComponent(RigidBody).clearState();
            // this.playAnim(HeroBase.STATUS.IDLE);
            this.node.setPosition(this._targetPos);

            this.playAnim(HeroBase.STATUS.ATTACK)
        }  else {
            this._tmpPos.z += dt * this._dirVector.z
            this.node.setPosition(this._tmpPos);
        }
    }

    startBattle(targetList: any): void {
        this._curActFunc = null;
        this._targetList = targetList
        this.seekAttackTarget();
    }

    seekAttackTarget(): void {
        // this._curActFunc = null;
        this._targetNode = null;
        this._dirVector.set(Vec3.ZERO);
        let dirVec = new Vec3();
        for (let i = 0; i < this._targetList.length; i++) {
            if (!this._targetList[i].getComponent("HeroBase").isDie()) {
                if(this._targetNode) {
                    Vec3.subtract(dirVec, this._targetList[i].position, this.node.position);
                    if(dirVec.length() < this._dirVector.length()) {
                        this._targetNode = this._targetList[i];
                        this._dirVector.set(dirVec);
                    }
                } else {
                    this._targetNode = this._targetList[i];
                    Vec3.subtract(this._dirVector, this._targetNode.position, this.node.position);
                }
            }
        }

        if (this._targetNode) {
            if (this._heroInfo.atkRange < this._dirVector.length()) {
                // 先简单处理了
                dirVec.x = this._dirVector.x * this._heroInfo.atkRange / this._dirVector.length()
                dirVec.z = this._dirVector.z * this._heroInfo.atkRange / this._dirVector.length()
                this._dirVector.subtract(dirVec);
                this._targetPos.set(this.node.position);
                this._targetPos.add(this._dirVector);
                this.startRunTo();
            } else {
                // 直接攻击
                this.startAttack();
            }
                
        } else {
            this.playAnim(HeroBase.STATUS.IDLE);
        }

    }

    startRunTo(): void {
        this.playAnim(HeroBase.STATUS.RUN);
        this._curActFunc = this.doRunTo;
        this.runTo();
    }

    runTo(): void {
        this.node.lookAt(this._targetPos);
        this._tmpPos.set(this.node.position);
        this._actTime = this._dirVector.length() / RunSpeed;
    }

    doRunTo(dt: number): void {
        if (this._targetNode.getComponent("HeroBase").isDie()) {
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
        this._curActFunc = this.doAttack;
        this._actTime = this._heroInfo.hitTime;
        this.playAnim(HeroBase.STATUS.ATTACK);
        this.node.lookAt(this._targetNode.position);
        this._curNode.getComponent(SkeletalAnimation)?.on(SkeletalAnimation.EventType.LASTFRAME, function (a: any, b: any, c: any) {
            if (this._targetNode) {
                if (this._targetNode.getComponent("HeroBase").isDie()) {
                    this._curNode.getComponent(SkeletalAnimation)?.off(SkeletalAnimation.EventType.LASTFRAME)
                    this.seekAttackTarget();
                } else {
                    this._curActFunc = this.doAttack;
                    this._actTime = this._heroInfo.hitTime;
                }
            } else {
                this._curNode.getComponent(SkeletalAnimation)?.off(SkeletalAnimation.EventType.LASTFRAME)
            }
            
            // console.log(a, b, c)
        }.bind(this))
    }

    doAttack(dt: number) {
        this._actTime -= dt;
        if (this._actTime <= 0) {
            this.hitTarget();
            this._curActFunc = null;
        }

    }

    hitTarget(): void {
        if (this._targetNode && !this._targetNode.getComponent("HeroBase").isDie()) {
            this._targetNode.getComponent("HeroBase").addHp(-this._heroInfo.atk);
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

    die(): void {
        this._curActFunc = null;
        this._battleTitleBar.setVisible(false);
        this.playAnim(HeroBase.STATUS.DIE);
    }

    initHero(camera: Camera, canvas: Node, heroInfo: any, _leaderNode?: any): void {
        this._heroInfo = heroInfo;
        this._leaderNode = _leaderNode;

        this.initTitleBar(camera, canvas);

        this.refreshData();
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
        this.playAnim(HeroBase.STATUS.IDLE);
    }

    initTitleBar(camera: Camera, canvas: Node): void {
        this._battleTitleBar = this.node.getChildByName("titleBarNode")?.getComponent("BattleTitleBar");

        let isGreen = true;
        if (this._heroInfo.type != HeroBase.HeroType.LEADER && this._heroInfo.type != HeroBase.HeroType.HERO) {
            isGreen = false;
        }


        this._battleTitleBar.createTitleBar(camera, canvas, isGreen);
        
        this._battleTitleBar.setHpPercent(1);
        this._battleTitleBar.setPowPercent(0);
    }

    setVisible(b: boolean): void {
        this.node.active = b;
        this._battleTitleBar.setVisible(b);
    }

    playAnim(status: number): void {
        if (this._status == status) {
            return;
        }

        this._curNode.active = false;
        this._status = status;
        switch (status) {
            case HeroBase.STATUS.NONE:
                this._curNode = this.idleNode;
                break;
            case HeroBase.STATUS.IDLE:
                this._curNode = this.idleNode;
                break; 
            case HeroBase.STATUS.RUN:
                this._curNode = this.runNode;
                break;
            case HeroBase.STATUS.ATTACK:
                this._curNode = this.attackNode;
                break;
            case HeroBase.STATUS.VICTORY:
                this._curNode = this.victoryNode;
                break;
            case HeroBase.STATUS.DIE:
                this._curNode = this.dieNode;
                break;
            default:
                this._curNode = this.idleNode;
                break;
        }

        this._curNode.active = true;
        this._curNode.getComponent(SkeletalAnimation).play();
    }
}
