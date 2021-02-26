import { _decorator, Component, Node, instantiate, Prefab, Vec3, Camera, ProgressBar, Color } from 'cc';
const { ccclass, property } = _decorator;

import { FlyWords } from "./FlyWords";


@ccclass('BattleTitleBar')
export class BattleTitleBar extends Component {
    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;


    private _hpBar: ProgressBar = null;
    private _powBar: ProgressBar = null;

    private _titleBar: any = null;
    private _targetPos = new Vec3();

    private _camera: any = null;
    // private _canvas: any = null;

    @property(Prefab)
    private TitleBarPrefab: Prefab = null;

    @property(Prefab)
    private FlyWordPrefab: Prefab = null;

    // start () {
    //     // Your initialization goes here.
    // }

    //slow-update. fps = 10 TODO 需要优化
    // update(dt: number) {
    //     if (!this._titleBar && !this._titleBar.active) {
    //         return;
    //     }

    //     // let now = Date.now();
    //     // if (now - this._lastUpdateTime < 100) {
    //     //     return;
    //     // }

    //     this.node.getWorldPosition(this._targetPos);
    //     //this._targetPos.y += this._offsetY;
    //     this._camera.convertToUINode(this._targetPos, this._titleBar.parent, this._targetPos);
    //     this._titleBar.setPosition(this._targetPos);

    // }

    lateUpdate(): void {
        if (!this._titleBar || !this._titleBar.active) {
            return;
        }

        // let now = Date.now();
        // if (now - this._lastUpdateTime < 100) {
        //     return;
        // }

        this.node.getWorldPosition(this._targetPos);
        //this._targetPos.y += this._offsetY;
        this._camera.convertToUINode(this._targetPos, this._titleBar.parent, this._targetPos);
        this._titleBar.setPosition(this._targetPos);
    }

    createTitleBar(camera: Camera, canvas: Node, isGreen: boolean): void {
        this._camera = camera.getComponent(Camera);
        // this._canvas = canvas;
        this._titleBar = instantiate(this.TitleBarPrefab);

        let hpBarList = this._titleBar.getChildByName("hp").getComponents(ProgressBar);
        for (let hpBar of hpBarList) {
            let spNode: any = hpBar.barSprite?.node
            if(spNode.name == "greenBar" && isGreen) {
                this._hpBar = hpBar;
            } else if (spNode.name == "redBar" && !isGreen) {
                this._hpBar = hpBar;
            } else {
                hpBar.destroy();
                spNode.destroy();
            }
        }

        this._powBar = this._titleBar.getChildByName("pow").getComponent(ProgressBar);
        canvas.addChild(this._titleBar);
    }

    removeTitleBar(): void {
        if (this._titleBar) {
            this._titleBar.destroy();
            this._titleBar = null;
        }
    }

    setHpPercent(percent: number): void {
        if (this._hpBar) {
            this._hpBar.progress = percent;
        }
    }

    setPowPercent(percent: number): void {
        if (this._powBar) {
            this._powBar.progress = percent;
        }
    }

    flyWords(v: number): void {
        if(!this.FlyWordPrefab) {
            return;
        }
        let wordsLabel = instantiate(this.FlyWordPrefab);

        let color = Color.RED;
        let str = v.toString();
        if (v > 0) {
            str = "+" + str;
            color = Color.GREEN;
        }
        this._titleBar.getChildByName("flyWordNode").addChild(wordsLabel);
        (wordsLabel.getComponent("FlyWords") as FlyWords).startFly(str, color);    
    }


    setVisible(b: boolean): void {
        if (this._titleBar) {
            this._titleBar.active = b;
            if (b) {
                this.lateUpdate();
            } else {
                this._titleBar.getChildByName("flyWordNode").removeAllChildren();
            }
        }
    }

}
