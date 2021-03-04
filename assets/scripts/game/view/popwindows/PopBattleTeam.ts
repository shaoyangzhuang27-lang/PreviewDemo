
import { _decorator, Component, Node, Label, ToggleContainer, EventHandler, Toggle, sys, resources, instantiate, Vec3, ScrollView, v3, math, Widget } from 'cc';
const { ccclass, property } = _decorator;
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { HeroIcon } from '../hero/HeroIcon';
import { HeroSelectIcon } from '../hero/HeroSelectIcon';
import { PopMgr } from '../../control/PopMgr';
import { MsgMgr } from '../../control/MsgMgr';

@ccclass('PopBattleTeam')
export class PopBattleTeam extends PopBase {

    @property({type: Node})
    public btn_submit:Node | null = null;

    @property({type: Label})
    public lab_title:Label | null = null;

    @property({type: Label})
    public lab_power:Label | null = null;

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

    @property({type :  Node})
    public scroll_content:Node = null as unknown as Node;

    private submitCallFun:Function | null = null;       //保存阵容回调
    private _teamType :number = 0;  //获取阵型
    private _curPageNum :number = 1;    //当前阵容界面
    private _formationList:Map<number, HeroData> = new Map<number, HeroData>();   //当前上阵英雄阵容
    private _topSelectHeroList:Map<number, number> = new Map<number, number>();
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



