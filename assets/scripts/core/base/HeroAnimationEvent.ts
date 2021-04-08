import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HeroAnimationEvent')
export class HeroAnimationEvent extends Component {

    private _prepareAttackEventCallBack: Function | null = null
    private _attackEventCallBack: Function | null = null
    private _prepareSkillEventCallBack: Function | null = null
    private _skillEventCallBack: Function | null = null

    public setPrepareAttackEventCallBack(prepareAttackEventCallBack: Function) {
        this._prepareAttackEventCallBack = prepareAttackEventCallBack;
    }

    public setAttackEventCallBack(attackEventCallBack: Function) {
        this._attackEventCallBack = attackEventCallBack
    }

    public setPrepareSkillEventCallBack(prepareSkillEventCallBack: Function) {
        this._prepareSkillEventCallBack = prepareSkillEventCallBack;
    }

    public setSkillEventCallBack(skillEventCallBack: Function) {
        this._skillEventCallBack = skillEventCallBack;
    }

    public onPrepareAttack(): void {
        if(this._prepareAttackEventCallBack) {
            this._prepareAttackEventCallBack();
        }
    }

    public onAttack(): void {
        if(this._attackEventCallBack) {
            this._attackEventCallBack();
        }
    }

    public onPrepareSkill(): void {
        if(this._prepareSkillEventCallBack) {
            this._prepareSkillEventCallBack();
        }
    }

    public onSkill(): void {
        if(this._skillEventCallBack) {
            this._skillEventCallBack();
        }
    }
}
