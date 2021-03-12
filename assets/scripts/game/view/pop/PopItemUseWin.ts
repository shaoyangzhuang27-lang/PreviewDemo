
import { _decorator, Component, Node, Label, instantiate, resources, EditBox, } from 'cc';
const { ccclass, property } = _decorator;
import { ItemEquipCell, ItemEquipType } from '../menu/ItemEquipCell';
import { PopBase } from '../../../core/control/PopBase';
import { MsgMgr } from '../../control/MsgMgr';
import { TableName, ValueMgr } from '../../model/ValueMgr';
import { GameModel } from '../../model/GameModel';

@ccclass('PopItemUseWin')
export class PopItemUseWin extends PopBase {
    @property({type :  Node})
    public btnSell:Node = null as unknown as Node;

    @property({type :  Node})
    public btnMinus:Node = null as unknown as Node;

    @property({type :  Node})
    public btnPlus:Node = null as unknown as Node;

    @property({type :  Node})
    public iconNode:Node = null as unknown as Node;

    @property({type :  EditBox})
    public itemEditNode:EditBox = null as unknown as EditBox;      //道具使用相关

    @property({type :  Node})
    public lab_notSell:Node = null as unknown as Node;    //不可出售

    @property({type :  Label})
    public lab_name:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_sell:Label = null as unknown as Label;
    
    //道具信息
    @property({type :  Label})
    public lab_itemCount:Label = null as unknown as Label;
    @property({type :  Label})
    public lab_desc:Label = null as unknown as Label;
    // @property({type :  Node})
    // public lab_access:Node = null as unknown as Node;     //获取途径

    private _itemID:number = -1;
    private _visit :boolean | null = null;     //参观者模式  适用于锻造厂装备弹窗
    private _maxCount:number = 0;
    private _useCount:number = 0;
    private _itemData:Config.item_usable.Record = null as unknown as Config.item_usable.Record;
    private _objectType:number = 0;
    start () {
        super.start();
        this.btnSell?.on(Node.EventType.TOUCH_END, this._itemUseOrSell, this);
        this.btnMinus.on(Node.EventType.TOUCH_END, this._btnClickCallBack, this);
        this.btnPlus.on(Node.EventType.TOUCH_END, this._btnClickCallBack, this);
        this.itemEditNode.node.on('editing-did-ended', this._inputEditCallback, this);
    }

    public setUseItemType(id:number,type:number,isVisit:boolean | null=null)
    {
        this._itemID = id;
        this._visit = isVisit;
        this._objectType = type;
        this._maxCount = GameModel.getInstance().getBagModel().getItemCountByKey(this._itemID,ItemEquipType.goods);
        this._useCount = this._maxCount;
        
        this._init();
    }

    private _init()
    {        
        if(this._visit)
        {
            this.btnSell.active = false;
            this.lab_notSell.active = false;
        }

        this.itemEditNode.node.active = false;        
        this.btnSell.active = false;

        let nameData:any = null;
        let descData:any = null;

        if(this._objectType == Msg.TObjectType.EObject_UsableItem)
        {         

            this.btnSell.active = true;
            this.lab_notSell.active = false;
            // this.lab_access.active = false;
            this.itemEditNode.node.active = true;
            this.itemEditNode.string = this._useCount.toString();

            this._itemData = ValueMgr.getInstance().getItemByField(TableName.item_usable,this._itemID) as Config.item_usable.Record;
            nameData = ValueMgr.getInstance().getItemByField(TableName.language_data,this._itemData.name) as Config.language_data.Record;
            descData = ValueMgr.getInstance().getItemByField(TableName.language_data,this._itemData.desc) as Config.language_data.Record;
            
        }
        else{
            let itemStrArr = GameModel.getInstance().getBagModel().getItemDescByType(this._objectType);
            if(itemStrArr.length == 2)
            {
                nameData = ValueMgr.getInstance().getItemByField(TableName.language_ui,itemStrArr[0]) as Config.language_ui.Record;
                descData = ValueMgr.getInstance().getItemByField(TableName.language_ui,itemStrArr[1]) as Config.language_ui.Record;
                // this.lab_access.active = true;
                // let accessLab = this.lab_access.getComponent(Label) as Label;
                // accessLab.string = 
            }
            
        }
        //装备物品名称 描述
        this.lab_name.string = nameData.cn;
        this.lab_desc.string = descData.cn;

        resources.load('prefabs_ui/main/itemEquipCell', (err:any,res:any)=>{
            let itemEquipCell = instantiate(res) as Node;
            this.iconNode.addChild(itemEquipCell);
            let script = itemEquipCell.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemUseType(this._objectType);
            script.setItemType(this._itemID, 0, ItemEquipType.goods, null);
        })
    }

    private _itemUseOrSell()
    {   
        //英雄礼包
        if(this._itemData.itemType == Msg.TUsableItemType.EUsableItemType_HeroPack)
        {

        }
        //阵营礼包
        else if(this._itemData.itemType == Msg.TUsableItemType.EUsableItemType_CampAdvancePack)
        {

        }
        //经验、道具礼包
        else{
            MsgMgr.getInstance().getMsgBag().requestUseItem(this._itemID,this._useCount,0);
            this.delSelf()
        }
    }

    private _btnClickCallBack(event:any)
    {
        if(event.target == this.btnMinus)
        {
            this._useCount--;
        }
        else if(event.target == this.btnPlus)
        {
            this._useCount++;
        }
        if(this._useCount<= 1)
        {
            this._useCount = 1;
        }
        else if(this._useCount >= this._maxCount)
        {
            this._useCount = this._maxCount;
        }
        this.itemEditNode.string = this._useCount.toString();
    }

    private _inputEditCallback(editbox: EditBox)
    {
        console.log("获得输入的数据",editbox.string);
        let inputNum = Number(editbox.string);
        if(inputNum > this._maxCount)
        {
            editbox.string = this._maxCount.toString();
        }
        else if(inputNum <= 0)
        {
            editbox.string = "0"
        }
        this._useCount = inputNum;
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
