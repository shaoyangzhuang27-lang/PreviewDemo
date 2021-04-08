
import { _decorator, Component, CCFloat, Enum, Vec3, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

import { HeroBase, HeroPot } from "../core/base/HeroBase";

enum EBattleEffectType {
    Immediately, // 立即
    Fly, // 飞行
}
Enum(EBattleEffectType);


@ccclass('BattleEffect')
export class BattleEffect extends Component {
    
    @property({type: EBattleEffectType, displayName: "类型", tooltip: "Immediately:立即, Fly:飞行"})
    public effectType: EBattleEffectType = EBattleEffectType.Immediately;

    @property({type: HeroPot, displayName: "特效播放点", tooltip: "Base:原点, MainWeapon:主武器, Chest:胸骨, SubWeapon:副武器, Center:中心点, Hp:中心点"})
    public playPot: HeroPot = HeroPot.Center;

    @property({type: CCFloat, min: 0.1, displayName: "自动销毁时间", tooltip: "如果是buff根据配置表duration销毁，飞行类型撞击时销毁"})
    public playTime: number = 5;

    @property({type: CCFloat, displayName: "飞行速度", tooltip: "当类型为Fly时的飞行速度"})
    public flySpeed: number = 8;

    @property({type: Prefab, displayName: "结束时特效", tooltip: "结束时特效"})
    public endEffectPrefab: Prefab | null =  null as unknown as Prefab;

    private _tmpTime: number = 0;

    private _actFun: Function | null = null;
    private _endFunc: Function | null = null;

    private _actTime: number = 0;
    private _dirVector: Vec3 = new Vec3();
    private _tmpPos: Vec3 = new Vec3();
    private _targetNode: Node | null = null;
    private _endTargetList: HeroBase[] = [];

    private _tmpLLTime: number = 15;

    onLoad(): void{
        if (this.effectType == EBattleEffectType.Fly) {
            this.playTime = 0;
        }
    }

    update(dt: number) {
        if (this._actFun) {
            this._actFun.call(this, dt);
        }

        this._tmpLLTime-=dt;
        if (this._tmpLLTime <= 0) {
            console.warn("BattleEffect 注意特效没有释放++++++++++++++++++++++++++++++++" + this.node.name);
            this.node.destroy();
            return;
        }


        if (this.playTime == 0) {
            return;
        }
        this._tmpTime += dt;
        if (this._tmpTime > this.playTime) {
            this.onEnd();
        }
    }

    onEnd(): void {
        if (this.endEffectPrefab && this._endTargetList.length > 0) {
            for (let i = 0; i < this._endTargetList.length; i++) {
                this._endTargetList[i].playEffect(instantiate(this.endEffectPrefab));
            }
        }

        if (this._endFunc) {
            this._endFunc(); 
        }

        this.destroySelf();
    }

    destroySelf(): void {
        this.node.removeFromParent();
        this.node.destroy();  
    }

    isImmediately(): boolean {
        return this.effectType == EBattleEffectType.Immediately;
    }

    isFly(): boolean {
        return this.effectType == EBattleEffectType.Fly;
    }

    addEndTarget(target: HeroBase): void {
        this._endTargetList.push(target);
    }

    setEndFunc(endFunc: Function): void {
        this._endFunc = endFunc;
    }

    updateFly(dt: number) {
        this._actTime -= dt;
        if (this._actTime <= 0) {
            this.node.setWorldPosition(this._tmpPos);
            
            this.onEnd();
        } else {
            this._tmpPos.x += this._dirVector.x * dt * this.flySpeed / this._dirVector.length();
            this._tmpPos.z += this._dirVector.z * dt * this.flySpeed / this._dirVector.length();
            this.node.setWorldPosition(this._tmpPos);
        }
        
    }

    initFly(attack: HeroBase, target: HeroBase, endFunc: Function): void { 
        this.setEndFunc(endFunc);
        this._targetNode = target.getPlayPot(HeroPot.Chest);
        let parent = attack.node.parent?.parent;
        
        if (parent) {      
            parent.addChild(this.node);
            this.node.setWorldPosition(attack.getPlayPot(this.playPot).getWorldPosition());
            this.refreshFlyData();

            if (this.endEffectPrefab) {
                this.addEndTarget(target);
            }

            this._actFun = this.updateFly;
        }
    }

    refreshFlyData() {
        if (this._targetNode) {
            Vec3.subtract(this._dirVector, this._targetNode.worldPosition, this.node.worldPosition);
            this.node.lookAt(this._targetNode.worldPosition);
            this._tmpPos.set(this.node.getWorldPosition());
            this._actTime = this._dirVector.length() / this.flySpeed;
        }
    }
}

