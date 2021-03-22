import { _decorator, Component, Node,Label,ScrollView,resources,instantiate, Vec3, Size,Sprite,UITransform, Button,SpriteFrame, Layout, Color } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { HeroIcon } from '../hero/HeroIcon';
import { GameModel } from '../../model/GameModel';
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



    start () {
        super.start();
        this.btn_summon.node.on(Node.EventType.TOUCH_END, this._onSummonClick, this);
        this.initUI();
        // this.initHeroModelInfo(3042500);
    }

    public _onSummonClick(event : any)
    {
        //按钮点击再次召唤请请求，在服务器回调函数中添加 重置scrollview按钮
        // resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
        //         let reclineup_item = instantiate( res );
        //         let script = reclineup_item.getComponent(HeroIcon);
        //         reclineup_item.scale = new Vec3(0.75,0.75,1);
        //         let subWidget = reclineup_item.getComponent(UITransform) as UITransform;
        //         subWidget.contentSize = new Size(113,113);
        //         script.initUIHeroIconInfo(3031301,XConsts.HERO_ICON_TYPE.SummonSettle);
        //         this.scroll_heroicon_view.content?.addChild(reclineup_item);
        // });
    }

    public initUI()
    {
        var settleTitle = ValueMgr.getInstance().getItemByField(TableName.language_data,XConsts.SUMMON_SETTLE_TITLE) as Config.language_data.Record;
        this.lab_title.string = settleTitle.cn;

        if(this.scroll_heroicon_view.content)
        {
            this.scroll_heroicon_view.content.removeAllChildren()
        }

        this._HeroList

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

        // resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
        //     for (var i = 0 ; i < 2; i++) {
        //         let reclineup_item = instantiate( res );
        //         let script = reclineup_item.getComponent(HeroIcon);
        //         reclineup_item.scale = new Vec3(0.5,0.5,1);
        //         // script.initUIHeroIconInfo(id);
        //         this.scroll_heroicon_view.content?.addChild(reclineup_item);
        //     }
        // });
    }
    

    public initBtnSummonUI(summmonType : Msg.TSummonType,consumeType : Msg.TSummonConsumeType, bIsOne : boolean)
    {
        var lab = this.btn_summon.node.getChildByName("lab")?.getComponent(Label);
        var lab_summon_num = this.btn_summon.node.getChildByName("lab_summon_num")?.getComponent(Label);
        var img_summon_icon = this.btn_summon.node.getChildByName("img_summon_icon")?.getComponent(Sprite);

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
            if (summmonType == Msg.TSummonType.ESummonType_Basic) {
                img_summon_icon && this.resetResourcesSpriFame("hero_pub/pub_prop_scroll/spriteFrame",img_summon_icon);
            } else if (summmonType == Msg.TSummonType.ESummonType_Heroic) {
                img_summon_icon && this.resetResourcesSpriFame("hero_pub/pub_prop_scroll/spriteFrame",img_summon_icon);
            }
            var curNum = bIsOne ? XConsts.PUB_SUMMON_SCROLL_ONE_COSUME : XConsts.PUB_SUMMON_SCROLL_TEN_COSUME
            lab_summon_num && (lab_summon_num.string = String(curNum));
            changeLabColor(GameModel.getInstance().getHeroPubModel().getBaseSummonScrollNum(),curNum);

        } //消耗钻石  暂时只处理80级之前的显示
        else if (consumeType == Msg.TSummonConsumeType.ESummonConsumeType_VRmb) {
            var curNum = bIsOne ? XConsts.PUB_SUMMON_DIAMOND_ONE_COSUME : XConsts.PUB_SUMMON_DIAMOND_TEN_COSUME
            lab_summon_num && (lab_summon_num.string = String(curNum));
            changeLabColor(GameModel.getInstance().getHeroPubModel().getPlayerDiamondCounts(),curNum);
        }//消耗友情
        else if (consumeType == Msg.TSummonConsumeType.ESummonConsumeType_FriendGift) 
        {
            img_summon_icon && this.resetResourcesSpriFame("hero_pub/pub_prop_heart/spriteFrame",img_summon_icon);
            
            var curNum = bIsOne ? XConsts.PUB_SUMMON_FRIEND_ONE_COSUME : XConsts.PUB_SUMMON_FRIEND_TEN_COSUME
            lab_summon_num && (lab_summon_num.string = String(curNum));
            changeLabColor(GameModel.getInstance().getHeroPubModel().getFriendSummonScrollNum(),curNum);
        } 

    }

    public initHeroModelInfo(heroId : number)
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
            this._setStar(heroInfo.star);
            this.resetResourcesSpriFame(profession,this.img_profession);
        }
       

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

    public resetResourcesSpriFame(path:string,objSprite : Sprite)
    {
        resources.load(path, SpriteFrame ,(err: any, spriteFrame: SpriteFrame) => {
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
        if(nCounts < 5 && lay)
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
        this._HeroList = this._HeroList.concat(msgData.heroList);
        this.initBtnSummonUI(this._nSummonType, this._nSummonConsumeType, this._bIsOne);
        this.setShowScrollViewType(msgData.heroList.length);
        this.popWindowType = nType;
    }
}