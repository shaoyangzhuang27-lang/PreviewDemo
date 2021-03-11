
import { _decorator, Component, SkeletalAnimation, Node, BoxCollider, RigidBody, Enum } from 'cc';
const { ccclass, property } = _decorator;

import { BattleEffect } from "../../battle/BattleEffect";
import { HeroAnimationEvent } from "./HeroAnimationEvent";

const AnimStatus = {
    STOP: "stop",
    IDLE: "idle",
    RUN: "run",
    ATTACK: "attack",
    SKILL: "skill",
    VICTORY: "victory",
    DIE: "die",
} 

export enum HeroPot {
    Base, // 原点
    MainWeapon, // 主武器
    Chest, // 胸骨
    SubWeapon, // 副武器
    Center, // 中心点
}
Enum(HeroPot);

@ccclass('HeroBase')
export class HeroBase extends Component {

    // public static STATUS = AnimStatus

    @property({type: Node, displayName: "英雄原点"})
    public heroBasePot: Node = null as unknown as Node
    @property({type: Node, displayName: "英雄主武器"})
    public heroMainWeaponPot: Node = null as unknown as Node
    @property({type: Node, displayName: "英雄胸骨"})
    public heroChestPot: Node = null as unknown as Node
    @property({type: Node, displayName: "英雄副武器"})
    public heroSubWeaponPot: Node = null as unknown as Node
    @property({type: Node, displayName: "英雄中心点"})
    public heroCenterPot: Node = null as unknown as Node

    private _status: string = ""
    private _bodyNode: Node = null as unknown as Node
    private _skeletalAnimation: SkeletalAnimation = null as unknown as SkeletalAnimation

    onLoad() {

        this._bodyNode = this.node.getChildByName("body") as Node;
        this._skeletalAnimation = this._bodyNode.getComponent(SkeletalAnimation) as SkeletalAnimation;
        (this.node.getComponent(BoxCollider) as BoxCollider).enabled = false;
        (this.node.getComponent(RigidBody) as RigidBody).enabled = false;

        if (!this.heroBasePot) {
            this.heroBasePot = this.node;
            console.warn(this.node.name + "英雄未配置原点");
        }

        if (!this.heroMainWeaponPot) {
            this.heroMainWeaponPot = this.node;
            console.warn(this.node.name + "英雄未配置主武器");
        }

        if (!this.heroChestPot) {
            this.heroChestPot = this.node;
            console.warn(this.node.name + "英雄未配置胸骨");
        }

        if (!this.heroSubWeaponPot) {
            this.heroSubWeaponPot = this.node;
            console.warn(this.node.name + "英雄未配置副武器");
        }

        if (!this.heroCenterPot) {
            this.heroCenterPot = this.node;
            console.warn(this.node.name + "英雄未配置中心点");
        }

        // this.playIdle();
        // this.stopAnim();
    }

    onDestroy() {
        if (this._skeletalAnimation) {
            this._skeletalAnimation.off(SkeletalAnimation.EventType.LASTFRAME);
        }
    }

    setAttackEventCallBack(attackEventCallBack: Function) {
        (this._bodyNode.getComponent("HeroAnimationEvent") as HeroAnimationEvent).setAttackEventCallBack(attackEventCallBack);
    }

    setSkillEventCallBack(skillEventCallBack: Function) {
        (this._bodyNode.getComponent("HeroAnimationEvent") as HeroAnimationEvent).setSkillEventCallBack(skillEventCallBack);
    }

    isStatus(status: string) {
        return this._status == status;
    }

    isInDie() {
        return this._status == AnimStatus.DIE;
    }

    isInSkill() {
        return this._status == AnimStatus.SKILL;
    }

    isInAttack() {
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

    stopAnim(): void {
        this.playAnim(AnimStatus.STOP);
    }

    playAnim(status: string): void {
        if (this._status == status) {
            return;
        }
        this._status = status;

        if (this._status == AnimStatus.STOP) {
            this._skeletalAnimation.stop();
            return;
        }

        this._skeletalAnimation.play(status);
    }

    

    playEffect(effectNode: Node): void {
        this.getPlayPot((effectNode.getComponent("BattleEffect") as BattleEffect).playPot).addChild(effectNode);
    }

    getPlayPot(playPot: HeroPot): Node {
        switch (playPot) {
            case HeroPot.Base:
                return this.heroBasePot
            case HeroPot.MainWeapon:
                return this.heroMainWeaponPot
            case HeroPot.Chest:
                return this.heroChestPot
            case HeroPot.SubWeapon:
                return this.heroSubWeaponPot
            case HeroPot.Center:
                return this.heroCenterPot   
            default:
                return this.node;
        }
    }
}
