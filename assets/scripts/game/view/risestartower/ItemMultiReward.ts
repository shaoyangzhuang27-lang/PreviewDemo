
//英雄碎片
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
    public starlist:Node[] = [];


    private _propInfo : XStruct.starup_prop_info.IRecord = {
        nType : Msg.TObjectType.EObject_Hero,
        nPropId : 0,
        nLevel : 0,
        num : 0,
    }  
    
    start () {
        this.btn_frame.on(Node.EventType.TOUCH_END, this._onClickIcon, this);     
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
        switch(this._propInfo.nType)
        {
            case Msg.TObjectType.EObject_Hero : 
                break;
            case Msg.TObjectType.EObject_Hero : 
                this.img_camp.active = false;
                this.lab_level.node.active = false;


                break;
            case Msg.TObjectType.EObject_Exp : 
                break;
        }
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

    // set FragmentInfo(info : XStruct.fragment_synthesis_info.IRecord)
    // {

    // }
    // update (deltaTime: number) {
    //     // [4]
    // }
}
