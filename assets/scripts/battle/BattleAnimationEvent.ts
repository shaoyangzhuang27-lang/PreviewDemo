

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BattleAnimationEvent')
export class BattleAnimationEvent extends Component {


    public onAttack(): void {
        console.log("111111111111111111111111111")
    }
}
