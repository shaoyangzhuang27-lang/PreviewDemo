
import { _decorator, Component, Node,Label,ScrollView,ToggleContainer,EventHandler,Toggle,resources,instantiate,Vec3} from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { XConsts } from '../../model/const/XConsts';
import { GameModel } from '../../model/GameModel';
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { HeroSelectIcon } from '../hero/HeroSelectIcon';
import { HeroIcon } from '../hero/HeroIcon';

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
    public scroll_select:ScrollView = null as unknown as ScrollView;

    @property({type: ToggleContainer})
    public toggle_camp:ToggleContainer = null as unknown as ToggleContainer;

    @property({type: Node})
    public img_hero:Node | null = null;

    private _curSelectCamp : number = 0;

    private _heartHeroId : number = 0;

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

        // this.toggle_camp?.checkEvents.push(containerEventHandler);
        this.toggle_camp.toggleItems.forEach((tog)=>{
            tog?.checkEvents.push(containerEventHandler);
        });

        this._updateHeroIconByCamp(this._curSelectCamp);
    }
    private _onSubmit(){

        //发消息确定绑定心愿英雄
    }
 
    private _onToggleCampClick(event: Event, customEventData: string){

        let togs = this.toggle_camp?.activeToggles();
        console.log("zzzzzzzzzzzzzzzzzzzzz",togs);
        let nSelectCamp = Msg.TCampType.ECampType_NULL;
        if(!togs)return;
        if(togs?.length == 0){
            nSelectCamp =  Msg.TCampType.ECampType_NULL;
        }else{
            let tog = togs[0] as Toggle;
            let index:number = Number(tog.node.name.charAt(tog.node.name.length-1));
            nSelectCamp = index;
        }

        if(this._curSelectCamp == nSelectCamp)
        {
            return; 
        }
        else
        {
            this._curSelectCamp = nSelectCamp;
            this._updateHeroIconByCamp(this._curSelectCamp);
        }
    }

    private _updateHeroIconByCamp(nCamp : number)
    {
        if(this.scroll_select.content)
        {
            this.scroll_select.content.removeAllChildren()
        }

        let heroIdList = GameModel.getInstance().getHeroPubModel().getWonderHeartHeroIdByCamp(nCamp);
        resources.load('prefabs_ui/main/hero_selecticon', (err:any,res:any)=>{
            for(var i=0; i < heroIdList.length; i++ )
            {
                let _heroIcon = instantiate(res) ;
                let script = _heroIcon.getComponent(HeroSelectIcon);
                script.setWonderSelectData(0,heroIdList[i],(value : number,itemType:number)=>{
                    if(script.getItemType())
                    {
                        script.setItemType(0);
                        this._updateHeartHeroIcon(0);
                    }
                    else
                    {
                        script.setItemType(1);
                        // this._heartHeroId = script.getSelectWonderHeroId();
                        this._updateHeartHeroIcon(script.getSelectWonderHeroId());
                    }
                    this.scroll_select.content?.children.forEach(element=>{
                        if(element.getComponent(HeroSelectIcon)?.getItemType() && element.getComponent(HeroSelectIcon)?.getSelectWonderHeroId() != script.getSelectWonderHeroId())
                        {
                            element.getComponent(HeroSelectIcon)?.setItemType(0);
                        }
                    })
                    
                });
                this.scroll_select.content?.addChild(_heroIcon);
            }
        });         
    }

    private _updateHeartHeroIcon(id :number)
    {
        
        var callFunc = ()=>{

            var node_HeroIcon = this.img_hero?.getChildByName("hero_icon");
            if(node_HeroIcon)
            {
                node_HeroIcon.active = false;
            }
            this.scroll_select.content?.children.forEach(element=>{
                if(element.getComponent(HeroSelectIcon)?.getItemType())
                {
                    element.getComponent(HeroSelectIcon)?.setItemType(0);
                }
            })

        };

        if(id == 0)
        {
            var node_HeroIcon = this.img_hero?.getChildByName("hero_icon");
            if(node_HeroIcon)
            {
                node_HeroIcon.active = false;
               // node_HeroIcon.getComponent(HeroIcon)?.initUIHeroIconInfo(this._heartHeroId,XConsts.HERO_ICON_TYPE.RecLineUp);
            }
        }
        else
        {
            // if( this._heartHeroId != id)
            // {
                this._heartHeroId = id
                var node_HeroIcon = this.img_hero?.getChildByName("hero_icon");
                if(node_HeroIcon)
                {
                    node_HeroIcon.active = true;
                    node_HeroIcon.getComponent(HeroIcon)?.initUIHeroIconInfo(this._heartHeroId,XConsts.HERO_ICON_TYPE.RecLineUp);
                }
                else
                {
                    resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
                        let _heroIcon = instantiate(res) ;
                        let script = _heroIcon.getComponent(HeroIcon); 
                        // script.setHeroID(this._heroInfo as HeroData);
                        script.initUIHeroIconInfo(id,XConsts.HERO_ICON_TYPE.WonderSummon);
                        _heroIcon.scale = new Vec3(0.6,0.6,1);    
                        script.setBtnCallBack(callFunc); 
                        this.img_hero?.addChild(_heroIcon);
                       console.log("iiiiiiiiiiiiiiii",this.img_hero);
                    });
                }
            // }
        }
       
        // GameModel.getInstance().getHeroPubModel().getPlayerWonderHero();
       
    }
}
