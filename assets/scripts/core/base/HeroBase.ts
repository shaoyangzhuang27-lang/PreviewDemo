
import { _decorator, Component, SkeletalAnimation, Node, BoxCollider, RigidBody } from 'cc';
const { ccclass, property } = _decorator;

import { HeroAnimationEvent } from "./HeroAnimationEvent";

const AnimStatus = {
    IDLE: "idle",
    RUN: "run",
    ATTACK: "attack",
    SKILL: "skill",
    VICTORY: "victroy",
    DIE: "die",
} 

@ccclass('HeroBase')
export class HeroBase extends Component {

    // public static STATUS = AnimStatus

    private _status: string = ""
    private _bodyNode: Node = null
    private _skeletalAnimation: SkeletalAnimation = null

    onLoad() {

        this._bodyNode = this.node.getChildByName("body");
        this._skeletalAnimation = this._bodyNode.getComponent(SkeletalAnimation);
        this.node.getComponent(BoxCollider).enabled = false;
        this.node.getComponent(RigidBody).enabled = false;
        // this.node.getComponent(RigidBody).clearState();

        this.playIdle();
        this.stopAnim();
    }

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    setAttackEventCallBack(attackEventCallBack: Function) {
        (this._bodyNode.getComponent("HeroAnimationEvent") as HeroAnimationEvent).setAttackEventCallBack(attackEventCallBack);
    }

    isStatus(status: string) {
        return this._status == status;
    }

    isDie() {
        return this._status == AnimStatus.DIE;
    }

    isAttack() {
        return this._status == AnimStatus.ATTACK;
    }

    getSkeletalAnimation(): SkeletalAnimation {
        return this._skeletalAnimation;
    }

    playIdle(): void {
        this.playAnim(AnimStatus.IDLE);
    }

    playRun(): void {
        this.playAnim(AnimStatus.RUN);
    }

    playAttack(): void {
        this.playAnim(AnimStatus.ATTACK);
    }

    playSkill(): void {
        this.playAnim(AnimStatus.SKILL);
    }

    playVictory(): void {
        this.playAnim(AnimStatus.VICTORY);
    }

    playDie(): void {
        this.playAnim(AnimStatus.DIE);
    }

    playAnim(status: string): void {
        if (this._status == status) {
            return;
        }

        this._status = status;
        this._skeletalAnimation.play(status);
    }

    stopAnim(): void {
        this._skeletalAnimation.stop();
    }
}
