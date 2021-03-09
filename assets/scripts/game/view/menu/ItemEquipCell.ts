
import { _decorator, Component, Node, Label, resources, SpriteFrame, Sprite } from 'cc';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from '../../model/ValueMgr';
const { ccclass, property } = _decorator;

@ccclass('ItemEquipCell')
export class ItemEquipCell extends Component {
    @property({type :  Node})
    public img_bg:Node = null as unknown as Node;

    @property({type :  Node})
    public img_icon:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_frame:Node = null as unknown as Node;

    @property({type :  Node})
    public starlist:Node[] = [];

    @property({type :  Label})
    public lab_count:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_info:Label = null as unknown as Label;

    @property({type :  Node})
    public img_infoBg:Node = null as unknown as Node;

    private _itemType : number = 1;     //区分道具:1、装备:2 
    private _itemID:number = -1;
    private _itemCount:number = 0;
    private _clickCallback :Function | null = null;
    start () {
        this.btn_frame.on(Node.EventType.TOUCH_END, this._openItemEquipInfoView, this);
    }

    public setItemType(id:number,count:number,type:number,callback:Function | null)
    {
        this._itemID = id;
        this._itemCount = count;
        this._itemType = type;
        this._clickCallback = callback;
        this._initIcon();
    }

    private _initIcon()
    {
        //数量
        this.lab_count.string = this._itemCount.toString();

        if(this._itemType == 2)     //装备
        {            
            this._setUIIConVisible(false);
            let equipData:Config.equip.Record = ValueMgr.getInstance().getItemByField(TableName.equip,this._itemID) as Config.equip.Record;
            let iconName:string = equipData.imageName;
            let starCount:number = equipData.star;
            let qualityName:string = XConsts.KHeroQualityBgSpriteName[equipData.quality];

            let iconPath = "ui/equip/" + iconName + "/spriteFrame"
            this._resourceLoad(iconPath,this.img_icon);

            let qualityPath = "ui/icon/" + qualityName + "/spriteFrame"
            this._resourceLoad(qualityPath,this.img_bg);

            for (let index = 0; index < this.starlist.length; index++) {
                if(index >= starCount)
                {
                    this.starlist[index].active = false;
                }
            }

        }
        else{       //道具
            this._setUIIConVisible(true);
        }
    }

    private _openItemEquipInfoView()
    {
        if(this._clickCallback)
        {
            this._clickCallback(this._itemID,this._itemType)
        }
    }

    private _setUIIConVisible(show:boolean)
    {
        this.img_infoBg.active = show;
        for (let index = 0; index < this.starlist.length; index++) {
            let star = this.starlist[index] as Node;
            star.active = !show;                
        }
    }

    //资源替换
    private _resourceLoad (path:string,obj:any)
    {
        resources.load(path, (err,spriteFrame:SpriteFrame) =>
        {
            console.log("装备道具errerrerrerrerr",err)
            if(!err)
            {
                let sprite = obj.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
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
