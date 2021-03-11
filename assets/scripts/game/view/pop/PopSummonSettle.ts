import { _decorator, Component, Node,Label,ScrollView,resources,instantiate, Vec3, Size,Widget,UITransform } from 'cc';
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

    @property({type: Node})
    public btn_add:Node | null = null;

    // private _submitCallFun:Function | null = null;

    @property({type :  ScrollView})
    public scroll_heroicon_view:ScrollView = null as unknown as ScrollView;

    start () {
        super.start();
        this.btn_add?.on(Node.EventType.TOUCH_END, this._onAddClick, this);
        this.initUI();
    }

    public _onAddClick(event : any)
    {
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
                let reclineup_item = instantiate( res );
                let script = reclineup_item.getComponent(HeroIcon);
                reclineup_item.scale = new Vec3(0.75,0.75,1);
                let subWidget = reclineup_item.getComponent(UITransform) as UITransform;
                subWidget.contentSize = new Size(113,113);
                this.scroll_heroicon_view.content?.addChild(reclineup_item);
        });
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
        //         // script.initRecLineUpHeroIconInfo(id); 
        //         this.scroll_heroicon_view.content?.addChild(reclineup_item);
        //     }
        // });
    }
}