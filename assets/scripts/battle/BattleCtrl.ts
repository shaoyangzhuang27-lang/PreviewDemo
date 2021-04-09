
import { _decorator, Component, Node, Vec3, Canvas, Prefab, instantiate, director, Button, Label, math } from 'cc';
const { ccclass, property } = _decorator;



import { BattleTest } from "./test/BattleTest";

import { EHeroType, BattleHero } from "./BattleHero";
import { BattleMgr } from "./BattleMgr";
import { BattleResMgr } from "./BattleResMgr";

import { XConsts } from '../game/model/const/XConsts';

let bLoadMain = false;

const GroundLen = 300;

let oldMainLoop: any = null;

let tmpPos: Vec3 = new Vec3();

@ccclass('BattleCtrl')
export class BattleCtrl extends Component {
    public static EmbattleCfg = [[-4, 0], [0, 0], [4, 0] 
        ,[-4, 4], [0, 4], [4, 4]];

    @property(Node)
    public battleUiNode: Node = null as unknown as Node;


    private _bStart: boolean = false;

    private _groundPrefab: Prefab = null as unknown as Prefab;



    private _actTime: number = 0;
    private _curActFunc: any = null;

    private _battleGrounds: Array<Node> = [];
    private _nextGroundIdx: number = 0;

    private _army: Array<BattleHero> = [];
    private _monster: Array<BattleHero> = [];
    private _boss: Array<BattleHero> = [];

    private _enemy: Array<BattleHero> = [];

    private _aliveArmy: Array<BattleHero> = [];
    private _aliveEnemy: Array<BattleHero> = [];

    private _leaderNode: Node = null as unknown as Node;
    
    public camera: any = null;
    public cameraNode: any = null;
    private _cameraPos: Vec3 = new Vec3();

    private _bSeekBoss: boolean = false;
    private _bossBtn: Node | null = null;


    private _posMap: Map<number, BattleHero> = new Map<number, BattleHero>();

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

        this.battleUiNode.setSiblingIndex(XConsts.OrderStage);

