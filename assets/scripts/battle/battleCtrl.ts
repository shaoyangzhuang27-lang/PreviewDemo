
import { _decorator, Component, Node, Vec3, Canvas, Prefab, instantiate, director, resources } from 'cc';
const { ccclass, property } = _decorator;

import {BattlerHero} from "./BattlerHero";

let bLoadMain = false;

const GroundLen = 300;

let oldMainLoop: any = null;

@ccclass('BattleCtrl')
export class BattleCtrl extends Component {

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

    private _army: Array<BattlerHero> = []
    private _enemy: Array<BattlerHero> = []

    private _leaderNode: Node = null


    public canvas: any = null
    public camera: any = null
    public cameraNode: any = null


    // private _goundPrefab: Prefab = null;

    onLoad() {
        // resources.load("prefabs/battle/pingtai01", Prefab, function name(e, res) {
        //     console.log("1111111111111")
        //     this._goundPrefab = res;
        // }.bind(this));

        // if(oldMainLoop == null) {
        //     oldMainLoop = director.mainLoop
        //     director.mainLoop = function(time) {
        //         oldMainLoop.call(director, time*0.2);
        //     }
        // }

        this.cameraNode = this.node.getChildByName("cameraNode");
        this.camera = this.cameraNode.getChildByName("Main Camera");
        this.canvas = this.node.getParent()?.getChildByName("Canvas");
    }

    start() {

        this.initMap();
        this.initHeros();
        
        
        this.seekEnemy();
        // this.wait();
    }

    update(dt: number) {
        // this.cameraNode.setPosition(this._leaderNode.position.x, 0, this._leaderNode.position.z);
        // console.log(this.cameraNode.position)

        if(!this._leaderNode) {
            return;
        }
        // console.log(director.getScheduler().getTimeScale());

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
        // if(!this.cameraNode) {
        //     return;
        // }
        this.cameraNode.setPosition(this._leaderNode.position.x, 0, this._leaderNode.position.z);
    }

    initMap(): void {
        for(let i = 0; i < 3; i++) {
            let ground = instantiate(this.pingtai01Prefab);
            this.node.addChild(ground);
            ground.setPosition(new Vec3(0, 0 , -GroundLen*i))
            this._battleGrounds.push(ground);
        }

        // for(let i = 0; i < 3; i++) {
        //     let ground = instantiate(this._goundPrefab);
        //     this.node.addChild(ground);
        //     ground.setPosition(new Vec3(0, 0 , -GroundLen*i))
        //     this._battleGrounds.push(ground);
        // }
        this._nextGroundIdx = 2;
    }

