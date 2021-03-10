
import { _decorator, Component, Node, Label, ToggleContainer, EventHandler, Toggle, sys, resources, instantiate, Vec3, ScrollView, v3, math, Widget } from 'cc';
const { ccclass, property } = _decorator;
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { HeroIcon } from '../hero/HeroIcon';
import { HeroSelectIcon } from '../hero/HeroSelectIcon';
import { PopMgr } from '../../control/PopMgr';
import { MsgMgr } from '../../control/MsgMgr';
import { XConsts } from "../../model/const/XConsts";
import { XFuns } from '../../model/const/XFuns';

@ccclass('PopBattleTeam')
export class PopBattleTeam extends PopBase {

    @property({type: Node})
    public btn_submit:Node | null = null;

    @property({type: Label})
    public lab_title:Label = null as unknown as Label;

    @property({type: Label})
    public lab_power:Label = null as unknown as Label;

    @property({type :  Node})
    public btn_left:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_right:Node = null as unknown as Node;

    @property({type: ToggleContainer })
    public topHeroPages:ToggleContainer | null = null as unknown as ToggleContainer;

    // @property({type :  Node})
    // public selectToggleList:Node[] = [];

    @property({type: ToggleContainer })
    public campGroup:ToggleContainer | null = null as unknown as ToggleContainer;

    @property({type :  Node})
    public campToggleList:Node[] = [];

    @property({type :  Node})
    public heroPosList:Node[] = [];

    @property({type :  ScrollView})
    public scroll_HeroView:ScrollView = null as unknown as ScrollView;

    // @property({type :  Node})
    // public scroll_content:Node = null as unknown as Node;

    // private submitCallFun:Function | null = null;       //保存阵容回调
    private _teamType :number = 0;  //获取阵型
    private _curPageNum :number = 1;    //当前阵容界面
    private _formationList:Map<number, HeroData> = new Map<number, HeroData>();   //当前上阵英雄阵容


    private _allHeroList:Map<number, HeroData> = new Map<number, HeroData>();        //拥有的所有英雄
    private _curCampType:number = 0;        //当前选择的英雄阵营

    private _selectBattleList:Map<number, number> = new Map<number, number>();
    private _bottomHeroItemList:Map<number, Node> = new Map<number, Node>();        //滚动区域创建的英雄列表
    private _selectBattleHeroList:Map<number, number> = new Map<number, number>();      //第一个number是英雄静态id,第二个是站位


    onLoad () {
        super.onLoad();
        // [3]
        this._formationList = GameModel.getInstance().getFormationModel().getCurrentFormation();   //当前上阵英雄阵容
        this._allHeroList = GameModel.getInstance().getHeroList();

        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PopBattleTeam';// 这个是代码文件名
        containerEventHandler.handler = '_onTopHeroPagesClick';
        containerEventHandler.customEventData = '';

        this.topHeroPages?.checkEvents.push(containerEventHandler);

        const containerCampEventHandler = new EventHandler();
        containerCampEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerCampEventHandler.component = 'PopBattleTeam';// 这个是代码文件名
        containerCampEventHandler.handler = '_onCampClick';
        containerCampEventHandler.customEventData = '';
        this.campGroup?.checkEvents.push(containerCampEventHandler);

        // const scrollViewEventHandler = new EventHandler();
        // containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        // containerEventHandler.component = 'PopBattleTeam';// 这个是代码文件名
        // containerEventHandler.handler = 'scrollCallBack';
        // containerEventHandler.customEventData = '';
        // this.scroll_HeroView.scrollEvents.push(scrollViewEventHandler);

        // this.scroll_HeroView.node.on("scroll-ended",this.scrollCallBack.bind(this),this);//监听scrollview事件



        this.btn_submit?.on(Node.EventType.TOUCH_END, this._onSubmit, this);
        this.btn_left.on(Node.EventType.TOUCH_END, this._btnLeftCallBack, this);
        this.btn_right.on(Node.EventType.TOUCH_END, this._btnRightCallBack, this);
    }

    start()
    {
        super.start();
        this._curPageNum = GameModel.getInstance().getFormationModel().getCurFormationIndex();
        
        this._initTopHeros();
        this._initBottomHeros();
        this._initTopTab();
    }


