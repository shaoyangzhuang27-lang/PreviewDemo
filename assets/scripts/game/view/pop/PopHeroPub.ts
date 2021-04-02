/* 游戏组件:英雄酒馆
* @author 郭刚
* @version 1.0.0,2021.3.13
*/
import { _decorator, Component, Node,Label,resources,instantiate,Vec3, CCInteger,EventHandler,Sprite, SpriteFrame, Button, ToggleContainer,Toggle,ProgressBar, Color} from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { PopMgr } from '../../control/PopMgr';
import { ResMgr } from '../../control/ResMgr';
import { XConsts } from '../../model/const/XConsts';
import { NotifyMgr } from '../../control/NotifyMgr';
import { MsgMgr } from '../../control/MsgMgr';
import { XFuns } from '../../model/const/XFuns';
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { PubHeroIcon } from '../pub/PubHeroIcon';

const { ccclass, property } = _decorator;

@ccclass('PopHeroPub')
export class PopHeroPub extends PopBase {
    @property({type: Label})
    public lab_title:Label | null = null;

    @property({type: Label})
    public lab_recteam:Label | null = null;

    @property({type: Node})
    public node_ordinary:Node | null = null;

    @property({type: Node})
    public node_wonder:Node | null = null;
    
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

    @property({type: ToggleContainer})
    public node_togglecontainer = null as unknown as ToggleContainer;
    
    
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

    private _strSummonExplainTitle : string = "";
    private _strSummonExplainContent : string = "";


    start () {
        super.start();
        GameModel.getInstance().getHeroPubModel().initPubUILabContents();
        this.curSummonType = Msg.TSummonType.ESummonType_Heroic;
        // this._nHeroSummonProgress =  GameModel.getInstance().getHeroPubModel().getPlayerSummonScore();
        // var heroSummon = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.PUB_UI_HEROSUMMON) as Config.language_ui.Record
        this.initUILabel()
        this.updateImgPropNum();
        this.updateBtnSummonState();
        this.showPubHeroIconPrefab();
        this.updateProgressProcess();

        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PopHeroPub';// 这个是代码文件名
        containerEventHandler.handler = '_onToggleContainerClick';
        containerEventHandler.customEventData = '';

        this.node_togglecontainer?.checkEvents.push(containerEventHandler);
        this.updateShowNodeToggle();



        this.btn_hero_summon.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_friend_summon.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_summon_one.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_summon_ten.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_introduce?.on(Node.EventType.TOUCH_END, this._onIntroduceClick, this);
        this.btn_recteam?.on(Node.EventType.TOUCH_END, this._onRecommendTeamClick, this);

        this.addPubNotifyHandler();
        
    }


