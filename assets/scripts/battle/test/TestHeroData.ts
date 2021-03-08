
import { _decorator } from 'cc';


import { HeroData } from "../../game/model/datas/HeroData"

export class TestHeroData extends HeroData{

    private _testCfg: any = {};
    // 最大血量
    public getMaxHP(isAura: boolean = true) {
       return this.getTestCfgValue("hp");
    }

    // 攻击       
    public getATK(isAura: boolean = true) {
        return this.getTestCfgValue("atk");
    }
    
    // 防御
    public getDEF(isAura: boolean = true) {
        return this.getTestCfgValue("def");
    }

    // 攻速
    public getSpeed(isAura: boolean = true) {
        return this.getTestCfgValue("speed");
    }

    // 命中率
    public getHit(isAura: boolean = true) {
        return this.getTestCfgValue("hit");
    }

    // 暴击率
    public getCrit(isAura: boolean = true) {
        return this.getTestCfgValue("crit");
    }

    // 暴击伤害
    public getCritDamage(isAura: boolean = true) {
        return this.getTestCfgValue("critDamage");
    }
    
    // 破甲
    public getDEFBreak(isAura: boolean = true) {
        return this.getTestCfgValue("defBreak");
    }

    // 闪避率
    public getDodge(isAura: boolean = true) {
        return this.getTestCfgValue("defDodge");
    }

    // 免伤值
    public getReduceDamage(isAura: boolean = true) {
        return this.getTestCfgValue("reduceDamage");
    }
    
    // 技能效果
    public getSkillEffect(isAura: boolean = true) {
        return this.getTestCfgValue("skillEffect");
    }
    
    // 阵营伤害
    public getCampDamage(isAura: boolean = true) {
        return this.getTestCfgValue("campDamage");
    }
    
    // 治疗效果
    public getHealEffect(isAura: boolean = true) {
        return this.getTestCfgValue("healEffect");
    }

    // 技能攻速
    public getSkillSpeed(isAura: boolean = true) {
        return this.getTestCfgValue("skillSpeed");
    }

    // 普攻范围
    public getRange(isAura : boolean = true) {
        return this.getTestCfgValue("range");
    }

     // 是否是主角
     public isRoleHero() {
        return this.getTestCfgValue("isRoleHero");
    }

    // 模型预制体路径
    public getPrefabPath(): string {
        return this.getTestCfgValue("prefab");
    }

    // 获得主动技能ID
    public getSkillID(): number {
        return this.getTestCfgValue("skillID");
    }

    public setTestCfg(testCfg: any) {
        this._testCfg = testCfg;
    }

    public getTestCfgValue(key: string) {
        if (this._testCfg.hasOwnProperty(key)) {
            return this._testCfg[key];
        }
        return 0;
    }
}

