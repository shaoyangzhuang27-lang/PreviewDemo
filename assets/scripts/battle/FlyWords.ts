/*
 * @Author: your name
 * @Date: 2021-03-01 13:54:59
 * @LastEditTime: 2021-03-30 15:25:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \PreviewDemo\assets\scripts\battle\FlyWords.ts
 */

import { _decorator, Component, Label, math, Node, Sprite, Color, resources, SpriteFrame, Layout, Layers, Asset, instantiate } from 'cc';
import { BattleResMgr } from './BattleResMgr';
const { ccclass, property } = _decorator;

// 伤害显示对应图片
export interface DamageTypeShowConfig {
    labColor?: Color,      // 飘字颜色
    labActive?: boolean,     // 是否需要数值显示
    icoPaths?: string[],   // 对应伤害图标
    icoColor?: Color[],    // 图标变色？
    extra?: any
}

@ccclass('FlyWords')
export class FlyWords extends Component {
    @property(Label)
    private labValue: Label = null as unknown as Label;

    @property(Node)
    private layDamage: Node = null as unknown as Node;

    private _actTime = 0.5;
    private _tmpScale = 0;

    startFly(v: number, showInfo: DamageTypeShowConfig, startX: number = 0): void {
        this._tmpScale = 0.3;
        // 伤害数值
        this.labValue.string = v.toString();
        // 伤害配置显示
        this._createDamageShow(showInfo)
        // 初始位置和大小
        this.node.setScale(this._tmpScale, this._tmpScale);
        this.node.setPosition(startX + Math.random() * 30 - 15, -80 + Math.random() * 20);
        // this.node.setPosition(0, -80 + Math.random() * 20);
    }

    _createDamageShow(showConfig: DamageTypeShowConfig){
        // 字体颜色
        this.labValue.color = showConfig.labColor || Color.WHITE;
        this.labValue.node.active = showConfig.labActive == false ? false: true;
        // 图标显示
        if(!showConfig.icoPaths || showConfig.icoPaths.length < 0){
            return
        }
       
        for (let index = 0; index < showConfig.icoPaths.length; index++) {
            const icoPath = showConfig.icoPaths[index];
            let spriteFrame = resources.get(icoPath, SpriteFrame)
            if (spriteFrame && this.node && this.node.activeInHierarchy){
                let node = new Node("flyWordsIco" + index)
                node.parent = this.layDamage
                node.layer = Layers.Enum.UI_2D

                let sptComponent = node.addComponent(Sprite)
                sptComponent.spriteFrame = spriteFrame;
                if (showConfig.icoColor && showConfig.icoColor[index]) {
                    sptComponent.color = showConfig.icoColor[index]
                }
            }
        }
    }
    
    update (dt: number) {
        this.node.setPosition(this.node.position.x, this.node.position.y + dt * 40);
        this._tmpScale += dt * 1.5;
        this.node.setScale(this._tmpScale, this._tmpScale);

        this._actTime -= dt;
        if (this._actTime < 0) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}
