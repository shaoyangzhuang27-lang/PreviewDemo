
import { _decorator, Node } from 'cc';
const { ccclass, property } = _decorator;

import { HeroPot } from "../core/base/HeroBase";
import { BattleEffect } from './BattleEffect';

@ccclass('BattleFlyEffect')
export class BattleFlyEffect extends BattleEffect {
 
    private _target: Node | null = null;
    update(dt: number) {
        
        super.update(dt);
    }


    isDelay(): boolean {
        return true;
    }
}