    public initUILabel()
    {
        this._strSummonExplainTitle  = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_SUMMONDESCTITLE) ;
        this._strSummonExplainContent  = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_SUMMONDESC);
        if(this.lab_title)
        {
            this.lab_title.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_title");
        }
        if(this.lab_recteam)
        {
            this.lab_recteam.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_recteam");
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
        PopMgr.getInstance().popExplain(this._strSummonExplainTitle,this._strSummonExplainContent,()=>{ PopMgr.getInstance().deleteWindow();});
    }
    private _onRecommendTeamClick(event : any)
    {
        PopMgr.getInstance().popRecLineUpWindow(XConsts.PUB_UI_CAMPRECOMMEND,()=>{console.log("")});
    }


    //更新显示卷轴或爱心个数
    public updateImgPropNum()
    {
         //获取酒馆需要信息
        this._nScorllNum = GameModel.getInstance().getHeroPubModel().getBaseSummonScrollNum();
        this._nFriendHeartNum = GameModel.getInstance().getHeroPubModel().getFriendSummonScrollNum();
        if(this._curSummonType == Msg.TSummonType.ESummonType_Heroic)
        {
            this.lab_prop_num.string = "x" + XFuns.FormatNumber(this._nScorllNum);
        }
        else if(this._curSummonType == Msg.TSummonType.ESummonType_Friend)
        {
            this.lab_prop_num.string = "x" + XFuns.FormatNumber(this._nFriendHeartNum);
        }
       
    }

    private _onButtonClick(event:any){
        let nPlayerDiamondsCounts = GameModel.getInstance().getHeroPubModel().getPlayerDiamondCounts();
        let info : XStruct.common_one_info.Record = {
            title : "",
            content : "",
            mode : 0,
            isRichLabMode : false,
            isChangeBtnSpriteFrame : false,
            submitContent:"" ,
            cancelContent:"" 
        }
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
                        info.title = "错误";
                        info.content = "爱心不足";
                        this.showPromptWindow(info);
                    }
                    else{
                     
                        console.log("pppppppp 单个爱心");
                        this.onSubmit(Msg.TSummonType.ESummonType_Friend,Msg.TSummonConsumeType.ESummonConsumeType_FriendGift,true);
                    }
                }
                else
                {
                    if(this._nScorllNum >= XConsts.PUB_SUMMON_SCROLL_ONE_COSUME)
                    {
                    
                        console.log("pppppppp 单个卷轴");
                        this.onSubmit(Msg.TSummonType.ESummonType_Heroic,Msg.TSummonConsumeType.ESummonConsumeType_Scroll,true);
                    }
                    else 
                    {
                        if(nPlayerDiamondsCounts >= XConsts.PUB_SUMMON_DIAMOND_ONE_COSUME)
                        {
                            //普通召唤 中的钻石召唤
                            console.log("pppppppp 单个钻石");
                            this.onSubmit(Msg.TSummonType.ESummonType_Heroic,Msg.TSummonConsumeType.ESummonConsumeType_VRmb,true);
                        }
                        else
                        {
                            info.title = "错误";
                            info.content = "钻石不足";
                            info.submitContent = "商城";
                            let sumbitCallFunc = ()=>{
                                PopMgr.getInstance().deleteWindow();
                                console.log("弹出商城窗口");
                            }
                            this.showPromptWindow(info,sumbitCallFunc);
                            // this.showPromptWindow("错误","钻石不足",1);
                        }
                    }
                }
                break; 
            case this.btn_summon_ten:
                // console.log("summon_ten");
                if(this._curSummonType == Msg.TSummonType.ESummonType_Friend)
                {
                    if(this._nFriendHeartNum < XConsts.PUB_SUMMON_FRIEND_TEN_COSUME)
                    {
                        // this.showPromptWindow("错误","爱心不足",1);
                        info.title = "错误";
                        info.content = "爱心不足";
                        this.showPromptWindow(info);
                    }
                    else
                    {
                       console.log("pppppppppp 爱心10连");
                        this.onSubmit(Msg.TSummonType.ESummonType_Friend,Msg.TSummonConsumeType.ESummonConsumeType_FriendGift,false);
                    }
                }
                else
                {
                    if(this._nScorllNum > 0 && this._nScorllNum < XConsts.PUB_SUMMON_SCROLL_TEN_COSUME)
                    {
                        let nShortageDiamonds = XConsts.PUB_SUMMON_SCROLL_EXCHANGE_DIAMOND *  (XConsts.PUB_SUMMON_SCROLL_TEN_COSUME - this._nScorllNum);
                        if(nPlayerDiamondsCounts >= nShortageDiamonds)
                        {
                            let callFunc = ()=>{
                                this.onSubmit(Msg.TSummonType.ESummonType_Heroic,Msg.TSummonConsumeType.ESummonConsumeType_Scroll_VRmb,false);
                            }
                            var str = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_BUYSUMMONSCROLL);
                            
                            str = str.replace("{0}",String(nShortageDiamonds));
                            str = str.replace("{1}",String(XConsts.PUB_SUMMON_SCROLL_TEN_COSUME - this._nScorllNum));
                            str = str.replace("{2}",String(XConsts.PUB_SUMMON_SCROLL_EXCHANGE_DIAMOND));

                            info.title = "注意";
                            info.content = str;
                            info.mode = 1;
                            info.isRichLabMode = true;
                            this.showPromptWindow(info,callFunc);
                            // this.showPromptWindow("注意",str,2,callFunc,true);
                            // this.onSubmit(Msg.TSummonType.ESummonType_Heroic,Msg.TSummonConsumeType.ESummonConsumeType_Scroll_VRmb,false);
                        }
                        else
                        {
                            let callFunc = ()=>{
                                PopMgr.getInstance().deleteWindow();
                                let tempInfo : XStruct.common_one_info.Record = {
                                    title : "",
                                    content : "",
                                    mode : 0,
                                    isRichLabMode : false,
                                    isChangeBtnSpriteFrame : false,
                                    submitContent:"" ,
                                    cancelContent:"" 
                                }
                                // this.showPromptWindow("错误","钻石不足",1);
                                tempInfo.title = "错误";
                                tempInfo.content = "钻石不足";
                                tempInfo.submitContent = "商城";
                                let sumbitCallFunc = ()=>{
                                    PopMgr.getInstance().deleteWindow();
                                    console.log("弹出商城窗口");
                                }
                                // this.showPromptWindow(tempInfo,sumbitCallFunc);
                                PopMgr.getInstance().popCommonOneWindow(tempInfo,sumbitCallFunc);
                                
                            }
                            var str = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_BUYSUMMONSCROLL);
                            
                            str = str.replace("{0}",String(nShortageDiamonds));
                            str = str.replace("{1}",String(XConsts.PUB_SUMMON_SCROLL_TEN_COSUME - this._nScorllNum));
                            str = str.replace("{2}",String(XConsts.PUB_SUMMON_SCROLL_EXCHANGE_DIAMOND));

                            info.title = "注意";
                            info.content = str;
                            info.mode = 1;
                            info.isRichLabMode = true;
                            this.showPromptWindow(info,callFunc);
                            
                        }
                    }
                    else if(this._nScorllNum >= XConsts.PUB_SUMMON_SCROLL_TEN_COSUME)
                    {
                        //server此处应该向服务区发消息，然后在回调函数里面处理弹窗内容
                        console.log("pppppppppp 卷轴10连");
                        this.onSubmit(Msg.TSummonType.ESummonType_Heroic,Msg.TSummonConsumeType.ESummonConsumeType_Scroll,false);
                    }
                    else 
                    {
                        if(nPlayerDiamondsCounts >= XConsts.PUB_SUMMON_DIAMOND_TEN_COSUME)
                        {

                            //普通召唤 中的钻石召唤
                            console.log("pppppppppp 钻石10连");
                            this.onSubmit(Msg.TSummonType.ESummonType_Heroic,Msg.TSummonConsumeType.ESummonConsumeType_VRmb,false);
                        }
                        else
                        {
                            // this.showPromptWindow("错误","钻石不足",1);

                            info.title = "错误";
                            info.content = "钻石不足";
                            info.submitContent = "商城";
                            let sumbitCallFunc = ()=>{
                                PopMgr.getInstance().deleteWindow();
                                console.log("弹出商城窗口");
                            }
                            this.showPromptWindow(info,sumbitCallFunc);
                        }
                    }
                }
                break;           
        }
    }

    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }

    public showPubHeroIconPrefab()
    {
        this.node_wonder && (this.node_wonder.active = false);
        ResMgr.getInstance().loadPrefab('prefabs_ui/pub/pub_heroicon', (err:any,res:any)=>{
            let p = instantiate( res );
            let script = p.getComponent(PubHeroIcon);
            var nodWindow = this.node.getChildByName("window");
            var node_ordinary = nodWindow?.getChildByName("node_ordinary");
            var nodeDiamond = node_ordinary?.getChildByName("node_diamond");
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

            script.setWonderSummonShow(false);
            if(nodeFiveStar)
            {
                p.setScale(0.4,0.4)
                nodeFiveStar.addChild(p)
            }
        },"PopHeroPub");


        // GameModel.getInstance().getHeroPubModel().initWonderHeartHeroIdList();
        // ResMgr.getInstance().loadPrefab('prefabs_ui/pub/pub_wonder_summon', (err:any,res:any)=>{
        //     let p = instantiate( res );
        //     this.node_wonder?.addChild(p);
        // } );
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
                this.resetResourcesSpriFame("ui/hero_pub/pub_call_ad_diamond/spriteFrame",this.img_summon_ad);
                if(this.lab_summon_ad)
                {
                    this.lab_summon_ad.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_summon_ad_hero");
                }
                this.resetResourcesSpriFame("ui/hero_pub/pub_prop_scroll/spriteFrame",this.img_prop);
                break;
            case Msg.TSummonType.ESummonType_Friend:
                this.node_diamond.active = false;
                this.node_friend.active = true;
                this.btn_hero_summon.interactable = true;
                this.btn_friend_summon.interactable = false;
                this.resetResourcesSpriFame("ui/hero_pub/pub_call_ad_friend/spriteFrame",this.img_summon_ad);
                if(this.lab_summon_ad)
                {
                    this.lab_summon_ad.string = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_summon_ad_friend");
                }
                this.resetResourcesSpriFame("ui/hero_pub/pub_prop_heart/spriteFrame",this.img_prop);
                break;
        }
        this._curSummonType = value;
    }

    

    public resetResourcesSpriFame(path:string,objSprite : Sprite)
    {
        ResMgr.getInstance().loadSpriteFrame(path,(err: Error | null, spriteFrame: SpriteFrame | null) => {
            objSprite.spriteFrame = spriteFrame;
        },"PopHeroPub");
    }

    public showPromptWindow(info : XStruct.common_one_info.Record, submitFunc :Function | null = null)
    {
        let callCloseFunc = ()=>{
            if(submitFunc)
            {
                submitFunc();
            }
            else{
                PopMgr.getInstance().deleteWindow();
            }
        }
        let callSummonTenFunc = ()=>{
            if(submitFunc)
            {
                submitFunc();
            }
            PopMgr.getInstance().deleteWindow();
        }
        // if(mode == 1)
        // {
        //     PopMgr.getInstance().popCommonOneWindow(title,content,mode, mode ==callCloseFunc);
        // }
        PopMgr.getInstance().popCommonOneWindow(info,info.mode == 0 ? callCloseFunc : callSummonTenFunc);
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
        let changeLabColor = (obj : Label,bWhite : boolean)=>{
            obj.color = bWhite ? Color.WHITE :  Color.RED ;
        }

        let nPlayerDiamondsCounts =  GameModel.getInstance().getHeroPubModel().getPlayerDiamondCounts();
        if(img_one_remind && img_ten_remind)
        {
            img_one_remind.node.active = true; 
            img_ten_remind.node.active = true; 
        }
        if(this._curSummonType == Msg.TSummonType.ESummonType_Heroic)
        {
            if(imgdi_ten)
            {
                this.resetResourcesSpriFame("ui/hero_pub/pub_btn_violet/spriteFrame",imgdi_ten);
            }
            if(this._nScorllNum == 0)
            {
                if(img_one_remind && img_ten_remind)
                {
                   
                    img_one_remind.node.active = false; 
                    img_ten_remind.node.active = false; 
                }
                if(lab_one && img_one)
                {
                    this.resetResourcesSpriFame("ui/hero_pub/pub_diamond/spriteFrame",img_one);
                    img_one.node.setScale(0.25,0.25,1);
                    lab_one.string = "x" + String(XConsts.PUB_SUMMON_DIAMOND_ONE_COSUME);
                    nPlayerDiamondsCounts >= XConsts.PUB_SUMMON_DIAMOND_ONE_COSUME ? changeLabColor(lab_one,true) : changeLabColor(lab_one,false);

                }
                if(lab_ten && img_ten)
                {
                    this.resetResourcesSpriFame("ui/hero_pub/pub_diamond/spriteFrame",img_ten);
                    img_ten.node.setScale(0.25,0.25,1);
                    lab_ten.string = "x" + String(XConsts.PUB_SUMMON_DIAMOND_TEN_COSUME);
                    nPlayerDiamondsCounts >= XConsts.PUB_SUMMON_DIAMOND_TEN_COSUME ? changeLabColor(lab_ten,true) : changeLabColor(lab_ten,false);
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
                    this.resetResourcesSpriFame("ui/hero_pub/pub_prop_scroll/spriteFrame",img_one);
                    img_one.node.setScale(0.5,0.5,1);
                    lab_one.string = String(XConsts.PUB_SUMMON_SCROLL_ONE_COSUME);
                    this._nScorllNum >= XConsts.PUB_SUMMON_SCROLL_ONE_COSUME ? changeLabColor(lab_one,true) : changeLabColor(lab_one,false);
                }
                if(lab_ten && img_ten)
                {
                    this.resetResourcesSpriFame("ui/hero_pub/pub_prop_scroll/spriteFrame",img_ten);
                    img_ten.node.setScale(0.5,0.5,1);
                    lab_ten.string = String(XConsts.PUB_SUMMON_SCROLL_TEN_COSUME);
                    this._nScorllNum >= XConsts.PUB_SUMMON_SCROLL_TEN_COSUME ? changeLabColor(lab_ten,true) : changeLabColor(lab_ten,false);
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
                this.resetResourcesSpriFame("ui/hero_pub/pub_prop_heart/spriteFrame",img_one);
                img_one.node.setScale(0.5,0.5,1);
                lab_one.string = String(XConsts.PUB_SUMMON_FRIEND_ONE_COSUME);
                this._nFriendHeartNum >= XConsts.PUB_SUMMON_FRIEND_ONE_COSUME ? changeLabColor(lab_one,true) : changeLabColor(lab_one,false);
            }
            if(lab_ten && img_ten)
            {
                this.resetResourcesSpriFame("ui/hero_pub/pub_prop_heart/spriteFrame",img_ten);
                img_ten.node.setScale(0.5,0.5,1);
                lab_ten.string = String(XConsts.PUB_SUMMON_FRIEND_TEN_COSUME);
                this._nFriendHeartNum >= XConsts.PUB_SUMMON_FRIEND_TEN_COSUME ? changeLabColor(lab_ten,true) : changeLabColor(lab_ten,false);
            }
        }
        
    }


    public updateProgressProcess()
    {
        this._nHeroSummonProgress = GameModel.getInstance().getHeroPubModel().getPlayerSummonScore();

        if(this.lab_bar_info)
        {
            var strInfo = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_bar_info");
            var newStr = strInfo.replace("{0}",String(XConsts.PUB_HERO_SUMMON_COUNT_MAX - this._nHeroSummonProgress));
            this.lab_bar_info.string = newStr
        }
        var nodWindow = this.node.getChildByName("window");
        var node_ordinary = nodWindow?.getChildByName("node_ordinary");
        var nodeDiamond = node_ordinary?.getChildByName("node_diamond");
        var barProgress = nodeDiamond?.getChildByName("bar_progress");
        var barCompoent = barProgress?.getComponent(ProgressBar);
        var labBarProgress = nodeDiamond?.getChildByName("lab_bar_progress");
        var labCompoent = labBarProgress?.getComponent(Label);
        if(barCompoent)
        {
            barCompoent.progress = this._nHeroSummonProgress /XConsts.PUB_HERO_SUMMON_COUNT_MAX ;
        }
        if(labCompoent)
        {
            var str = "{0}/30";
            labCompoent.string = str.replace("{0}",String(this._nHeroSummonProgress));
        }
    }

    public notifyPubSummonHeroHandle ( msgData: Msg.SummonHeroA){

        if (msgData.err == Msg.TErrorCode.ERR_OK) {
            if(msgData.summonType != Msg.TSummonType.ESummonType_Wonder)
            {
                if(this.isActive())
                {
                    PopMgr.getInstance().popSummonSettleWindow(msgData,XConsts.POP_SUMMON_TYPE.HeroPub);
                }   
                this.addPubNotifyHandler();
                this.updateImgPropNum();
                this.updateProgressProcess();
                this.updateBtnSummonState();
                this.updateShowNodeToggle();
            }
           
        }
        else
        {
            //此处消息错误处理 
        }
    }
    onDestroy(){
        console.log("hero pub destory");
        this.removePubNotifyHandler();
        // this.node.off("OpenPubNotify");
    }

    public onSubmit(nSummonType : Msg.TSummonType,nConsumeType : Msg.TSummonConsumeType, bIsOneOrTen : boolean)
    {
        let summonHeroR : Msg.SummonHeroR = {
             summonType : nSummonType,
            consumeType : nConsumeType,
            isOneOrTen : bIsOneOrTen
        }
        console.log("pub submit",summonHeroR);
        MsgMgr.getInstance().getMsgHeroPub().requestSummonHeroR(summonHeroR);
    }

    public addPubNotifyHandler()
    {
        console.log("开启");
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_pub_summon_hero,this.notifyPubSummonHeroHandle,this);
    }

    public removePubNotifyHandler()
    {
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_pub_summon_hero,this.notifyPubSummonHeroHandle,this);
    }


    // public show()
    // {
    //     super.show();
    //     this.addPubNotifyHandler();
    //     this.updateImgPropNum();
    //     this.updateProgressProcess();
    //     this.updateBtnSummonState();
    //     this.updateShowNodeToggle();
    // }


    private _onToggleContainerClick(event: Event, customEventData: string){

        let tog:Toggle = (event as any);
        let  selectedToggle = tog.node.getComponent(Toggle);
        
        if(tog.node.name == "toggle_ordinary" &&  selectedToggle?.isChecked)
        {
            this.node_ordinary && (this.node_ordinary.active = true);
            this.node_wonder && (this.node_wonder.active = false);
            this._strSummonExplainTitle  = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_SUMMONDESCTITLE) ;
            this._strSummonExplainContent  = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_SUMMONDESC);
        }
        else if(tog.node.name == "toggle_senior" &&  selectedToggle?.isChecked)
        {
            this.node_ordinary && (this.node_ordinary.active = false);
            this.node_wonder && (this.node_wonder.active = true);
            this._strSummonExplainTitle  = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_WONDERSUMMONEXPLAIN) ;
            this._strSummonExplainContent  = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_WONDERSUMMONCONTENT);
        }
    }

    public updateShowNodeToggle()
    {
        let curLevel = GameModel.getInstance().getHeroPubModel().getPlayerLevel();
        if(this.node_togglecontainer)
        {
            curLevel >= XConsts.PUB_OPEN_WONDER_SUMMON_LEVEL ? this.node_togglecontainer.node.active = true : this.node_togglecontainer.node.active = false;
            if(this.node_togglecontainer.node.activeInHierarchy)
            {
                GameModel.getInstance().getHeroPubModel().initWonderHeartHeroIdList();
                ResMgr.getInstance().loadPrefab('prefabs_ui/pub/pub_wonder_summon', (err:any,res:any)=>{
                    let p = instantiate( res );
                    this.node_wonder?.addChild(p);
                },"PopHeroPub");
            }
        }
       
    }
}


