
import { _decorator, Component, Node, Vec3, Canvas, Prefab, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;



import { BattleTest } from "./test/BattleTest";

import { EHeroType, BattleHero } from "./BattleHero";
import { BattleMgr } from "./BattleMgr";
import { BattleResMgr } from "./BattleResMgr";

import { ValueMgr } from "../game/model/ValueMgr";

let bLoadMain = false;

const GroundLen = 300;

let oldMainLoop: any = null;

@ccclass('BattleCtrl')
export class BattleCtrl extends Component {

    private _groundPrefab: Prefab = null as unknown as Prefab;

    public static EmbattleCfg = [[-3, 0], [0, 0], [3, 0] 
                                    ,[-3, 3], [0, 3], [3, 3]];

    private _actTime: number = 0;
    private _curActFunc: any = null;

    private _battleGrounds: Array<Node> = [];
    private _nextGroundIdx: number = 0;

    private _army: Array<BattleHero> = [];
    private _enemy: Array<BattleHero> = [];

    private _aliveArmy: Array<BattleHero> = [];
    private _aliveEnemy: Array<BattleHero> = [];

    private _leaderNode: Node = null as unknown as Node;


    public canvas: any = null;
    public camera: any = null;
    public cameraNode: any = null;



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

        if(BattleTest.isInit) {
            this.doStart();
        } else {
            BattleTest.buildTestBattle()
            BattleResMgr.getInstance().startLoad(BattleTest.getLoadResList(), (c, t)=>{
                
            }, ()=>{
                
                if (ValueMgr.getInstance().isInit()) {
                    this.doStart();
                } else {
                    
                    ValueMgr.getInstance().loadData((cur:number, total:number)=>{
                        if(cur == total){
                            ValueMgr.getInstance().setInit(true);
                            this.doStart();
                        }
                    });
                } 
            });
        }
        

    }


    doStart() {
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
        if(!this._leaderNode) {
            return;
        }
        this.cameraNode.setPosition(this._leaderNode.position.x, 0, this._leaderNode.position.z);
    }

    initMap(): void {
        
        this._groundPrefab = BattleResMgr.getInstance().getRes(BattleTest.getMapInfo().prefab);
        for(let i = 0; i < 3; i++) {
            let ground = instantiate(this._groundPrefab);
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

    createHero(heroData: any, heroType: EHeroType): BattleHero {
        let battleHeroNode = instantiate(BattleResMgr.getInstance().getRes("prefabs/battle/hero/battle_hero"));
        let battleHero: BattleHero = battleHeroNode.getComponent("BattleHero") as BattleHero;
        this.node.addChild(battleHeroNode);
    
        battleHero.initHero(this, heroData, heroType);    
        return battleHero;
    }

    initHeros(): void {
        // TODO
        let armyInfo = BattleMgr.getInstance().getIdleArmyInfo();
        
        armyInfo.forEach((v, k) => {
            let battleHero = this.createHero(v, v.isRoleHero() ? EHeroType.LEADER : EHeroType.HERO);
            if (v.isRoleHero()) {
                this._leaderNode = battleHero.node;
            }
            battleHero.setEmbattleedSite(k);
            this._army.push(battleHero);
        })

        for (let i = 0; i < this._army.length; i++) {
            if (this._army[i].isHero()) {
                this._army[i].setLeaderNode(this._leaderNode);
            }
            this._army[i].node.setPosition(new Vec3(BattleCtrl.EmbattleCfg[this._army[i].embattleedSite][0]
                , 0 
                , this._battleGrounds[this._nextGroundIdx - 1].position.z - 10 + BattleCtrl.EmbattleCfg[this._army[i].embattleedSite][1]))

            // console.log(this._army[i].node.position)
        }
    
        let enemyInfo = BattleMgr.getInstance().getIdleEnemyInfo();
        // 怪物提前生成，保证游戏顺畅
        enemyInfo.forEach((v, k) => {
            let battleHero = this.createHero(v, EHeroType.MONSTER);
            battleHero.setEmbattleedSite(k);
            this._enemy.push(battleHero);
            battleHero.setVisible(false);
        })
    }

    seekEnemy(): void {
        this._actTime = 10 + Math.random() * 2;
        this._curActFunc = this.doSeekEnemy;
        for(let i = 0; i < this._army.length; i++) {
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
        for (let i = 0; i < this._enemy.length; i++) {
            this._enemy[i].setVisible(true);
            this._enemy[i].node.setRotationFromEuler(0, 180);
            this._enemy[i].revive();
            this._enemy[i].node.setPosition(new Vec3(BattleCtrl.EmbattleCfg[this._enemy[i].embattleedSite][0]
                , 0 
                , enemyZ - BattleCtrl.EmbattleCfg[this._enemy[i].embattleedSite][1]));

            this._aliveEnemy[i] = this._enemy[i];
        }

        // 我方布阵
        enemyZ += 20;
        for(let i = 0; i < this._army.length; i++) {
            this._army[i].startEmbattle(
                new Vec3(BattleCtrl.EmbattleCfg[this._army[i].embattleedSite][0]
                , 0 
                , enemyZ + BattleCtrl.EmbattleCfg[this._army[i].embattleedSite][1]), this._actTime - 0.03);

            this._aliveArmy[i] = this._army[i];
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
        for(let i = 0; i < this._army.length; i++) {
            this._army[i].startRunToBattle(enemyZ, this._actTime - 0.03);
        }

        enemyZ = -enemyZ;
        for(let i = 0; i < this._enemy.length; i++) {
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
        for(let i = 0; i < this._army.length; i++) {
            this._army[i].startBattle(this._aliveEnemy, this._aliveArmy);
        }

        for(let i = 0; i < this._enemy.length; i++) {
            this._enemy[i].startBattle(this._aliveArmy, this._aliveEnemy);
        }
    }

    // doBattle(): void {
    // }
    onHeroDie(hero: BattleHero) {
        if (hero.isEnemy()) {
            for(let i = 0; i < this._aliveEnemy.length; i++) {
                if (hero == this._aliveEnemy[i]) {
                    this._aliveEnemy.splice(i, 1);
                    break;
                }
            }

            if (this._aliveEnemy.length == 0) {
                this.wait();
            }
        } else {
            for(let i = 0; i < this._aliveArmy.length; i++) {
                if (hero == this._aliveArmy[i]) {
                    this._aliveArmy.splice(i, 1);
                    break;
                }
            }

            if (this._aliveArmy.length == 0) 
            {
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
            for (let i = 0; i < this._enemy.length; i++) {
                this._enemy[i].setVisible(false);
            }

            for (let i = 0; i < this._army.length; i++) {
                if (this._army[i].isDie()) {
                    this._army[i].revive();
                } else {
                    this._army[i].refreshData();
                }
            }
            this.seekEnemy();
        }
    }

    refreshEnemy(enemyZ: number): void {
        for (let i = 0; i < this._enemy.length; i++) {
            this._enemy[i].setVisible(true);
            this._enemy[i].node.setRotationFromEuler(0, 180);
            this._enemy[i].revive();
            this._enemy[i].node.setPosition(new Vec3(BattleCtrl.EmbattleCfg[this._enemy[i].embattleedSite][0]
                , 0 
                , enemyZ - BattleCtrl.EmbattleCfg[this._enemy[i].embattleedSite][1]));
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
