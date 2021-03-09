
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
    public selectGroup:ToggleContainer | null = null as unknown as ToggleContainer;

    @property({type :  Node})
    public selectToggleList:Node[] = [];

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
    private _lastTog:Toggle = null as unknown as Toggle;


    private _allHeroList:Map<number, HeroData> = new Map<number, HeroData>();        //拥有的所有英雄
    private _curCampType:number = 0;        //当前选择的英雄阵营

    private _selectBattleList:Map<number, number> = new Map<number, number>();
    private _svHeroList:Map<number, Node> = new Map<number, Node>();        //滚动区域创建的英雄列表
    private _selectBattleHeroList:Map<number, number> = new Map<number, number>();      //第一个number是英雄静态id,第二个是站位


    onLoad () {
        super.onLoad();
        // [3]
        this._formationList = GameModel.getInstance().getFormationModel().getCurrentFormation();   //当前上阵英雄阵容
        this._allHeroList = GameModel.getInstance().getHeroList();

        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PopBattleTeam';// 这个是代码文件名
        containerEventHandler.handler = 'tabClick';
        containerEventHandler.customEventData = '';

        this.selectGroup?.checkEvents.push(containerEventHandler);

        const containerCampEventHandler = new EventHandler();
        containerCampEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerCampEventHandler.component = 'PopBattleTeam';// 这个是代码文件名
        containerCampEventHandler.handler = 'tabCampClick';
        containerCampEventHandler.customEventData = '';
        this.campGroup?.checkEvents.push(containerCampEventHandler);

        // const scrollViewEventHandler = new EventHandler();
        // containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        // containerEventHandler.component = 'PopBattleTeam';// 这个是代码文件名
        // containerEventHandler.handler = 'scrollCallBack';
        // containerEventHandler.customEventData = '';
        // this.scroll_HeroView.scrollEvents.push(scrollViewEventHandler);

        // this.scroll_HeroView.node.on("scroll-ended",this.scrollCallBack.bind(this),this);//监听scrollview事件



        this.btn_submit?.on(Node.EventType.TOUCH_END, this._submitHandle, this);
        this.btn_left.on(Node.EventType.TOUCH_END, this._btnLeftCallBack, this);
        this.btn_right.on(Node.EventType.TOUCH_END, this._btnRightCallBack, this);
    }

    start()
    {
        super.start();
        this._initTopHeros();
        this._initBottomHeros();
    }

    private _initTopHero(heroIcon:any,value:HeroData){
        
        let childName = "formationIcon_" + value.getStaticID().toString();;
        heroIcon.scale = new Vec3(0.5,0.5,1);
        heroIcon.addComponent(Widget);
        let subWidget = heroIcon.getComponent(Widget) as Widget;
        subWidget.updateAlignment();
        heroIcon.name = childName;

        let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
        script.setHeroID(value as HeroData);
        script.setBtnCallBack((_data:any)=>{
            this._topHeroClickCallBack(_data);
        });  
    }
    private _getTopHero(heroID:number){
        
        let childName = "formationIcon_" + heroID;
        
        for (let index = 0; index < this.heroPosList.length; index++) {
            let child = this.heroPosList[index].getChildByName(childName);
            if(child)return child
        }
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
                this.heroPosList[key].addChild(heroIcon);
                
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
            this._svHeroList.clear()

            for (let value of this._allHeroList.values()) {
                let heroIcon = instantiate(res) as Node;
                this.scroll_HeroView.content?.addChild(heroIcon);

                let script = heroIcon.getComponent("HeroSelectIcon") as HeroSelectIcon; 
                
                let itemType =  this._getItemType(value);
                console.log("itemType----")
                console.log(itemType)
                script.setChoiceIconImage(itemType);

                script.setSelectData(value as HeroData,(data:any,itemType:number)=>{
                    this._bottomHeroSelectCallBack(data,itemType);

                    if((itemType == 1 || itemType == 0) && this._selectBattleList && this._selectBattleList.size < 6 )
                    {
                        if(itemType == 1) {
                            itemType = 0;
                        }else if(this._selectBattleList && this._selectBattleList.size < 6){
                            itemType = 1;
                        }
                        else{
                            return 
                        }
                        script.setChoiceIconImage(itemType);
                    }
                    
                });


                this._svHeroList.set(value.getDyncID(), heroIcon);
            }
        });
    }
    private _getItemType(heroData:HeroData){
        let itemType =  0;
        // //0未选中
        // if(!this._selectBattleList.has(heroData.getStaticID())){
        //     itemType = 0;
        // }
        // //1选中
        // if(this._selectBattleList.has(heroData.getStaticID())){
        //     itemType = 1;
        // }
        // //2锁定

        //this._selectBattleList:上面的英雄组
        //heroData:下面的英雄

        //没有一样的英雄    bookid没有
        //有一样的英雄选中  bookid有 动态id有
        //有一样的英雄未选中    bookid有 动态id没有

        let dyncId = this._selectBattleList.get(HeroData.GetHeroBookID(heroData.getStaticID()));
        console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-0000000000000000000000")
        console.log(this._selectBattleList)
        console.log(heroData.getStaticID())
        console.log(HeroData.GetHeroBookID(heroData.getStaticID()))
        console.log(heroData.getStaticID() / 1000000 * 1000000)
        console.log(heroData.getStaticID() % 10000)
        if(dyncId)//有一样的英雄
        {
            let heroInfo:HeroData = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(dyncId) as HeroData;
            console.log(heroInfo.getDyncID())
            console.log(heroData.getDyncID())
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

    private _submitHandle(){
        sys.localStorage.setItem("heroFormation_" + this._teamType, this._curPageNum);
        let _saveFormation:Msg.FormationInfo = new Msg.FormationInfo();
        for (const item of this._selectBattleHeroList.keys()) {
            _saveFormation.formation[item] = this._selectBattleHeroList.get(item) as number;
        }
        _saveFormation.index = this._curPageNum;

        MsgMgr.getInstance().getMsgFormation().requestChangeBattleTeam(_saveFormation,this._curPageNum,this._curPageNum,0);

        //关闭窗口，删除自身
        if(this._closeFunc)
        {
            this._closeFunc();
        }
        
    }

    private scrollCallBack()
    {

    }
    
    //上阵区域点选英雄回调
    private _topHeroClickCallBack(_heroInfo:HeroData, isBottomClick:boolean = false) {
        let _heroID = _heroInfo.getStaticID() as number;
        let _dyncId = _heroInfo.getDyncID();
        console.log("点击顶部英雄头像，则下阵英雄",_heroID);
        if(this._selectBattleList && this._selectBattleList.has(HeroData.GetHeroBookID(_heroID)))
        {
            if(_heroID == 0 || _heroInfo.isRoleHero())
            {
                PopMgr.getInstance().popupPrompt("主角不能下阵");
            }
            else{
                this._selectBattleList.delete(HeroData.GetHeroBookID(_heroID));
                this._selectBattleHeroList.delete(_dyncId);
                
                let node = this._getTopHero(_heroID)
                if(node)node.removeFromParent();
            }            
        }
        if(!isBottomClick && this._svHeroList.has(_dyncId))
        {
            for (let value of this._svHeroList.values()) {
                let script = value.getComponent("HeroSelectIcon") as HeroSelectIcon; 
                let scriptHeroInfo = script.getCurHeroInfo() as HeroData;
                if(scriptHeroInfo.getStaticID() == _heroInfo.getStaticID())
                {
                    script.setChoiceIconImage(0);
                    // if(scriptHeroInfo.getDyncID() != _heroInfo.getDyncID())
                    // {
                    //     sc
                    // }
                }
            }
            let child = this._svHeroList.get(_heroID);
            console.log("asczxcascqc");
        }
    }

    //滚动区域英雄点击回调
    private _bottomHeroSelectCallBack(heroInfo:HeroData,itemType:number = 0)
    {
        let heroStaticID = heroInfo.getStaticID() as number;
        let heroDyncID = heroInfo.getDyncID();
        console.log("点击滚动区域影响按时大多数",itemType,heroStaticID,heroDyncID);

        if(this._selectBattleList.size >= 6 && itemType == 0)
        {
            PopMgr.getInstance().popupPrompt("已达到最大上阵数量");
            return;
        }

        let foremostHeroHomeIndex:number = this._getForemostHeroHomeIndex();
        let foremostHeroHome = this.heroPosList[foremostHeroHomeIndex];

        if(itemType == 0)
        {
            resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
                let heroIcon = instantiate(res) as Node;       
                this._initTopHero(heroIcon, heroInfo);
                foremostHeroHome.addChild(heroIcon);  
            });

            this._selectBattleList.set(HeroData.GetHeroBookID(heroStaticID), heroDyncID);
            this._selectBattleHeroList.set(heroDyncID, foremostHeroHomeIndex);
        }
        else if(itemType == 1)
        {
            this._topHeroClickCallBack(heroInfo,true);
        }
        else if(itemType == 2)
        {
            PopMgr.getInstance().popupPrompt("出站英雄中已包含相同的英雄");
        }
    }
    private _getForemostHeroHomeIndex(){
        
        let foremostHeroHomeIndex:number = 0;
        for (let index = 0; index < this.heroPosList.length; index++) {
            const element = this.heroPosList[index];
            if(element.children.length == 0)
            {
                foremostHeroHomeIndex = index;
                break;
            }
        }
        return foremostHeroHomeIndex
    }

    //////////////////////////////////////////////////////


    //设置标题
    public setTitle(title:string){
        if(this.lab_title)
            this.lab_title.string = title
    }

    private tabCampClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        console.log(tog.node.name)
        var _length = tog.node.name.length;
        var _index = tog.node.name.charAt(_length-1);
        console.log("tab 阵营切换",_index,_length,XConsts.KHeroCampIcon[Number(_index)]);

        this._curCampType = Number(_index);
        this._initBottomHeros();
    }

    
    //上阵英雄切换标签------------------------------------------------
    private _btnLeftCallBack()
    {
        this._curPageNum--;
        if(this._curPageNum < 0)
        {
            this._curPageNum = this.selectToggleList.length;
        }
        (this.selectToggleList[this._curPageNum] as unknown as Toggle).isChecked = true;
        this._initTopHeros();
        this._initBottomHeros();
    }

    private _btnRightCallBack()
    {
        this._curPageNum++;
        if(this._curPageNum > this.selectToggleList.length)
        {
            this._curPageNum = 0;
        }
        (this.selectToggleList[this._curPageNum] as unknown as Toggle).isChecked = true;
        this._initTopHeros();
        this._initBottomHeros();
    }

    private tabClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        console.log(tog.node.name)
        var _length = tog.node.name.length;
        var _index = tog.node.name.charAt(_length-1);
        console.log("tab 页面切换",_index,_length);
        if(!this.selectToggleList[Number(_index)])
        {
            return
        }
        if(this._lastTog && this._lastTog != tog)
        {
            this._lastTog.enabled = true;
            this._lastTog.isChecked = false;
        }
        tog.enabled = false;
        console.log("上次与本次的索引",this._curPageNum,Number(_index));
        this._curPageNum = Number(_index);
        this._lastTog = tog;
        this._initTopHeros();
        this._initBottomHeros();
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
