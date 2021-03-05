
import { _decorator, Component, Node,Label,resources,instantiate,Vec3, CCInteger,Sprite, SpriteFrame, Button, ButtonComponent} from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
const { ccclass, property } = _decorator;

 var SUMMON_FRIEND_COUNT_MAX = 30;
@ccclass('PopHeroPub')
export class PopHeroPub extends PopBase {
    @property({type: Label})
    public lab_title:Label | null = null;

    @property({type: Node})
    public btn_introduce:Node | null = null;

    @property({type: Node})
    public btn_recommendteam:Node | null = null;


    @property({type: Sprite})
    public img_prop = null as unknown as Sprite;

    @property({type: Label})
    public lab_prop_num = null as unknown as Label;

    @property({type: Node})
    public node_diamond = null as unknown as Node;

    @property({type: Node})
    public node_friend = null as unknown as Node;

    @property({type: Button})
    public btn_hero_summon = null as unknown as Button;

    @property({type: Button})
    public btn_friend_summon = null as unknown as Button;

    @property({type: Sprite})
    public img_summon_ad = null as unknown as Sprite;


    @property({type: Button})
    public btn_summon_one = null as unknown as Button;

    @property({type: Button})
    public btn_summon_ten = null as unknown as Button;
    // @property({type: LabelComponent})
    // public lab_content:LabelComponent | null = null;

    private submitCallFun:Function | null = null;

    // //召唤类型  默认英雄召唤
    // private _curSummonType: Msg.TSummonType = Msg.TSummonType.ESummonType_Heroic;
    // //消费道具类型 默认道具类型Null
    // private _curSummonConsumType :  Msg.TSummonConsumeType = Msg.TSummonConsumeType.ESummonConsumeType_NULL;
    //召唤类型  默认英雄召唤
    private _curSummonType: number = 0;
    //消费道具类型 默认道具类型Null
    private _curSummonConsumType :  number = 0;
    //卷轴数量
    private _nScorllNum : number  = 0;
    //友情心数量
    private _nFriendHeartNum : number = 0;
    //英雄召唤进度
    private _nSummonFriendCount : number = 0;


    start () {
        super.start();
        this.curSummonType = Msg.TSummonType.ESummonType_Heroic;
        this.updateImgPropNum();
        this.updateBtnSummonState();
        this.showPubHeroIconPrefab()
        this.btn_hero_summon.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_friend_summon.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_summon_one.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_summon_ten.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
    }

    //更新显示卷轴或爱心个数
    public updateImgPropNum()
    {
         //获取酒馆需要信息
        this._nScorllNum = GameModel.getInstance().getHeroPubModel().getHeroSummonScrollNum();
        this._nFriendHeartNum = GameModel.getInstance().getHeroPubModel().getFriendSummonScrollNum();
        if(this._curSummonType == Msg.TSummonType.ESummonType_Heroic)
        {
            this.lab_prop_num.string = String(this._nScorllNum);
        }
        else if(this._curSummonType == Msg.TSummonType.ESummonType_Friend)
        {
            this.lab_prop_num.string = String(this._nFriendHeartNum);
        }
       
    }

    private _onButtonClick(event:any){
        switch (event.target.getComponent(Button)) {
            case this.btn_hero_summon:
                console.log("hero_summon");
                if(this._curSummonType != Msg.TSummonType.ESummonType_Heroic)
                {

                    this.curSummonType = Msg.TSummonType.ESummonType_Heroic;
                    this.updateImgPropNum();
                    this.updateBtnSummonState();
                }
                
                break;
            case this.btn_friend_summon:
                console.log("friend_summon");
                if(this._curSummonType != Msg.TSummonType.ESummonType_Friend)
                {
                    this.curSummonType = Msg.TSummonType.ESummonType_Friend;
                    this.updateImgPropNum();
                    this.updateBtnSummonState();
                }
                break;  
            case this.btn_summon_one:
                console.log("summon_one");
                break; 
            case this.btn_summon_ten:
                console.log("summon_ten");
                break;           
        }
    }

