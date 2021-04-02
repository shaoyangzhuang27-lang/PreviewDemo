/**
 * 游戏组件:升星塔
 * @author 施敏昭
 * @version 1.0.0,2021.3.13
 */
import { _decorator, Component, Node, Sprite,SpriteFrame, Label, ToggleContainer, EventHandler, Toggle, sys, resources, instantiate, Vec3, ScrollView, v3, math, Widget, Button } from 'cc';
const { ccclass, property } = _decorator;
import { PopBase } from '../../../../core/control/PopBase';
import { GameModel } from '../../../model/GameModel';
import { HeroData } from '../../../model/datas/HeroData';
import { HeroIcon } from '../../hero/HeroIcon';
import { HeroSelectIconStarUp } from '../../hero/HeroSelectIconStarUp';
import { PopMgr } from '../../../control/PopMgr';
import { MsgMgr } from '../../../control/MsgMgr';
import { XConsts } from "../../../model/const/XConsts";
import { NotifyMgr } from '../../../control/NotifyMgr';
import { HeroModel } from '../../hero/HeroModel';
import { TableName, ValueMgr } from "../../../model/ValueMgr";
import { ResMgr } from '../../../control/ResMgr';

@ccclass('PopRisingStarTower')
export class PopRisingStarTower extends PopBase {

    @property({type: Node, displayName: "一键升星按钮"})
    public btn_submit:Node | null = null;

    @property({type: Button, displayName: "升星按钮"})
    public btn_risingstar:Button | null = null;

    @property({type: Node, displayName: "说明按钮"})
    public btn_explain:Node | null = null;

    @property({type: Node, displayName: "显示区域"})
    public top_platform:Node | null = null;

    @property({type: Node, displayName: "显示区域信息"})
    public top_platform_hero:Node | null = null;

    @property({type: Label})
    public lab_title:Label = null as unknown as Label;

    @property({type: Label, displayName: "当前英雄名称"})
    public lab_Name:Label = null as unknown as Label;

    @property({type :  Node, displayName: "当前英雄阵营"})
    public img_camp:Node = null as unknown as Node;

    @property({type :  Node, displayName: "当前英雄职业"})
    public img_classes:Node = null as unknown as Node;

    @property({type :  Node, displayName: "当前英雄星级"})
    public starlist:Node[] = [];

    @property({ type: HeroModel, displayName: "当前英雄形象" })
    public cur_hero_model: HeroModel | null = null;

    @property({type: ToggleContainer , displayName: "阵营" })
    public campGroup:ToggleContainer | null = null as unknown as ToggleContainer;

    @property({type :  Node, displayName: "当前英雄升星信息头像1"})
    public img_info_head1:Node = null as unknown as Node;

    @property({type :  Node, displayName: "当前英雄升星信息头像2"})
    public img_info_head2:Node = null as unknown as Node;

    @property({type: Label, displayName: "当前英雄升星信息label1"})
    public lab_info1:Label = null as unknown as Label;

    @property({type: Label, displayName: "当前英雄升星信息label2"})
    public lab_info2:Label = null as unknown as Label;

    @property({type :  Node, displayName: "当前平台升星英雄"})
    public btn_head1:Node = null as unknown as Node;

    @property({type :  Node, displayName: "当前平台升星副英雄1"})
    public btn_head2:Node = null as unknown as Node;

    @property({type :  Node, displayName: "当前平台升星副英雄2"})
    public btn_head3:Node = null as unknown as Node;

    @property({type :  Node, displayName: "当前平台升星副英雄1mask"})
    public maskNode2:Node = null as unknown as Node;

    @property({type :  Node, displayName: "当前平台升星副英雄2mask"})
    public maskNode3:Node = null as unknown as Node;

    @property({type :  Node})
    public heroPosList:Node[] = [];

    @property({type :  ScrollView})
    public scroll_HeroView:ScrollView = null as unknown as ScrollView;

