//使用道具返回
import { _decorator, Component, Node, Label, resources, instantiate } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { PopMgr } from '../../control/PopMgr';
import { XFuns } from '../../model/const/XFuns';
import { TableName, ValueMgr } from '../../model/ValueMgr';
const { ccclass, property } = _decorator;
import { EquipPropType,ElementEquipProp } from '../common/ElementEquipProp';

@ccclass('PopItemReward')
export class PopItemReward extends PopBase {
    @property({type :  Node})
    public btnSure:Node = null as unknown as Node;

    @property({type :  Node})
    public iconCell:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_Count:Label = null as unknown as Label;

    private _itemData:Config.item_usable.Record = null as unknown as Config.item_usable.Record;
    private _count:number = 0;

    start () {
        this.btnSure.on(Node.EventType.TOUCH_END,this.delSelf,this);
    }

    public setItemInfo(itemID:number,num:number)
    {
        this._count = num;
        this._itemData = ValueMgr.getInstance().getItemByField(TableName.item_usable,itemID) as Config.item_usable.Record;
        this._initView()
    }

    private _initView()
    {
        this.lab_Count.string = "x" +  XFuns.FormatNumber(this._count).toString();
        resources.load('prefabs_ui/common/element_equipprop', (err:any,res:any)=>{
            let itemEquipCell = instantiate(res) as Node;
            this.iconCell.addChild(itemEquipCell);
            let script = itemEquipCell.getComponent("ElementEquipProp") as ElementEquipProp;
            script.setItemType(this._itemData.id, 0, EquipPropType.goods, (id:number,num:number,objType:number)=>{
                this._itemEqipCallBack(id,num,objType)
            });
        })
    }

    private _itemEqipCallBack(itemID:number,itemType:number,objType:number = 0)
    {
        if(itemType == EquipPropType.goods)
        {
            // PopMgr.getInstance().popItemRewardView(itemID,1212542001);
            PopMgr.getInstance().popItemUseSellView(itemID,objType);
        }
        else{
            PopMgr.getInstance().popEquipInfoView(itemID);            
        }
        
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
