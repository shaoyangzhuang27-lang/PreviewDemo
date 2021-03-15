
import { _decorator, Component, Node, EditBox, Label, resources, instantiate } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { MsgMgr } from '../../control/MsgMgr';
import { PopMgr } from '../../control/PopMgr';
import { GameModel } from '../../model/GameModel';
import { TableName, ValueMgr } from '../../model/ValueMgr';
import { ItemEquipCell, ItemEquipType } from '../menu/ItemEquipCell';
const { ccclass, property } = _decorator;

@ccclass('PopEquipSaleView')
export class PopEquipSaleView extends PopBase {
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

    @property({type :  Label})
    public lab_name:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_gold:Label = null as unknown as Label;

    /**
     * @param _equipId 装备id
     * @param _maxCount 背包最大数量
     * @param _selectCount 选择数量
     */
    private _equipId:number = 0;        
    private _maxCount:number = 0;
    private _selectCount:number = 0;

    private _equipData:Config.equip.Record = null as unknown as Config.equip.Record;
    start () {
        super.start();
        this.btnSell?.on(Node.EventType.TOUCH_END, this._equipSellCallback, this);
        this.btnMinus.on(Node.EventType.TOUCH_END, this._btnClickCallBack, this);
        this.btnPlus.on(Node.EventType.TOUCH_END, this._btnClickCallBack, this);
        this.itemEditNode.node.on('editing-did-ended', this._inputEditCallback, this);
    }
    /**
     * 
     * @param id   装备id
     */
    public setEquipSaleType(id:number)
    {
        this._equipId = id;
        this._maxCount = GameModel.getInstance().getBagModel().getItemCountByKey(this._equipId,ItemEquipType.equip);
        this._selectCount = this._maxCount;
        this._equipData = ValueMgr.getInstance().getItemByField(TableName.equip,this._equipId) as Config.equip.Record;
        
        this._init();
    }

    private _init()
    {
        let nameData:any = ValueMgr.getInstance().getItemByField(TableName.language_data,this._equipData.name) as Config.language_data.Record;;
        //名称，价格
        this.lab_name.string = nameData.cn;
        this.lab_gold.string = (this._equipData.price * this._selectCount).toString();
        this.itemEditNode.string = this._selectCount.toString();

        resources.load('prefabs_ui/main/itemequipcell', (err:any,res:any)=>{
            let itemEquipCell = instantiate(res) as Node;
            this.iconNode.addChild(itemEquipCell);
            let script = itemEquipCell.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemsInfo(this._equipId, 0, ItemEquipType.equip, null);
        })
    }

    private _equipSellCallback()
    {
        console.log("点击出售装备");
        if(this._selectCount > 0)
        {
            MsgMgr.getInstance().getMsgBag().requestSellEquip(this._equipId,this._selectCount);
            this.delSelf()
        }
        else
        {
            PopMgr.getInstance().popupPrompt("出售数量不能为0");
        }
        
    }

    private _btnClickCallBack(event:any)
    {
        if(event.target == this.btnMinus)
        {
            this._selectCount--;
        }
        else if(event.target == this.btnPlus)
        {
            this._selectCount++;
        }
        if(this._selectCount<= 1)
        {
            this._selectCount = 1;
        }
        else if(this._selectCount >= this._maxCount)
        {
            this._selectCount = this._maxCount;
        }
        this.itemEditNode.string = this._selectCount.toString();
        this.lab_gold.string = (this._equipData.price * this._selectCount).toString();
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
        this._selectCount = inputNum;
        this.lab_gold.string = (this._equipData.price * this._selectCount).toString();
    }
}
