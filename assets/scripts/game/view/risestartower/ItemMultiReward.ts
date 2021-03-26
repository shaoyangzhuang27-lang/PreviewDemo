/**
 * 游戏组件:获得物品弹窗
 * @author 郭刚
 * @version 1.0.0,2021.3.19
 */
import { _decorator, Component, Node, Sprite, Label, Button,SpriteFrame, resources,ProgressBar,instantiate, CCInteger } from 'cc';
const { ccclass, property } = _decorator;
import { PopMgr } from '../../control/PopMgr';
import { XConsts } from '../../model/const/XConsts';
import { XFuns } from '../../model/const/XFuns';
import { GameModel } from '../../model/GameModel';
import { TableName, ValueMgr } from "../../model/ValueMgr";

@ccclass('ItemMultiReward')
export class ItemMultiReward extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    
    @property({type :  Node})
    public img_bg:Node = null as unknown as Node;

    @property({type :  Node})
    public img_icon:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_frame:Node = null as unknown as Node;

    @property({type :  Node})
    public img_camp:Node = null as unknown as Node;


    @property({type :  Label})
    public lab_num:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_level:Label = null as unknown as Label;

    @property({type :  Node})
    public node_satr:Node = null as unknown as Node;

    @property({type :  Node})
    public starlist:Node[] = [];


    private _propInfo : XStruct.prop_info.IRecord = {
        nType : 0,
        nPropId : 0,
        nLevel : 0,
        nPropQuality: 0,
        num : 0,
    }  
    
    start () {
        this.btn_frame.on(Node.EventType.TOUCH_END, this._onClickIcon, this);
        this.initUI()
    }

    //碎片合成弹窗
    private _onClickIcon(event:any)
    {
        console.log("英雄信息界面");
        // PopMgr.getInstance().popFragmentSynthesisWindow(this._propInfo,()=>{console.log("hu")});
    }


    /**
     * @description: SpriteFame资源替换
     * @param path 资源路径
     * @param obj 节点类型Node
     */  
    _resourceLoad (path:string | null | undefined,obj:any)
    {
      
            path && resources.load(path,SpriteFrame,(err:any,spriteFrame:SpriteFrame) =>
            {
                obj.active = true;
                let sprite = obj.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            });
        
    }

    private _setStar(star:number)
    {
        for (let index = 0; index < this.starlist.length; index++) {
            if(index > star-1)
            {
                this.starlist[index].active = false;
            }
            else{
                this.starlist[index].active = true;
                if(star % 2 == 0)
                {
                   var pos =  this.starlist[index].getPosition();
                   this.starlist[index].setPosition(pos.x + 7,pos.y);
                }
            } 
        }
    }


    public initUI()
    {
        if(this._propInfo.nType)
        {
            let frame = "";
            let camp = "";
            let icon = "";
            let bg = "";
            switch(this._propInfo.nType)
            {
                case Msg.TObjectType.EObject_Hero : 
                    let heroInfo = ValueMgr.getInstance().getItemByField(TableName.heroes, this._propInfo.nPropId ? this._propInfo.nPropId : 0) as Config.heroes.Record;
                    let star = heroInfo.star;
                    frame = "ui/common/icon/" +  XConsts.GetQualityBgByStar(heroInfo.star) + "/spriteFrame";
                    icon = "ui/common/hero/" + heroInfo.image + "/spriteFrame";
                    camp = "ui/common/team/" + XConsts.KHeroCampIcon[heroInfo.camp]  + "/spriteFrame"
                    this.lab_level.string = String(this._propInfo.nLevel);
                    this._resourceLoad(frame,this.btn_frame);
                    this._resourceLoad(icon,this.img_icon);
                    this._resourceLoad(camp,this.img_camp);
                    this._setStar(star);
                    break;
                case Msg.TObjectType.EObject_Money :
                    this.img_camp.active = false;
                    this.lab_level.node.active = false;
                    this.node_satr.active = false;
                    icon = "ui/common/commonIcon/" +  XConsts.KObjectIconSpriteName[this._propInfo.nType] + "/spriteFrame"
                    bg = "ui/common/icon/" +  XConsts.KQualityBgSpriteName[this._propInfo.nPropQuality ?this._propInfo.nPropQuality : 2] + "/spriteFrame"
                    this.img_icon.setScale(0.5,0.5,1);
                    this._resourceLoad(icon,this.img_icon);
                    this._resourceLoad(bg,this.img_bg);
                   
                    break;
                case Msg.TObjectType.EObject_Exp :
                    this.img_camp.active = false;
                    this.lab_level.node.active = false;
                    this.node_satr.active = false;
                    icon = "ui/common/commonIcon/" +  XConsts.KObjectIconSpriteName[this._propInfo.nType] + "/spriteFrame"
                    bg = "ui/common/icon/" +  XConsts.KQualityBgSpriteName[this._propInfo.nPropQuality ?this._propInfo.nPropQuality : 2] + "/spriteFrame"
                    this.img_icon.setScale(0.5,0.5,1);
                    this._resourceLoad(icon,this.img_icon);
                    this._resourceLoad(bg,this.img_bg);
                    break;
                case Msg.TObjectType.EObject_SoulStone :
                    this.img_camp.active = false;
                    this.lab_level.node.active = false;
                    this.node_satr.active = false;
                    icon = "ui/common/commonicon/" +  XConsts.KObjectIconSpriteName[this._propInfo.nType] + "/spriteFrame"
                    bg = "ui/common/icon/" +  XConsts.KQualityBgSpriteName[this._propInfo.nPropQuality ?this._propInfo.nPropQuality : 2] + "/spriteFrame"
                    this.img_icon.setScale(0.5,0.5,1);
                    this._resourceLoad(icon,this.img_icon);
                    this._resourceLoad(bg,this.img_bg);
                    break;
                case Msg.TObjectType.EObject_Equip :
                    this.img_camp.active = false;
                    this.lab_level.node.active = false;
                    let equipData = GameModel.getInstance().getForgeModel().getConfigEquipDataById(this._propInfo.nPropId as number)
                    icon = "ui/common/equip/" + equipData.imageName + "/spriteFrame"
                    bg = "ui/common/icon/" + XConsts.KQualityBgSpriteName[this._propInfo.nPropQuality ? this._propInfo.nPropQuality : 2] + "/spriteFrame"
                    this._resourceLoad(icon, this.img_icon);
                    this._resourceLoad(bg, this.img_bg);
                    break;
                case Msg.TObjectType.EObject_UpgradePoint :
                    this.img_camp.active = false;
                    this.lab_level.node.active = false;
                    this.node_satr.active = false;
                    icon = "ui/common/commonIcon/" +  XConsts.KObjectIconSpriteName[this._propInfo.nType] + "/spriteFrame"
                    bg = "ui/common/icon/" +  XConsts.KQualityBgSpriteName[this._propInfo.nPropQuality ?this._propInfo.nPropQuality : 2] + "/spriteFrame"
                    this.img_icon.setScale(0.5,0.5,1);
                    this._resourceLoad(icon,this.img_icon);
                    this._resourceLoad(bg,this.img_bg);
                    break;
                case Msg.TObjectType.EObject_AdvanceExp :
                    this.img_camp.active = false;
                    this.lab_level.node.active = false;
                    this.node_satr.active = false;
                    icon = "ui/common/commonIcon/" +  XConsts.KObjectIconSpriteName[this._propInfo.nType] + "/spriteFrame"
                    bg = "ui/common/icon/" +  XConsts.KQualityBgSpriteName[this._propInfo.nPropQuality ?this._propInfo.nPropQuality : 2] + "/spriteFrame"
                    this.img_icon.setScale(0.5,0.5,1);
                    this._resourceLoad(icon,this.img_icon);
                    this._resourceLoad(bg,this.img_bg);
                    break;
                default:
                    console.log("传入相应Msg.TObjectType, 自己写")
                    break;
            }

            this.lab_num.string =  "x" + XFuns.FormatNumber(this._propInfo.num ? this._propInfo.num : 0);
        }
    }


    /**
     * @description: 设置物品信息
     * @param data 物品信息结构
     */    
    public setPropInfo(lootObjectData : Msg.LootObject | null,  defineData : XStruct.prop_info.Record | null)
    {

        if(lootObjectData)
        {
            if(lootObjectData.objType == Msg.TObjectType.EObject_Hero)
            {
                this._propInfo.nType = Msg.TObjectType.EObject_Hero;
                this._propInfo.nPropId = lootObjectData.param1;
                this._propInfo.nLevel = lootObjectData.param2;
                this._propInfo.nPropQuality = lootObjectData.param3;
            }
            else
            {
                this._propInfo.nType = lootObjectData.objType; 
            }
            this._propInfo.num = lootObjectData.num;
        }
        else if(defineData)
        {
            this._propInfo = instantiate(defineData);
        }
    }
}
