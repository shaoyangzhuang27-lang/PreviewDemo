import { _decorator, Component, Node,Label,resources,instantiate,Vec3, CCInteger,Sprite, SpriteFrame, Button, ButtonComponent,ProgressBar} from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { PopMgr } from '../../control/PopMgr';
import { XConsts } from '../../model/const/XConsts';
import { NotifyMgr } from '../../control/NotifyMgr';
import { MsgMgr } from '../../control/MsgMgr';
// import { TableName, ValueMgr } from "../../model/ValueMgr";
const { ccclass, property } = _decorator;

@ccclass('PopHeroPub')
export class PopHeroPub extends PopBase {
    @property({type: Label})
    public lab_title:Label | null = null;

    @property({type: Label})
    public lab_recteam:Label | null = null;

    @property({type: Label})
    public lab_friend_info:Label | null = null;

    

    @property({type: Node})
    public btn_introduce:Node | null = null;

    @property({type: Node})
    public btn_recteam:Node | null = null;


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

    @property({type: Label})
    public lab_summon_ad:Label | null = null;

    @property({type: Label})
    public lab_bar_info:Label | null = null;

    @property({type: Button})
    public btn_summon_one = null as unknown as Button;

    @property({type: Button})
    public btn_summon_ten = null as unknown as Button;
    
    private submitCallFun:Function | null = null;

    //召唤类型  默认英雄召唤
    private _curSummonType: number = 0;
    //消费道具类型 默认道具类型Null
    private _curSummonConsumType :  number = 0;
    //卷轴数量
    private _nScorllNum : number  = 0;
    //友情心数量
    private _nFriendHeartNum : number = 0;
    //英雄召唤进度
    private _nHeroSummonProgress : number = 0;


