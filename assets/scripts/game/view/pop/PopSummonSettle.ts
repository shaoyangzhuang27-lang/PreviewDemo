import { _decorator, Component, Node,Label,ScrollView,resources,instantiate, Vec3, Size,Sprite,UITransform,Button,SpriteFrame, Layout, Color, Game } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { HeroIcon } from '../hero/HeroIcon';
import { GameModel } from '../../model/GameModel';
import { NotifyMgr } from '../../control/NotifyMgr';
import { MsgMgr } from '../../control/MsgMgr';
import { PopMgr } from '../../control/PopMgr';
import { ResMgr } from '../../control/ResMgr';

const { ccclass, property } = _decorator;

@ccclass('PopSummonSettle')
export class PopSummonSettle extends PopBase {
    @property({type: Label})
    public lab_title = null as unknown as Label;

    // @property({type: LabelComponent})
    // public lab_content:LabelComponent | null = null;

    @property({type: Label})
    public lab_hero_name = null as unknown as Label;

    
    @property({type: Sprite})
    public img_profession= null as unknown as Sprite;

    @property({type: Sprite})
    public img_camp= null as unknown as Sprite;

    @property({type: Button})
    public btn_summon = null as unknown as Button;

    @property({type :  Node})
    public starlist:Node[] = [];

    @property({type: Node})
    public btn_sure = null as unknown as Node;

    @property({type: Node})
    public btn_fragment_sure = null as unknown as Node;
    // private _submitCallFun:Function | null = null;

    @property({type: Node})
    public node_hero = null as unknown as Node;
    

    @property({type: Label})
    public lab_summon_desc = null as unknown as Label;

    @property({type :  ScrollView})
    public scroll_heroicon_view:ScrollView = null as unknown as ScrollView;

    
    //弹窗来源类型
    private _popWindowType : number = XConsts.POP_SUMMON_TYPE.HeroPub;

    //是否一次召唤
    private _bIsOne : boolean = false;

    //召唤类型
    private _nSummonType : number = 0;
    //消费类型
    private _nSummonConsumeType : number = 0;

    private _HeroList : Array<Msg.IHeroInfo> = [];

    private _arrDecomposeHeroId : Array<number> = [];

    private _arrStarPos : Array<Vec3> = [];



    start () {
        super.start();
        var settleTitle = ValueMgr.getInstance().getItemByField(TableName.language_data,XConsts.SUMMON_SETTLE_TITLE) as Config.language_data.Record;
        this.lab_title.string = settleTitle.cn;
        this.btn_summon.node.on(Node.EventType.TOUCH_END, this._onBtnSummonClick, this);
        this.btn_sure.on(Node.EventType.TOUCH_END, this._onBtnSureClick, this);
        // this._initStarPos();
        this.initUI();

        if(this._popWindowType ==XConsts.POP_SUMMON_TYPE.HeroPub)
        {
            console.log("notifySummonSetleHeroHandl")
            NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_pub_summon_hero,this.notifySummonSetleHeroHandle,this);
        }