        this.btn_submit?.on(Node.EventType.TOUCH_END, this.submitHandle, this);
        this.btn_left.on(Node.EventType.TOUCH_END, this.btnLeftCallBack, this);
        this.btn_right.on(Node.EventType.TOUCH_END, this.btnRightCallBack, this);
    }

    start()
    {
        super.start()
        if(this._selectBattleList == null)
        {
            this._selectBattleList = new Map<number, number>();
        }
        this._selectBattleList.clear();
        this.initBottomHero()
    }

    initTopHero()
    {
        this._formationList = GameModel.getInstance().getFormationModel().getFormationByIndex(this._curPageNum);
       
        resources.load('prefabs_ui/main/heroIcon', (err:any,res:any)=>{
            if(this._selectBattleList == null)
            {
                this._selectBattleList = new Map<number, number>();
            }
            this._selectBattleList.clear()
            if(this._selectBattleHeroList == null)
            {
                this._selectBattleHeroList = new Map<number, number>();
            }
            this._selectBattleHeroList.clear()

            for (let index = 0; index < this.heroPosList.length; index++) {
                this.heroPosList[index].removeAllChildren();                
            }

            let index = 0;
            for (let value of this._formationList.values()) {          
                let _heroIcon = instantiate(res) as Node;
                _heroIcon.scale = new Vec3(0.5,0.5,1);
                _heroIcon.addComponent(Widget);
                let subWidget = _heroIcon.getComponent(Widget) as Widget;
                subWidget.updateAlignment();

                this.heroPosList[index].addChild(_heroIcon);
                _heroIcon.position = this.heroPosList[index].position;
                _heroIcon.name = "formationIcon_" + value.getStaticID().toString();

                let script = _heroIcon.getComponent("HeroIcon") as HeroIcon; 
                script.setHeroID(value as HeroData);
                script.setBtnCallBack((_data:any)=>{
                    this._topHeroClickCallBack(_data);
                });                
                
                this._selectBattleList.set(value.getStaticID() as number, value.getDyncID());
                this._selectBattleHeroList.set(value.getDyncID(), index);
                index++;
            }
            this.initBottomHero();
            // this.heroPosList[index].addChild();
            
        });
    }

    initBottomHero()
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

        resources.load('prefabs_ui/main/heroSelectIcon', (err:any,res:any)=>{
            if(this._svHeroList == null)
            {
                this._svHeroList = new Map<number, Node>();
            }
            this._svHeroList.clear()

            for (let value of this._allHeroList.values()) {
                let _heroIcon = instantiate(res) as Node;
                this.scroll_HeroView.content?.addChild(_heroIcon);
                _heroIcon.name = "scrollviewHero_" + value.getStaticID().toString()

                let script = _heroIcon.getComponent("HeroSelectIcon") as HeroSelectIcon; 
                
                let _clickType =  0;                
                if(this._selectBattleList.has(value.getStaticID()))
                {
                    let _dyncId = this._selectBattleList.get(value.getStaticID()) as number;
                    let _topHeroInfo:HeroData = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(_dyncId) as HeroData;
                    if(_topHeroInfo.getDyncID() == value.getDyncID())
                    {
                        _clickType = 1;
                    }
                    else{
                        _clickType = 2;
                    }
                }

                script.setChoiceIconImage(_clickType);
                script.setSelectData(value as HeroData,(data:any,_num:number)=>{
                    this._bottomHeroSelectCallBack(data,_num);
                    if((_num == 1 || _num == 0) && this._selectBattleList && this._selectBattleList.size < 6 )
                    {
                        if(_num == 1) {_num = 0;}
                        else {
                            if(this._selectBattleList && this._selectBattleList.size < 6)
                            {
                                _num = 1;
                            }
                            else{ return }
                        }
                        script.setChoiceIconImage(_num);
                    }
                    
                });


                this._svHeroList.set(value.getDyncID(), _heroIcon);
            }
        });
    }

    tabClick(event: Event, customEventData: string){
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
        this.initTopHero();
    }

    btnLeftCallBack()
    {
        this._curPageNum--;
        if(this._curPageNum < 0)
        {
            this._curPageNum = this.selectToggleList.length;
        }
        (this.selectToggleList[this._curPageNum] as unknown as Toggle).isChecked = true;
        this.initTopHero();
    }

    btnRightCallBack()
    {
        this._curPageNum++;
        if(this._curPageNum > this.selectToggleList.length)
        {
            this._curPageNum = 0;
        }
        (this.selectToggleList[this._curPageNum] as unknown as Toggle).isChecked = true;
        this.initTopHero();
    }

    tabCampClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        console.log(tog.node.name)
        var _length = tog.node.name.length;
        var _index = tog.node.name.charAt(_length-1);
        console.log("tab 阵营切换",_index,_length);

    }

    submitHandle(){
        sys.localStorage.setItem("heroFormation_" + this._teamType, this._curPageNum);
        let _saveFormation:Msg.FormationInfo = new Msg.FormationInfo();
        for (const item of this._selectBattleHeroList.keys()) {
            _saveFormation.formation[item] = this._selectBattleHeroList.get(item) as number;
        }
        _saveFormation.index = this._curPageNum;

        MsgMgr.getInstance().getMsgFormation().requestChangeBattleTeam(_saveFormation,this._curPageNum,this._curPageNum,0);
    }

    scrollCallBack()
    {

    }
    
    //上阵区域点选英雄回调
    _topHeroClickCallBack(_heroInfo:HeroData, isBottomClick:boolean = false) {
        let _heroID = _heroInfo.getStaticID() as number;
        let _dyncId = _heroInfo.getDyncID();
        let childName = "formationIcon_" + _heroID.toString();
        console.log("点击顶部英雄头像，则下阵英雄",_heroID);
        if(this._selectBattleList && this._selectBattleList.has(_heroID))
        {
            if(_heroID == 0 || _heroInfo.isRoleHero())
            {
                PopMgr.getInstance().popupPrompt("主角不能下阵");
            }
            else{
                this._selectBattleList.delete(_heroID);
                this._selectBattleHeroList.delete(_dyncId);
                for (let index = 0; index < this.heroPosList.length; index++) {
                    let child = this.heroPosList[index].getChildByName(childName);
                    if(child)
                    {
                        child.removeFromParent();
                    }                    
                }
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
    _bottomHeroSelectCallBack(_heroInfo:HeroData,_clickType:number = 0)
    {
        let _heroStaticID = _heroInfo.getStaticID() as number;
        let _heroDyncID = _heroInfo.getDyncID();
        console.log("点击滚动区域影响按时大多数",_clickType,_heroStaticID,_heroDyncID);

        let posIndex:number = 0;
        if(this._selectBattleList.size >= 6 && _clickType == 0)
        {
            PopMgr.getInstance().popupPrompt("已达到最大上阵数量");
            return;
        }

        for (let index = 0; index < this.heroPosList.length; index++) {
            const element = this.heroPosList[index];
            if(element.children.length == 0)
            {
                posIndex = index;
                break;
            }
            
        }
        if(_clickType == 0)
        {
            resources.load('prefabs_ui/main/heroIcon', (err:any,res:any)=>{
                // index = index + 1;     
                let _heroIcon = instantiate(res) as Node;
                _heroIcon.scale = new Vec3(0.5,0.5,1);
                _heroIcon.addComponent(Widget);
                let subWidget = _heroIcon.getComponent(Widget) as Widget;
                subWidget.updateAlignment();    
                this.heroPosList[posIndex].addChild(_heroIcon);

                _heroIcon.position = this.heroPosList[posIndex].position;
                _heroIcon.name = "formationIcon_" + _heroStaticID.toString();

                let script = _heroIcon.getComponent("HeroIcon") as HeroIcon; 
                script.setHeroID(_heroInfo as HeroData);
                script.setBtnCallBack((_data:any)=>{
                    this._topHeroClickCallBack(_data);
                });
                
                this._selectBattleList.set(_heroStaticID, _heroDyncID);
                this._selectBattleHeroList.set(_heroDyncID, posIndex);
            });
        }
        else if(_clickType == 1)
        {
            this._topHeroClickCallBack(_heroInfo,true);
        }
        else if(_clickType == 2)
        {
            PopMgr.getInstance().popupPrompt("出站英雄中已包含相同的英雄");
        }
    }

    //////////////////////////////////////////////////////

    public setInitTeamView(type:number = 1)
    {
        this._teamType = type;
        this._curPageNum = sys.localStorage.getItem("heroFormation_" + this._teamType) | 1;
        if(this._topSelectHeroList == null)
        {
            this._topSelectHeroList = new Map<number, number>();
        }
        this._topSelectHeroList.clear();
        // this._lastTog = this.selectToggleList[Number(this._curPageNum)] as Toggle;
        this.initTopHero();
    }

    //设置标题
    public setTitle(title:string){
        if(this.lab_title)
            this.lab_title.string = title
    }
    //保存阵容回调
    public setSubmitCallBack(func:Function){
        this.submitCallFun = func;
    }
    //关闭回调
    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