    //原英雄数据
    private _firstHeroData:HeroData = null as unknown as HeroData;

    //拥有的所有英雄
    private _allHeroList:Map<number, HeroData> = new Map<number, HeroData>();
    //拥有的所有英雄列表显示对象
    private _bottomHeroItemList:Map<number, Node> = new Map<number, Node>();

    private _curCampType:number = 0;        //当前选择的英雄阵营
    private _curStarupType:number = 0;        //当前选择的升星材料类型
    private _curStarupParam:number = 0;        //当前选择的升星材料参数ID或星
    private _curStarupNum:number = 3;        //当前选择的升星材料数量

    private _risingdyncMaiID:number = 0;        //当前升星主ID
    private _risingDyncViceID1:number = 0;        //当前升星副ID1
    private _risingDyncViceID2:number = 0;        //当前升星副ID2
    private _selectBattleList:Map<number, number> = new Map<number, number>();      //选择升星英雄列表

    private _starNameList:string[] = new Array<string>();
    onLoad () {
        super.onLoad();
        // [3]

        const containerCampEventHandler = new EventHandler();
        containerCampEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerCampEventHandler.component = 'PopRisingStarTower';// 这个是代码文件名
        containerCampEventHandler.handler = '_onCampClick';
        containerCampEventHandler.customEventData = '';
        if(this.campGroup){
            this.campGroup.checkEvents.push(containerCampEventHandler);
            this.campGroup.toggleItems.forEach((tog)=>{
                tog?.checkEvents.push(containerCampEventHandler);
            });
        }

        if(this.btn_risingstar){
            this.btn_risingstar.interactable = false;            //升星按钮禁用
        }
        var clickEventHandler = new EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "PopRisingStarTower";//这个是代码文件名
        clickEventHandler.handler = "risingstarClick";
        clickEventHandler.customEventData = "";
        this.btn_risingstar?.clickEvents.push(clickEventHandler);

        if(this.top_platform){
            this.top_platform.active = true;
        }
        if(this.top_platform_hero){
            this.top_platform_hero.active = false;
        }

        this.btn_explain?.on(Node.EventType.TOUCH_END, this._explainHandle, this);
        this.btn_submit?.on(Node.EventType.TOUCH_END, this._submitHandle, this);
        this.btn_head1?.on(Node.EventType.TOUCH_END, this._platformMainHeadHandle, this);
        this.btn_head2?.on(Node.EventType.TOUCH_END, this._platformViceHeadHandle1, this);
        this.btn_head3?.on(Node.EventType.TOUCH_END, this._platformViceHeadHandle2, this);
    }

    start()
    {
        super.start();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_starUp_change,this._notifyStarUpChangeHandle,this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_OneKeyStarUp_change,this._notifyOneKeyStarUpChangeHandle,this);
        this._starNameList = ["星星初级","星星中级","星星高级"]
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
    //是否排除这个英雄
    private _isDeleteHero(HeroData : HeroData){
        //剔除满星级英雄
        if(HeroData.getStar() >= 13){
            return true
        }
        //剔除2星怪 不能升星的
        let heroDataes = ValueMgr.getInstance().getTableByName(TableName.heroes).records ;
        for (let Data of heroDataes) {
            let record = Data as Config.heroes.Record;
            if(record.id == HeroData.getStaticID()) { 
                if(record.starupType == 0){
                    return true
                }
                break;
            }
        }
        return false
    }

    //说明界面
    private _explainHandle(){
        let heroDataes = ValueMgr.getInstance().getTableByName(TableName.language_ui).records ;
        let strExplain= ""
        for (let herodata of heroDataes) {
            let record = herodata as Config.language_ui.Record;
            if(record.id == "UI_StarTowerExplain") { 
                strExplain = record.cn;
                break;
            }
        }

        PopMgr.getInstance().popExplain("",strExplain,()=>{
            PopMgr.getInstance().deleteWindow();
        },()=>{
            PopMgr.getInstance().deleteWindow();
        },false);
    }

