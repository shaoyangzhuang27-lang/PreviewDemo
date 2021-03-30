
import { _decorator, Component, Node,Label,ScrollView } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
const { ccclass, property } = _decorator;

@ccclass('PubWonderHeartHero')
export class PubWonderHeartHero extends PopBase {
    @property({type: Label})
    public lab_title= null as unknown as Label;
    @property({type: Label})
    public lab_select_desc= null as unknown as Label;

    @property({type: Node})
    public btn_submit:Node | null = null;

    @property({type :  ScrollView})
    public scroll_heroicon_view:ScrollView = null as unknown as ScrollView;



    start () {
        super.start();
        this.btn_submit?.on(Node.EventType.TOUCH_END, this._onSubmit, this);
        this.lab_title.string = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_WONDERHERO);
        this.lab_select_desc.string = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_WONDERHEROSELECT);
    }
    private _onSubmit(){

    }
 
}