    submitHandle(){
        if(this.submitCallFun){
            this.submitCallFun();
        }
    }
    public setTitle(title:string){
        if(this.lab_title)
            this.lab_title.string = title
    }
    // public setContent(content:string){
    //     console.log(content)
    //     if(this.lab_content)
    //         this.lab_content.string = content
    // }
    public setSubmitCallBack(func:Function){
        this.submitCallFun = func;
    }

    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }

    // update (deltaTime: number) {
    // //     // Your update function goes here.
    // }

    public showPubHeroIconPrefab()
    {
        resources.load('prefabs_ui/pub/pub_heroicon', (err:any,res:any)=>{
            let p = instantiate( res );
            var nodWindow = this.node.getChildByName("window");
            var nodeDiamond = nodWindow?.getChildByName("node_diamond");
            var imgFiveStarBg = nodeDiamond?.getChildByName("img_fivestar_bg");
            var nodeFiveStar = imgFiveStarBg?.getChildByName("node_fivestar");
            if(nodeFiveStar)
            {
                p.setScale(0.4,0.4)
                nodeFiveStar.addChild(p)
            }
        } );
    }


    set curSummonType(value : Msg.TSummonType)
    {
        switch(value)
        {
            case Msg.TSummonType.ESummonType_Heroic:
                this.node_diamond.active = true;
                this.node_friend.active = false;
                this.btn_hero_summon.interactable = false;
                this.btn_friend_summon.interactable = true;
                this.resetResourcesSpriFame("hero_pub/pub_call_ad_diamond/spriteFrame",this.img_summon_ad);
                this.resetResourcesSpriFame("hero_pub/pub_prop_scroll/spriteFrame",this.img_prop);
        
                break;
            case Msg.TSummonType.ESummonType_Friend:
                this.node_diamond.active = false;
                this.node_friend.active = true;
                this.btn_hero_summon.interactable = true;
                this.btn_friend_summon.interactable = false;
                this.resetResourcesSpriFame("hero_pub/pub_call_ad_friend/spriteFrame",this.img_summon_ad);
                this.resetResourcesSpriFame("hero_pub/pub_prop_heart/spriteFrame",this.img_prop);

                break;
        }
        this._curSummonType = value;
    }

    

    public resetResourcesSpriFame(path:string,objSprite : Sprite)
    {
        resources.load(path, SpriteFrame ,(err: any, spriteFrame: SpriteFrame) => {
            objSprite.spriteFrame = spriteFrame;
        });
    }


    //更新召唤显示按钮状态
    public updateBtnSummonState()
    {
        var lab_one = this.btn_summon_one.node.getChildByName("lab_summon_num")?.getComponent(Label);
        var img_one = this.btn_summon_one.node.getChildByName("img_summon_icon")?.getComponent(Sprite);
        var img_one_remind = this.btn_summon_one.node.getChildByName("img_summon_remind")?.getComponent(Sprite);
        var imgdi_ten = this.btn_summon_ten.node.getComponent(Sprite);
        var lab_ten = this.btn_summon_ten.node.getChildByName("lab_summon_num")?.getComponent(Label);
        var img_ten = this.btn_summon_ten.node.getChildByName("img_summon_icon")?.getComponent(Sprite);
        var img_ten_remind = this.btn_summon_ten.node.getChildByName("img_summon_remind")?.getComponent(Sprite);
        if(img_one_remind && img_ten_remind)
        {
            img_one_remind.node.active = true; 
            img_ten_remind.node.active = true; 
        }
        if(this._curSummonType == Msg.TSummonType.ESummonType_Heroic)
        {
            if(this._nScorllNum == 0)
            {
                if(img_one_remind && img_ten_remind)
                {
                   
                    img_one_remind.node.active = false; 
                    img_ten_remind.node.active = false; 
                }
                if(lab_one && img_one)
                {
                    this.resetResourcesSpriFame("hero_pub/pub_diamond/spriteFrame",img_one);
                    lab_one.string = "x" + String(300);
                }
                if(lab_ten && img_ten)
                {
                    this.resetResourcesSpriFame("hero_pub/pub_diamond/spriteFrame",img_ten);
                    lab_ten.string = "x" + String(2700);
                }
               
            }
            else
            {
                if(img_one_remind && img_ten_remind)
                {
                    if(this._nScorllNum >= 10)
                    {
                        img_one_remind.node.active = true; 
                        img_ten_remind.node.active = true; 
                    }
                    else
                    {
                        img_one_remind.node.active = true; 
                        img_ten_remind.node.active = false; 
                    }
                    
                }
                if(lab_one && img_one)
                {
                    this.resetResourcesSpriFame("hero_pub/pub_prop_scroll/spriteFrame",img_one);
                    lab_one.string = String(1);
                }
                if(lab_ten && img_ten)
                {
                    this.resetResourcesSpriFame("hero_pub/pub_prop_scroll/spriteFrame",img_ten);
                    lab_ten.string = String(10);
                }
            }
        }
        else if(this._curSummonType == Msg.TSummonType.ESummonType_Friend)
        {
            if(img_one_remind && img_ten_remind)
            {
                img_one_remind.node.active = false; 
                img_ten_remind.node.active = false; 
            } 
            if(imgdi_ten)
            {
                this.resetResourcesSpriFame("ui/initial/底部弹框_常用蓝色按钮/spriteFrame",imgdi_ten);
            }
            if(lab_one && img_one)
            {
                this.resetResourcesSpriFame("hero_pub/pub_prop_heart/spriteFrame",img_one);
                lab_one.string = String(10);
            }
            if(lab_ten && img_ten)
            {
                this.resetResourcesSpriFame("hero_pub/pub_prop_heart/spriteFrame",img_ten);
                lab_ten.string = String(100);
            }
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
