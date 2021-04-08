// import { _decorator, Component, Node, Enum } from 'cc';

import { BattleTest } from "./test/BattleTest";
import { HeroData } from "../game/model/datas/HeroData";
import { TableName, ValueMgr } from "../game/model/ValueMgr";
import { EEffectType } from "./BattleHero";
import { BattleResMgr } from "./BattleResMgr";
import { resources, SpriteFrame } from "cc";

let preloadResList: string[] = [];

let preloadFunc: (v: HeroData, k: Number) => void = (v: HeroData, k: Number) => {

    if (v.getPrepareAttackParticleName() != "0") {
        preloadResList.push(v.getPrepareAttackParticleName());
    }

    if (v.getNormalAttackParticleName() != "0") {
        preloadResList.push(v.getNormalAttackParticleName());
    }

    if(v.getPrefabPath() != "0") {
        preloadResList.push(v.getPrefabPath());

        if (v.getSkillID()) {
            let recordSkill = ValueMgr.getInstance().getItemByField(TableName.skill, v.getSkillID()) as Config.skill.Record;
            if (recordSkill) {
                let path = BattleTest.getSkillPrefabPath(recordSkill.id);
                if (path) {
                    preloadResList.push(path);
                }

                path = BattleTest.getPrepareSkillPrefabPath(recordSkill.id);
                if (path) {
                    preloadResList.push(path);
                }

                for (let i = 0; i < recordSkill.effectType.length; i++) {
                    switch (recordSkill.effectType[i]) {
                        // case EEffectType.Damage: // 伤害
                        //     break;
                        // case EEffectType.Heal: // 加血
                        //     break;
                        case EEffectType.AddBuff: // 生成buff
                            let recordBuff: Config.buff_new.Record = ValueMgr.getInstance().getItemByField(TableName.buff_new, recordSkill.effectParam1[i]) as Config.buff_new.Record;
                            if (recordBuff && recordBuff.particle != "0") {
                                path = BattleTest.getBuffPrefabPath(recordBuff.particle);
                                if (path) {
                                    preloadResList.push(path);
                                }
                            }
                            break;
                        // case EEffectType.AddPower: // 加能量
                        //     break;
                        // case EEffectType.SubPower: // 减能量
                        //     break;
                        // case EEffectType.KnockOff: // 击飞
                        //     break;
                        // case EEffectType.DamageMulti: // 多段伤害
                        //     break;
                        // case EEffectType.RemoveBuff: // 移除BUFF
                        //     break;
                        // case EEffectType.MoveToTargetBack: // 移动到目标位置身后
                        //     break;
                        // case EEffectType.AddBuffTime: // 加强BUFF时间
                        //     break;
                        // case EEffectType.SureCrit: // 伤害或治疗必定暴击
                        //     break;
                        // case EEffectType.Reborn: // 复活
                        //     break;
                        // case EEffectType.HealHPPct: // 百分比加血
                        //     break;
                        // case EEffectType.TeleportWhenBattleStart: // 战斗开始时瞬移位置
                        //     break;
                    }
                }
            }
        }
        
    }
}

export class BattleMgr {
    private static _instance: BattleMgr = new BattleMgr();

    public static getInstance() {
        return this._instance;
    }

    public buildTest(onProgress: (c: number, t: number)=>void, onLoaded: ()=>void) {
        if (ValueMgr.getInstance().isInit()) {
            this.doTest(onProgress, onLoaded);
        } else {
            ValueMgr.getInstance().loadData((cur:number, total:number)=>{
                if(cur == total){
                    ValueMgr.getInstance().setInit(true);

                    this.doTest(onProgress, onLoaded);
                }
            })
        }
    }

    public doTest(onProgress: (c: number, t: number)=>void, onLoaded: ()=>void) {
        BattleTest.buildTestBattle();
        this.buildPreloadRes();
        this.uiPreloadRes();
        BattleResMgr.getInstance().startLoad(BattleMgr.getInstance().getPreloadRes(), onProgress, onLoaded);
    }

    public buildPreloadRes() {
        
        preloadResList = [];
        preloadResList.push("prefabs/battle/hero/battle_hero");
        
        preloadResList.push(BattleTest.getMapInfo().prefab);

        let armyFormation: Map<number, HeroData> = this.getIdleArmyInfo();
        armyFormation.forEach(preloadFunc);

        let enemyFormation: Map<number, HeroData> = this.getIdleEnemyInfo();
        enemyFormation.forEach(preloadFunc);

        let bossFormation: Map<number, HeroData> = this.getIdleBossInfo();
        bossFormation.forEach(preloadFunc);
    }

    // ui相关资源
    public uiPreloadRes(){
        preloadResList.push("battle/ui/加血/spriteFrame")
        // resources.loadDir("battle/ui", SpriteFrame, (err : any, asset : any)=>{
        //     if(!err){
        //         console.log(asset)
        //         // resources.release("battle/ui", SpriteFrame);
        //     }
        // })
    }

    public getIdleArmyInfo() {
        return BattleTest.getArmyFormation();
    }


    public getIdleEnemyInfo() {
        return BattleTest.getEnemyFormation();
    }

    public getIdleBossInfo() {
        return BattleTest.getBossFormation();
    }

    public getPreloadRes() {
        return preloadResList;
    }
}
