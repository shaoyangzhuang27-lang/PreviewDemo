
import { _decorator, Button,instantiate,Widget,Vec3, Node,resources,ToggleContainer,EventHandler,Toggle,ScrollView } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { HeroSelectIcon } from '../hero/HeroSelectIcon';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { HeroIcon } from '../hero/HeroIcon';
const { ccclass, property } = _decorator;

@ccclass('PopDecompose')
export class PopDecompose extends PopBase {

    @property({type: ToggleContainer , displayName: "底部选择按钮"})
    public selectGroup:ToggleContainer | null = null;

    @property({type: Button, displayName: "重置按钮"})
    public btn_reset:Button | null = null;

    @property({type: Node, displayName: "重置节点"})
    public top_reset:Node | null = null;

    @property({type: Node, displayName: "分解节点"})
    public top_decompose:Node | null = null;

    @property({type: Node, displayName: "重置人"})
    public btn_reset_icon:Node = null as unknown as Node;

    @property({type: Node, displayName: "重置头像"})
    public head_Node:Node = null as unknown as Node;

    @property({type: Node, displayName: "重置label"})
    public lab_head_ts:Node = null as unknown as Node;

    @property({type: ToggleContainer , displayName: "阵营" })
    public campGroup:ToggleContainer | null = null as unknown as ToggleContainer;

    @property({type :  Node, displayName: "重置获得的物品"})
    public goodsNodes:Node[] = [];

    @property({type :  ScrollView})
    public scroll_HeroView:ScrollView = null as unknown as ScrollView;

    //拥有的所有英雄
    private _allHeroList:Map<number, HeroData> = new Map<number, HeroData>();
    //拥有的所有英雄列表显示对象
    private _bottomHeroItemList:Map<number, Node> = new Map<number, Node>();
    private _selectBattleList:Map<number, number> = new Map<number, number>();      //选择重置或重生英雄列表

    private _curResetHero:number = 0;        //当前选择的重置英雄

    onLoad () {
        super.onLoad();

        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PopDecompose';// 这个是代码文件名
        containerEventHandler.handler = 'tabClick';
        containerEventHandler.customEventData = '';
        this.selectGroup?.checkEvents.push(containerEventHandler);

        const containerCampEventHandler = new EventHandler();
        containerCampEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerCampEventHandler.component = 'PopDecompose';// 这个是代码文件名
        containerCampEventHandler.handler = '_onCampClick';
        containerCampEventHandler.customEventData = '';
        if(this.campGroup){
            this.campGroup.checkEvents.push(containerCampEventHandler);
            this.campGroup.toggleItems.forEach((tog)=>{
                tog?.checkEvents.push(containerCampEventHandler);
            });
        }

        this.head_Node.active = false;
        this.lab_head_ts.active = true;

        this.btn_reset_icon?.on(Node.EventType.TOUCH_END, this._platformViceHeadHandle, this);
    }
    start () {
        super.start();
        this._getAllHeroList();  

        if(this._selectBattleList == null)
        {
            this._selectBattleList = new Map<number, number>();
        }
        this._selectBattleList.clear();

        this._initBottomHeros();
    }

    //获取升星列表英雄
    private _getAllHeroList(){
        this._allHeroList = GameModel.getInstance().getHeroList();
    }

    //底部选择事件
    tabClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        console.log(tog.node.name)

