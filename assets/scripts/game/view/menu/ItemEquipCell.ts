/**
 * 游戏组件:道具装备cell
 * @author 黄志清
 * @version 1.0.0,2021.3.15
 */
import { _decorator, Component, Node, Label, resources, SpriteFrame, Sprite } from 'cc';
import { XConsts } from '../../model/const/XConsts';
import { XFuns } from '../../model/const/XFuns';
import { XShare } from '../../model/const/XShare';
import { TableName, ValueMgr } from '../../model/ValueMgr';
const { ccclass, property } = _decorator;

export enum ItemEquipType{
    goods = 1,      //道具
    equip = 2       //装备           
}

@ccclass('ItemEquipCell')
export class ItemEquipCell extends Component {
    @property({type :  Node})
    public img_bg:Node = null as unknown as Node;

    @property({type :  Node})
    public img_icon:Node = null as unknown as Node;

    @property({type :  Node})
    public starlist:Node[] = [];

    @property({type :  Node})
    public lab_count:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_info:Label = null as unknown as Label;

    @property({type :  Node})
    public img_infoBg:Node = null as unknown as Node;

    private _itemType : number = 1;     //区分道具:1 、装备:2 ItemEquipType.equip
    private _itemID:number = -1;
    private _itemCount:number = 0;
    private _clickCallback :Function | null = null;
    private _objectType:number = 0;

    start () {
        
        this.img_bg.on(Node.EventType.TOUCH_END, this._openItemEquipInfoView, this);
    }

    //传入道具id,数量， 
    /**
     * 
     * @param id        道具id
     * @param count     数量
     * @param type      类型：道具:1 ItemEquipType.goods、装备:2 ItemEquipType.equip
     * @param callback  回调方法
     */
    public setItemType(id:number,count:number,type:number,callback:Function | null)
    {
        this._itemID = id;
        this._itemCount = count;
        this._itemType = type;
        this._clickCallback = callback;
        this._initIcon();
    }

    /**
     * @param objType 道具类型 枚举值参考Msg.TObjectType.
     * @param 可使用道具统一传Msg.TObjectType.EObject_UsableItem
     */
    public setItemUseType(objType:number)
    {
        this._objectType = objType;
    }

    private _initIcon()
    {
        //数量
        let labCount:Label = this.lab_count.getComponent(Label) as Label;
        labCount.string = XFuns.FormatNumber(this._itemCount);
        if(this._itemCount == 0)        //不需要显示数量时  数量设置为0
        {
            this.lab_count.active = false;
        }
        let iconPath:string = "";
        let qualityPath:string = "";
        this.img_infoBg.active = false;
        if(this._itemType == 2)     //装备
        {            
            this._setUIIConVisible(true);
            let equipData:Config.equip.Record = ValueMgr.getInstance().getItemByField(TableName.equip,this._itemID) as Config.equip.Record;
            let iconName:string = equipData.imageName;
            let starCount:number = equipData.star;
            let qualityName:string = XConsts.KQualityBgSpriteName[equipData.quality];

            iconPath = "ui/common/equip/" + iconName + "/spriteFrame"
            qualityPath = "ui/common/icon/" + qualityName + "/spriteFrame"

            for (let index = 0; index < this.starlist.length; index++) {
                if(index >= starCount)
                {
                    this.starlist[index].active = false;
                }
            }
        }
        else{       //道具
            this._setUIIConVisible(false);
            
            if(this._objectType != Msg.TObjectType.EObject_UsableItem)
            {
                this._itemID = this._objectType;    //不可使用道具  id就是道具类型
                if(XShare.getInstance().KObjectQuality.has(this._objectType))
                {
                    let quality = Number(XShare.getInstance().KObjectQuality.get(this._objectType)) ;
                    let qualityName:string = XConsts.KQualityBgSpriteName[quality];
                    qualityPath = "ui/common/icon/" + qualityName + "/spriteFrame";
                }
                let iconName:string = XConsts.KObjectIconSpriteName[this._objectType];
                iconPath = "ui/common/commonIcon/" + iconName + "/spriteFrame";
            }
            else{
                let itemData:Config.item_usable.Record = ValueMgr.getInstance().getItemByField(TableName.item_usable,this._itemID) as Config.item_usable.Record;        
                let qualityName:string = XConsts.KQualityBgSpriteName[itemData.quality];
                let itemUseType:number = itemData.itemType;

                qualityPath = "ui/common/icon/" + qualityName + "/spriteFrame"
                if(itemUseType == Msg.TUsableItemType.EUsableItemType_ObjectOffline)
                {
                    this.img_infoBg.active = true;
                }
            }
            
        }

        
        resources.load(iconPath, (err,spriteFrame:SpriteFrame) =>
        {
            if(!err)
            {
                let sprite = this.img_icon.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });

        
        resources.load(qualityPath, (err,spriteFrame:SpriteFrame) =>
        {
            if(!err)
            {
                let sprite = this.img_bg.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
    }

    private _openItemEquipInfoView()
    {
        if(this._clickCallback)
        {
            this._clickCallback(this._itemID,this._itemType,this._objectType)
        }
    }

    private _setUIIConVisible(show:boolean)
    {
        // this.img_infoBg.active = show;
        for (let index = 0; index < this.starlist.length; index++) {
            let star = this.starlist[index] as Node;
            star.active = show;                
        }
    }
    
    /**
     * 重新传入数量
     * @param count 装备或道具的数据
     */
    public resetItemCount(count:number)
    {
        this._itemCount = count;
        let labCount:Label = this.lab_count.getComponent(Label) as Label;
        labCount.string = XFuns.FormatNumber(this._itemCount);
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
