
import { _decorator, Component, Node,Label,ProgressBar,Button,Sprite,Color,resources,Prefab,RichText,instantiate,SpriteFrame, Vec3 } from 'cc';
import { GameModel } from '../../../model/GameModel';
import { XConsts } from '../../../model/const/XConsts';
import { TableName, ValueMgr } from "../../../model/ValueMgr";
import { HeroIcon } from '../../hero/HeroIcon';
import { ItemEquipType,ItemEquipCell } from '../../menu/ItemEquipCell';
import { PopMgr } from '../../../control/PopMgr';
import { ElementPubHeroIcon } from './ElementPubHeroIcon';
import { MsgMgr } from '../../../control/MsgMgr';
import { NotifyMgr } from '../../../control/NotifyMgr';
import { XFuns } from '../../../model/const/XFuns';
import {PopPubWonderSummonSettle} from "./PopPubWonderSummonSettle";
import { ResMgr } from '../../../control/ResMgr';
import { PopHeroPub } from "../../../view/features/pub/PopHeroPub";
const { ccclass, property } = _decorator;

@ccclass('ModPubWonderSummon')
export class ModPubWonderSummon extends Component {
    @property({type: Node})
    public node_hero:Node | null = null;
    @property({type: Node})
    public node_dimond:Node | null = null;
    @property({type: Node})
    public node_equip_0:Node | null = null;
    @property({type: Node})
    public node_equip_1:Node | null = null;
    @property({type: Node})
    public node_equip_2:Node | null = null;
    @property({type: Node})
    public node_fragment_0:Node | null = null;
    @property({type: Node})
    public node_fragment_1:Node | null = null;
    @property({type: Label})
    public lab_prop_num = null as unknown as Label;
    @property({type: RichText})
    public lab_bar_rich = null as unknown as RichText;

    @property({type: Label})
    public lab_summon_ad= null as unknown as Label;

    @property({type: Label})
    public lab_summon_detail= null as unknown as Label;


    @property({type: Node})
    public node_fivestar:Node | null = null;

    @property({type: Node})
    public img_update:Node | null = null;

    @property({type: Button})
    public btn_detail = null as unknown as Button;

    @property({type: Button})
    public btn_summon_one = null as unknown as Button;

    @property({type: Button})
    public btn_summon_ten = null as unknown as Button;


    @property({type: Node})
    public node_wonder_summonsettle= null as unknown as Node;
    //奇迹召唤召唤进度
    private _nWonderSummonProgress : number = 0;

    public node_parent_window : PopHeroPub = null as unknown as PopHeroPub;

