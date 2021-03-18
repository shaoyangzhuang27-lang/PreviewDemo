
import { _decorator, Component, Node, ToggleContainer, EventHandler, Toggle, ProgressBar, Label, Event, instantiate, resources } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { ItemEquipCell, ItemEquipType } from '../menu/ItemEquipCell';
const { ccclass, property } = _decorator;

@ccclass('PopForge')
export class PopForge extends PopBase {
    // [1]
    // dummy = '';

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

    @property({ type: Node, displayName: "装备表"  })
    public layoutEquip: Node = null as unknown as Node;
    
    start () {
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

        this.proCount.progress = 0.5;
        this._initView()
    }

    _initView(){
        // 获取装备数据
        let list = GameModel.getInstance().getForgeModel().getConfigEquip()

        resources.load('prefabs_ui/main/itemequipcell', (err: any, res: any) => {
            let itemEquipCell = instantiate(res) as Node;
            itemEquipCell.parent = this.layoutEquip
            let script = itemEquipCell.getComponent("ItemEquipCell") as ItemEquipCell;
            // script.setItemType(this._itemID, 0, ItemEquipType.equip, null);
        })
    }

    _tabClick(event: Event, customEventData: string){
        let tog: Toggle = (event as any);
        console.log("tab 点击事件 ：", tog.node.name)
    }

    _clickCompose(event : Event){
        console.log("_clickCompose 点击事件")
    }

    _clickQCompose(event :Event){
        console.log("_clickQCompose 点击事件")
    }

    _clickSubCount(event: Event){
        console.log("_clickSubCount 点击事件")
    }

    _clickAddCount(event : Event){
        console.log("_clickAddCount 点击事件")
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