        if(!(this.top_reset && this.top_decompose) )return;
        if(tog.node.name == "Toggle1"){
            this.top_reset.active = true;
            this.top_decompose.active = false;
        } else if (tog.node.name == "Toggle2"){
            this.top_reset.active = false;
            this.top_decompose.active = true;
        }
    }

    private _initBottomHeros()
    {
        if(this.scroll_HeroView.content)
        {
            this.scroll_HeroView.content.removeAllChildren()
        }

        resources.load('prefabs_ui/main/hero_selecticon', (err:any,res:any)=>{
            this._bottomHeroItemList.clear()
            let k = new Array<[number,Node]>();     //排序存储对象
            let isShowOneKey = 0;       //是否显示一键升星按钮
            for (let heroData of this._allHeroList.values()) {
                let heroIcon = instantiate(res) as Node;
                this.scroll_HeroView.content?.addChild(heroIcon);
                let heroSelectScript = heroIcon.getComponent("HeroSelectIcon") as HeroSelectIcon;  
                let itemType =  this._getItemType(heroData);

                heroSelectScript.setItemType(itemType);
                heroSelectScript.setSelectData(heroData as HeroData,(data:any,itemType:number)=>{
                    let isSelect = null;
                    if(itemType == 0){
                        isSelect = true;
                    }else if(itemType == 1){
                        isSelect = false;
                    }
                    
                    if(isSelect != null){
                        this._heroSelect(heroData,isSelect);
                    }            
                });
                let sortIndex_1:number = heroData.getLevel() * 10000 + heroData.getStar()*1000 + heroData.getCamp() * 10 + heroData.getClasses();
                let sortIndex_2:number = 3000000 - sortIndex_1;
                k.push([sortIndex_2,heroIcon]);
                


                this._bottomHeroItemList.set(heroData.getDyncID(), heroIcon);
            }
            
            k.sort((n1,n2) => n1[0] - n2[0])
            k.forEach((value,key)=>{
                value[1].setSiblingIndex(key);
            })
        });
    }

    //点选英雄
    private _heroSelect(heroData:HeroData,isSelect:boolean)
    {
        if(isSelect == null)return;

        this._heroToTop(heroData,isSelect);
        this._getBottomHeroItemScript(heroData)?.setSelect(isSelect);
        this._frushButtonHero();
    }

    //根据herodata获取拥有英雄代码
    private _getBottomHeroItemScript(heroData:HeroData){
        for (let value of this._bottomHeroItemList.values()) {
            let script = value.getComponent("HeroSelectIcon") as HeroSelectIcon; 
            let scriptHeroInfo = script.getCurHeroInfo() as HeroData;
            if(scriptHeroInfo.getDyncID() == heroData.getDyncID())
            {
                return script;
            }
        }
    }

    //top英雄上下阵
    private _heroToTop(heroData:HeroData, isSelect:boolean) {
        let staticID = heroData.getStaticID() as number;
        let dyncID = heroData.getDyncID();
        console.log("点击顶部英雄头像，则下阵英雄",staticID);
        let hasHeroInTop = this._selectBattleList && this._selectBattleList.has(dyncID)
            
        if(isSelect)
        {
            if(this._curResetHero != 0){
                this._selectBattleList.delete(this._curResetHero);
                this._platformViceHeadHandle();
            }
            //top上阵
            this._selectBattleList.set(dyncID, HeroData.GetHeroBookID(staticID));
            this._curResetHero = dyncID;
            this._platformExhibition();
        }else{

            //top下阵
            if(hasHeroInTop){
                this._selectBattleList.delete(dyncID);
                this._platformViceHeadHandle();
            }
        }
        if(this._curResetHero == 0){
            this.head_Node.active = false;
            this.lab_head_ts.active = true;
        }else{
            this.head_Node.active = true;
            this.lab_head_ts.active = false;
        }
    }

    //平台展示
    private _platformExhibition(){
        let HeroInfo = this._getHeroData(this._curResetHero)as HeroData
        this.btn_reset_icon.getChildByName("heroIcon")?.removeFromParent();
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
            let heroIcon = instantiate(res) as Node;
            heroIcon.scale = new Vec3(0.5,0.5,1);
            heroIcon.addComponent(Widget);

            let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
            script.setHeroData(HeroInfo as HeroData);
            this.btn_reset_icon.addChild(heroIcon);
            heroIcon.name = "heroIcon";
        });
    }

    //根据动态ID获取HeroData
    private _getHeroData(heroID:number){
        let HeroInfo;
        for (let value of this._bottomHeroItemList.values()) {
            let script = value.getComponent("HeroSelectIcon") as HeroSelectIcon; 
            let scriptHeroInfo = script.getCurHeroInfo() as HeroData;
            if(scriptHeroInfo.getDyncID() == heroID)
            {
                HeroInfo = scriptHeroInfo;
            }
        }
        return HeroInfo;
    }

    //0未选中 1选中 2锁定
    private _getItemType(heroData:HeroData){
        let itemType =  0;
        let _heroStaticID = heroData.getStaticID() as number;
        let _heroDyncID = heroData.getDyncID();

        let dyncId = this._selectBattleList.get(_heroDyncID);
        if(dyncId)//有一样的英雄
        {
            let heroInfo:HeroData = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(_heroDyncID) as HeroData;
            if(heroInfo.getDyncID() == heroData.getDyncID())
            {
                itemType = 1; 
            }
        }else{//没有一样的英雄
            itemType = 0;
        }
        return itemType;
    }

    private _onCampClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        var index = tog.node.name.charAt(tog.node.name.length-1);
        
        this._frushButtonHero();
    }
    private _frushButtonHero(){
        this._bottomHeroItemList.forEach((heroNode,dyncid)=>{
            let heroSelectScript = heroNode.getComponent("HeroSelectIcon") as HeroSelectIcon;
            let heroData = heroSelectScript.getHeroData() as HeroData;
            let itemType =  this._getItemType(heroData);
            heroSelectScript.setItemType(itemType);
            
            if(this._getCampType() == Msg.TCampType.ECampType_NULL){
                heroNode.active = true;
            }else if(this._getCampType() == heroData.getCamp()){
                heroNode.active = true;
            }else{
                heroNode.active = false;
            }
        });
    }

    //获取当前阵营类型
    private _getCampType(){
        let togs = this.campGroup?.activeToggles();
        if(!togs)return;
        if(togs?.length == 0){
            return Msg.TCampType.ECampType_NULL
        }else{
            let tog = togs[0] as Toggle;
            console.log(tog.name)
            console.log(tog.node.name)
            let index:number = Number(tog.node.name.charAt(tog.node.name.length-1));
            return index;
        }
    }

    //平台副英雄事件
    private _platformViceHeadHandle(){
        if(this._curResetHero == 0){
            return;
        }
        let heroData = this._getHeroData(this._curResetHero);
        this._heroSelect(heroData as HeroData,false); 

        this._curResetHero = 0;
        this.btn_reset_icon.getChildByName("heroIcon")?.removeFromParent();
    }
}
