
import { _decorator, Component, Node, instantiate } from 'cc';
import { BattleEffect } from './BattleEffect';
import { BattleHero } from './BattleHero';
import { BattleResMgr } from './BattleResMgr';
import { DamageType } from './BattleTitleBar';
import { BattleTest } from './test/BattleTest';

enum EBuffType {
    Null,           //      = 0
    Dot,            // 伤害 = 1
    Hot,            // 加血 = 2
    Control,        // 控制 = 3
    ValueUp,        // 属性增加 = 4
    ValueDown,      // 属性减少 = 5
    Silence,        // 沉默 = 6
    Shield,         // 护盾 = 7
    Rebound,        // 反弹伤害 = 8
    ShareDamage,    // 分摊伤害 = 9
    Immune,         // 免疫控制 = 10
    Sign,           // 标记 = 11
}

export class BattleBuffer {

    public time: number = 0;
    public lastTime: number = 0;

    private _buffEffectNode: Node | null = null;
    private _record: Config.buff_new.Record = null as unknown as Config.buff_new.Record;
    private _target: BattleHero = null as unknown as BattleHero;

    private _shieldValue: number = 0;
    private _atk: number = 0;

    constructor(target: BattleHero, attack: BattleHero, record: Config.buff_new.Record) {
        this._target = target
        this._record = record;

        
        this.refreshBuff(attack);
        
    }

    refreshBuff(attack: BattleHero): void {
        this.lastTime = Date.now() + this._record.duration * 1000;
        this.time = this.lastTime;
        switch (this._record.effectType) {
            case EBuffType.Dot:            // 伤害 = 1
                this.time = Date.now() + 1000;
                this._atk = -attack.atk;
                break;
            case EBuffType.Hot:            // 加血 = 2
                this.time = Date.now() + 1000;
                this._atk = attack.atk;
                break;
            case EBuffType.Control:        // 控制 = 3
                this._target.stopAnim();
                break;
            case EBuffType.ValueUp:        // 属性增加 = 4
            case EBuffType.ValueDown:      // 属性减少 = 5
                this._target.addBuffProperty(this._record, this._record.effectType == EBuffType.ValueUp);
                break;
            case EBuffType.Silence:        // 沉默 = 6
                break;
            case EBuffType.Shield:         // 护盾 = 7
                this._shieldValue = this._record.effectParam1 * this._target.atk / 100;
                break;
            case EBuffType.Rebound:        // 反弹伤害 = 8
                break;
            case EBuffType.ShareDamage:    // 分摊伤害 = 9
                break;
            case EBuffType.Immune:         // 免疫控制 = 10
                break;
            case EBuffType.Sign:           // 标记 = 11
                break;
        }

        if (this._record.particle != "0") {
            let path: string = BattleTest.getBuffPrefabPath(this._record.particle);
            if (path) {
                let buffPrefab = BattleResMgr.getInstance().getRes(path);
                if (buffPrefab) {

                    if (this._buffEffectNode) {
                        (this._buffEffectNode.getComponent("BattleEffect") as BattleEffect).destroySelf();
                        this._buffEffectNode = null;
                    }

                    this._buffEffectNode = instantiate(buffPrefab);
                    if (this._buffEffectNode) {
                        this._target.playEffect(this._buffEffectNode);
                        // 所有buff的粒子都由BattleBuffer清理
                        if ((this._buffEffectNode.getComponent("BattleEffect") as BattleEffect).playTime > 0) {
                            (this._buffEffectNode.getComponent("BattleEffect") as BattleEffect).playTime = 0;
                        }
                    }  
                }
            } 
        
        }
    }

    getBuffID(): number {
        return this._record.id;
    }

    doBuff(buffList: BattleBuffer[], idx: number): boolean {
        // TODO 持续伤害代码在这实现
        if (this._atk != 0) {
            if (this._atk > 0){
                this._target.addHp(this._atk * this._record.effectParam1 / 100, DamageType.Heal);
            } else {
                this._target.addHp(this._atk * this._record.effectParam1 / 100, DamageType.Skill);
            }
        }

        if (this.lastTime > this.time) {
            this.time+=1000;
            if (this.time > this.lastTime) {
                this.time = this.lastTime;
            }
            return true;
        }

        
        this.onEnd(buffList, idx)
        return false;
    }

    onEnd(buffList: BattleBuffer[], idx: number = 0) {
        switch (this._record.effectType) {
            case EBuffType.Dot:            // 伤害 = 1
                break;
            case EBuffType.Hot:            // 加血 = 2
                break;
            case EBuffType.Control:        // 控制 = 3
                let b: boolean = true;
                for(let i = idx; i < buffList.length; i++) {
                    if (buffList[i].isControl()) {
                        b = false;
                        break;
                    }
                }

                if (b) {
                    this._target.seekAttackTarget();
                }
                break;
            case EBuffType.ValueUp:        // 属性增加 = 4
            case EBuffType.ValueDown:      // 属性减少 = 5
                this._target.removeBuffProperty(this._record, this._record.effectType == EBuffType.ValueUp);
                break;
            case EBuffType.Silence:        // 沉默 = 6
                break;
            case EBuffType.Shield:         // 护盾 = 7
                break;
            case EBuffType.Rebound:        // 反弹伤害 = 8
                break;
            case EBuffType.ShareDamage:    // 分摊伤害 = 9
                break;
            case EBuffType.Immune:         // 免疫控制 = 10
                break;
            case EBuffType.Sign:           // 标记 = 11
                break;
        }

        if (this._buffEffectNode) {
            (this._buffEffectNode.getComponent("BattleEffect") as BattleEffect).onEnd();
            this._buffEffectNode = null;
        }
    }

    onClear(): void {
        if (this._buffEffectNode) {
            (this._buffEffectNode.getComponent("BattleEffect") as BattleEffect).destroySelf();
            this._buffEffectNode = null;
        }
        // else {
        //     console.log("sdfsd++++++++++++++++++++++++")
        // }
    }

    isControl(): boolean {
        return this._record.effectType == EBuffType.Control;
    }

    isShield(): boolean {
        return this._record.effectType == EBuffType.Shield;
    }

    // 参数damage为负数
    doDamageShield(damage: number): number {
        if (this._shieldValue > -damage) {
            this._shieldValue += damage;
            return damage;
        }

        this._target.removeBuff(this);
        this.onEnd(this._target.getBuffList());
        return -this._shieldValue;
    }

}

