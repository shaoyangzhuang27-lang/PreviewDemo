/*
 * @Author: zsy
 * @Date: 2021-03-18 17:51:30
 * @LastEditTime: 2021-03-23 17:07:54
 * @LastEditors: Please set LastEditors
 * @Description: 锻造屋 弹窗
 * @FilePath: \PreviewDemo\assets\scripts\game\view\pop\PopForge.ts
 */

import { _decorator, Component, Node, ToggleContainer, EventHandler, Toggle, ProgressBar, Label, Event, instantiate, resources, Vec3, Sprite, UITransform, size, SpriteFrame, Layers } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { MsgMgr } from '../../control/MsgMgr';
import { NotifyMgr } from '../../control/NotifyMgr';
import { PopMgr } from '../../control/PopMgr';
import { XConsts } from '../../model/const/XConsts';
import { XFuns } from '../../model/const/XFuns';
import { GameModel } from '../../model/GameModel';
import { ElementEquipProp, EquipPropType } from '../common/ElementEquipProp';
import { PopQuickCompose } from './PopQuickCompose';
const { ccclass, property } = _decorator;

@ccclass('PopForge')
export class PopForge extends PopBase {
    // [1]
    // dummy = '';
    // 当前页签
    curPage: number = 1
    // 页签节点名称与具体装备类型映射
    togName2EquipType: Map<string, number> = new Map<string, number>(); // 不能用Msg来声明，编辑器无法识别
    // 当前选择的装备数据
    selectEquipData: any = null;
    // 当前页的装备列表
    curPageEquipData: any = [];
    // 合成数量
    composeCount: number = 0;

    // [2]
    // @property
    // serializableDummy = 0;

    // 标签页
    @property({ type: ToggleContainer, displayName : "锻造选择" })
    public forgeGroup: ToggleContainer | null = null;

    @property({ type: ProgressBar, displayName: "进度条" })
    public proCount: ProgressBar = null as unknown as ProgressBar;
    // 按钮
    @property({ type: Node, displayName: "合成" })
    public btnCompose: Node = null as unknown as Node;

    @property({ type: Node, displayName: "一键合成" })
    public btnQCompose: Node = null as unknown as Node;

    @property({ type: Node, displayName: "减" })
    public btnSub: Node = null as unknown as Node;

    @property({ type: Node, displayName: "加" })
    public btnAdd: Node = null as unknown as Node;
    // 文本显示
    @property({ type: Label, displayName: "现有金币" })
    public labMoney: Label = null as unknown as Label;

    @property({ type: Label, displayName: "消耗金币" })
    public labCostMoney: Label = null as unknown as Label;

    @property({ type: Label, displayName: "合成数量" })
    public labComposeCount: Label = null as unknown as Label;

    @property({ type: Label, displayName: "材料数量" })
    public labCostCount: Label = null as unknown as Label;

    // layout 除了itemcell不放其他东西
    @property({ type: Node, displayName: "装备表"  })
    public layoutEquip: Node = null as unknown as Node;

    @property({ type: Node, displayName: "选中装备" })
    public nodeSelect: Node = null as unknown as Node;

    @property({ type: Node, displayName: "合成材料" })
    public nodeForward: Node = null as unknown as Node;
    