        this.addNotifyPubHeroDecomposeHandler();
        console.log("zzzzzzzzzzzz diamond", GameModel.getInstance().getHeroPubModel().getIsAutoDecompose());
        // console.log("palyer heros", GameModel.getInstance().getHeroesModel().getHeroList());
        // this.initHeroModelInfo(3042500);
    }

    
    private _onBtnSureClick(event : any)
    {
        if(GameModel.getInstance().getHeroPubModel().getIsAutoDecompose())
        {
            this._arrDecomposeHeroId = GameModel.getInstance().getHeroesModel().getAutoDecomposeHeroDyncIDList(XConsts.AUTODECOMPOSE_MAX_STARS);
            if(this._arrDecomposeHeroId.length > 0)
            {
                console.log("decompose id",this._arrDecomposeHeroId);
                let msg : Msg.HeroDecomposeR  = new Msg.HeroDecomposeR();
                msg.heroIDList = Array.from(this._arrDecomposeHeroId);
                // MainClient.instance.RequestMessage (Msg.MsgType.TheHeroDecomposeR, msg, Msg.MsgType.TheHeroDecomposeA, OnRecvHeroDecompose);
                MsgMgr.getInstance().getMsgHeroPub().requestHeroDecomposeR(msg);
            }
            else
            {
                PopMgr.getInstance().deleteWindow();
            }
        }
        else
        {
            PopMgr.getInstance().deleteWindow();
        }
    }

    public notifySummonSetleHeroHandle ( msgData: Msg.SummonHeroA){
        if (msgData.err == Msg.TErrorCode.ERR_OK) {
            console.log(" SummonSettleHeroSummon",msgData);
            console.log("summonsettle diamond", GameModel.getInstance().getHeroPubModel().getPlayerDiamondCounts());

            this.initDataFromMsgData(msgData,this._popWindowType);
            this.initUI();
        }
        else
        {
            //此处消息错误处理 
        }
    }

    public _onBtnSummonClick(event : any)
    {
        let summonHeroR : Msg.SummonHeroR = {
            summonType : this._nSummonType,
            consumeType : this._nSummonConsumeType,
            isOneOrTen : this._bIsOne,
       }

       if(this._nSummonConsumeType == Msg.TSummonConsumeType.ESummonConsumeType_Scroll_VRmb)
       {
            this._nSummonConsumeType = Msg.TSummonConsumeType.ESummonConsumeType_VRmb;
       }
    //    else if(this._nSummonConsumeType == Msg.TSummonConsumeType.ESummonConsumeType_Wonder_VRmb)
    //    {
    //        this._nSummonConsumeType = Msg.TSummonConsumeType.ESummonConsumeType_Wonder;
    //    }

       let heroPubModel = GameModel.getInstance().getHeroPubModel();
       let nConsumeCounts = 0;
       let nCurCounts = 0;
       

        switch(this._nSummonConsumeType)
        {
            case Msg.TSummonConsumeType.ESummonConsumeType_VRmb :
                nCurCounts = heroPubModel.getPlayerDiamondCounts();
                if(this._nSummonType == Msg.TSummonType.ESummonType_Heroic)
                {
                    nConsumeCounts =this._bIsOne ? XConsts.PUB_SUMMON_DIAMOND_ONE_COSUME : XConsts.PUB_SUMMON_DIAMOND_TEN_COSUME;
                }
                // else if(this._nSummonType == Msg.TSummonType.ESummonType_Wonder)
                // {
                //     //奇迹召唤不弹召唤骑士界面
                //     nConsumeCounts = this._bIsOne ? XConsts.PUB_SUMMON_WONDER_ONE_COSUME : XConsts.PUB_SUMMON_WONDER_TEN_COSUME;
                // }
                break;
            case Msg.TSummonConsumeType.ESummonConsumeType_Scroll :
                nConsumeCounts = this._bIsOne ? XConsts.PUB_SUMMON_SCROLL_ONE_COSUME: XConsts.PUB_SUMMON_SCROLL_TEN_COSUME;
                nCurCounts = heroPubModel.getBaseSummonScrollNum();
                break;
            case Msg.TSummonConsumeType.ESummonConsumeType_FriendGift :
                nConsumeCounts = this._bIsOne ? XConsts.PUB_SUMMON_FRIEND_ONE_COSUME: XConsts.PUB_SUMMON_FRIEND_TEN_COSUME;
                nCurCounts = heroPubModel.getFriendSummonScrollNum();
                break;    
        }
       
        if(nCurCounts < nConsumeCounts)
        {
            if(this._nSummonConsumeType == Msg.TSummonConsumeType.ESummonConsumeType_VRmb)
            {
                console.log("钻石不足！！！");
            }
            else if(this._nSummonConsumeType == Msg.TSummonConsumeType.ESummonConsumeType_Scroll)
            {
                console.log("英雄契约不足");
            }
            else if(this._nSummonConsumeType == Msg.TSummonConsumeType.ESummonConsumeType_FriendGift)
            {
                console.log("爱心不足");
            }
        }
        else
        {
            MsgMgr.getInstance().getMsgHeroPub().requestSummonHeroR(summonHeroR);
        }
    }

    public initUI()
    {
        

        if(this.scroll_heroicon_view.content)
        {
            this.scroll_heroicon_view.content.removeAllChildren()
        }

        // console.log("hhhhhhhhhhh",this._HeroList);
        // console.log("ffffffffffff",this._HeroList.length);
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
                for(var i = 0; i < this._HeroList.length; i++)
                {
                    let reclineup_item = instantiate( res );
                    let script = reclineup_item.getComponent(HeroIcon);
                    reclineup_item.scale = new Vec3(0.75,0.75,1);
                    let subWidget = reclineup_item.getComponent(UITransform) as UITransform;
                    subWidget.contentSize = new Size(113,113);
                    script.initUIHeroIconInfo(this._HeroList[i].staticID,this._popWindowType);
                    this.scroll_heroicon_view.content?.addChild(reclineup_item);
                    if(i ==0)
                    {
                        this.initHeroModelInfo(this._HeroList[0].staticID);
                    }
                }    
        });
    }
    

    public initBtnSummonUI(summmonType : Msg.TSummonType,consumeType : Msg.TSummonConsumeType, bIsOne : boolean)
    {
        // var lab = this.btn_summon.node.getChildByName("lab")?.getComponent(Label);
        var lab_summon_num = this.btn_summon.node.getChildByName("lab_summon_num")?.getComponent(Label);
        var img_summon_icon = this.btn_summon.node.getChildByName("img_summon_icon")?.getComponent(Sprite);

        var strBtnSummonDescOne  = "召唤 1";  
        var strBtnSummonDescTen  = "召唤 10";  
        var changeLabColor = (nCounts : number,curNum : number)=>{
            if(nCounts < curNum)
            {
                lab_summon_num && (lab_summon_num.color = Color.RED);
            }
            else
            {
                lab_summon_num && (lab_summon_num.color = Color.WHITE);
            }
        }
        //消耗卷轴
        if (consumeType == Msg.TSummonConsumeType.ESummonConsumeType_Scroll) {
            if(summmonType == Msg.TSummonType.ESummonType_Heroic)
            {
                img_summon_icon && this.resetResourcesSpriFame("ui/hero_pub/pub_prop_scroll/spriteFrame",img_summon_icon);
                img_summon_icon && img_summon_icon.node.setScale(0.5,0.5,1);
                var curNum = bIsOne ? XConsts.PUB_SUMMON_SCROLL_ONE_COSUME : XConsts.PUB_SUMMON_SCROLL_TEN_COSUME
                lab_summon_num && (lab_summon_num.string = String(curNum));

                this.lab_summon_desc.string = bIsOne ? strBtnSummonDescOne : strBtnSummonDescTen;
                changeLabColor(GameModel.getInstance().getHeroPubModel().getBaseSummonScrollNum(),curNum);
            }
            // else if(summmonType == Msg.TSummonType.ESummonType_Wonder)
            // {
            //     //奇迹召唤卷轴不在这个界面弹窗
            // }

        } //消耗钻石  暂时只处理80级之前的显示
        else if (consumeType == Msg.TSummonConsumeType.ESummonConsumeType_VRmb) {

            if(summmonType == Msg.TSummonType.ESummonType_Heroic)
            {
                var curNum = bIsOne ? XConsts.PUB_SUMMON_DIAMOND_ONE_COSUME : XConsts.PUB_SUMMON_DIAMOND_TEN_COSUME
                img_summon_icon && img_summon_icon.node.setScale(0.25,0.25,1);
                lab_summon_num && (lab_summon_num.string = String(curNum));
                this.lab_summon_desc.string = bIsOne ? strBtnSummonDescOne : strBtnSummonDescTen;
                changeLabColor(GameModel.getInstance().getHeroPubModel().getPlayerDiamondCounts(),curNum);
            }
            // else if(summmonType == Msg.TSummonType.ESummonType_Wonder)
            // {
            //     //奇迹召唤宝石不在这个界面弹窗
            // }
            
        }//消耗友情
        else if (consumeType == Msg.TSummonConsumeType.ESummonConsumeType_FriendGift) 
        {
            img_summon_icon && this.resetResourcesSpriFame("ui/hero_pub/pub_prop_heart/spriteFrame",img_summon_icon);
            img_summon_icon && img_summon_icon.node.setScale(0.5,0.5,1);
            var curNum = bIsOne ? XConsts.PUB_SUMMON_FRIEND_ONE_COSUME : XConsts.PUB_SUMMON_FRIEND_TEN_COSUME
            lab_summon_num && (lab_summon_num.string = String(curNum));
            this.lab_summon_desc.string = bIsOne ? strBtnSummonDescOne : strBtnSummonDescTen;
            changeLabColor(GameModel.getInstance().getHeroPubModel().getFriendSummonScrollNum(),curNum);
        } 

    }

    public initHeroModelInfo(heroId : number | null | undefined)
    {

        if(heroId)
        {
            //5051402
            let heroInfo = ValueMgr.getInstance().getItemByField(TableName.heroes, heroId ) as Config.heroes.Record;
            var camp = "ui/common/team/" + XConsts.KHeroCampIcon[heroInfo.camp] + "/spriteFrame";
            var profession = "ui/book/" + XConsts.KClassesSpriteName[heroInfo.classes] + "/spriteFrame";

            var heroName = ValueMgr.getInstance().getItemByField(TableName.language_data,heroInfo.name) as Config.language_data.Record;
            this.lab_hero_name.string = heroName.cn
            this.resetResourcesSpriFame(camp,this.img_camp);
            this._initStarPos();
            this._setStar(heroInfo.star);
            this.resetResourcesSpriFame(profession,this.img_profession);
        }
       

    }

    private _initStarPos()
    {
        for (let index = 0; index < this.starlist.length; index++) {
            var pos =  this.starlist[index].getPosition();
            this._arrStarPos.push(instantiate(pos));
        }
    }

    private _reloadSprFram(objNode: Node, path: string) : void {
        ResMgr.getInstance().loadSpriteFrame(path, (err,spriteFrame:SpriteFrame | null) => {
            if(!err) {
                let sprite = objNode.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        },"PopHeroReplace");   
    }

    private _setStar(star:number)
    {

        let starNameList = ["星星初级","星星中级","星星高级"]
        let grade:number = Math.ceil(star/5) - 1;
        let yu:number = (star - 1) % 5 + 1;

        let starName = starNameList[grade];
        let starPath = "ui/common/icon/" + starName + "/spriteFrame"
        for (let index = 0; index < this.starlist.length; index++) {
            this.starlist[index].active = index < yu || yu == 0
            if (this.starlist[index].active) {
                this._reloadSprFram(this.starlist[index], starPath);
            }            
        }
        for (let index = 0; index < this.starlist.length; index++) {
            this.starlist[index].setPosition(this._arrStarPos[index]);
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

    public resetResourcesSpriFame(path:string,objSprite : Sprite)
    {
        resources.load(path, SpriteFrame ,(err: any, spriteFrame: SpriteFrame) => {
            // console.log("zzzzzzzzzzzzz",path);
            objSprite.spriteFrame = spriteFrame;
        });
    }


    public set popWindowType(nType: number)
    {
        if(nType == XConsts.POP_SUMMON_TYPE.HeroPub)
        {
            this.btn_fragment_sure.active = false;
        }
        else if(nType == XConsts.POP_SUMMON_TYPE.FragmentSysthesis)
        {
            this.btn_summon.node.active =false;
            this.btn_sure.active = false;
        }
        this._popWindowType = nType;
    }

    public setShowScrollViewType(nCounts: number)
    {
        var lay = this.scroll_heroicon_view.content?.getComponent(Layout);
        if(nCounts < XConsts.SUMMON_SETTLE_HORIZONTAL_COUNTS && lay)
        {
            lay.type = 1;
        }
    }

    public initDataFromMsgData(msgData: Msg.SummonHeroA,nType : number)
    {
        // GameModel.getInstance().getHeroPubModel().getBaseSummonScrollNum()
        this._nSummonType = msgData.summonType;
        this._nSummonConsumeType = msgData.consumeType;
        this._bIsOne = msgData.heroList.length > 1 ? false : true;
        this._HeroList = [];
        this._HeroList = this._HeroList.concat(msgData.heroList);
        this.initBtnSummonUI(this._nSummonType, this._nSummonConsumeType, this._bIsOne);
        this.setShowScrollViewType(msgData.heroList.length);
        this.popWindowType = nType;

       
        GameModel.getInstance().getHeroesModel().updateHeroListFromSummon(this._HeroList);


           let playerModel = GameModel.getInstance().getPlayerModel();
            switch(msgData.consumeType)
            {
                case Msg.TSummonConsumeType.ESummonConsumeType_Scroll:
                    playerModel.consumeObjectByNum(Msg.TObjectType.EObject_HeroicSummonScroll, msgData.consumeNum,Msg.TObjectConsumeType.EObjectConsumeType_HeroSummon);
                    playerModel.updateSummonScore(msgData.summonScore);
                    console.log("消费卷轴  抽考结算 ",msgData.consumeNum);
                    //召唤次数暂时未考虑
                    break;
                case Msg.TSummonConsumeType.ESummonConsumeType_VRmb:
                    playerModel.consumeObjectByNum(Msg.TObjectType.EObject_VRmb, msgData.consumeNum,Msg.TObjectConsumeType.EObjectConsumeType_HeroSummon);
                    playerModel.updateSummonScore(msgData.summonScore);
                    NotifyMgr.getInstance().notify(NotifyMgr.event_coin_diamond_level_change);
                    break;
                case Msg.TSummonConsumeType.ESummonConsumeType_FriendGift:
                    playerModel.consumeObjectByNum(Msg.TObjectType.EObject_FriendGift, msgData.consumeNum,Msg.TObjectConsumeType.EObjectConsumeType_HeroSummon);
                    break; 
                    //奇迹召唤不在这里显示
                // case Msg.TSummonConsumeType.ESummonConsumeType_Wonder:
                //     playerModel.consumeObjectByNum(Msg.TObjectType.EObject_WonderGem, msgData.consumeNum,Msg.TObjectConsumeType.EObjectConsumeType_HeroSummon);
                //     playerModel.updateWonderTimes(msgData.summonScore); 
                //     NotifyMgr.getInstance().notify(NotifyMgr.event_coin_diamond_level_change);
                //     break;
   
            }

      
        
    }

    onDestroy(){
       
        this.removeNotifyPubHeroDecomposeHandler();
    }

    
    public addNotifyPubHeroDecomposeHandler()
    {
        console.log("decompose开启");
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_pub_hero_decompose,this.notifyPubHeroDecomposeHandle,this);
    }

    public removeNotifyPubHeroDecomposeHandler()
    {
        console.log("decompose关闭");
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_pub_summon_hero,this.notifySummonSetleHeroHandle,this); 
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_pub_hero_decompose,this.notifyPubHeroDecomposeHandle,this);
    }


    public notifyPubHeroDecomposeHandle(msgData: Msg.HeroDecomposeA)
    {
        console.log("dddddddddecompose 111",msgData);

        if (msgData.err == Msg.TErrorCode.ERR_OK) {
            msgData.heroIDList.forEach((id)=>{
                GameModel.getInstance().getHeroesModel().removeHeroByHeroDyncID(id);
            })
            let arrProp: Array<XStruct.prop_info.Record> = [];
            let stuProp : XStruct.prop_info.Record = {
                nType : 0,
                nPropId : 0,
                nLevel : 0,
                nPropQuality : 0,
                num : 0,
            }
            if(msgData.advanceExp)
            {
                stuProp.nType = Msg.TObjectType.EObject_Exp;
                stuProp.num = msgData.advanceExp;
                arrProp.push(instantiate(stuProp));    
            }

            if(msgData.soulStone)
            {
                stuProp.nType = Msg.TObjectType.EObject_SoulStone;
                stuProp.num = msgData.soulStone;
                arrProp.push(instantiate(stuProp));    
            }

            if(msgData.money)
            {
                stuProp.nType = Msg.TObjectType.EObject_Money;
                stuProp.num = msgData.money;
                arrProp.push(instantiate(stuProp));    
            }  
            PopMgr.getInstance().deleteWindow();
            PopMgr.getInstance().popMultiItemRewardWindow(null,arrProp);         
        }
       
    }
}