    private _initBottomHeros()
    {
        this._getAllHeroList();
        if(this.scroll_HeroView.content)
        {
            this.scroll_HeroView.content.removeAllChildren()
        }

        resources.load('prefabs_ui/main/hero_selecticonstarup', (err:any,res:any)=>{
            this._bottomHeroItemList.clear()
            let k = new Array<[number,Node]>();     //排序存储对象
            let isShowOneKey = 0;       //是否显示一键升星按钮
            for (let heroData of this._allHeroList.values()) {
                let isDeleteHero = this._isDeleteHero(heroData)
                if(isDeleteHero){continue}
                let heroIcon = instantiate(res) as Node;
                this.scroll_HeroView.content?.addChild(heroIcon);
                let heroSelectScript = heroIcon.getComponent("HeroSelectIconStarUp") as HeroSelectIconStarUp;  
                let itemType =  this._getItemType(heroData);
                let isStarUp = this._isStarUp(heroData);
                if(isStarUp){
                    isShowOneKey = 1;
                }
                heroSelectScript.setItemType(itemType);
                heroSelectScript.setItemSymbol(Number(isStarUp));
                heroSelectScript.setSelectData(heroData as HeroData,(data:any,itemType:number)=>{
                    //第一个是升星主体 型号3
                    if(this._risingdyncMaiID == heroData.getDyncID() && itemType != 3)
                    {
                        itemType = 3;
                        this._platformExhibition();
                        heroSelectScript.setItemType(itemType);
                        return 
                    }

                    let isSelect = null;
                    if(itemType == 0){
                        //升星材料已满
                        if(this._selectBattleList.size == this._curStarupNum+1)
                        {
                            console.log("升星材料已满",this._selectBattleList.size);
                            return;
                        }
                        isSelect = true;
                    }else if(itemType == 1){
                        isSelect = false;
                    }else if(itemType == 3){
                        isSelect = false;
                        this._platformMainHeadHandle()
                    }

                    
                    if(isSelect != null){
                        this._heroSelect(heroData,isSelect);
                    }  
                    this._platformExhibition();               
                });
                let sortIndex_1:number = heroData.getLevel() * 10000 + heroData.getStar()*1000 + heroData.getCamp() * 10 + heroData.getClasses();
                let sortIndex_2:number = 3000000 - sortIndex_1;
                //排序 可以升星的放前面
                if(isStarUp){
                    sortIndex_2 -= 10000000;
                }
                k.push([sortIndex_2,heroIcon]);
                


                this._bottomHeroItemList.set(heroData.getDyncID(), heroIcon);
            }
            if(this.btn_submit && isShowOneKey == 1){
                this.btn_submit.active = true;
            }else if(this.btn_submit){
                this.btn_submit.active = false;
            }
            
            k.sort((n1,n2) => n1[0] - n2[0])
            k.forEach((value,key)=>{
                value[1].setSiblingIndex(key);
            })
        });
    }

