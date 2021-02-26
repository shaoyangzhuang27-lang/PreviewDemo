import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HeroAnimationEvent')
export class HeroAnimationEvent extends Component {

    private _attackEventCallBack: Function | null = null
    private _skillEventCallBack: Function | null = null

    public setAttackEventCallBack(attackEventCallBack: Function) {
        this._attackEventCallBack = attackEventCallBack
    }

    public setSkillEventCallBack(skillEventCallBack: Function) {
        this._skillEventCallBack = skillEventCallBack
    }

    public onAttack(): void {
        if(this._attackEventCallBack) {
            this._attackEventCallBack();
        }
    }

    public onSkill(): void {
        if(this._skillEventCallBack) {
            this._skillEventCallBack();
        }
    }
}
