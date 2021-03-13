import { _decorator, Component, Node, instantiate, Prefab, Vec3, Camera, ProgressBar, Color, math } from 'cc';
const { ccclass, property } = _decorator;

import { FlyWords } from "./FlyWords";

export enum DamageType {
    None, // None,
    Miss, // 未命中,
    Hit, // 被普攻没暴击掉血_还没阵营克制,
    HitByCrt, // 被普攻暴击掉血_还没阵营克制,
    HitByCamp, // 被普攻没暴击掉血_有阵营克制,
    HitByCrtAndCamp, // 被普攻暴击掉血_有阵营克制,
    Skill, // 被技能没暴击掉血_还没阵营克制,
    SkillByCrt, // 被技能暴击掉血_还没阵营克制,
    SkillByCamp, // 被技能没暴击掉血_有阵营克制,
    SkillByCrtAndCamp, // 被技能暴击掉血_有阵营克制,
    Heal, // 没暴击奶,
    HealByCrt, // 暴击奶,
    AddPow, // 能量加,
    SubPow, // 能量减,
    ShieldAbsorption, // 盾吸收伤害,
    Immunity, // 免疫,
}


@ccclass('BattleTitleBar')
export class BattleTitleBar extends Component {
    @property(Prefab)
    private BattleUiTitlePrefab: Prefab = null as unknown as Prefab;

    @property(Prefab)
    private FlyWordsPrefab: Prefab = null as unknown as Prefab;

    private _hpBarComponent: ProgressBar = null as unknown as ProgressBar;
    private _powBarComponent: ProgressBar = null as unknown as ProgressBar;

    private _battleUiTitleNode: Node | null = null;
    private _fly_words_node: Node | null = null;

    private _targetPos = new Vec3();

    private _camera: any = null;

    private _flayWordStartX: number = -15;

    // start () {
    //     // Your initialization goes here.
    // }

    //slow-update. fps = 10 TODO 需要优化
    // update(dt: number) {
    //     if (!this._battleUiTitleNode && !this._battleUiTitleNode.active) {
    //         return;
    //     }

    //     // let now = Date.now();
    //     // if (now - this._lastUpdateTime < 100) {
    //     //     return;
    //     // }

    //     this.node.getWorldPosition(this._targetPos);
    //     //this._targetPos.y += this._offsetY;
    //     this._camera.convertToUINode(this._targetPos, this._battleUiTitleNode.parent, this._targetPos);
    //     this._battleUiTitleNode.setPosition(this._targetPos);

    // }

    lateUpdate(): void {
        if (!this._battleUiTitleNode || !this._battleUiTitleNode.active) {
            return;
        }

        // let now = Date.now();
        // if (now - this._lastUpdateTime < 100) {
        //     return;
        // }

        this.node.getWorldPosition(this._targetPos);
        //this._targetPos.y += this._offsetY;
        this._camera.convertToUINode(this._targetPos, this._battleUiTitleNode.parent, this._targetPos);
        this._battleUiTitleNode.setPosition(this._targetPos);
    }

    createTitleBar(camera: Camera, parentNode: Node, isGreen: boolean): void {
        this._camera = camera.getComponent(Camera);
        this._battleUiTitleNode = instantiate(this.BattleUiTitlePrefab);

        let hpBarList = this._battleUiTitleNode.getChildByName("hp")?.getComponents(ProgressBar) as [ProgressBar];
        for (let hpBar of hpBarList) {
            let spNode: any = hpBar.barSprite?.node
            if(spNode.name == "green_bar" && isGreen) {
                this._hpBarComponent = hpBar;
            } else if (spNode.name == "red_bar" && !isGreen) {
                this._hpBarComponent = hpBar;
            } else {
                hpBar.destroy();
                spNode.destroy();
            }
        }

        this._powBarComponent = this._battleUiTitleNode.getChildByName("pow")?.getComponent(ProgressBar) as ProgressBar;
        this._fly_words_node = this._battleUiTitleNode.getChildByName("fly_words_node");
        parentNode.addChild(this._battleUiTitleNode);
    }

    removeTitleBar(): void {
        if (this._battleUiTitleNode) {
            this._battleUiTitleNode.destroy();
            this._battleUiTitleNode = null;
            this._fly_words_node = null;
        }
    }

    setHpPercent(percent: number): void {
        if (this._hpBarComponent) {
            this._hpBarComponent.progress = percent;
        }
    }

    setPowPercent(percent: number): void {
        if (this._powBarComponent) {
            this._powBarComponent.progress = percent;
        }
    }

    flyWords(v: number, damageType: DamageType): void {
        if(!this.FlyWordsPrefab) {
            return;
        }
        let wordsLabel = instantiate(this.FlyWordsPrefab);

        let color = Color.RED;
        let str = v.toString();
        if (v > 0) {
            str = "+" + str;
        }
        switch (damageType) {
            case DamageType.Miss: // 未命中
                break;
            case DamageType.Hit: // 被普攻没暴击掉血_还没阵营克制
                color = Color.RED;
                str = "普" + str;
                break;
            case DamageType.HitByCrt: // 被普攻暴击掉血_还没阵营克制
                break;
            case DamageType.HitByCamp: // 被普攻没暴击掉血_有阵营克制
                break;
            case DamageType.HitByCrtAndCamp: // 被普攻暴击掉血_有阵营克制
                break;
            case DamageType.Skill: // 被技能没暴击掉血_还没阵营克制
                color = Color.CYAN;
                str = "技" + str;
                break;
            case DamageType.SkillByCrt: // 被技能暴击掉血_还没阵营克制
                break;
            case DamageType.SkillByCamp: // 被技能没暴击掉血_有阵营克制
                break;
            case DamageType.SkillByCrtAndCamp: // 被技能暴击掉血_有阵营克制
                break;
            case DamageType.Heal: // 没暴击奶
                color = Color.GREEN;
                str = "血+" + str;
                break;
            case DamageType.HealByCrt: // 暴击奶
                break;
            case DamageType.AddPow: // 能量加
                break;
            case DamageType.SubPow: // 能量减
                break;
            case DamageType.ShieldAbsorption: // 盾吸收伤害
                color = Color.BLUE;
                str = "盾" + str;
                break;
            case DamageType.Immunity: // 免疫
            default:
                break;
        }   
 
        this._fly_words_node?.addChild(wordsLabel);
        (wordsLabel.getComponent("FlyWords") as FlyWords).startFly(str, color, this._flayWordStartX);
        this._flayWordStartX = -this._flayWordStartX;
    }


    setVisible(bVisible: boolean): void {
        if (this._battleUiTitleNode) {
            this._battleUiTitleNode.active = bVisible;
            if (bVisible) {
                this.lateUpdate();
            } else {
                this._fly_words_node?.removeAllChildren();
            }
        }
    }

}