    //是否能升星
    private _isStarUp(curHeroData:HeroData){
        let num = 0;
        let curStarupType;
        let curStarupParam;
        let curStarupNum;
        let heroDataes = ValueMgr.getInstance().getTableByName(TableName.heroes).records ;
        for (let herodata of heroDataes) {
            let record = herodata as Config.heroes.Record;
            if(record.id == curHeroData.getStaticID()) { 
                curStarupType = record.starupType;
                curStarupParam = record.starupParam;
                curStarupNum = record.starupNum;
                break;
            }
        }
        for (let heroData of this._allHeroList.values()){
            let isDeleteHero = this._isDeleteHero(heroData)
            if(isDeleteHero){continue}
            if(curStarupType == 1){
                if(curHeroData.getStaticID()  == heroData.getStaticID() 
                && curHeroData.getDyncID() != heroData.getDyncID() ){
                    num++;
                    if(num == curStarupNum){
                        return true;
                    }
                }
            }else if(curStarupType == 2){
                if(heroData.getStar() == curStarupParam
                && curHeroData.getDyncID() != heroData.getDyncID() ){
                    num++;
                    if(num == curStarupNum){
                        return true;
                    }
                }
            }
        }
        return false;
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
        let hasHeroInTop = this._selectBattleList && this._selectBattleList.has(dyncID)
            
        if(isSelect)
        {
            //top上阵

            this._selectBattleList.set(dyncID, HeroData.GetHeroBookID(staticID));
            if(this._selectBattleList.size == 1){
                this._risingdyncMaiID = dyncID;

//弹出升星结果界面****************测试**************
// this._firstHeroData=this._getHeroData(this._risingdyncMaiID)as HeroData
//         let HeroData = this._getHeroData(this._firstHeroData.getDyncID())as HeroData


//         PopMgr.getInstance().popStarUpResultView(this._firstHeroData,HeroData,()=>{
//             PopMgr.getInstance().deleteWindow();
//         });
//弹出升星结果界面****************测试**************
            }else{
                if(this._risingDyncViceID1 == 0){
                    this._risingDyncViceID1 = dyncID;
                }else{
                    this._risingDyncViceID2 = dyncID;
                }
            }
           this._changeStarUpState();
        }else{

            //top下阵
            if(hasHeroInTop)
            {
                this._selectBattleList.delete(dyncID);
                if(dyncID == this._risingDyncViceID1){
                    this._platformViceHeadHandle1();
                }if(dyncID == this._risingDyncViceID2){
                    this._platformViceHeadHandle2();
                }
                    
                let node = this._getTopHeroByStaticID(staticID)
                if(node)node.removeFromParent();
            }
            this._bottomHeroChange();
            this._changeStarUpState();
        }
    }

    //根据英雄动态id获取英雄静态id
    private _getTopHeroByStaticID(heroID:number){
        
        let childName = "formationIcon_" + heroID;
        
        for (let index = 0; index < this.heroPosList.length; index++) {
            let child = this.heroPosList[index].getChildByName(childName);
            if(child)return child
        }
    }

    //根据herodata获取拥有英雄代码
    private _getBottomHeroItemScript(heroData:HeroData){
        for (let value of this._bottomHeroItemList.values()) {
            let script = value.getComponent("HeroSelectIconStarUp") as HeroSelectIconStarUp; 
            let scriptHeroInfo = script.getCurHeroInfo() as HeroData;
            if(scriptHeroInfo.getDyncID() == heroData.getDyncID())
            {
                return script;
            }
        }
    }
    private _frushButtonHero(){
        this._bottomHeroItemList.forEach((heroNode,dyncid)=>{
            let heroSelectScript = heroNode.getComponent("HeroSelectIconStarUp") as HeroSelectIconStarUp;
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

    //0未选中 1选中 2锁定 3升星选中
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
                //第一个是升星主体 型号3
                if(this._risingdyncMaiID == heroData.getDyncID())
                {
                    itemType = 3;
                }else{
                    itemType = 1;
                }   
            }
        }else{//没有一样的英雄
            itemType = 0;
        }
        return itemType;
    }

    //平台主英雄事件
    private _platformMainHeadHandle(){
        if(!this._selectBattleList || this._selectBattleList.size == 0){
            return;
        }
        this._risingdyncMaiID = 0;
        for (let value2 of this._bottomHeroItemList.values()) {
            let script2 = value2.getComponent("HeroSelectIconStarUp") as HeroSelectIconStarUp; 
            let scriptHeroInfo = script2.getCurHeroInfo() as HeroData;
            script2.setItemType(0);
        }
        this._selectBattleList.clear();
        this.btn_head2.getChildByName("heroIcon2")?.removeFromParent();
        this.btn_head3.getChildByName("heroIcon3")?.removeFromParent();
        this._risingDyncViceID1 = 0;
        this._risingDyncViceID2 = 0;
        this._curStarupType = 0;
        this._curStarupParam = 0;
        this._curStarupNum = 0;
        this._platformExhibition();  
        this._changeStarUpState();
    }