    private _initTopHeros()
    {
        this._formationList = GameModel.getInstance().getFormationModel().getFormationByIndex(this._curPageNum);

        this._selectBattleList.clear()
        this._selectBattleHeroList.clear()
        this._formationList.forEach((value,key)=>{
            let bookheroid = HeroData.GetHeroBookID(value.getStaticID());
            this._selectBattleList.set( bookheroid, value.getDyncID());
            this._selectBattleHeroList.set(value.getDyncID(), key);
        });
       
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{

            for (let index = 0; index < this.heroPosList.length; index++) {
                this.heroPosList[index].removeAllChildren();
            }

            this._formationList.forEach((value,key)=>{
                let heroIcon = instantiate(res) as Node;
                this._initTopHero(heroIcon, value);
                // if(key == 0) key = 1
                this._getHeroHomeByIndex(key).addChild(heroIcon);
                
            });


            let allFight = GameModel.getInstance().getFormationModel().getCurrentFormationFightPower();
            this.lab_power.string = XFuns.FormatNumber(allFight);

        });
    }

    private _initBottomHeros()
    {
        if(this._curCampType == 0)
        {
            this._allHeroList = GameModel.getInstance().getHeroList();
        }
        else{
            this._allHeroList = GameModel.getInstance().getHeroesModel().getHeroListByCampType(this._curCampType);
        }

        if(this.scroll_HeroView.content)
        {
            this.scroll_HeroView.content.removeAllChildren()
        }

        resources.load('prefabs_ui/main/hero_selecticon', (err:any,res:any)=>{
            this._bottomHeroItemList.clear()

            for (let heroData of this._allHeroList.values()) {
                let heroIcon = instantiate(res) as Node;
                this.scroll_HeroView.content?.addChild(heroIcon);
                let heroSelectScript = heroIcon.getComponent("HeroSelectIcon") as HeroSelectIcon; 
                let itemType =  this._getItemType(heroData);
                heroSelectScript.setItemType(itemType);
                heroSelectScript.setSelectData(heroData as HeroData,(heroData:HeroData,itemType:number)=>{
                    let haveRoom = this._selectBattleList && this._selectBattleList.size < 6;

                    if(itemType == 2){
                        PopMgr.getInstance().popupPrompt("出站英雄中已包含相同的英雄");
                        return;
                    }

                    if(!haveRoom && itemType == 0){
                        PopMgr.getInstance().popupPrompt("已达到最大上阵数量");
                        return;
                    }

                    let isSelect = null;
                    if(itemType == 0 && haveRoom){
                        isSelect = true;
                    }else if(itemType == 1){
                        isSelect = false;
                    }

                    if(isSelect != null){
                        this._heroSelect(heroData,isSelect);
                    }
                    
                });

                this._bottomHeroItemList.set(heroData.getDyncID(), heroIcon);
            }
        });
    }
    private _frushButtonHero(){
        this._bottomHeroItemList.forEach((heroNode,dyncid)=>{
            let heroSelectScript = heroNode.getComponent("HeroSelectIcon") as HeroSelectIcon;
            let heroData = heroSelectScript.getHeroInfo() as HeroData;
            let itemType =  this._getItemType(heroData);
            heroSelectScript.setItemType(itemType);
            
            if(this._getCampSelect() == Msg.TCampType.ECampType_NULL){
                heroNode.active = true;
            }else if(this._getCampSelect() == heroData.getCamp()){
                heroNode.active = true;
            }else{
                heroNode.active = false;
            }
        });
    }

    private _initTopHero(heroIcon:Node,value:HeroData){
        
        let childName = "formationIcon_" + value.getStaticID().toString();;
        heroIcon.scale = new Vec3(0.5,0.5,1);
        heroIcon.addComponent(Widget);
        let subWidget = heroIcon.getComponent(Widget) as Widget;
        subWidget.updateAlignment();
        heroIcon.name = childName;

        let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
        script.setHeroID(value as HeroData);
        script.setBtnCallBack((_data:HeroData)=>{
            this._heroSelect(_data,false);
        });  
    }
    private _getTopHeroByStaticID(heroID:number){
        
        let childName = "formationIcon_" + heroID;
        
        for (let index = 0; index < this.heroPosList.length; index++) {
            let child = this.heroPosList[index].getChildByName(childName);
            if(child)return child
        }
    }
    //
    private _getItemType(heroData:HeroData){
        let itemType =  0;

        let dyncId = this._selectBattleList.get(HeroData.GetHeroBookID(heroData.getStaticID()));
        
        if(dyncId)//有一样的英雄
        {
            let heroInfo:HeroData = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(dyncId) as HeroData;
            if(heroInfo.getDyncID() == heroData.getDyncID())
            {
                itemType = 1;
            }
            else{
                itemType = 2;
            }
        }else{//没有一样的英雄
            itemType = 0;
        }
        return itemType;
    }
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
    private _getForemostHeroHomeIndex(){
        
        let foremostHeroHomeIndex:number = 0;
        for (let index = 0; index < this.heroPosList.length; index++) {
            const element = this.heroPosList[index];
            if(element.children.length == 0)
            {
                foremostHeroHomeIndex = index + 1;
                break;
            }
        }
        return foremostHeroHomeIndex
    }
    private _getHeroHomeByIndex(index:number){
        return this.heroPosList[index - 1];
    }

    private _onSubmit(){
        // sys.localStorage.setItem("heroFormation_" + this._teamType, this._curPageNum);
        let saveFormation:Msg.FormationInfo = new Msg.FormationInfo();
        for (const item of this._selectBattleHeroList.keys()) {
            // if(item == 0)continue;
            saveFormation.formation[item] = this._selectBattleHeroList.get(item) as number;
        }
        // saveFormation.formation[0] = 2;
        saveFormation.index = this._curPageNum;

        MsgMgr.getInstance().getMsgFormation().requestChangeBattleTeam(saveFormation,this._curPageNum,this._curPageNum,0);

        //关闭窗口，删除自身
        if(this._closeFunc)
        {
            this._closeFunc();
        }
        
    }

    //点选英雄
    private _heroSelect(heroData:HeroData,isSelect:boolean)
    {
        if(isSelect == null)return;

        this._heroToTop(heroData,isSelect);
        this._getBottomHeroItemScript(heroData)?.setSelect(isSelect);
        this._frushButtonHero();
    }
    
    //top英雄上下阵
    private _heroToTop(heroData:HeroData, isSelect:boolean) {
        let staticID = heroData.getStaticID() as number;
        let dyncID = heroData.getDyncID();
        console.log("点击顶部英雄头像，则下阵英雄",staticID);
        let hasHeroInTop = this._selectBattleList && this._selectBattleList.has(HeroData.GetHeroBookID(staticID))
        let isRole = staticID == 0 || heroData.isRoleHero()
        
        if(isRole)
        {
            PopMgr.getInstance().popupPrompt("主角不能下阵");
            return;
        }

            
        if(isSelect)
        {
            //top上阵
            let heroStaticID = heroData.getStaticID() as number;
            let heroDyncID = heroData.getDyncID();
            // console.log("点击滚动区域影响按时大多数",isSelect,heroStaticID,heroDyncID);
            let foremostHeroHomeIndex:number = this._getForemostHeroHomeIndex();
            let foremostHeroHome = this._getHeroHomeByIndex(foremostHeroHomeIndex);
            resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
                let heroIcon = instantiate(res) as Node;
                this._initTopHero(heroIcon, heroData);
                foremostHeroHome.addChild(heroIcon);  
            });

            this._selectBattleList.set(HeroData.GetHeroBookID(heroStaticID), heroDyncID);
            this._selectBattleHeroList.set(heroDyncID, foremostHeroHomeIndex);
        }else{

            //top下阵
            if(hasHeroInTop)
            {
                this._selectBattleList.delete(HeroData.GetHeroBookID(staticID));
                this._selectBattleHeroList.delete(dyncID);
                    
                let node = this._getTopHeroByStaticID(staticID)
                if(node)node.removeFromParent();

            }
        }
    }



    //////////////////////////////////////////////////////


    //设置标题
    public setTitle(title:string){
        if(this.lab_title)
            this.lab_title.string = title
    }

    private _onCampClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        var index = tog.node.name.charAt(tog.node.name.length-1);
        this._curCampType = Number(index);
        
        this._frushButtonHero();
        
    }
    private _getCampSelect(){
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

    
    //上阵英雄切换标签------------------------------------------------
    private _btnLeftCallBack()
    {  
        if(this._curPageNum == 1)return;
        this._initTopTab(this._curPageNum - 1);
    }

    private _btnRightCallBack()
    {
        
        if(this._curPageNum == this.topHeroPages?.toggleItems.length)return;
        this._initTopTab(this._curPageNum + 1);
    }

    private _initTopTab(index:number = -1){
        if(index == -1){
            index = this._curPageNum;
        }
        let tog = this.topHeroPages?.toggleItems[index-1] as Toggle;
        tog.isChecked = true;
    }

    private _onTopHeroPagesClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        let index:number = Number(tog.node.name.charAt(tog.node.name.length-1));
        if(this._curPageNum == index)return;
        this._curPageNum = Number(index);

        this._initTopHeros();
        this._frushButtonHero();
    }

    private scrollCallBack()
    {

    }

    //上阵英雄切换标签------------------------------------------------
    // //保存阵容回调
    // public setSubmitCallBack(func:Function){
    //     this.submitCallFun = func;
    // }
    // //关闭回调
    // public setCloseCallBack(func:Function | null){
    //     if(func)
    //         this._closeFunc = func;
    // }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
