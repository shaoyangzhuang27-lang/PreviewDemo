
import { _decorator, Component, Node, ToggleContainer, EventHandler, Toggle, Vec3, tween, Label, Widget, resources, instantiate, UITransform, size, Button} from 'cc';
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

    @property({ type: Node, displayName : "英雄背包" })
    public layHero: Node = null as unknown as Node;

    // @property({ type: ToggleContainer, displayName : "阵营选择" })
    // public campGroup: ToggleContainer | null = null;

    @property({ type: Toggle, displayName: "阵营选择" })
    public campSelect: Toggle[] = [];

    @property({ type: Node, displayName: "背包扩展" })
    public btnExtend: Node = null as unknown as Node;

    start () {
        // [3]
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'TeamMain';// 这个是代码文件名
        containerEventHandler.handler = 'tabClick';
        containerEventHandler.customEventData = '';
        this.selectGroup?.checkEvents.push(containerEventHandler);
        // 开启了AllowSwitchOff选项，全不选事件不会通知到到tabClick,所以阵营点击事件用另外的click处理
        // this.campGroup?.checkEvents.push(containerEventHandler); 
        for (let index = 0; index < this.campSelect.length; index++) {
            this.campSelect[index].node.on(Button.EventType.CLICK, this._clickCamp, this)
        }

        this.btnClose.on(Node.EventType.TOUCH_END, this.closeHandle, this);
        this.btnChange.on(Node.EventType.TOUCH_END, this._openChangeFormationView, this);
        this.btnBook.on(Node.EventType.TOUCH_END, this._openBookLibraryView, this);
        this.btnAura.on(Node.EventType.TOUCH_END, this._openAuraInfoView, this);
        this.btnPet.on(Node.EventType.TOUCH_END, this._openPetInfoView, this);
        this.bgMask.on(Node.EventType.TOUCH_END, this.closeHandle, this);
        this.btnExtend.on(Button.EventType.CLICK, this._clickExtend, this);

        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_formation_change,this._notifyFormationChangeHandle,this);

        this.show();
        this._initTeam();
    }

    private _initTeam()
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

    // 英雄背包节点
    private _initHeroNode(campType ?: Msg.TCampType){
        // 清空子节点
        this.layHero.removeAllChildren()
        // 数据排序
        let heroModel = GameModel.getInstance().getHeroesModel()
        let heroList = campType ? heroModel.getHeroListByCampType(campType) : heroModel.getHeroList();
        let sortList = heroModel.sortHeroList(heroList)
        // 绘制
        resources.load('prefabs_ui/main/hero_icon', (err: any, res: any) => {
            sortList.forEach((heroData, key) => {
                // 创建头像
                let heroIcon = instantiate(res) as Node;
                // 大小适配自动排版
                let trans = heroIcon.getComponent(UITransform) as UITransform
                trans.contentSize = size(82, 82)
                // 显示缩放
                heroIcon.scale = new Vec3(0.55, 0.55, 1);
                heroIcon.parent = this.layHero
                // 刷新和回调
                let script = heroIcon.getComponent("HeroIcon") as HeroIcon;
                script.setHeroData(heroData);
                script.setBtnCallBack((_data: HeroData) => {
                    // 弹出英雄详细界面
                    this._openHeroUpGradeView(_data);
                });
            })
        });
    }
    
    tabClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        console.log(tog.node.name)

        if(!(this.teamNode && this.heroNode) )return;
        if(tog.node.name == "Toggle1"){
            this.teamNode.active = true;
            this.heroNode.active = false;
            // this._initTeam();
        } else if (tog.node.name == "Toggle2"){
            this.teamNode.active = false;
            this.heroNode.active = true;
            this._initHeroNode()
            this._resetTogCampCheckStatus()
        }
    }
    // 英雄背包阵营选择
    _clickCamp(tog: Toggle){
        console.log("tog is checked :", tog.node.name, tog.isChecked)
        // 初始设置ischecked = false
        if(!tog.isChecked){
            // 英雄背包里面的tab
            let strName: Map<string, Msg.TCampType> = new Map<string, Msg.TCampType>();
            strName.set("hero_camp1", Msg.TCampType.ECampType_Water)
            strName.set("hero_camp2", Msg.TCampType.ECampType_Fire)
            strName.set("hero_camp3", Msg.TCampType.ECampType_Wood)
            strName.set("hero_camp4", Msg.TCampType.ECampType_Light)
            strName.set("hero_camp5", Msg.TCampType.ECampType_Dark)
            let campType = strName.get(tog.node.name)
            this._initHeroNode(campType)
        }else{
            this._initHeroNode()
        }
    }
    // 背包扩充
    _clickExtend(target: Button){
        console.log("点击背包扩充")

        // PlayerInfo.BoughtBagTimes //购买背包容量次数
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

    // 设置英雄背包阵营页签状态
    private _resetTogCampCheckStatus() {
        // let components = this.campSelect?.getComponentsInChildren(Toggle)
        this.campSelect?.forEach(element => {
            element.isChecked = false
            // 刷新状态
            element._toggleContainer?.notifyToggleCheck(element)
        });
    }

    private _notifyFormationChangeHandle(data:any=null)
    {
        this._initTeam();
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
