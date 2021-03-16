
import { _decorator, Component, Node } from 'cc';
import { BattleEffect } from './BattleEffect';
import { BattleHero } from './BattleHero';

export class BattleDelayDamage {

    private _battleEffect: BattleEffect | null = null;
    private _battleEffectNode: Node | null = null;
    private _damageFunc: Function | null = null;

    private _target: BattleHero | null = null;

    constructor(battleEffect: BattleEffect, attack: BattleHero, target: BattleHero, damageFunc: Function) {
        this._battleEffect = battleEffect;
        this._battleEffectNode = battleEffect.node;
        this._target = target;
        // TODO 只有Fly类型
        this._damageFunc = damageFunc;
        this._battleEffect.initFly(attack.getHeroBase(), target.getHeroBase(), ()=>{
            this.onEnd();
        })

    }

    onEnd(): void {
        if (this._damageFunc) {
            this._damageFunc(this._target);
        }

        this._battleEffectNode = null;
    }

    onClear(): void {
        if (this._battleEffectNode) {
            (this._battleEffectNode.getComponent("BattleEffect") as BattleEffect).destroySelf();
            this._battleEffectNode = null;
        }
    }
}