
import { _decorator, Component, CCFloat, Enum } from 'cc';
const { ccclass, property } = _decorator;

import { HeroPot } from "../core/base/HeroBase";
import { BattleHero } from './BattleHero';

enum BattleEffectType {
    Immediately, // 立即
    Fly, // 飞行
}

Enum(BattleEffectType);

@ccclass('BattleEffect')
export class BattleEffect extends Component {
    
    @property({type: HeroPot, displayName: "类型", tooltip: "Immediately:立即, Fly:飞行"})
    public effectType: BattleEffectType = BattleEffectType.Immediately;

    @property({type: HeroPot, displayName: "特效播放点", tooltip: "Base:原点, MainWeapon:主武器, Chest:胸骨, SubWeapon:副武器, Center:中心点, Hp:中心点"})
    public playPot: HeroPot = HeroPot.Center;

    @property({type: CCFloat, displayName: "自动销毁时间", tooltip: "配置0不会自动销毁"})
    public playTime: number = 5

    private _tmpTime: number = 0;

    update (dt: number) {
        if (this.playTime == 0) {
            return;
        }
        this._tmpTime += dt;
        if (this._tmpTime > this.playTime) {
            this.node.destroy();
        }
    }

    destroySelf(): void {
        this.node.destroy();
    }

    initFly(): void {

    }
}

