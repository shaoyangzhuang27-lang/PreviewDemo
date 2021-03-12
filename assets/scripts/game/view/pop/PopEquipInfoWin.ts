
import { _decorator, Component, Node, Label, instantiate, resources, } from 'cc';
const { ccclass, property } = _decorator;
import { ItemEquipType,ItemEquipCell } from '../menu/ItemEquipCell';
import { PopBase } from '../../../core/control/PopBase';
import { MsgMgr } from '../../control/MsgMgr';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from '../../model/ValueMgr';
import { GameModel } from '../../model/GameModel';

@ccclass('PopEquipInfoWin')
export class PopEquipInfoWin extends PopBase {
    @property({type :  Node})
    public btnSell:Node = null as unknown as Node;

    @property({type :  Node})
    public iconNode:Node = null as unknown as Node;

    @property({type :  Node})
    public equipSuitNode:Node = null as unknown as Node;      //套装属性节点

    @property({type :  Node})
    public lab_tip:Node = null as unknown as Node;        //无套装属性

    @property({type :  Label})
    public lab_name:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_equipProperty:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_sell:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_suitName:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_suitCount:Label = null as unknown as Label;

    //套装属性及加成值
    @property({type :  Label})
    public lab_suitproperty_1:Label = null as unknown as Label;
    @property({type :  Label})
    public lab_suitproperty_2:Label = null as unknown as Label;
    @property({type :  Label})
    public lab_suitproperty_3:Label = null as unknown as Label;
    @property({type :  Label})
    public lab_suitproperty_1_count:Label = null as unknown as Label;
    @property({type :  Label})
    public lab_suitproperty_2_count:Label = null as unknown as Label;
    @property({type :  Label})
    public lab_suitproperty_3_count:Label = null as unknown as Label;

    private _itemID:number = -1;
    private _visit:boolean | null = false;     //参观者模式  适用于锻造厂装备弹窗
    // private _itemCount:number = 0;
    start () {
        super.start();
        this.btnSell?.on(Node.EventType.TOUCH_END, this._itemUseOrSell, this);
    }

    public setEquipItemType(id:number,isVisit:boolean | null = false)
    {
        this._itemID = id;
        this._visit = isVisit;
        this._init();
    }

    private _init()
    {
        this.equipSuitNode.active = false;
        if(this._visit)
        {
            this.btnSell.active = false;
        }

        let equipTable = ValueMgr.getInstance().getTableByName(TableName.equip)
        let equipData:Config.equip.Record = ValueMgr.getInstance().getItemByField(TableName.equip,this._itemID) as Config.equip.Record;
        let nameData = ValueMgr.getInstance().getItemByField(TableName.language_data,equipData.name) as Config.language_data.Record;
        
        //单个装备属性
        let propertyType:number = equipData.propertyType[0];
        let propertyNum:number = equipData.propertyNum[0];
        let uiLan = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.KPropertyName[propertyType]) as Config.language_ui.Record;

        let propertyStr:string = uiLan.cn + " +" + propertyNum.toString()
        this.lab_equipProperty.string = propertyStr;
        this.lab_equipProperty.color = XConsts.KColorGreen;
        if(equipData.suitId != 0)
        {
            this.lab_tip.active = false;
            this.equipSuitNode.active = true;
            let suitEquipData = ValueMgr.getInstance().getItemByField(TableName.suit,equipData.suitId) as Config.suit.Record;

        }
        

        //装备物品名称
        this.lab_name.string = nameData.cn;

        resources.load('prefabs_ui/main/itemequipcell', (err:any,res:any)=>{
            let itemEquipCell = instantiate(res) as Node;
            this.iconNode.addChild(itemEquipCell);
            let script = itemEquipCell.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemType(this._itemID, 0, ItemEquipType.equip, null);
        })
    }

    private _itemUseOrSell()
    {
        //打开装备出售界面
        // MsgMgr.getInstance().getMsgBag().requestUseItem(this._itemID,this._useCount,0);
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
