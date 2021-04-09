/*
 * @Description: 英雄学院注意窗体消耗item
 * @Author: 徐涛
 * @Date: 2021-04-01 15:44:34
 * @LastEditTime: 2021-04-08 16:45:47
 */
import { _decorator, Component, Sprite, Label, Vec3, Color } from 'cc';
const { ccclass, property } = _decorator;
import { XFuns } from '../../../model/const/XFuns';

@ccclass('CellCollegeCost')
export class CellCollegeCost extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({ type: Sprite, displayName: "图标" })
    public img_icon: Sprite = null as unknown as Sprite;

    @property({ type: Label, displayName: "拥有" })
    public lab_has: Label = null as unknown as Label;

    @property({ type: Label, displayName: "消耗" })
    public lab_cost: Label = null as unknown as Label;

    @property({ type: Label, displayName: "花费字" })
    public lab_title: Label = null as unknown as Label;
    
    start() {
        // [3]

    }

    /**
     * @description: 设置数据
     * @param {Msg} type 物品类型
     * @param {number} nHas 拥有
     * @param {number} nCost 消耗
     */
    public setData(type: Msg.TObjectType.EObject_VRmb | Msg.TObjectType.EObject_CollegeMoney, nHas: number, nCost: number) {
        this.lab_has.color = (nHas > nCost) ? Color.GREEN : Color.RED;
        this.lab_has.string = nHas.toString();
        this.lab_cost.string = "/" + nCost.toString();

        let imgPath = "ui/common/commonIcon/符文水晶/spriteFrame";
        this.lab_title.node.active= true;
        let scale = new Vec3(0.9, 0.9, 1);
        if (type == Msg.TObjectType.EObject_VRmb) {
            imgPath = "ui/common/commonIcon/钻石/spriteFrame";
            scale = new Vec3(0.92, 0.92, 1);
            this.lab_title.node.active= false;
        }
        XFuns.ReplaceSpriteFrame(imgPath, this.img_icon, () => {
            this.img_icon.node.setScale(scale);
        });
    }
}
