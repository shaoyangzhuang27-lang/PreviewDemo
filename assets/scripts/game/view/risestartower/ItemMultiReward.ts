//升星物品
import { _decorator, Component, Node, Sprite, Label, Button,SpriteFrame, resources,ProgressBar,instantiate, CCInteger } from 'cc';
const { ccclass, property } = _decorator;
import { PopMgr } from '../../control/PopMgr';
import { XConsts } from '../../model/const/XConsts';
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


    private _propInfo : XStruct.starup_prop_info.IRecord = {
        nType : XConsts.KSTARUP_PROP_TYPE.Hero,
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

    //资源替换
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
            let icon = "";
            let bg = "";
            switch(this._propInfo.nType)
            {
                case XConsts.KSTARUP_PROP_TYPE.Hero : 
                    let heroInfo = ValueMgr.getInstance().getItemByField(TableName.heroes, this._propInfo.nPropId ? this._propInfo.nPropId : 0) as Config.heroes.Record;
                    let star = heroInfo.star;
                    frame = "ui/common/icon/" +  XConsts.GetQualityBgByStar(heroInfo.star) + "/spriteFrame";
                    icon = "ui/common/hero/" + heroInfo.image + "/spriteFrame";

                    this.lab_level.string = String(this._propInfo.nLevel);
                    this._resourceLoad(frame,this.btn_frame);
                    this._resourceLoad(icon,this.img_icon);
                    this._setStar(star);
                    // this._resourceLoad()
                    break;
                case XConsts.KSTARUP_PROP_TYPE.Money : 
                    this.img_camp.active = false;
                    this.lab_level.node.active = false;
                    this.node_satr.active = false;
                    // this.lab_num.string = "x" + String(this._propInfo.num);
                    icon = "ui/common/commonIcon/" +  XConsts.KObjectIconSpriteName[this._propInfo.nType] + "/spriteFrame"
                    bg = "ui/common/icon/" +  XConsts.KQualityBgSpriteName[this._propInfo.nPropQuality ?this._propInfo.nPropQuality : 2] + "/spriteFrame"
                    this._resourceLoad(icon,this.img_icon);
                    this._resourceLoad(bg,this.img_bg);
                    break;
                case XConsts.KSTARUP_PROP_TYPE.Exp : 
                    this.img_camp.active = false;
                    this.lab_level.node.active = false;
                    this.node_satr.active = false;
                    // this.lab_num.string = "x" + String(this._propInfo.num);
                    icon = "ui/common/commonIcon/" +  XConsts.KObjectIconSpriteName[this._propInfo.nType] + "/spriteFrame"
                    bg = "ui/common/icon/" +  XConsts.KQualityBgSpriteName[this._propInfo.nPropQuality ?this._propInfo.nPropQuality : 2] + "/spriteFrame"
                    this._resourceLoad(icon,this.img_icon);
                    this._resourceLoad(bg,this.img_bg);
                    break;
            }

            this.lab_num.string =  "x" + String(this._propInfo.num);
            // let name: string = XConsts.KObjectIconSpriteName[this._propInfo.nType]
            // let icon = "ui/main/" +  XConsts.KObjectIconSpriteName[this._propInfo.nType] + "/spriteFrame"
            // let bg = "ui/common/icon/" +  XConsts.KQualityBgSpriteName[this._propInfo.nPropQuality ?this._propInfo.nPropQuality : 2] + "/spriteFrame"
        }
       

        // let name: string = XConsts.KObjectIconSpriteName[this._propInfo.nType]
        // let iconPath: string = "ui/main/" + name + "/spriteFrame"
        // resources.load(iconPath, (err, spriteFrame: SpriteFrame) => {
        //     if (!err && this.m_sptIcon) {
        //         let sprite = this.m_sptIcon.getComponent(Sprite) as Sprite;
        //         sprite.spriteFrame = spriteFrame;
        //     }
        // });
       
                // info.frame = "ui/common/icon/" +  XConsts.GetQualityBgByStar(heroInfo.star) + "/spriteFrame";
                // info.quality = "ui/common/icon/" + XConsts.KFragmentQualitySpriteName[1] + "/spriteFrame";
                // info.icon = "ui/common/hero/" + heroInfo.image + "/spriteFrame";
                // info.camp = "ui/common/team/" + XConsts.KHeroCampIcon[heroInfo.camp] + "/spriteFrame";
                // info.star = heroInfo.star;
                // info.maxNum = XConsts.KFragmentNumRequired[info.star ? info.star : 1];
                // info.curNum = value.num ? value.num : 0;
                // info.heroName = heroInfo.name;
                // info.campName = XConsts.KCampName[heroInfo.camp];
        // if(this._propInfo.nType == Msg.TObjectType.EObject_Hero)
        // {

        // }
        // else if()
        // this.img_camp.active = false;
        
        // console.log("vvvvvvvvvvvvv",this._propInfo);
        // Object.keys(this._propInfo).forEach((val, idx, array) => {
        //     // val: 当前值
        //     // idx：当前index
        //     // array: Array

        //     val == "icon" && this._propInfo[val] && this._resourceLoad(this._propInfo[val],this.img_icon);
        //     val == "frame" && this._propInfo[val] && this._resourceLoad(this._propInfo[val],this.btn_frame);
        //     val == "camp" && this._propInfo[val] && this._resourceLoad(this._propInfo[val],this.img_camp);
        //     val == "quality" && this._propInfo[val] && this._resourceLoad(this._propInfo[val],this.img_debris);
        //     val == "bg" && this._propInfo[val] && this._resourceLoad(this._propInfo[val],this.img_bg);
            
        // });

        // if(info.maxNum && info.curNum )
        // {
        //     let nPreocess = info.curNum / info.maxNum ;
        //     if(nPreocess > 1)
        //     {
        //         nPreocess = 1;
        //     }

        //     let bar = this.probar_fragment.node.getChildByName("bar");
        //     let path = nPreocess !=1 ? "ui/common/icon/" + "碎片未满进度条" + "/spriteFrame" : "ui/common/icon/" + "碎片已满进度条" + "/spriteFrame";
        //     this._resourceLoad(path,bar);
           
        //     var barCompoent =  this.probar_fragment?.getComponent(ProgressBar);
        //     if(barCompoent)
        //     {
        //         barCompoent.progress = nPreocess ;
        //     }

        //     var str = String(info.curNum) + "/" + String(info.maxNum);
        //     this.lab_process_num.string = str;

        //     nPreocess != 1 ? this.img_point.active = false : this.img_point.active = true;

        //     this._setStar(info.star ? info.star : 0);

        // }

    }

    public setPropInfo(data : XStruct.starup_prop_info.IRecord)
    {
           this._propInfo = instantiate(data);
    }


}