    start () {
        super.start();
        GameModel.getInstance().getHeroPubModel().initPubUILabContents();
        this.curSummonType = Msg.TSummonType.ESummonType_Heroic;
        // var heroSummon = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.PUB_UI_HEROSUMMON) as Config.language_ui.Record
        this.initUILabel()
        this.updateImgPropNum();
        this.updateBtnSummonState();
        this.showPubHeroIconPrefab();
        this.updateProgressProcess();
        this.btn_hero_summon.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_friend_summon.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_summon_one.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_summon_ten.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_introduce?.on(Node.EventType.TOUCH_END, this._onIntroduceClick, this);
        this.btn_recteam?.on(Node.EventType.TOUCH_END, this._onRecommendTeamClick, this);

        // var str0 = "再召唤{0}次必得五星传奇英雄";
        // var newStr = str0.replace("{0}","10");
        // console.log("pppppppppppppppp",newStr);

        let diamond =  GameModel.getInstance().getHeroPubModel().getPlayerDiamondCounts();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_pub_summon_hero,this.notifyPubSummonHeroHandle,this);
    }


    public initUILabel()
    {
        if(this.lab_title)
        {
            this.lab_title.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_title");
        }
        if(this.lab_recteam)
        {
            this.lab_recteam.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_recteam");
        }
       
        if(this.lab_bar_info)
        {
            var strInfo = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_bar_info");
            var newStr = strInfo.replace("{0}",String(XConsts.PUB_SUMMON_COUNT_MAX - this._nHeroSummonProgress));
            this.lab_bar_info.string = newStr
        }
        if(this.lab_friend_info)
        {
            this.lab_friend_info.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_friend_info");
        }

        if(this.lab_summon_ad)
        {
            this.lab_summon_ad.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_summon_ad_hero");
        }
    }
    private _onIntroduceClick(event : any)
    {
        PopMgr.getInstance().popRecLineUpWindow("推荐阵容",()=>{console.log("")});
    }
    private _onRecommendTeamClick(event : any)
    {
        PopMgr.getInstance().popRecLineUpWindow("推荐阵容",()=>{console.log("")});
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
                if(this._curSummonType == Msg.TSummonType.ESummonType_Friend)
                {
                    if(this._nFriendHeartNum < XConsts.PUB_SUMMON_FRIEND_ONE_COSUME)
                    {
                        this.showPromptWindow("错误","爱心不足",1);
                    }
                    else{
                        // MsgMgr.getInstance().getMsgLogin().requestDeviceLoginNew();
                        //server此处应该向服务区发消息，然后在回调函数里面处理弹窗内容
                        // this.showSummonSettleWindow("SummonWindow");
                        this.onSubmit(Msg.TSummonType.ESummonType_Friend,Msg.TSummonConsumeType.ESummonConsumeType_FriendGift,true);
                    }
                }
                else
                {
                    if(this._nScorllNum >= XConsts.PUB_SUMMON_SCROLL_ONE_COSUME)
                    {
                        //server此处应该向服务区发消息，然后在回调函数里面处理弹窗内容
                        // this.showSummonSettleWindow("SummonWindow");
                        this.onSubmit(Msg.TSummonType.ESummonType_Heroic,Msg.TSummonConsumeType.ESummonConsumeType_Scroll,true);
                    }
                    else 
                    {
                        if(GameModel.getInstance().getHeroPubModel().getPlayerDiamondCounts() >= XConsts.PUB_SUMMON_DIAMOND_ONE_COSUME)
                        {
                            //server此处应该向服务区发消息，然后在回调函数里面处理弹窗内容
                            // this.showSummonSettleWindow("SummonWindow");
                            this.onSubmit(Msg.TSummonType.ESummonType_Heroic,Msg.TSummonConsumeType.ESummonConsumeType_VRmb,true);
                        }
                        else
                        {
                            this.showPromptWindow("错误","钻石不足",1);
                        }
                    }
                }
                break; 
            case this.btn_summon_ten:
                console.log("summon_ten");
                if(this._curSummonType == Msg.TSummonType.ESummonType_Friend)
                {
                    if(this._nFriendHeartNum < XConsts.PUB_SUMMON_FRIEND_TEN_COSUME)
                    {
                        this.showPromptWindow("错误","爱心不足",1);
                    }
                    else
                    {
                        //server此处应该向服务区发消息，然后在回调函数里面处理弹窗内容
                        this.showSummonSettleWindow("SummonWindow");
                    }
                }
                else
                {
                    if(this._nScorllNum >= XConsts.PUB_SUMMON_SCROLL_TEN_COSUME)
                    {
                        //server此处应该向服务区发消息，然后在回调函数里面处理弹窗内容
                        this.showSummonSettleWindow("SummonWindow");
                    }
                    else 
                    {
                        if(GameModel.getInstance().getHeroPubModel().getPlayerDiamondCounts() >= XConsts.PUB_SUMMON_DIAMOND_TEN_COSUME)
                        {
                            //server此处应该向服务区发消息，然后在回调函数里面处理弹窗内容
                            this.showSummonSettleWindow("SummonWindow");
                        }
                        else
                        {
                            this.showPromptWindow("错误","钻石不足",1);
                        }
                    }
                }
                break;           
        }
    }

    submitHandle(){
        if(this.submitCallFun){
            this.submitCallFun();
        }
    }
    // public setTitle(title:string){
    //     if(this.lab_title)
    //         this.lab_title.string = title
    // }
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
            var lab_detail =  nodeDiamond?.getChildByName("lab_detail")?.getComponent(Label);
            // var summonHeroLotto = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.PUB_UI_NEWSUMMONHEROLOTTO) as Config.language_ui.Record;
            if(lab_detail)
            {
                lab_detail.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_detail");
            }
            var lab_detail_dimaond =  nodeDiamond?.getChildByName("lab_detail_dimaond")?.getComponent(Label);
           // var summonJewelConsume = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.PUB_UI_NEWSUMMONJEWELCONSUMEO) as Config.language_ui.Record;
            if(lab_detail_dimaond)
            {
                lab_detail_dimaond.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_detail_dimaond");
            }

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
                if(this.lab_summon_ad)
                {
                    this.lab_summon_ad.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_summon_ad_hero");
                }
                this.resetResourcesSpriFame("hero_pub/pub_prop_scroll/spriteFrame",this.img_prop);
        
                break;
            case Msg.TSummonType.ESummonType_Friend:
                this.node_diamond.active = false;
                this.node_friend.active = true;
                this.btn_hero_summon.interactable = true;
                this.btn_friend_summon.interactable = false;
                this.resetResourcesSpriFame("hero_pub/pub_call_ad_friend/spriteFrame",this.img_summon_ad);
                if(this.lab_summon_ad)
                {
                    this.lab_summon_ad.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_summon_ad_friend");
                }
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

    public showPromptWindow(title : string, content : string, mode: number)
    {
        PopMgr.getInstance().popCommonOneWindow(title,content,mode,()=>{console.log("召唤道具不足提示！")});
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
                    lab_one.string = "x" + String(XConsts.PUB_SUMMON_DIAMOND_ONE_COSUME);
                }
                if(lab_ten && img_ten)
                {
                    this.resetResourcesSpriFame("hero_pub/pub_diamond/spriteFrame",img_ten);
                    lab_ten.string = "x" + String(XConsts.PUB_SUMMON_DIAMOND_TEN_COSUME * 0.9);
                }
               
            }
            else
            {
                if(img_one_remind && img_ten_remind)
                {
                    if(this._nScorllNum >= XConsts.PUB_SUMMON_SCROLL_TEN_COSUME)
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
                    lab_one.string = String(XConsts.PUB_SUMMON_SCROLL_ONE_COSUME);
                }
                if(lab_ten && img_ten)
                {
                    this.resetResourcesSpriFame("hero_pub/pub_prop_scroll/spriteFrame",img_ten);
                    lab_ten.string = String(XConsts.PUB_SUMMON_SCROLL_TEN_COSUME);
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
                lab_one.string = String(XConsts.PUB_SUMMON_FRIEND_ONE_COSUME);
            }
            if(lab_ten && img_ten)
            {
                this.resetResourcesSpriFame("hero_pub/pub_prop_heart/spriteFrame",img_ten);
                lab_ten.string = String(XConsts.PUB_SUMMON_FRIEND_TEN_COSUME);
            }
        }
        
    }


    public updateProgressProcess()
    {
        var nodWindow = this.node.getChildByName("window");
        var nodeDiamond = nodWindow?.getChildByName("node_diamond");
        var barProgress = nodeDiamond?.getChildByName("bar_progress");
        var barCompoent = barProgress?.getComponent(ProgressBar);
        var labBarProgress = nodeDiamond?.getChildByName("lab_bar_progress");
        var labCompoent = labBarProgress?.getComponent(Label);
        if(barCompoent)
        {
            barCompoent.progress = this._nHeroSummonProgress /XConsts.PUB_SUMMON_COUNT_MAX ;
        }
        if(labCompoent)
        {
            var str = "{0}/30";
            labCompoent.string = str.replace("{0}",String(this._nHeroSummonProgress));
        }
    }

    public showSummonSettleWindow(title : string)
    {
        PopMgr.getInstance().popSummonSettleWindow(title,()=>{console.log("SummonSettleWindow!!")});
    } 


    public notifyPubSummonHeroHandle (data:any){
        console.log("Notify PubHeroSummon",data);
        // MsgMgr.getInstance().getMsgLogin().requestGetHeroList();
        // MsgMgr.getInstance().getMsgLogin().requestGetPlayerData();
        // SceneMgr.getInstance().changeToBattle();
    }
    onDestroy(){
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_pub_summon_hero,this.notifyPubSummonHeroHandle,this);
    }

    public onSubmit(nSummonType : Msg.TSummonType,nConsumeType : Msg.TSummonConsumeType, bIsOneOrTen : boolean)
    {
        let summonHeroR : Msg.SummonHeroR = {
             summonType : nSummonType,
            consumeType : nConsumeType,
            isOneOrTen : bIsOneOrTen
        }
        MsgMgr.getInstance().getMsgHeroPub().requestSummonHeroR(summonHeroR);
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
