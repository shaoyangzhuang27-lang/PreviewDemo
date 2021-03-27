import { _decorator, Component, Node, instantiate, Prefab, Vec3, Camera, ProgressBar, Color, math, Label } from 'cc';
const { ccclass, property } = _decorator;

import { DamageTypeShowConfig, FlyWords } from "./FlyWords";

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

// 伤害DamageType显示配置
// 伤害类型对应的图标和颜色
export class DTShowInfo{
    public static DTConfig: Map<DamageType, DamageTypeShowConfig> = new Map<DamageType, DamageTypeShowConfig>();
    // 伤害显示对应信息
    public static getDamageShowInfo(damageType: DamageType): DamageTypeShowConfig {
        if(this.DTConfig.size > 0){
            return this.DTConfig.get(damageType) as DamageTypeShowConfig
        }
        // 未命中 图片资源暂缺
        this.DTConfig.set(DamageType.Miss, {icoPaths:[""]})
        // 被普攻没暴击掉血_还没阵营克制,
        this.DTConfig.set(DamageType.Hit, {labColor : Color.WHITE})
        // 被普攻暴击掉血_还没阵营克制
        this.DTConfig.set(DamageType.HitByCrt, { labColor: Color.WHITE, icoPaths: ["battle/ui/暴击图标/spriteFrame"] })
        // 被普攻没暴击掉血_有阵营克制,
        this.DTConfig.set(DamageType.HitByCamp, { labColor: Color.WHITE, icoPaths: ["battle/ui/战斗-箭头/spriteFrame"] })
        // 被普攻暴击掉血_有阵营克制,
        this.DTConfig.set(DamageType.HitByCrtAndCamp, { labColor: Color.WHITE, icoPaths: ["battle/ui/战斗-箭头/spriteFrame", "battle/ui/暴击图标/spriteFrame"] })
        // 被技能没暴击掉血_还没阵营克制,
        this.DTConfig.set(DamageType.Skill, { labColor: Color.CYAN })
        // 被技能暴击掉血_还没阵营克制,
        this.DTConfig.set(DamageType.SkillByCrt, { labColor: Color.CYAN, icoPaths: ["battle/ui/暴击图标/spriteFrame"] })
        // 被技能没暴击掉血_有阵营克制,
        this.DTConfig.set(DamageType.SkillByCamp, { labColor: Color.CYAN, icoPaths: ["battle/ui/战斗-箭头/spriteFrame"] })
        // 被技能暴击掉血_有阵营克制,
        this.DTConfig.set(DamageType.SkillByCrtAndCamp, { labColor: Color.CYAN, icoPaths: ["battle/ui/战斗-箭头/spriteFrame", "battle/ui/暴击图标/spriteFrame"] })
        // 没暴击奶,
        this.DTConfig.set(DamageType.Heal, { labColor: Color.GREEN, icoPaths: ["battle/ui/加血/spriteFrame"] })
        // 暴击奶
        this.DTConfig.set(DamageType.HealByCrt, { labColor: Color.GREEN, icoPaths: ["battle/ui/加血暴击/spriteFrame"] })
        // 能量加
        this.DTConfig.set(DamageType.AddPow, { labColor: Color.YELLOW })
        // 能量减
        this.DTConfig.set(DamageType.SubPow, { labColor: Color.YELLOW })
        // 盾吸收伤害
        this.DTConfig.set(DamageType.ShieldAbsorption, { labColor: Color.BLUE })
        // 免疫
        this.DTConfig.set(DamageType.Immunity, { labColor: Color.BLUE })
        
        return this.DTConfig.get(damageType) as DamageTypeShowConfig
    }
}

// 显示伤害信息
export interface DamageTypeShowInfo {
    damage: number,
    damageType: number,
    eHeroType?: number,     // 类型相关
    heroCamp?: number       // 阵营相关 
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
    private _statusLabel: Node | null = null;

    private _targetPos = new Vec3();

    private _camera: any = null;

    private _flayWordStartX: number = -15;

    private _statusStringMap: Map<string, number> = new Map<string, number>()

    // start () {
    //     // Your initialization goes here.
    // }

    lateUpdate(): void {
        if (!this._battleUiTitleNode ||
            !this._battleUiTitleNode.active ||
            !this._battleUiTitleNode.activeInHierarchy) {
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
        this._statusLabel = this._battleUiTitleNode.getChildByName("status") as Node;

        this._statusLabel.active = false;

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

    addStatusString(str: string): void {
        if (this._statusLabel && str != "") {

            let value = this._statusStringMap.get(str);
            if (!value) {
                value = 1; 
            } else {
                value++;
            }

            this._statusStringMap.set(str, value);

            if (value == 1) {
                str = "";
                this._statusStringMap.forEach((v: number, k: string) => {
                    str = str + k + " ";
                });

                (this._statusLabel.getComponent(Label) as Label).string = str;
                this._statusLabel.active = true;
            }          
        } 
    }

    removeStatusString(str: string): void {
        if (this._statusLabel && str != "") {

            let value = this._statusStringMap.get(str);
            if (!value) {
                return; 
            } else {
                value--;
            }

            if (value == 0) {
                this._statusStringMap.delete(str);
                str = "";
                this._statusStringMap.forEach((v: number, k: string) => {
                    str = str + k + " ";
                });

                (this._statusLabel.getComponent(Label) as Label).string = str;
                if (str == "") {
                    this._statusLabel.active = false;
                }          
            } else {
                this._statusStringMap.set(str, value);
            }         
        } 
    }
    // 等具体表现出来再修改接口，暂时传value和type
    flyWords(v: number, damageType: DamageType): void {
        if(!this.FlyWordsPrefab) {
            return;
        }
        let wordsLabel = instantiate(this.FlyWordsPrefab);

        //先程序写
        let showConfig = DTShowInfo.getDamageShowInfo(damageType)
        // 根据eHeroType的类型修改飘血颜色
        // heroCamp阵营克制类型 火-木（红），木-水（绿），水-火（蓝） 修改阵营图标显示颜色

        this._fly_words_node?.addChild(wordsLabel);
        (wordsLabel.getComponent("FlyWords") as FlyWords).startFly(v, showConfig, this._flayWordStartX);
        this._flayWordStartX = -this._flayWordStartX;
    }

    setVisible(bVisible: boolean): void {
        if (this._battleUiTitleNode) {
            this._battleUiTitleNode.active = bVisible;
            if (bVisible) {
                this.lateUpdate();
            } else {
                if (this._statusLabel) {
                    this._statusLabel.active = false;
                }
                this._statusStringMap.clear();
                
                this._fly_words_node?.removeAllChildren();
            }
        }
    }

}
