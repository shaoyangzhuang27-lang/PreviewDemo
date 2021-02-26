import { _decorator, Component, Node, instantiate, Prefab, Vec3, Camera, ProgressBar, Color, TERRAIN_HEIGHT_BASE } from 'cc';
const { ccclass, property } = _decorator;

import { FlyWords } from "./FlyWords";


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

    createTitleBar(camera: Camera, canvas: Node, isGreen: boolean): void {
        this._camera = camera.getComponent(Camera);
        // this._canvas = canvas;
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
        canvas.addChild(this._battleUiTitleNode);
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

    flyWords(v: number): void {
        if(!this.FlyWordsPrefab) {
            return;
        }
        let wordsLabel = instantiate(this.FlyWordsPrefab);

        let color = Color.RED;
        let str = v.toString();
        if (v > 0) {
            str = "+" + str;
            color = Color.GREEN;
        }
        this._fly_words_node?.addChild(wordsLabel);
        (wordsLabel.getComponent("FlyWords") as FlyWords).startFly(str, color);    
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