    start () {
        super.start()
        // [3]
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PopForge';// 这个是代码文件名
        containerEventHandler.handler = '_tabClick';
        containerEventHandler.customEventData = '';
        this.forgeGroup?.checkEvents.push(containerEventHandler);

        this.btnCompose.on(Node.EventType.TOUCH_END, this._clickCompose, this)
        this.btnQCompose.on(Node.EventType.TOUCH_END, this._clickQCompose, this)
        this.btnSub.on(Node.EventType.TOUCH_END, this._clickSubCount, this)
        this.btnAdd.on(Node.EventType.TOUCH_END, this._clickAddCount, this)

        // 类型和控件名称绑定
        this.togName2EquipType.set("tog1", Msg.TEquipLocationType.EEquipLocationType_Weapon)
        this.togName2EquipType.set("tog2", Msg.TEquipLocationType.EEquipLocationType_Head)
        this.togName2EquipType.set("tog3", Msg.TEquipLocationType.EEquipLocationType_Chest)
        this.togName2EquipType.set("tog4", Msg.TEquipLocationType.EEquipLocationType_Trinket)

        this.proCount.progress = 0.5;

        // 现有金币
        let playerInfo = GameModel.getInstance().getPlayerModel().getPlayerInfo()
        this.labMoney.string = XFuns.FormatNumber(playerInfo.money)

        this.labComposeCount.string = "0"
        this._initConfigEquipView()

        // 关注装备合成事件
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_equip_compose_suc, this._equipComposeSuc, this);
    }

    onDestroy() {
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_equip_compose_suc, this._equipComposeSuc, this)
    }

    _equipComposeSuc(data : any){
        // 刷新一下界面
        this._initConfigEquipView(this.curPage)
    }

    /**
     * @description: 
     * @param {Msg} locationType
     * @return {*}
     */    
    _initConfigEquipView(locationType?: Msg.TEquipLocationType){
        // 清空容器
        let childrens = this.layoutEquip.children
        childrens.forEach(element => {
            element?.destroy()
        });

        // 当前选中类型
        locationType = locationType == undefined ? Msg.TEquipLocationType.EEquipLocationType_Weapon : locationType
        this.curPage = locationType
        // 获取装备数据
        let forgeModel = GameModel.getInstance().getForgeModel()
        let list = forgeModel.getConfigEquipsByPos(locationType, false)
        this.curPageEquipData = forgeModel.sortEquipList(list)
        // 切换页签后默认第一个为选择
        this.selectEquipData = list[0]

        resources.load('prefabs_ui/common/element_equipprop', (err: any, res: any) => {
            this.curPageEquipData.forEach((element: Config.equip.Record) => {
                let itemEquipCell = instantiate(res) as Node;
                itemEquipCell.parent = this.layoutEquip
                itemEquipCell.name = "equipCell" + element.id
                // 设置装备点击回调
                let script = itemEquipCell.getComponent("ElementEquipProp") as ElementEquipProp;
                script.setItemType(element.id, 0, EquipPropType.equip, 
                    (id:number, itemType:number, obType:number)=>{
                        console.log("点击装备回调，设置选中装备")
                        if (this.selectEquipData.id != id){
                            this._initSelectEquip(id)
                        }
                });
            })
            this._initSelectEquip(list[0].id)
            this._createComposeTagForCell()
        })
    }

    /**
     * @description: 
     * @param {number} equipId
     * @return {*}
     */    
    _initSelectEquip(equipId?: number) {
        this.nodeSelect.children.forEach(element => {
            element?.destroy()
        });
        this.nodeForward.children.forEach(element => {
            element?.destroy()
        });

        // 如果没有传值则默认选中第一个
        equipId = equipId == undefined ? this.selectEquipData.id : equipId
        if(equipId == undefined){
            return
        }

        let forgeModel = GameModel.getInstance().getForgeModel()
        let equipData = forgeModel.getConfigEquipDataById(equipId)
        let forwardData = forgeModel.getConfigEquipDataById(equipData.forwardId)
        // 记录当前选中数据
        this.selectEquipData = equipData
        // 绘制装备图标
        resources.load('prefabs_ui/common/element_equipprop', (err: any, res: any) => {
            // 绘制选中图标
            let equipSelect = instantiate(res) as Node;
            equipSelect.parent = this.nodeSelect
            this.nodeSelect.scale = new Vec3(1.2, 1.2, 1)
            let script = equipSelect.getComponent("ElementEquipProp") as ElementEquipProp;
            script.setItemType(equipData.id, 0, EquipPropType.equip, 
                (id: number, itemType: number, obType: number) => {
                    console.log("点击装备回调,弹出装备详情界面")
            });

            // 绘制对应材料图标
            let equipForward = instantiate(res) as Node;
            equipForward.parent = this.nodeForward
            let scriptForward = equipForward.getComponent("ElementEquipProp") as ElementEquipProp;
            scriptForward.setItemType(forwardData.id, 0, EquipPropType.equip, 
                (id: number, itemType: number, obType: number) => {
                console.log("点击装备回调，弹出装备详情界面")
            });
        })

        // 设置装备选中状态
        this._setSelectForEquipCell(equipId)
        // 材料数量进度
        let forwardCount = forgeModel.getBagEquipCount(forwardData.id)
        this.labCostCount.string = forwardCount + "/" + XConsts.KEquipComposeMaterialNum
        this.proCount.progress = Math.min(forwardCount / XConsts.KEquipComposeMaterialNum, 1)
        // 合成金币
        this.composeCount = forgeModel.canCompose(equipId)
        this.labCostMoney.string = XFuns.FormatNumber(this.composeCount * equipData.composeMoney)
        // 初始合成数量
        this.labComposeCount.string = this.composeCount.toString()
    }

    // 创建选中图片
    _setSelectForEquipCell(equipId : number){
        let cell = this.layoutEquip.getChildByName("equipCell" + equipId)
        if(!cell){
            console.log("找不到对应的装备cell，无法设置选中状态")
            return
        }
        // 清除其他节点上的选中状态
        let childrens = this.layoutEquip.children
        childrens.forEach(element => {
            let selectNode = element.getChildByName("cellSelect")
            selectNode?.destroy()
        });

        // 绘制选中图片
        let iconPath = "ui/common/team/阵型调整_出战英雄选中/spriteFrame"
        resources.load(iconPath, (err, spriteFrame: SpriteFrame) => {
            if (cell && cell.activeInHierarchy){
                let node = new Node("cellSelect")
                node.parent = cell
                node.layer = Layers.Enum.UI_2D

                let composeNode = cell.getChildByName("cellCompose")
                if (composeNode) {
                    composeNode.setSiblingIndex(node.getSiblingIndex() + 1)
                }
                // 图片
                let sprite = node.addComponent(Sprite);
                sprite.spriteFrame = spriteFrame;
                // 设置icon显示大小
                let uitrans = sprite.addComponent(UITransform) as UITransform;
                uitrans.contentSize = size(110, 110)
            }
        });     
    }

    // 创建可合成标志
    _createComposeTagForCell(){
        // 绘制选中图片
        let iconPath = "ui/common/提醒叹号/spriteFrame"
        resources.load(iconPath, (err, spriteFrame: SpriteFrame) => {
            this.curPageEquipData.forEach((element: Config.equip.Record) => {
                let maxCount = GameModel.getInstance().getForgeModel().canCompose(element.id)
                let cell = this.layoutEquip.getChildByName("equipCell" + element.id)
                if (cell && cell.activeInHierarchy && maxCount > 0) {
                    let node = new Node("cellCompose")
                    node.parent = cell
                    node.layer = Layers.Enum.UI_2D
                    node.position = new Vec3(40, 40, 0)
                    let sprite = node.addComponent(Sprite);
                    sprite.spriteFrame = spriteFrame;
                }
            });
        });
    }

    _tabClick(event: Event, customEventData: string){
        let tog: Toggle = (event as any);
        console.log("tab 点击事件 ：", tog.node.name)
        
        let clickEquipType = this.togName2EquipType.get(tog.node.name)
        if (this.curPage == clickEquipType) {
            console.log("已经在当前页签")
            return
        }
        this._initConfigEquipView(clickEquipType)
        this._initSelectEquip()
    }

    _clickCompose(event : Event){
        console.log("_clickCompose 点击事件")
        if(this.composeCount < 0){
            return
        }
        MsgMgr.getInstance().getMsgForge().requestComposeEquipR(this.selectEquipData.id, this.composeCount);
    }

    _clickQCompose(event :Event){
        console.log("_clickQCompose 点击事件")
        let forgeModel = GameModel.getInstance().getForgeModel()
        let ret: { composeMap: Map<number, number>, composeCost : number} = forgeModel.getQuickComposeEquips(this.curPage)
        if (ret.composeMap.size == 0){
            console.log("没有可以快捷合成的装备")
            return
        }
        resources.load('prefabs_ui/pop/pop_quick_compose', (err: any, res: any) => {
            let p = instantiate(res);
            let script = p.getComponent("PopQuickCompose") as PopQuickCompose
            script.popSelf()
            script.setIsMaskClose(true);
            script.initComposeEquipView(ret.composeMap, ret.composeCost, this.curPage)
        });
    }

    _clickSubCount(event: Event){
        console.log("_clickSubCount 点击事件")
        this.composeCount = Math.max(this.composeCount - 1, 0)

        this.labCostMoney.string = XFuns.FormatNumber(this.composeCount * this.selectEquipData.composeMoney)
        this.labComposeCount.string = this.composeCount.toString()
    }

    _clickAddCount(event : Event){
        console.log("_clickAddCount 点击事件")
        let maxCount = GameModel.getInstance().getForgeModel().canCompose(this.selectEquipData.id)
        this.composeCount = Math.min(this.composeCount + 1, maxCount)

        this.labCostMoney.string = XFuns.FormatNumber(this.composeCount * this.selectEquipData.composeMoney)
        this.labComposeCount.string = this.composeCount.toString()
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
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
