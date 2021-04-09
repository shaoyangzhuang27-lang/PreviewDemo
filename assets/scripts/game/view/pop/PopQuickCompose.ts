/*
 * @Author: zsy
 * @Date: 2021-03-18 17:51:30
 * @LastEditTime: 2021-03-23 17:09:44
 * @LastEditors: Please set LastEditors
 * @Description: 锻造屋 一键合成
 * @FilePath: \PreviewDemo\assets\scripts\game\view\pop\PopQuickCompose.ts
 */

import { _decorator, Component, Node,  Label, Event, instantiate, resources} from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { MsgMgr } from '../../control/MsgMgr';
import { XConsts } from '../../model/const/XConsts';
import { XFuns } from '../../model/const/XFuns';
import { GameModel } from '../../model/GameModel';
import { ElementEquipProp, EquipPropType } from '../common/ElementEquipProp';
const { ccclass, property } = _decorator;

@ccclass('PopQuickCompose')
export class PopQuickCompose extends PopBase {
    // [1]
    // dummy = '';
    curType: number = 0
    // [2]
    // @property
    // serializableDummy = 0;

    // 合成金币
    @property({ type: Label, displayName: "合成消耗" })
    public labCost: Label = null as unknown as Label;

    // layout 除了itemcell不放其他东西
    @property({ type: Node, displayName: "装备表"  })
    public layoutEquip: Node = null as unknown as Node;

    // @property({ type: Node, displayName: "取消" })
    // public btnCancel: Node = null as unknown as Node;

    @property({ type: Node, displayName: "合成" })
    public btnQCompose: Node = null as unknown as Node;
    
    start () {
        super.start()
        this.btnQCompose.on(Node.EventType.TOUCH_END, this._clickQCompose, this)
        // this.btnCancel.on(Node.EventType.TOUCH_END, this._clickCancel, this)
        // 消耗金币
        // this.labCost.string = XFuns.FormatNumber(10000)
    }

    /**
     * @description: 
     * @param {Msg} composeMap 合成装备数据<composeId, composeCount>
     * @param {Msg} composeCost 花费的金币
     * @return {*}
     */   
    initComposeEquipView(composeMap:Map<number, number>, composeCost: number, curType: Msg.TEquipLocationType){
        // 清空容器
        let childrens = this.layoutEquip.children
        childrens.forEach(element => {
            element?.destroy()
        });

        resources.load('prefabs_ui/main/itemequip_cell', (err: any, res: any) => {
            for (let [id, count] of composeMap){
                let itemEquipCell = instantiate(res) as Node;
                itemEquipCell.parent = this.layoutEquip
                itemEquipCell.name = "equipCell" + id
                // 设置装备点击回调
                let script = itemEquipCell.getComponent("ItemEquipCell") as ItemEquipCell;
                script.setItemType(id, count, ItemEquipType.equip,
                    (id: number, itemType: number, obType: number) => {
                        console.log("点击装备回调，设置选中装备")
                    });
            }
        })
        this.labCost.string = XFuns.FormatNumber(composeCost)
        this.curType = curType
    }

    // _clickCancel(event: Event){
    //     console.log("_clickCancel 点击事件 取消")
    // }

    _clickQCompose(event : Event){
        console.log("_clickQCompose 点击事件 合成")
        MsgMgr.getInstance().getMsgForge().requestComposeEquipMultiR(this.curType);
        this.delSelf()
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