    initHeros(): void {
        // 初始化怪物
        this._enemyInfo = [
            {
                id: 40,
                type: BattlerHero.HeroType.MONSTER,
                hp: 30,
                atk: 2,
                hitTime: 0.5,
                range: 3,
                speed: 1.3,
                normal_attack: "0",
            },
            {
                id: 44,
                type: BattlerHero.HeroType.MONSTER,
                hp: 50,
                atk: 2,
                hitTime: 0.5,
                range: 3,
                speed: 1.3,
                normal_attack: "0",
            },
            {
                id: 45,
                type: BattlerHero.HeroType.MONSTER,
                hp: 40,
                atk: 2,
                hitTime: 0.5,
                range: 3,
                speed: 1.3,
                normal_attack: "0",
            },
            {
                id: 41,
                type: BattlerHero.HeroType.MONSTER,
                hp: 20,
                atk: 3,
                hitTime: 0.5,
                range: 7,
                speed: 1.3,
                normal_attack: "0",
            },
            {
                id: 42,
                type: BattlerHero.HeroType.MONSTER,
                hp: 15,
                atk: 3,
                hitTime: 0.5,
                range: 7,
                speed: 1.3,
                normal_attack: "0",
            },
            {
                id: 46,
                type: BattlerHero.HeroType.MONSTER,
                hp: 50,
                atk: 3,
                hitTime: 0.5,
                range: 7,
                speed: 1.3,
                normal_attack: "0",
            },
        ]

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
                type: BattlerHero.HeroType.LEADER,
                embattleedSite: 1,
                hp: 100,
                atk: 5,
                hitTime: 0.6,
                range: 3,
                speed: 1.3,
                normal_attack: "0",
            },
            {
                id: 29,
                type: BattlerHero.HeroType.LEADER,
                embattleedSite: 0,
                hp: 100,
                atk: 4,
                hitTime: 0.5,
                range: 3,
                speed: 1.3,
                normal_attack: "0",
            },
            {
                id: 30,
                type: BattlerHero.HeroType.LEADER,
                embattleedSite: 2,
                hp: 100,
                atk: 4,
                hitTime: 0.5,
                range: 3,
                speed: 1.3,
                normal_attack: "0",
            },
            {
                id: 25,
                type: BattlerHero.HeroType.LEADER,
                embattleedSite: 3,
                hp: 100,
                atk: 6,
                hitTime: 0.5,
                range: 7,
                speed: 1.3,
                normal_attack: "0",
            },
            {
                id: 26,
                type: BattlerHero.HeroType.LEADER,
                embattleedSite: 4,
                hp: 100,
                atk: 6,
                hitTime: 0.5,
                range: 7,
                speed: 1.3,
                normal_attack: "0",
            },
            {
                id: 33,
                type: BattlerHero.HeroType.LEADER,
                embattleedSite: 5,
                hp: 100,
                atk: 6,
                hitTime: 0.5,
                range: 7,
                speed: 1.3,
                normal_attack: "0",
            },
        ]
        
        this._leaderNode = instantiate(this._HeroCfg[armyInfo[0].id]);
        // this.camera.removeFromParent();
        // this._leaderNode.addChild(this.camera);
        this.node.addChild(this._leaderNode);
        let hero: BattlerHero = this._leaderNode.getComponent("BattlerHero") as BattlerHero;
        hero.initHero(this, armyInfo[0]);
        this._army[armyInfo[0].embattleedSite] = hero


        for (let i = 1; i < armyInfo.length; i++) {
            let heroNode = instantiate(this._HeroCfg[armyInfo[i].id]);
            this.node.addChild(heroNode);
            hero = heroNode.getComponent("BattlerHero"); 
            hero.initHero(this, armyInfo[i], this._leaderNode);
            this._army[armyInfo[i].embattleedSite] = hero;
        }

        for (let i = 0; i < 6; i++) {
            this._army[i].node.setPosition(new Vec3(BattleCtrl.EmbattleCfg[i][0]
                , 0 
                , this._battleGrounds[this._nextGroundIdx - 1].position.z - 10 + BattleCtrl.EmbattleCfg[i][1]))

            // console.log(this._army[i].position)
        }

        // 怪物提前生成，保证游戏顺畅
        for (let i = 0; i < 6; i++) {
            let heroNode = instantiate(this._HeroCfg[this._enemyInfo[i].id]);
            this.node.addChild(heroNode);
            heroNode.setRotationFromEuler(0, 180, 0);
            hero = heroNode.getComponent("BattlerHero"); 
            hero.initHero(this, this._enemyInfo[i]);
            this._enemy[i] = hero;
            heroNode.setPosition(0, 0, 0);
            hero.setVisible(false);
        }
    }

    seekEnemy(): void {
        this._actTime = 10 + Math.random() * 2;
        this._curActFunc = this.doSeekEnemy;
        for(let i = 0; i < 6; i++) {
            this._army[i].startSeekEnemy();
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
            this._army[i].startEmbattle(
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
        this._actTime = 1.5
        this._curActFunc = this.doRunToBattle;

        let enemyZ = (-20 + 3)/2;
        for(let i = 0; i < 6; i++) {
            this._army[i].startRunToBattle(enemyZ, this._actTime - 0.03);
        }

        enemyZ = -enemyZ;
        for(let i = 0; i < 6; i++) {
            this._enemy[i].startRunToBattle(enemyZ, this._actTime - 0.03);
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
        // this._curActFunc = this.doBattle;
        this._curActFunc = null;
        for(let i = 0; i < 6; i++) {
            this._army[i].startBattle(this._enemy);
        }

        for(let i = 0; i < 6; i++) {
            this._enemy[i].startBattle(this._army);
        }
    }

    // doBattle(): void {
    // }

    onHeroDie(hero: BattlerHero) {
        if (hero.isEnemy()) {
            let isAllDie = true;
            for(let i = 0; i < 6; i++) {
                if (!this._enemy[i].isDie()) {
                    isAllDie = false;
                    break;
                }
            }

            if (isAllDie) {
                this.wait();
            }
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
                this._enemy[i].setVisible(false);
            }

            for(let i = 0; i < 6; i++) {
                this._army[i].refreshData();
            }
            this.seekEnemy();
        }
    }

    refreshEnemy(enemyZ: number): void {
        for (let i = 0; i < 6; i++) {
            this._enemy[i].setVisible(true);
            this._enemy[i].node.setRotationFromEuler(0, 180);
            this._enemy[i].revive();
            this._enemy[i].node.setPosition(new Vec3(BattleCtrl.EmbattleCfg[i][0]
                , 0 
                , enemyZ - BattleCtrl.EmbattleCfg[i][1]));
        }
    }


    onClickMainCity(): void {
        if (bLoadMain) {
            director.loadScene("main");
        } else {
            director.loadScene("loading", function (e, s) {
                bLoadMain = true;
            });
        }
        
    }

}