    //平台副英雄事件
    private _platformViceHeadHandle1(){
        if(this._risingDyncViceID1 == 0){
            return;
        }
        let heroData = this._getHeroData(this._risingDyncViceID1);
        this._heroSelect(heroData as HeroData,false); 

        this._risingDyncViceID1 = 0;
        this.btn_head2.getChildByName("heroIcon2")?.removeFromParent();
        this._bottomHeroChange();
    }
    private _platformViceHeadHandle2(){
        if(this._risingDyncViceID2 == 0){
            return;
        }
        let heroData = this._getHeroData(this._risingDyncViceID2);
        this._heroSelect(heroData as HeroData,false); 
        this._risingDyncViceID2 = 0;
        this.btn_head3.getChildByName("heroIcon3")?.removeFromParent();
        this._bottomHeroChange();
    }

    //升星按钮变化
    private _changeStarUpState(){
        if(this.btn_risingstar && this._selectBattleList.size == this._curStarupNum+1){
            this.btn_risingstar.interactable = true;
        }
        else if(this.btn_risingstar){
            this.btn_risingstar.interactable = false;
        }
    }

    //升星平台展示
    private _platformExhibition(){
        if(this._selectBattleList.size > 0){
            if(this.top_platform){
                this.top_platform.active = false;
            }
            if(this.top_platform_hero){
                this.top_platform_hero.active = true;
                this._showHeroInfo();
            }
            this._bottomHeroChange();
        }
        else{
            if(this.top_platform){
                this.top_platform.active = true;
            }
            if(this.top_platform_hero){
                this.top_platform_hero.active = false;
            }
            this._frushButtonHero();
        }
    }

    //根据动态ID获取HeroData
    private _getHeroData(heroID:number){
        let HeroInfo;
        for (let value of this._bottomHeroItemList.values()) {
            let script = value.getComponent("HeroSelectIconStarUp") as HeroSelectIconStarUp; 
            let scriptHeroInfo = script.getCurHeroInfo() as HeroData;
            if(scriptHeroInfo.getDyncID() == heroID)
            {
                HeroInfo = scriptHeroInfo;
            }
        }
        return HeroInfo;
    }

    //滚动区域英雄变化
    private _bottomHeroChange(){
        this._bottomHeroItemList.forEach((heroNode,dyncid)=>{
            let heroSelectScript = heroNode.getComponent("HeroSelectIconStarUp") as HeroSelectIconStarUp;
            let heroData = heroSelectScript.getHeroData() as HeroData;
            let itemType =  this._getItemType(heroData);
            heroSelectScript.setItemType(itemType);
            
            //静态ID一样的
            if(this._curStarupType == 1){
                let risingdyncHeroData = this._getHeroData(this._risingdyncMaiID)as HeroData
                if(risingdyncHeroData.getStaticID() == heroData.getStaticID()){
                    heroNode.active = true;
                }else{
                    heroNode.active = false;
                }
            }else if(this._curStarupType == 2){
                if(this._curStarupParam == heroData.getStar()){
                    heroNode.active = true;
                }else{
                    heroNode.active = false;
                }
            }
        });
    }

