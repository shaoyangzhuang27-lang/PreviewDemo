
import { _decorator, Component, Node,Label,ScrollView,ToggleContainer,EventHandler,Toggle } from 'cc';
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

    @property({type: ToggleContainer})
    public toggle_camp = null as unknown as ToggleContainer;

    @property({type: Node})
    public img_hero:Node | null = null;

    private _curSelectCamp : number = Msg.TCampType.ECampType_NULL;

    start () {
        super.start();
        this.btn_submit?.on(Node.EventType.TOUCH_END, this._onSubmit, this);
        this.lab_title.string = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_WONDERHERO);
        this.lab_select_desc.string = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_WONDERHEROSELECT);

        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PubWonderHeartHero';// 这个是代码文件名
        containerEventHandler.handler = '_onToggleCampClick';
        containerEventHandler.customEventData = '';

        this.toggle_camp?.checkEvents.push(containerEventHandler);
    }
    private _onSubmit(){

        //发消息确定绑定心愿英雄
    }
 
    private _onToggleCampClick(event: Event, customEventData: string){

        console.log("zzzzzzzzzzzzzzzzzzzzz");
        let tog:Toggle = (event as any);
        let  selectedToggle = tog.node.getComponent(Toggle);
        
        if(selectedToggle?.isChecked)
        {
            switch(tog.node.name)
            {
                case "camp_water":
                    console.log("camp_water");
                    break;
                case "camp_fire":
                    console.log("camp_fire");
                    break;
                case "camp_wood":
                    console.log("camp_wood");
                    break;
                case "camp_light":
                    console.log("camp_light");
                    break;
                case "camp_dark":
                    console.log("camp_dark");
                    break;
            }
        }
    }
}
