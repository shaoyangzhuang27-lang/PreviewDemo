

import { _decorator, Component, Node } from 'cc';


import { BattleHero } from "./BattleHero";
const { ccclass, property } = _decorator;

@ccclass('BattleAnimationEvent')
export class BattleAnimationEvent extends Component {

    private _hero: BattleHero | null = null

    onLoad() {
        this._hero = this.node.getParent()?.getComponent("BattleHero") as BattleHero;
    }

    public onAttack(): void {
        if(this._hero) {
            this._hero.onAttack();
        }
    }
}
