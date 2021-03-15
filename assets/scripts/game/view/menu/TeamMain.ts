
import { _decorator, Component, Node, ToggleContainer, EventHandler, Toggle, Vec3, tween, Label, Widget, resources, instantiate } from 'cc';
import { MsgMgr } from '../../control/MsgMgr';
import { PopMgr } from '../../control/PopMgr';
import { NotifyMgr } from '../../control/NotifyMgr';
import { HeroData } from '../../model/datas/HeroData';
import { GameModel } from '../../model/GameModel';
import { HeroIcon } from '../hero/HeroIcon';
import { XFuns } from '../../model/const/XFuns';
const { ccclass, property } = _decorator;

@ccclass('TeamMain')
export class TeamMain extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({type: ToggleContainer })
    public selectGroup:ToggleContainer | null = null;
    
    @property({type: Node })
    public teamNode:Node | null = null as unknown as Node;
    
    @property({type: Node })
    public heroNode:Node | null = null as unknown as Node;
    
    @property({type: Node })
    public pNode:Node | null = null as unknown as Node;
    
    @property({type: Node })
    public btnClose:Node = null as unknown as Node;

    @property({type: Node })
    public btnBook:Node = null as unknown as Node;

    @property({type: Node })
    public btnChange:Node = null as unknown as Node;

    @property({type: Node })
    public btnPet:Node = null as unknown as Node;

    @property({type: Node })
    public btnAura:Node = null as unknown as Node;
    
    @property({type: Label })
    public labPower:Label = null as unknown as Label;

    @property({type :  Node})
    public heroPosList:Node[] = [];
    
    @property({type: Node })
    public bgMask:Node = null as unknown as Node;

    start () {
        // [3]
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'TeamMain';// 这个是代码文件名
        containerEventHandler.handler = 'tabClick';
        containerEventHandler.customEventData = '';
        this.selectGroup?.checkEvents.push(containerEventHandler);
        this.btnClose.on(Node.EventType.TOUCH_END, this.closeHandle, this);
        this.btnChange.on(Node.EventType.TOUCH_END, this._openChangeFormationView, this);
        this.btnBook.on(Node.EventType.TOUCH_END, this._openBookLibraryView, this);
        this.btnAura.on(Node.EventType.TOUCH_END, this._openAuraInfoView, this);
        this.btnPet.on(Node.EventType.TOUCH_END, this._openPetInfoView, this);
        this.bgMask.on(Node.EventType.TOUCH_END, this.closeHandle, this);

        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_formation_change,this._notifyFormationChangeHandle,this);

        this.show();
        this._initHero();
    }

    private _initHero()
    {
        let curFormationList:Map<number,HeroData> = GameModel.getInstance().getFormationModel().getCurrentFormation();
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{        
            for (let index = 0; index < this.heroPosList.length; index++) {
                this.heroPosList[index].removeAllChildren();                
            }

            curFormationList.forEach((heroData,key)=>{
        
                let heroIcon = instantiate(res) as Node;
                this._initTopHero(heroIcon, heroData);
                this.heroPosList[key-1].addChild(heroIcon);

            })
            let allFight = GameModel.getInstance().getFormationModel().getCurrentFormationFightPower();
            this.labPower.string = XFuns.FormatNumber(allFight);
        });
    }
    private _initTopHero(heroIcon:Node,value:HeroData){
        
        // let childName = "formationIcon_" + value.getStaticID().toString();
        heroIcon.scale = new Vec3(0.5,0.5,1);
        heroIcon.addComponent(Widget);
        let subWidget = heroIcon.getComponent(Widget) as Widget;
        subWidget.updateAlignment();
        // heroIcon.name = childName;

        let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
        script.setHeroData(value as HeroData);
        script.setBtnCallBack((_data:HeroData)=>{
            this._openHeroUpGradeView(_data);
        });  
    }

    test(){
        let heroList = GameModel.getInstance().getHeroList();
        console.log("heroList=====:");
        console.log(heroList);
        console.log(GameModel.getInstance().getCurrentFormation());
        // heroList.forEach((value,key)=>{
        //     console.log(value.GetATK());
        // })
    }
    
    tabClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        console.log(tog.node.name)
        
        if(!(this.teamNode && this.heroNode) )return;
        if(tog.node.name == "Toggle1"){
            this.teamNode.active = true;
            this.heroNode.active = false;
        }else{
            this.teamNode.active = false;
            this.heroNode.active = true;
        }
    }
    show(){
        console.log("show--------------")
        console.log(this.pNode)
        // this.pNode?.setPosition(new Vec3(0,-900,0));
        tween(this.pNode)
        .to(0.1,{position:new Vec3(this.pNode?.getPosition().x,-340,0)})
        .call(() => {
        }).start()
    }
    hide(){
        tween(this.pNode)
        .to(0.1,{position:new Vec3(this.pNode?.getPosition().x,-900,0)})
        .call(() => {
            this.node.removeFromParent();
        }).start()
    }
    closeHandle(){
        this.hide();
    }

    private _notifyFormationChangeHandle(data:any=null)
    {
        this._initHero();
    }

    //更换阵容
    private _openChangeFormationView()
    {
        PopMgr.getInstance().popBattleTeamView(1,()=>{
            // MsgMgr.getInstance().getMsgFormation().requestChangeBattleTeam();
        });
        // this.hide();
    }

    //图鉴
    private _openBookLibraryView()
    {
        PopMgr.getInstance().popBoolLibraryView();
    }

    //宠物
    private _openPetInfoView()
    {

    }

    //光环
    private _openAuraInfoView()
    {

    }

    //英雄升级界面
    private _openHeroUpGradeView(_heroData:HeroData)
    {
        PopMgr.getInstance().popHeroPromotionView(_heroData.getDyncID() );
    }

    //升星塔界面
    private _openStarUpView()
    {
        PopMgr.getInstance().popStarUpView();
    }
    

    // update (deltaTime: number) {
    //     // [4]
    // }

    onDestroy()
    {
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_formation_change,this._notifyFormationChangeHandle,this);
    }
}
