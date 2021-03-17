import { _decorator, Component, Node,Label,ScrollView,resources,instantiate, Vec3, Size,Sprite,UITransform, Button,SpriteFrame, Layout } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { HeroIcon } from '../hero/HeroIcon';
const { ccclass, property } = _decorator;

@ccclass('PopSummonSettle')
export class PopSummonSettle extends PopBase {
    @property({type: Label})
    public lab_title = null as unknown as Label;

    // @property({type: LabelComponent})
    // public lab_content:LabelComponent | null = null;

    @property({type: Button})
    public btn_summon = null as unknown as Button;

    @property({type: Node})
    public btn_sure = null as unknown as Node;

    @property({type: Node})
    public btn_fragment_sure = null as unknown as Node;
    // private _submitCallFun:Function | null = null;


    private _popWindowType : number = XConsts.POP_SUMMON_TYPE.HeroPub;

    private _nSummonCounts : number = 6;
    @property({type :  ScrollView})
    public scroll_heroicon_view:ScrollView = null as unknown as ScrollView;



    start () {
        super.start();
        this.btn_summon.node.on(Node.EventType.TOUCH_END, this._onSummonClick, this);
        this.initUI();
        var lay = this.scroll_heroicon_view.content?.getComponent(Layout);
        if(this._nSummonCounts < 5 && lay)
        {
            lay.type = 1;
        }
    }

    public _onSummonClick(event : any)
    {
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
    

    public initBtnSummonUI(summmonType : Msg.TSummonType,consumeType : Msg.TSummonConsumeType)
    {
        var lab = this.btn_summon.node.getChildByName("lab")?.getComponent(Label);
        var lab_summon_num = this.btn_summon.node.getChildByName("lab_summon_num")?.getComponent(Label);
        var img_summon_icon = this.btn_summon.node.getChildByName("img_summon_icon")?.getComponent(Sprite);

        if(summmonType == Msg.TSummonType.ESummonType_Friend)
        {    
            img_summon_icon && this.resetResourcesSpriFame("hero_pub/pub_prop_heart/spriteFrame",img_summon_icon);
        }
        else if(summmonType == Msg.TSummonType.ESummonType_Basic && consumeType == Msg.TSummonConsumeType.ESummonConsumeType_Scroll)
        {
            img_summon_icon && this.resetResourcesSpriFame("hero_pub/pub_prop_scroll/spriteFrame",img_summon_icon);
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
}