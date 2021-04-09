/**
 * 游戏组件:背包英雄选择子节点
 * @author 黄志清
 * @version 1.0.0,2021.3.16
 */
import { _decorator, Component, Node, Label, Button, resources, instantiate, Widget, EventTouch } from 'cc';
import { PopMgr } from '../../control/PopMgr';
import { TableName, ValueMgr } from '../../model/ValueMgr';
import { ElementHeroIcon } from './ElementHeroIcon';
const { ccclass, property } = _decorator;

@ccclass('HeroGiftChoiceCell')
export class HeroGiftChoiceCell extends Component {
    @property({type :  Node})
    public img_blueBg:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_blueSelect:Node = null as unknown as Node;

    @property({type :  Node})
    public img_orangeBg:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_orangeSelect:Node = null as unknown as Node;
    
    @property({type :  Node})
    public iconNode:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_heroname:Label = null as unknown as Label;

    private _callback:Function|null = null;
    private _heroId:number = 0;
    private _data = [];
    start () {
        this.btn_blueSelect.on(Node.EventType.TOUCH_END, this._selectHeroCallback, this);
        this.btn_orangeSelect.on(Node.EventType.TOUCH_END, this._selectHeroCallback, this);
    }

    //英雄勾选界面
    private _selectHeroCallback(button: EventTouch)
    {
        let selectId:number = this._heroId;
        let node:Node = button.currentTarget as Node;
        console.log(node.name);
        if(node.name == "btn_choice_orange")   //取消选择
        {            
            selectId = 0;
        }
        


        if(this._callback)
        {
            this._callback(selectId,this._data);
        }
    }

    //开启英雄信息图鉴
    private _openHeroBookView(heroInfo:Config.heroes.Record)
    {
        PopMgr.getInstance().popupPrompt("点击英雄头像，打开图鉴!");
    }

    private _initHeroIcon()
    {
        let heroInfo:Config.heroes.Record = ValueMgr.getInstance().getItemByField(TableName.heroes,this._data[1]) as Config.heroes.Record;
        let heroNameData = ValueMgr.getInstance().getItemByField(TableName.language_data,heroInfo.name) as Config.language_data.Record;
        this.lab_heroname.string = heroNameData.cn;
        resources.load('prefabs_ui/common/element_heroicon', (err:any,res:any)=>{
            let heroIcon = instantiate(res) as Node;
            this.iconNode.addChild(heroIcon); 
            heroIcon.addComponent(Widget);
            let subWidget = heroIcon.getComponent(Widget) as Widget;
            subWidget.updateAlignment();
            
            
            let script = heroIcon.getComponent("ElementHeroIcon") as ElementHeroIcon;
            script.setHeroInfo(heroInfo,this._data[2]);
            script.setBtnCallBack((data:Config.heroes.Record)=>{
                this._openHeroBookView(data);
            });  
        });
    }

    /**
     * 英雄选择礼包弹窗信息
     * @param data 元组 data[0] 物品类型  data[1] id   data[2] 等级
     * @param visit 预览/参观模式
     */
    public setHeroGiftData(data:any,callback:Function|null = null, visit:boolean=false)
    {
        if(visit)
        {
            this.btn_blueSelect.active = false;
            this.lab_heroname.node.active = true;
        }
        this._data = data;
        this._heroId = data[1];
        this._callback = callback;
        this._initHeroIcon();
    }

    /**
     * 设置背景的不同颜色
     * @param nameStr 
     */
    public setImgBgActive(nameStr:string)
    {
        if(nameStr == "blue")      //选择
        {
            this.img_blueBg.active =false;
            this.img_orangeBg.active = true;
        }
        else if(nameStr == "orange")   //取消选择
        {
            this.img_blueBg.active =true;
            this.img_orangeBg.active = false;
        }
    }
    
}
