
import { _decorator, Component, Node, Vec3, Quat, Canvas, Prefab, instantiate, Camera } from 'cc';
const { ccclass, property } = _decorator;

import {HeroBase} from "./HeroBase";


const GroundLen = 300;

@ccclass('BattleCtrl')
export class BattleCtrl extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    @property(Canvas)
    private canvas: Canvas = null

    @property(Prefab)
    private hero00Prefab: Prefab = null
    @property(Prefab)
    private hero29Prefab: Prefab = null
    @property(Prefab)
    private hero30Prefab: Prefab = null
    @property(Prefab)
    private hero25Prefab: Prefab = null
    @property(Prefab)
    private hero26Prefab: Prefab = null
    @property(Prefab)
    private hero33Prefab: Prefab = null



    @property(Prefab)
    private hero40Prefab: Prefab = null
    @property(Prefab)
    private hero41Prefab: Prefab = null
    @property(Prefab)
    private hero42Prefab: Prefab = null
    @property(Prefab)
    private hero44Prefab: Prefab = null
    @property(Prefab)
    private hero45Prefab: Prefab = null
    @property(Prefab)
    private hero46Prefab: Prefab = null


    @property(Prefab)
    private pingtai01Prefab: Prefab = null

    public static EmbattleCfg = [[-3, 0], [0, 0], [3, 0] 
                                    ,[-3, 3], [0, 3], [3, 3]]

    private _enemyInfo: any = []
    private _HeroCfg: any = {}

    private _actTime: number = 0
    private _curActFunc: any = null

    private _battleGrounds: Array<Node> = []
    private _nextGroundIdx: number = 0

    private _army: Array<Node> = []
    private _enemy: Array<Node> = []

    private _leaderNode: Node = null


    private _canvas: any = null
    private _camera: any = null
    private _cameraNode: any = null

    start() {
        this.initMap();
        this.initHeros();
        
        
        this.seekEnemy();
        // this.wait();
    }

    update(dt: number) {
        // this._cameraNode.setPosition(this._leaderNode.position.x, 0, this._leaderNode.position.z);
        // console.log(this._cameraNode.position)


        if (this._curActFunc) {
            this._curActFunc.call(this, dt);
        }

        // TODO 需要优化 在战斗中可能会有击退
        if (this._leaderNode.position.z < this._battleGrounds[this._nextGroundIdx].position.z - 5) {
            let preGoundIdx = (this._nextGroundIdx + 1) % this._battleGrounds.length;
            let z = this._battleGrounds[this._nextGroundIdx].position.z;
            z -= GroundLen;
            this._battleGrounds[preGoundIdx].setPosition(0, 0, z);
            this._nextGroundIdx = preGoundIdx;
            // console.log(this._leaderNode.position.z, preGoundIdx, this._nextGroundIdx, z)
        }
    }

    lateUpdate(): void {
        this._cameraNode.setPosition(this._leaderNode.position.x, 0, this._leaderNode.position.z);
    }

    initMap(): void {
        for(let i = 0; i < 3; i++) {
            let ground = instantiate(this.pingtai01Prefab);
            this.node.addChild(ground);
            ground.setPosition(new Vec3(0, 0 , -GroundLen*i))
            this._battleGrounds.push(ground);
        }
        this._nextGroundIdx = 2;
    }

    initHeros(): void {
        // 初始化怪物
        this._enemyInfo = [
            {
                id: 40,
                type: HeroBase.HeroType.MONSTER,
                hp: 30,
                atk: 2,
                hitTime: 0.5,
                atkRange: 3
            },
            {
                id: 44,
                type: HeroBase.HeroType.MONSTER,
                hp: 50,
                atk: 2,
                hitTime: 0.5,
                atkRange: 3
            },
            {
                id: 45,
                type: HeroBase.HeroType.MONSTER,
                hp: 40,
                atk: 2,
                hitTime: 0.5,
                atkRange: 3
            },
            {
                id: 41,
                type: HeroBase.HeroType.MONSTER,
                hp: 20,
                atk: 3,
                hitTime: 0.5,
                atkRange: 7
            },
            {
                id: 42,
                type: HeroBase.HeroType.MONSTER,
                hp: 15,
                atk: 3,
                hitTime: 0.5,
                atkRange: 7
            },
            {
                id: 46,
                type: HeroBase.HeroType.MONSTER,
                hp: 50,
                atk: 3,
                hitTime: 0.5,
                atkRange: 7
            },
        ]

        this._cameraNode = this.node.getChildByName("cameraNode");
        this._camera = this._cameraNode.getChildByName("Main Camera");
        this._canvas = this.node.getParent().getChildByName("Canvas");

        this._HeroCfg = {
            0: this.hero00Prefab,
            29: this.hero29Prefab,
            30: this.hero30Prefab,
            25: this.hero25Prefab,
            26: this.hero26Prefab,
            33: this.hero33Prefab,

            40: this.hero40Prefab,
            41: this.hero41Prefab,
            42: this.hero42Prefab,
            44: this.hero44Prefab,
            45: this.hero45Prefab,
            46: this.hero46Prefab,
        }

        // 第一个位置固定主角
        let armyInfo = [
            {
                id: 0,
                type: HeroBase.HeroType.LEADER,
                embattleedSite: 1,
                hp: 100,
                atk: 4,
                hitTime: 0.5,
                atkRange: 3
            },
            {
                id: 29,
                type: HeroBase.HeroType.LEADER,
                embattleedSite: 0,
                hp: 100,
                atk: 4,
                hitTime: 0.5,
                atkRange: 3
            },
            {
                id: 30,
                type: HeroBase.HeroType.LEADER,
                embattleedSite: 2,
                hp: 100,
                atk: 4,
                hitTime: 0.5,
                atkRange: 3
            },
            {
                id: 25,
                type: HeroBase.HeroType.LEADER,
                embattleedSite: 3,
                hp: 100,
                atk: 6,
                hitTime: 0.5,
                atkRange: 7
            },
            {
                id: 26,
                type: HeroBase.HeroType.LEADER,
                embattleedSite: 4,
                hp: 100,
                atk: 6,
                hitTime: 0.5,
                atkRange: 7
            },
            {
                id: 33,
                type: HeroBase.HeroType.LEADER,
                embattleedSite: 5,
                hp: 100,
                atk: 6,
                hitTime: 0.5,
                atkRange: 7
            },
        ]
        
        this._leaderNode = instantiate(this._HeroCfg[armyInfo[0].id]);
        // this._camera.removeFromParent();
        // this._leaderNode.addChild(this._camera);
        this.node.addChild(this._leaderNode);
        let hero: any = this._leaderNode.getComponent("HeroBase")
        hero.initHero(this._camera, this._canvas, armyInfo[0]);
        this._army[armyInfo[0].embattleedSite] = this._leaderNode


        for (let i = 1; i < armyInfo.length; i++) {
            let heroNode = instantiate(this._HeroCfg[armyInfo[i].id]);
            this.node.addChild(heroNode);
            hero = heroNode.getComponent("HeroBase"); 
            hero.initHero(this._camera, this._canvas, armyInfo[i], this._leaderNode);
            this._army[armyInfo[i].embattleedSite] = heroNode;
        }

        for (let i = 0; i < 6; i++) {
            this._army[i].setPosition(new Vec3(BattleCtrl.EmbattleCfg[i][0]
                , 0 
                , this._battleGrounds[this._nextGroundIdx - 1].position.z - 10 + BattleCtrl.EmbattleCfg[i][1]))

            // console.log(this._army[i].position)
        }

        // 怪物提前生成，保证游戏顺畅
        for (let i = 0; i < 6; i++) {
            let heroNode = instantiate(this._HeroCfg[this._enemyInfo[i].id]);
            this.node.addChild(heroNode);
            heroNode.setRotationFromEuler(0, 180, 0);
            let hero = heroNode.getComponent("HeroBase"); 
            hero.initHero(this._camera, this._canvas, this._enemyInfo[i]);
            this._enemy[i] = heroNode;
            heroNode.setPosition(0, 0, 0);
            hero.setVisible(false);
        }
    }

    seekEnemy(): void {
        this._actTime = 10 + Math.random() * 2;
        this._curActFunc = this.doSeekEnemy;
        for(let i = 0; i < 6; i++) {
            this._army[i].getComponent("HeroBase")?.startSeekEnemy();
        }
    }

    doSeekEnemy(dt: number): void {
        this._actTime -= dt;

        if(this._actTime <= 0) {
            this.embattle();
        }
    }

    embattle(): void {
        this._actTime = 4;
        this._curActFunc = this.doEmbattle;
        let enemyZ = this._leaderNode.position.z - 50;
        // 重置敌人
        this.refreshEnemy(enemyZ);

        enemyZ += 20;
        for(let i = 0; i < 6; i++) {
            this._army[i].getComponent("HeroBase")?.startEmbattle(
                new Vec3(BattleCtrl.EmbattleCfg[i][0]
                , 0 
                , enemyZ + BattleCtrl.EmbattleCfg[i][1]), this._actTime - 0.03);
        }
    }

    doEmbattle(dt: number): void {
        this._actTime -= dt
        if (this._actTime <= 0) {
            this._actTime = 0;
            this.runToBattle();
        }
    }


    runToBattle(): void {
        this._actTime = 2.5
        this._curActFunc = this.doRunToBattle;

        let enemyZ = -20 + 3;
        for(let i = 0; i < 6; i++) {
            this._army[i].getComponent("HeroBase")?.startRunToBattle(enemyZ, this._actTime - 0.03);
        }
    }

    doRunToBattle(dt: number): void {
        this._actTime -= dt
        if (this._actTime <= 0) {
            this._actTime = 0;
            this.battle();
        }
    }

    battle(): void {
        this._curActFunc = this.doBattle;
        for(let i = 0; i < 6; i++) {
            this._army[i].getComponent("HeroBase")?.startBattle(this._enemy);
        }

        for(let i = 0; i < 6; i++) {
            this._enemy[i].getComponent("HeroBase")?.startBattle(this._army);
        }
    }

    // TODO 走事件触发
    doBattle(): void {
        let isAllDie = true;
        for(let i = 0; i < 6; i++) {
            if (!this._enemy[i].getComponent("HeroBase").isDie()) {
                isAllDie = false;
                break;
            }
        }

        if (isAllDie) {
            this.wait();
        }
    }

    wait(): void {
        this._actTime = 3;
        this._curActFunc = this.doWait;
    }

    doWait(dt: number): void {
        this._actTime -= dt;
        if (this._actTime <= 0) {
            for(let i = 0; i < 6; i++) {
                this._enemy[i].getComponent("HeroBase").setVisible(false);
            }

            for(let i = 0; i < 6; i++) {
                this._army[i].getComponent("HeroBase").refreshData();
            }
            this.seekEnemy();
        }
    }

    refreshEnemy(enemyZ: number): void {
        for (let i = 0; i < 6; i++) {
            this._enemy[i].getComponent("HeroBase").setVisible(true);
            this._enemy[i].getComponent("HeroBase").revive();
            this._enemy[i].setPosition(new Vec3(BattleCtrl.EmbattleCfg[i][0]
                , 0 
                , enemyZ - BattleCtrl.EmbattleCfg[i][1]));
        }
    }

}