        this.cameraNode = this.node.getChildByName("cameraNode");
        this.camera = this.cameraNode.getChildByName("Main Camera");
    }

    start() {
        

        if(BattleTest.isInit) {
            this.doStart();
        } else {
            
            BattleMgr.getInstance().buildTest((c, t)=>{
                
            }, ()=>{
                this.doStart();
            })
        }
        
    }

    doStart() {
        this.initMap();
        this.initHeros();
        
        if (this._bossBtn) {
            this._bossBtn.active = true;
        }

        this._bStart = true;
        this.seekEnemy();
        // this.wait();
    }

    isStart() {
        return this._bStart;
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
        if(this._army.length == 0) {
            return;
        }

        this._cameraPos.x = 0;
        this._cameraPos.z = 0;
        for (let i = 0; i < this._army.length; i++) {
            this._cameraPos.x += this._army[i].node.position.x;
            this._cameraPos.z += this._army[i].node.position.z;
        }


        this.cameraNode.setPosition(this._cameraPos.x/this._army.length, 0, this._cameraPos.z/this._army.length);
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
        });
        this._army.sort((a: BattleHero, b:BattleHero) => a.embattleedSite - b.embattleedSite);

        for (let i = 0; i < this._army.length; i++) {
            if (this._army[i].isHero()) {
                this._army[i].setLeaderNode(this._leaderNode);
            }
            this._army[i].node.setPosition(new Vec3(BattleCtrl.EmbattleCfg[this._army[i].embattleedSite][0]
                , 0 
                , this._battleGrounds[this._nextGroundIdx - 1].position.z - 10 + BattleCtrl.EmbattleCfg[this._army[i].embattleedSite][1]))

            // console.log(this._army[i].node.position)
        }
    
        let monsterInfo = BattleMgr.getInstance().getIdleEnemyInfo();
        // 怪物提前生成，保证游戏顺畅
        monsterInfo.forEach((v, k) => {
            let battleHero = this.createHero(v, EHeroType.MONSTER);
            battleHero.setEmbattleedSite(k);
            this._monster.push(battleHero);
            battleHero.setVisible(false);
        });
        this._monster.sort((a: BattleHero, b:BattleHero) => a.embattleedSite - b.embattleedSite);

        let bossInfo = BattleMgr.getInstance().getIdleBossInfo();
        // 怪物提前生成，保证游戏顺畅
        bossInfo.forEach((v, k) => {
            let battleHero = this.createHero(v, EHeroType.MONSTER);
            battleHero.setEmbattleedSite(k);
            this._boss.push(battleHero);
            battleHero.setVisible(false);
        });
        this._boss.sort((a: BattleHero, b:BattleHero) => a.embattleedSite - b.embattleedSite);
    }

    buildBattlePos(targetPos: Vec3, centerPos: Vec3, range: number, hero: BattleHero): void {
        let sz = Math.round(targetPos.z/2);
        let sx = Math.round(targetPos.x/2);

        let cz = Math.round(centerPos.z/2);
        let cx = Math.round(centerPos.x/2);

        // if (sz >= cz) {
        //     sz = cz + range;
        // } else {
        //     sz = cz - range;
        // }

        // if (sx >= cx) {
        //     sx = cx + range;
        // } else {
        //     sx = cx - range;
        // }
        
        if (this._posMap.has(sz * 100 + sx) && hero != this._posMap.get(sz * 100 + sx)) {
            range/=2;

            let px1 = sx;
            let pz1 = sz;
            let px2 = sx;
            let pz2 = sz;

            let ox1 = 0;
            let oz1 = 0;
            let ox2 = 0;
            let oz2 = 0;

            if (Math.abs(cz - sz) >= Math.abs(cx - sx)) {
                ox1 = 1;
                ox2 = -1;
            } else {
                oz1 = 1;
                oz2 = -1;
            }

            for (let i = 0; i < 10; i++) {
                if (i%2 == 0) {
                    if (ox1 != 0) {
                        px1 += ox1;

                        if (Math.abs(cx - px1) >= range) {
                            ox1 = 0;
                            if (pz1 > cz) {
                                oz1 = -1;
                            } else {
                                oz1 = 1;
                            }
                            pz1 += oz1;
                        }

                    } else {
                        pz1 += oz1;

                        if (Math.abs(cz - pz1) >= range) {
                            oz1 = 0;
                            if (pz1 > cz) {
                                ox1 = -1;
                            } else {
                                ox1 = 1;
                            }
                            px1 += ox1;
                        }
                    }

                    if (!this._posMap.has(pz1 * 100 + px1) || hero == this._posMap.get(pz1 * 100 + px1)) {
                        sx = px1;
                        sz = pz1;
                        break;
                    }

                } else {
                    if (ox2 != 0) {
                        px2 += ox2;

                        if (Math.abs(cx - px2) >= range) {
                            ox2 = 0;
                            if (pz2 > cz) {
                                oz2 = -1;
                            } else {
                                oz2 = 1;
                            }
                            pz2 += oz2;
                        }

                    } else {
                        pz2 += oz2;

                        if (Math.abs(cz - pz2) >= range) {
                            oz2 = 0;
                            if (pz2 > cz) {
                                ox2 = -1;
                            } else {
                                ox2 = 1;
                            }
                            px2 += ox2;
                        }
                    }

                    if (!this._posMap.has(pz2 * 100 + px2) || hero == this._posMap.get(pz2 * 100 + px2)) {
                        sx = px2;
                        sz = pz2;
                        break;
                    }
                }



            }
        }

        targetPos.x = sx*2;
        targetPos.z = sz*2;

        this._posMap.delete(hero.getTargetPos().z/2 * 100 + hero.getTargetPos().x/2);
        this._posMap.set(sz * 100 + sx, hero);
        
    }


    removeBattlePos(targetPos: Vec3): void {
        this._posMap.delete(targetPos.z/2 * 100 + targetPos.x/2);
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

        if (this._bSeekBoss) {
            this._enemy = this._boss;
            this._bSeekBoss = false;
            if (this._bossBtn) {
                (this._bossBtn.getComponent(Button) as Button).interactable = true;
                (this._bossBtn.getComponent(Button) as Button).enabled = true;
                let label = this._bossBtn.getChildByName("Label") as Node;  
                (label.getComponent(Label) as Label).string = "挑战首领!"
            }
        } else {
            this._enemy = this._monster;
        }
        

        // 重置敌人
        for (let i = 0; i < this._enemy.length; i++) {
            this._enemy[i].setVisible(true);
            this._enemy[i].node.setRotationFromEuler(0, 180);
            this._enemy[i].revive();
            this._enemy[i].setPosition(new Vec3(BattleCtrl.EmbattleCfg[this._enemy[i].embattleedSite][0]
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
            // this.battle();
        }
    }


    runToBattle(): void {
        this._actTime = 0.7
        this._curActFunc = this.doRunToBattle;

        // let enemyZ = (-20 + 4)/2;
        let enemyZ = -5;
        for(let i = 0; i < this._army.length; i++) {
            this._army[i].startRunToBattle(enemyZ, this._actTime - 0.01);
        }

        enemyZ = -enemyZ;
        for(let i = 0; i < this._enemy.length; i++) {
            this._enemy[i].startRunToBattle(enemyZ, this._actTime - 0.01);
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
        this._posMap.clear();

        for(let i = 0; i < this._army.length; i++) {
            this._army[i].startBattle(this._aliveEnemy, this._aliveArmy);
        }

        for(let i = 0; i < this._enemy.length; i++) {
            this._enemy[i].startBattle(this._aliveArmy, this._aliveEnemy);
        }

        // 先对位
        for(let i = 0; i < this._army.length; i++) {
            this._army[i].seekFirstTarget();
        }

        // 按位置顺序遍历
        let a = 0;
        let b = 0;
        for(let i = 0; i < 6; i++) {
            if (this._army.length > a && this._army[a].embattleedSite == i) {
                if (!this._army[a].getTarget()) {
                    this._army[a].seekFirstTarget();
                }
                
                a++;
            }

            if (this._enemy.length > b && this._enemy[b].embattleedSite == i) {
                if (!this._enemy[b].getTarget()) {
                    this._enemy[b].seekFirstTarget();
                }
                
                b++;
            }
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

    onClickBossFight(): void {
        if (this._bossBtn) {
            this._bSeekBoss = true;
            (this._bossBtn.getComponent(Button) as Button).interactable = false;
            (this._bossBtn.getComponent(Button) as Button).enabled = true;
            let label = this._bossBtn.getChildByName("Label") as Node;  
            (label.getComponent(Label) as Label).string = "搜寻首领中..."
        }
    }

    setBossBtn(bossBtn: Node): void {
        this._bossBtn = bossBtn;
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