    start () {

        this.lab_summon_ad.string = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_WONDERSUMMON);
        this.lab_summon_detail.string = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_WONDERSUMMONAWARD);

        this.btn_detail.node.on(Node.EventType.TOUCH_END, this._onBtnDetailClick, this);
        this.img_update?.on(Node.EventType.TOUCH_END, this._onImgUpdateClick, this);


        this.btn_summon_one.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_summon_ten.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.addPubNotifyHandler();

        this.node_wonder_summonsettle.active = false;
        // [3]
        this.updateHeartHeroIcon();
        this.updateProgressProcess();
        this.updateBtnSummonState();
        this.initHeroIconPrefab();
    }

    private _onBtnDetailClick(event:any)
    {
        this.node_parent_window.setIsNeedHide(true);
        PopMgr.getInstance().popPubWonderRewardListWindow();
    }

    public updateBtnSummonState()
    {
        var lab_one = this.btn_summon_one.node.getChildByName("lab_summon_num")?.getComponent(Label);
        var img_one = this.btn_summon_one.node.getChildByName("img_summon_icon")?.getComponent(Sprite);
        var img_one_remind = this.btn_summon_one.node.getChildByName("img_summon_remind")?.getComponent(Sprite);
        var lab_ten = this.btn_summon_ten.node.getChildByName("lab_summon_num")?.getComponent(Label);
        var img_ten = this.btn_summon_ten.node.getChildByName("img_summon_icon")?.getComponent(Sprite);
        var img_ten_remind = this.btn_summon_ten.node.getChildByName("img_summon_remind")?.getComponent(Sprite);
        let changeLabColor = (obj : Label,bWhite : boolean)=>{
            obj.color = bWhite ? Color.WHITE :  Color.RED ;
        }

        var nCurDiamonds =  GameModel.getInstance().getHeroPubModel().getPlayerDiamondCounts();
        var nScrollCounts = GameModel.getInstance().getHeroPubModel().getHeroicSummonScrollNum();
        if(nScrollCounts == 0)
        {
            lab_one && (lab_one.string = "x" + String(XConsts.PUB_SUMMON_WONDER_ONE_COSUME)) && changeLabColor(lab_one,nCurDiamonds >= XConsts.PUB_SUMMON_WONDER_ONE_COSUME);
            lab_ten && (lab_ten.string = String(XConsts.PUB_SUMMON_WONDER_TEN_COSUME)) && changeLabColor(lab_ten,nCurDiamonds >= XConsts.PUB_SUMMON_WONDER_TEN_COSUME);
            img_one_remind && (img_one_remind.node.active = nCurDiamonds >= XConsts.PUB_SUMMON_WONDER_ONE_COSUME);
            img_ten_remind && (img_ten_remind.node.active = nCurDiamonds >= XConsts.PUB_SUMMON_WONDER_TEN_COSUME);
            img_one && this.resetResourcesSpriFame("ui/hero_pub/pub_diamond/spriteFrame",img_one);
            img_ten && this.resetResourcesSpriFame("ui/hero_pub/pub_diamond/spriteFrame",img_ten);
            img_one?.node.setScale(new Vec3(0.25,0.25,1));
            img_ten?.node.setScale(new Vec3(0.25,0.25,1));
        }
        else
        {
            if(img_one_remind && img_ten_remind)
            {
                if(nScrollCounts >= XConsts.PUB_SUMMON_SCROLL_TEN_COSUME)
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
            img_one?.node.setScale(new Vec3(0.75,0.75,1));
            img_ten?.node.setScale(new Vec3(0.75,0.75,1));
            img_one && this.resetResourcesSpriFame("ui/hero_pub/wonder_scroll/spriteFrame",img_one);
            img_ten && this.resetResourcesSpriFame("ui/hero_pub/wonder_scroll/spriteFrame",img_ten);
        }
    }
    public updateProgressProcess()
    {
        this._nWonderSummonProgress = GameModel.getInstance().getHeroPubModel().getPlayerWonderTimes();
        this.lab_prop_num.string =  XFuns.FormatNumber(GameModel.getInstance().getHeroPubModel().getHeroicSummonScrollNum());
        if(this.lab_bar_rich)
        {
            var strInfo = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_WONDERSUMMONRESIDUE);
            var newStr = strInfo.replace("{0}",String(XConsts.PUB_WONDER_SUMMON_COUNT_MAX - this._nWonderSummonProgress));
            this.lab_bar_rich.string = newStr
        }
        var nodWindow = this.node.getChildByName("window");
        var node_wonder_progress = nodWindow?.getChildByName("node_wonder_progress");
        var barProgress = node_wonder_progress?.getChildByName("bar_progress");
        var barCompoent = barProgress?.getComponent(ProgressBar);
        if(barCompoent)
        {
            barCompoent.progress = this._nWonderSummonProgress /XConsts.PUB_WONDER_SUMMON_COUNT_MAX ;
        }

    }


    //显示界面上7个预制体信息
    public initHeroIconPrefab()
    {
        ResMgr.getInstance().loadPrefab('prefabs_ui/main/hero_icon', (err: Error | null, res: Prefab | null)=>{
            let _heroIcon = instantiate(res as Prefab);
            _heroIcon.setScale(0.4,0.4,1)
            let script = _heroIcon.getComponent(HeroIcon) as HeroIcon; 
            script.initUIHeroIconInfo(GameModel.getInstance().getHeroPubModel().getPlayerWonderHero(),XConsts.HERO_ICON_TYPE.WonderSummon);    
            script.setBtnCallBack(()=>{
                PopMgr.getInstance().popOpenBookHeroDetail(GameModel.getInstance().getHeroPubModel().getPlayerWonderHero());
            })
            this.node_hero?.addChild(_heroIcon);   
        },"ModPubWonderSummon");

        ResMgr.getInstance().loadPrefab('prefabs_ui/main/itemequip_cell', (err: Error | null, res: Prefab | null)=>{
            let itemEquipCell = instantiate(res as Prefab );
            //钻石 
            itemEquipCell.setScale(0.6,0.6,1)
            let id = Msg.TObjectType.EObject_VRmb; 
            let num = XConsts.PUB_UI_WONDER_DEFAULT_DIAMOND_REWARD;
            // 设置装备点击回调
            let script = itemEquipCell.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemType(id, num, ItemEquipType.goods, 
                ()=>{
                    this.node_parent_window.setIsNeedHide(false);
                    PopMgr.getInstance().popItemUseSellView(id,ItemEquipType.goods,false);
            });  

            this.node_dimond?.addChild(itemEquipCell);   
        },"ModPubWonderSummon");

        for(let i = 0; i < 3; i++)
        {
            ResMgr.getInstance().loadPrefab('prefabs_ui/main/itemequip_cell', (err: Error | null, res: Prefab | null)=>{
                let itemEquipCell = instantiate(res as Prefab); 
                itemEquipCell.setScale(0.4,0.4,1)
                let id = 45 + i; 
                let num = 1;
                // 设置装备点击回调
                let script = itemEquipCell.getComponent("ItemEquipCell") as ItemEquipCell;
                script.setItemType(id, num, ItemEquipType.equip, 
                    ()=>{
                        console.log("装备")
                        this.node_parent_window.setIsNeedHide(false);
                        PopMgr.getInstance().popEquipInfoView(id,true);
                });  
    
                switch(i)
                {
                    case 0 :
                        this.node_equip_0?.addChild(itemEquipCell);  
                        break;
                    case 1 :
                        this.node_equip_1?.addChild(itemEquipCell);  
                        break;
                    case 2 :
                        this.node_equip_2?.addChild(itemEquipCell);  
                        break;
                }
            },"ModPubWonderSummon");
        }

        for(let i = 0; i < 2; i++)
        {
            ResMgr.getInstance().loadPrefab('prefabs_ui/pub/pub_heroicon', (err: Error | null, res: Prefab | null)=>{
                let itemEquipCell = instantiate(res  as Prefab); 
                itemEquipCell.setScale(0.4,0.4,1)
                // let id = 45 + i; 
                // let num = 1;
                var info : XStruct.fragment_synthesis_info.IRecord = {
                    frame :"",
                    camp : "",
                    star : 0,
                    quality : "",
                    icon : "",
                    type : 0,
                    maxNum : 0,
                    curNum : 0,
                    heroName : "",
                    campName : "",
                    classesName : "",
                    bg : "",
                    param : 0
                }  
                info.type = Msg.TFragmentType.EFragmentType_Random;
                info.star = 4;
                if(i == 1)
                {
                    info.type = Msg.TFragmentType.EFragmentType_CampRandom;
                    info.camp = "ui/common/team/" + XConsts.KHeroCampIcon[1] + "/spriteFrame";
                    info.campName = XConsts.KCampName[1];
                }
                info.quality = "ui/common/icon/" + XConsts.KFragmentQualitySpriteName[0] + "/spriteFrame";
                info.frame = "ui/common/icon/" + XConsts.KFragmentFrameSpriteName[0] + "/spriteFrame";
               
                info.maxNum = 30;
                // 设置装备点击回调
                let script = itemEquipCell.getComponent(ElementPubHeroIcon) as ElementPubHeroIcon;
                script.setWonderSummonShow(true,info);
                script.setBtnCallBack( 
                    ()=>{
                        console.log("碎片");
                        this.node_parent_window.setIsNeedHide(false);
                        PopMgr.getInstance().popFragmentSynthesisWindow(info,()=>{console.log("碎片合成")},true);
                });  
    
                switch(i)
                {
                    case 0 :
                        this.node_fragment_0?.addChild(itemEquipCell);  
                         break;
                    case 1 :
                        this.node_fragment_1?.addChild(itemEquipCell);  
                        break;
                }
            },"ModPubWonderSummon");
        }
       
    }
  

    public updateHeartHeroIcon()
    {
        ResMgr.getInstance().loadPrefab('prefabs_ui/main/hero_icon', (err: Error | null, res: Prefab | null)=>{
            let _heroIcon = instantiate(res as Prefab);
            _heroIcon.setScale(0.4,0.4,1)
            let script = _heroIcon.getComponent(HeroIcon) as HeroIcon; 
            script.initUIHeroIconInfo(GameModel.getInstance().getHeroPubModel().getPlayerWonderHero(),XConsts.HERO_ICON_TYPE.WonderSummon);    
            script.setBtnCallBack(()=>{
                PopMgr.getInstance().popPubWonderHeartHeroWindow();
            })
            this.node_fivestar?.addChild(_heroIcon);   
        },"ModPubWonderSummon");

    }

    private _onImgUpdateClick(event : any)
    {
        // GameModel.getInstance().getHeroPubModel().initWonderHeartHeroIdList();
        PopMgr.getInstance().popPubWonderHeartHeroWindow();
    } 

    private _onButtonClick(event:any){
        let nPlayerDiamondsCounts = GameModel.getInstance().getHeroPubModel().getPlayerDiamondCounts();
        let nScrollCounts = GameModel.getInstance().getHeroPubModel().getHeroicSummonScrollNum();
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
            case this.btn_summon_one:
                console.log("summon_one");
                //PopMgr.getInstance().popPubWonderSummonSettleWindow();
                if(nScrollCounts >= XConsts.PUB_SUMMON_SCROLL_ONE_COSUME)
                {
                
                    console.log("pppppppp 单个卷轴");
                    this.onSubmit(Msg.TSummonType.ESummonType_Wonder,Msg.TSummonConsumeType.ESummonConsumeType_Wonder,true);
                }
                else 
                {
                    if(nPlayerDiamondsCounts >= XConsts.PUB_SUMMON_WONDER_ONE_COSUME)
                    {
                        //普通召唤 中的钻石召唤
                        console.log("pppppppp 单个钻石");
                        this.onSubmit(Msg.TSummonType.ESummonType_Wonder,Msg.TSummonConsumeType.ESummonConsumeType_VRmb,true);
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
                break; 
            case this.btn_summon_ten:
                    if(nScrollCounts > 0 && nScrollCounts < XConsts.PUB_SUMMON_SCROLL_TEN_COSUME)
                    {
                        let nShortageDiamonds = XConsts.PUB_SUMMON_WONDER_ONE_COSUME *  (XConsts.PUB_SUMMON_SCROLL_TEN_COSUME - nScrollCounts);
                        if(nPlayerDiamondsCounts >= nShortageDiamonds)
                        {
                            let callFunc = ()=>{
                                this.onSubmit(Msg.TSummonType.ESummonType_Wonder,Msg.TSummonConsumeType.ESummonConsumeType_Wonder_VRmb,false);
                            }
                            var str = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_BUYWONDERSUMMON);
                            
                            str = str.replace("{0}",String(nShortageDiamonds));
                            str = str.replace("{1}",String(XConsts.PUB_SUMMON_SCROLL_TEN_COSUME - nScrollCounts));
                            str = str.replace("{2}",String(XConsts.PUB_SUMMON_WONDER_ONE_COSUME));

                            info.title = "注意";
                            info.content = str;
                            info.mode = 1;
                            info.isRichLabMode = true;
                            this.showPromptWindow(info,callFunc);
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
                            var str = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_BUYWONDERSUMMON);
                            
                            str = str.replace("{0}",String(nShortageDiamonds));
                            str = str.replace("{1}",String(XConsts.PUB_SUMMON_SCROLL_TEN_COSUME - nScrollCounts));
                            str = str.replace("{2}",String(XConsts.PUB_SUMMON_WONDER_ONE_COSUME));

                            info.title = "注意";
                            info.content = str;
                            info.mode = 1;
                            info.isRichLabMode = true;
                            this.showPromptWindow(info,callFunc);
                            
                        }
                    }
                    else if(nScrollCounts >= XConsts.PUB_SUMMON_SCROLL_TEN_COSUME)
                    {
                        //server此处应该向服务区发消息，然后在回调函数里面处理弹窗内容
                        console.log("pppppppppp 卷轴10连");
                        this.onSubmit(Msg.TSummonType.ESummonType_Wonder,Msg.TSummonConsumeType.ESummonConsumeType_Wonder,false);
                    }
                    else 
                    {
                        if(nPlayerDiamondsCounts >= XConsts.PUB_SUMMON_WONDER_TEN_COSUME)
                        {
                            console.log("pppppppppp 钻石10连");
                            this.onSubmit(Msg.TSummonType.ESummonType_Wonder,Msg.TSummonConsumeType.ESummonConsumeType_VRmb,false);
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
                break;           
        }
    }

    public onSubmit(nSummonType : Msg.TSummonType,nConsumeType : Msg.TSummonConsumeType, bIsOneOrTen : boolean)
    {
        let wonderSummonHeroR : Msg.WonderSummonHeroR = {
             summonType : nSummonType,
            consumeType : nConsumeType,
            isOneOrTen : bIsOneOrTen
        }
        console.log("pub submit",wonderSummonHeroR);
        MsgMgr.getInstance().getMsgHeroPub().requestWonderSummonHeroR(wonderSummonHeroR);
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

    public addPubNotifyHandler()
    {
        console.log("开启");
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_pub_wonder_summon_hero,this.notifyWonderSummonHeroHandle,this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_pub_wonder_hero_select,this.notifyWonderSummonHeroSelectHandle,this);
    }

    public notifyWonderSummonHeroHandle ( msgData: Msg.WonderSummonHeroA){
        console.log("wwwwwwwwwwwwwwwwwwww",msgData);
        if (msgData.err == Msg.TErrorCode.ERR_OK) {
            let playerModel = GameModel.getInstance().getPlayerModel();
            let nSrollNums = GameModel.getInstance().getHeroPubModel().getHeroicSummonScrollNum();
            switch(msgData.consumeType)
            {
                case Msg.TSummonConsumeType.ESummonConsumeType_Wonder:
                    playerModel.consumeObjectByNum(Msg.TObjectType.EObject_WonderGem, msgData.consumeNum,Msg.TObjectConsumeType.EObjectConsumeType_HeroSummon);
                    playerModel.updateWonderTimes(msgData.summonScore);
                    console.log("消费奇迹宝石 ",msgData.consumeNum);
                    break;
                 case Msg.TSummonConsumeType.ESummonConsumeType_VRmb:
                    playerModel.consumeObjectByNum(Msg.TObjectType.EObject_VRmb, msgData.consumeNum,Msg.TObjectConsumeType.EObjectConsumeType_HeroSummon);
                    playerModel.updateWonderTimes(msgData.summonScore);
                    NotifyMgr.getInstance().notify(NotifyMgr.event_coin_diamond_level_change);
                    console.log("消费钻石 ",msgData.consumeNum);
                    break;
                case Msg.TSummonConsumeType.ESummonConsumeType_Wonder_VRmb:
                    playerModel.consumeObjectByNum(Msg.TObjectType.EObject_VRmb, msgData.consumeNum,Msg.TObjectConsumeType.EObjectConsumeType_HeroSummon);
                    playerModel.consumeObjectByNum(Msg.TObjectType.EObject_WonderGem,nSrollNums,Msg.TObjectConsumeType.EObjectConsumeType_HeroSummon);
                    playerModel.updateWonderTimes(msgData.summonScore);
                    console.log("消费钻石 ",msgData.consumeNum);
                    console.log("消费奇迹宝石 ",nSrollNums);
                    NotifyMgr.getInstance().notify(NotifyMgr.event_coin_diamond_level_change);
                    break;
            }
            this.updateBtnSummonState();
            this.updateProgressProcess(); 
            //展示奇迹召唤界面
            this.showSummonSettle(msgData);
            // PopMgr.getInstance().popPubWonderSummonSettleWindow();     
        }
        else
        {
            //此处消息错误处理 
        }
    }

    public notifyWonderSummonHeroSelectHandle ( msgData: Msg.WonderHeroSelectA){
        if (msgData.err == Msg.TErrorCode.ERR_OK) {
            let playerModel = GameModel.getInstance().getPlayerModel();
            playerModel.updateWonderHero(msgData.WonderHero);
            this.updateHeartHeroIcon();
        }
        else
        {
            //此处消息错误处理 
        }
    }

    public removePubNotifyHandler()
    {
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_pub_wonder_summon_hero,this.notifyWonderSummonHeroHandle,this);
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_pub_wonder_hero_select,this.notifyWonderSummonHeroSelectHandle,this);
        
    }

    onDestroy(){
        console.log("wondersummon destory");
        this.removePubNotifyHandler();
        // this.node.off("OpenPubNotify");
    }

    public resetResourcesSpriFame(path:string,objSprite : Sprite)
    {
        ResMgr.getInstance().loadSpriteFrame(path,(err: Error | null, spriteFrame: SpriteFrame | null) => {
            objSprite.spriteFrame = spriteFrame;
        },"PopWonderSummon");
    }

    public showSummonSettle(msgData : Msg.WonderSummonHeroA)
    {
        this.node_wonder_summonsettle.active = true;

        let nodeSummonSettle = this.node_wonder_summonsettle.getChildByName("pub_wonder_summonsettle");

        if(nodeSummonSettle)
        {
            nodeSummonSettle.active = true;
            let script = nodeSummonSettle.getComponent(PopPubWonderSummonSettle); 
            script && script.initShowAwardList(msgData);
        }
        else
        {
            ResMgr.getInstance().loadPrefab('prefabs_ui/pub/pub_wonder_summonsettle', (err: Error | null, res: Prefab | null)=>{
                let _settle = instantiate(res as Prefab);
                // _heroIcon.setScale(0.4,0.4,1)
                let script = _settle.getComponent(PopPubWonderSummonSettle) as PopPubWonderSummonSettle; 
                // script.initUIHeroIconInfo(GameModel.getInstance().getHeroPubModel().getPlayerWonderHero(),XConsts.HERO_ICON_TYPE.WonderSummon);    
                // script.setBtnCallBack(()=>{
                //     PopMgr.getInstance().popOpenBookHeroDetail(GameModel.getInstance().getHeroPubModel().getPlayerWonderHero());
                // })
                script.initShowAwardList(msgData);
                this.node_wonder_summonsettle.addChild(_settle);   
            },"ModPubWonderSummon");
        }
        
    }

    public setParentWindow(node : PopHeroPub)
    {
        this.node_parent_window = node;
    }
}