    //平台显示英雄信息
    private _showHeroInfo()
    {
        let HeroInfo = this._getHeroData(this._risingdyncMaiID);
        let HeroInfo2 = this._getHeroData(this._risingDyncViceID1);
        let HeroInfo3 = this._getHeroData(this._risingDyncViceID2);
        if(!HeroInfo)
        {
            return;
        }

        let _campName:string = XConsts.KHeroCampIcon[HeroInfo?.getCamp() as number];
        let _classesName:string = XConsts.KClassesSpriteName[HeroInfo?.getClasses() as number];
        let _iconName:string = HeroInfo?.getName() as string;
        let _starNum:number = HeroInfo?.getStar() as number;

        if(this._selectBattleList.size == 1)
        {
            this.img_camp.active = true;
            let campIconPath:string = "ui/team/" + _campName + "/spriteFrame"
            resources.load(campIconPath, (err,spriteFrame:SpriteFrame) =>
            {
                if(!err)
                {
                    let sprite = this.img_camp.getComponent(Sprite) as Sprite;
                    sprite.spriteFrame = spriteFrame;
                }
            });   
            this.img_classes.active = true;
            let classesIconPath:string = "ui/lv_up/" + _classesName + "/spriteFrame"
            resources.load(classesIconPath, (err,spriteFrame:SpriteFrame) =>
            {
                if(!err)
                {
                    let sprite = this.img_classes.getComponent(Sprite) as Sprite;
                    sprite.spriteFrame = spriteFrame;
                }
            });  
            
            this.lab_Name.string = _iconName.toString();
            this._setStar(_starNum);
            this._showCurHeroModel(_iconName);
            this._getHeroesDatas(HeroInfo.getStaticID());
            this._showStarUpInfo(HeroInfo);
            this._changeStarUpState();

            //同类型英雄
            if(this._curStarupType == 1){
                resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
                    let heroIcon = instantiate(res) as Node;
                    heroIcon.scale = new Vec3(0.5,0.5,1);
                    heroIcon.addComponent(Widget);
        
                    let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                    script.setHeroData(HeroInfo as HeroData); 
                    script.setLvIconVisib(false);
                    this.btn_head2.addChild(heroIcon);
                    this.maskNode2.active = true
                    this.maskNode2.setSiblingIndex(100)
                });
                if(this._curStarupNum == 1){
                    this.btn_head2.setPosition(-137,91,0);
                    this.btn_head3.active = false;
                }else if(this._curStarupNum == 2){
                    this.btn_head2.setPosition(-192,91,0);
                    this.btn_head3.active = true;
                    resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
                        let heroIcon = instantiate(res) as Node;
                        heroIcon.scale = new Vec3(0.5,0.5,1);
                        heroIcon.addComponent(Widget);
            
                        let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                        script.setHeroData(HeroInfo as HeroData); 
                        script.setLvIconVisib(false);
                        this.btn_head3.addChild(heroIcon);
                        this.maskNode3.active = true
                        this.maskNode3.setSiblingIndex(100)
                    }); 
                }
            }else if(this._curStarupType == 2){ //同星级英雄
                resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
                    let heroIcon = instantiate(res) as Node;
                    heroIcon.scale = new Vec3(0.5,0.5,1);
                    heroIcon.addComponent(Widget);
        
                    let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                    script.setMaskHeroData((HeroInfo as HeroData).getCamp(),this._curStarupParam,0); 
                    script.setLvIconVisib(false);
                    this.btn_head2.addChild(heroIcon);
                    this.maskNode2.active = true
                    this.maskNode2.setSiblingIndex(100)
                });
                if(this._curStarupNum == 1){
                    this.btn_head2.setPosition(-137,91,0);
                    this.btn_head3.active = false;
                }else if(this._curStarupNum == 2){
                    this.btn_head2.setPosition(-192,91,0);
                    this.btn_head3.active = true;
                    resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
                        let heroIcon = instantiate(res) as Node;
                        heroIcon.scale = new Vec3(0.5,0.5,1);
                        heroIcon.addComponent(Widget);
            
                        let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                        script.setMaskHeroData((HeroInfo as HeroData).getCamp(),this._curStarupParam,0); 
                        script.setLvIconVisib(false);
                        this.btn_head3.addChild(heroIcon);
                        this.maskNode3.active = true
                        this.maskNode3.setSiblingIndex(100)
                    }); 
                }
            }
        }
        else{//副材料显示
            if(HeroInfo2){
                this.btn_head2.getChildByName("heroIcon2")?.removeFromParent();
                resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
                    let heroIcon = instantiate(res) as Node;
                    heroIcon.scale = new Vec3(0.5,0.5,1);
                    heroIcon.addComponent(Widget);
        
                    let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                    script.setHeroData(HeroInfo2 as HeroData);
                    script.setLvIconVisib(true); 
                    this.btn_head2.addChild(heroIcon);
                    heroIcon.name = "heroIcon2";
                });
            }
            if(HeroInfo3){
                this.btn_head3.getChildByName("heroIcon3")?.removeFromParent();
                resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
                    let heroIcon = instantiate(res) as Node;
                    heroIcon.scale = new Vec3(0.5,0.5,1);
                    heroIcon.addComponent(Widget);
        
                    let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                    script.setHeroData(HeroInfo3 as HeroData); 
                    script.setLvIconVisib(true); 
                    this.btn_head3.addChild(heroIcon);
                    heroIcon.name = "heroIcon3";
                });
            }
        }
    }

    //设置星星
    private _setStar(star:number)
    {
        let grade:number = Math.ceil(star/5) - 1;
        let yu:number = (star - 1) % 5 + 1;

        let starName = this._starNameList[grade];
        let starPath = "ui/common/icon/" + starName + "/spriteFrame"

        for (let index = 0; index < this.starlist.length; index++) {
            if(index >= yu && yu != 0)
            {
                this.starlist[index].active = false;
            }
            else{
                this.starlist[index].active = true;
                this._resourceLoad(starPath,this.starlist[index]);
            }
        }
    }

    //资源替换
    private _resourceLoad(path:string,obj:any)
    {
        ResMgr.getInstance().loadSpriteFrame(path,(err,spriteFrame:SpriteFrame | null) =>
        {
            console.log("errerrerrerrerrerrerr",err)
            if(!err)
            {
                let sprite = obj.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
    }

    public setCloseCallBack(func:Function | null){
        if(func){
            this._closeFunc = func;
        }else{
            this._closeFunc = ()=>{
                PopMgr.getInstance().deleteWindow();
            };
        }  
    }

    // 展示当前英雄形象
    private _showCurHeroModel(_iconName:string)
    {
        if(this.cur_hero_model)
        {
            this.cur_hero_model.updateByHeroPerfabPath(_iconName);
        }
    }

    // 展示升星信息
    private _showStarUpInfo(HeroInfo:HeroData)
    {
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
            let heroIcon = instantiate(res) as Node;
            heroIcon.scale = new Vec3(0.5,0.5,1);
            heroIcon.addComponent(Widget);

            let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
            script.setHeroData(HeroInfo as HeroData); 
            this.img_info_head1.addChild(heroIcon);
        });

        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
            let heroIcon = instantiate(res) as Node;
            heroIcon.scale = new Vec3(0.5,0.5,1);
            heroIcon.addComponent(Widget);
            let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
            
            script.setHeroData(HeroInfo as HeroData); 
            script.addOneStar()
            this.img_info_head2.addChild(heroIcon);
        });

        this.lab_info1.string = HeroInfo.getStar()+1+"";
        this.lab_info2.string = "属性提升:20%";
        if(HeroInfo.getStar() < 2){
            this.lab_info2.string = "属性提升:10%";
        }
    }

    //////////////////////////////////////////////////////
    //升星后 阵容变化 弹出升星结果界面
    private _notifyStarUpChangeHandle(){
        this._initBottomHeros();

        //弹出升星结果界面
        let HeroData:HeroData = null as unknown as HeroData;
        for (let heroData of this._allHeroList.values()) {
            if(heroData.getDyncID() == this._firstHeroData.getDyncID()){
                HeroData = heroData;
                break;
            }
        }
        PopMgr.getInstance().popStarUpResultView(this._firstHeroData,HeroData);
    }

    //一键升星后 阵容变化 弹出获得物品窗口
    private _notifyOneKeyStarUpChangeHandle(data:any){
        this._initBottomHeros();
        // if(data instanceof Array){
        //     let heroNewStar:Msg.HeroStarUpMultiA = data[0];
        // }
        // PopMgr.getInstance().popMultiItemRewardWindow(null,data);

        let ItemData:Msg.HeroStarUpMultiA = data[0];

        let arrProp: Array<XStruct.prop_info.Record> = [];
        let stuProp : XStruct.prop_info.Record = {
            nType : 0,
            nPropId : 0,
            nLevel : 0,
            nPropQuality : 0,
            num : 0,
        }
        //英雄
        for (let key in ItemData.heroNewStar){
            let HeroInfo = this._getHeroData(Number(key))as HeroData
            stuProp.nType = Msg.TObjectType.EObject_Hero;
            stuProp.nPropId = HeroInfo.getStaticID();
            stuProp.nLevel = HeroInfo.getLevel();
            stuProp.nPropQuality = 1;
            stuProp.num = 1;
            arrProp.push(instantiate(stuProp)); 
        }
         
        //金币
        stuProp.nType = Msg.TObjectType.EObject_Money;
        stuProp.nPropId = 0;
        stuProp.nLevel = 0;
        stuProp.nPropQuality = 0;
        stuProp.num = ItemData.money;
        arrProp.push(instantiate(stuProp));  
        //升级点
        if(ItemData.upgradePoint > 0){
            stuProp.nType = Msg.TObjectType.EObject_UpgradePoint;
            stuProp.nPropId = 0;
            stuProp.nLevel = 0;
            stuProp.nPropQuality = 0;
            stuProp.num = ItemData.upgradePoint;
            arrProp.push(instantiate(stuProp));  
        }
        //进阶石
        if(ItemData.advanceExp > 0){
            stuProp.nType = Msg.TObjectType.EObject_AdvanceExp;
            stuProp.nPropId = 0;
            stuProp.nLevel = 0;
            stuProp.nPropQuality = 0;
            stuProp.num = ItemData.advanceExp;
            arrProp.push(instantiate(stuProp)); 
        }  
        //装备
        for (let key in ItemData.equipList) {
            stuProp.nType = Msg.TObjectType.EObject_Equip;
            stuProp.nPropId = Number(key)
            stuProp.nLevel = 1;
            stuProp.nPropQuality = 1;
            stuProp.num = 1;
            arrProp.push(instantiate(stuProp)); 
        }

        PopMgr.getInstance().popMultiItemRewardWindow(null,arrProp);  
    }

    //////////////////////////////////////////////////////


    // 从heroes文件获取升星材料类型 参数 数量
    private _getHeroesDatas(StaticID:number)
    {
        let heroDataes = ValueMgr.getInstance().getTableByName(TableName.heroes).records ;
        for (let herodata of heroDataes) {
            let record = herodata as Config.heroes.Record;
            if(record.id == StaticID) { 
                this._curStarupType = record.starupType;
                this._curStarupParam = record.starupParam;
                this._curStarupNum = record.starupNum;
                break;
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
        
        this._frushButtonHero();
    }

    //升星
    private risingstarClick(event: Event, customEventData: string){
        console.log("点击升星");
        this._firstHeroData = this._getHeroData(this._risingdyncMaiID)as HeroData
        let materialHeroIDs:Msg.HeroIDs = new Msg.HeroIDs();
        materialHeroIDs.heroIDList.push(this._risingDyncViceID1);
        if(this._risingDyncViceID2 != 0){
            materialHeroIDs.heroIDList.push(this._risingDyncViceID2);
        }
        MsgMgr.getInstance().getMsgStarUp().requestHeroStarUp(this._risingdyncMaiID,materialHeroIDs);
        this._platformMainHeadHandle();
    }

    //一键升星
    private _submitHandle(){
        PopMgr.getInstance().popOneKeyStarUpView();
    }
}
