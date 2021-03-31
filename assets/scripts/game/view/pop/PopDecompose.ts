/**
 * 游戏组件:融魂祭坛 分解
 * @author 施敏昭
 * @version 1.0.0,2021.3.26
 */
import { _decorator,Label,Component,Size,UITransform, Button,instantiate,Widget,Vec3, Node,resources,ToggleContainer,EventHandler,Toggle,ScrollView } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { HeroSelectIcon } from '../hero/HeroSelectIcon';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { HeroIcon } from '../hero/HeroIcon';
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { XShare } from '../../model/const/XShare';
import { PopMgr } from '../../control/PopMgr';
import { NotifyMgr } from '../../control/NotifyMgr';
import { MsgMgr } from '../../control/MsgMgr';
import { ItemEquipCell, ItemEquipType } from '../menu/ItemEquipCell';
import { XConsts } from '../../model/const/XConsts';
const { ccclass, property } = _decorator;

@ccclass('PopDecompose')
export class PopDecompose extends Component {

    @property({type: Node, displayName: "市场按钮"})
    public btn_shop:Node = null as unknown as Node;

    @property({type: Node, displayName: "自动分解普通英雄按钮"})
    public btn_check:Node = null as unknown as Node;

    @property({type: Node, displayName: "分解一键放入按钮"})
    public btn_oneKeyPut:Node | null = null;

    @property({type: Node, displayName: "分解按钮"})
    public btn_decomposet:Node | null = null;

    @property({type: Node, displayName: "自动分解普通英雄勾图"})
    public img_check:Node = null as unknown as Node;

    @property({type: Label, displayName: "背包容量"})
    public lab_bag_num:Label = null as unknown as Label;

    @property({type: Label, displayName: "分解灵魂石"})
    public lab_decompose_soul:Label = null as unknown as Label;

    @property({type: Label, displayName: "分解升级点"})
    public lab_decompose_upgrade:Label = null as unknown as Label;

    @property({type: Label, displayName: "分解进阶点"})
    public lab_decompose_Advanced:Label = null as unknown as Label;

    @property({type: ToggleContainer , displayName: "阵营" })
    public campGroup:ToggleContainer | null = null as unknown as ToggleContainer;

    @property({type: ToggleContainer , displayName: "星级" })
    public starGroup:ToggleContainer | null = null as unknown as ToggleContainer;

    @property({type :  Node, displayName: "分解物品"})
    public goodsNodes:Node[] = [];

    @property({type :  ScrollView})
    public scroll_HeroView:ScrollView = null as unknown as ScrollView;

    //拥有的所有英雄
    private _allHeroList:Map<number, HeroData> = new Map<number, HeroData>();
    //拥有的所有英雄列表显示对象
    private _bottomHeroItemList:Map<number, Node> = new Map<number, Node>();
    private _selectBattleList:Map<number, number> = new Map<number, number>();      //选择分解英雄列表

    private _curResetHero:number = 0;        //当前选择的重置英雄
    private _autoDecompose:boolean = true;        //自动分解普通英雄

    onLoad () {
        //super.onLoad();

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

        const containerStarEventHandler = new EventHandler();
        containerStarEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerStarEventHandler.component = 'PopDecompose';// 这个是代码文件名
        containerStarEventHandler.handler = '_onCampClick';
        containerStarEventHandler.customEventData = '';
        if(this.starGroup){
            this.starGroup.checkEvents.push(containerStarEventHandler);
            this.starGroup.toggleItems.forEach((tog)=>{
                tog?.checkEvents.push(containerStarEventHandler);
            });
        }

        this.btn_shop?.on(Node.EventType.TOUCH_END, this._shopHandle, this);
        this.btn_check?.on(Node.EventType.TOUCH_END, this._checkHandle, this);
        this.btn_oneKeyPut?.on(Node.EventType.TOUCH_END, this._oneKeyPutHandle, this);
        this.btn_decomposet?.on(Node.EventType.TOUCH_END, this._decomposeHandle, this);
    }
    start () {
       // super.start();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_hero_decompose_change,this._notifyDecomposeChangeHandle,this);

        if(this._selectBattleList == null)
        {
            this._selectBattleList = new Map<number, number>();
        }
        this._selectBattleList.clear();
        //自动分解按钮刷新
        let AutoDecompose = localStorage.getItem("AutoDecompose")
        if(AutoDecompose == "false"){
            this._autoDecompose = true
        }else if(AutoDecompose == "true"){
            this._autoDecompose = false
        }
        this._checkHandle()

        this._initBottomHeros();
    }

    //刷新灵魂石 进化点 进阶点 背包容量
    private _updataMoney(){
        let playerInfo = GameModel.getInstance().getPlayerModel().getPlayerInfo();
        this.lab_decompose_soul.string = playerInfo.soulStone.toString();
        this.lab_decompose_upgrade.string = playerInfo.heroUpgradeExp.toString();
        this.lab_decompose_Advanced.string = playerInfo.heroAdvanceExp.toString();

        let PlayerData = GameModel.getInstance().getPlayerModel()
        let allGoodsList = XConsts.KHeroBagMaxNum 
        allGoodsList += XConsts.KBuyHeroagNumEach * PlayerData.getPlayerInfo().BoughtBagTimes 
        allGoodsList += XConsts.KVipHeroBagAddition[PlayerData.getPlayerInfo().vipLevel] || 0

        let curGoodsList = GameModel.getInstance().getHeroesModel().getHeroList().size;
        this.lab_bag_num.string = "背包:"+curGoodsList+"/"+allGoodsList
    }

    //获取升星列表英雄
    private _getAllHeroList(){
        this._allHeroList = GameModel.getInstance().getHeroList();
    }
    //是否排除这个英雄
    private _isDeleteHero(Data : HeroData){
        //排除一级
        if(Data.getLevel() != 1){
            return true
        }
        if(Data.getStar() > 4){
            return true
        }
        return false
    }

    private _initBottomHeros()
    {
        this._getAllHeroList(); 
        this._updataMoney(); 
        let scroll:ScrollView = null as unknown as ScrollView;
        scroll = this.scroll_HeroView
        if(scroll.content)
        {
            scroll.content.removeAllChildren()
        }

        resources.load('prefabs_ui/main/hero_selecticon', (err:any,res:any)=>{
            this._bottomHeroItemList.clear()
            let k = new Array<[number,Node]>();     //排序存储对象
            let isShowOneKey = 0;       //是否显示一键升星按钮
            for (let heroData of this._allHeroList.values()) {
                let isDeleteHero = this._isDeleteHero(heroData)
                if(isDeleteHero){continue}
                let heroIcon = instantiate(res) as Node;
                scroll.content?.addChild(heroIcon);
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

    //选中状态初始化
    private _resetHeroState(){
        this._selectBattleList.clear();
        for (let value2 of this._bottomHeroItemList.values()) {
            let script2 = value2.getComponent("HeroSelectIcon") as HeroSelectIcon; 
            script2.setItemType(0);
        }
        this._platformExhibition();
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
            this._platformExhibition();
        }else{
            //top下阵
            if(hasHeroInTop){
                this._selectBattleList.delete(dyncID);
                this._platformExhibition();
            }
        }  
    }

    //平台展示
    private _platformExhibition(){
        //清空物品栏
        for (let index = 0; index < this.goodsNodes.length; index++) {
            if(this.goodsNodes[index].getChildByName("heroIcon")){
                this.goodsNodes[index].getChildByName("heroIcon")?.destroy();
                this.goodsNodes[index].getComponent(Button)?.clickEvents.splice(0);
            }
        }
        let index = 0
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
            for (let key of this._selectBattleList.keys()){
                let HeroInfo = this._getHeroData(key) as HeroData;
                let Info = ValueMgr.getInstance().getItemByField(TableName.heroes,HeroInfo.getStaticID()) as Config.heroes.Record;
                let heroIcon = instantiate(res) as Node;
                heroIcon.scale = new Vec3(0.5,0.5,1);
                heroIcon.addComponent(Widget);

                let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                script.setHeroData(HeroInfo as HeroData);
                this.goodsNodes[index].addChild(heroIcon);
                heroIcon.name = "heroIcon";

                var clickEventHandler = new EventHandler();
                clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
                clickEventHandler.component = "PopDecompose";//这个是代码文件名
                clickEventHandler.handler = "_onGoodsClick";
                clickEventHandler.customEventData = ""+key;
                this.goodsNodes[index].getComponent(Button)?.clickEvents.push(clickEventHandler);

                index++;
            }
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
            //阵营
            if(this._getCampType() == Msg.TCampType.ECampType_NULL){
                heroNode.active = true;
            }else if(this._getCampType() == heroData.getCamp()){
                heroNode.active = true;
            }else{
                heroNode.active = false;
            }
            //星级
            if(this._getStarType() == Msg.TCampType.ECampType_NULL){
                //不变
            }else if(this._getStarType() != heroData.getStar()){
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

    //获取当前星级类型
    private _getStarType(){
        let togs = this.starGroup?.activeToggles();
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

    //重置点击英雄事件
    private _platformViceHeadHandle(){
        if(this._curResetHero == 0){
            return;
        }
        let heroData = this._getHeroData(this._curResetHero);
        this._heroSelect(heroData as HeroData,false); 

        this._curResetHero = 0;
    }

     //点击物品栏
     private _onGoodsClick(event: Event, customEventData: string){
        let index:number = Number(customEventData);

        for (let key of this._selectBattleList.keys()){
            if(index == key){
                this._selectBattleList.delete(key);
                this._platformExhibition();

                let node = this._bottomHeroItemList.get(key) as Node
                let script2 = node.getComponent("HeroSelectIcon") as HeroSelectIcon; 
                script2.setItemType(0);
                return
            }
        }     
    }

    //---------------按钮事件---------------------------

    //市场按钮
    private _shopHandle(){

    }

    //自动分解普通英雄按钮
    private _checkHandle(){
        this._autoDecompose = !this._autoDecompose;
        if(this._autoDecompose){
            this.img_check.active = true;
        }
        else{
            this.img_check.active = false;
        }
        localStorage.setItem("AutoDecompose",""+this._autoDecompose)
    }

    //一键放入
    private _oneKeyPutHandle(){ 
        this._resetHeroState()
        for (let value of this._bottomHeroItemList.values()) {
            let script = value.getComponent("HeroSelectIcon") as HeroSelectIcon; 
            let scriptHeroInfo = script.getCurHeroInfo() as HeroData;
            this._selectBattleList.set(scriptHeroInfo.getDyncID(), HeroData.GetHeroBookID(scriptHeroInfo.getStaticID()));
            let node = this._bottomHeroItemList.get(scriptHeroInfo.getDyncID()) as Node
            let script2 = node.getComponent("HeroSelectIcon") as HeroSelectIcon; 
            script2.setItemType(1);
            if(this._selectBattleList.size >= 15)
            {
                break
            }
        }
        this._platformExhibition();
    }

    //分解按钮
    private _decomposeHandle(){
        let DyncHeroIDs : number[] = new Array<number>();
        let isTips = false
        for (let key of this._selectBattleList.keys()){
            DyncHeroIDs.push(key);
            let heroData = this._getHeroData(key) as HeroData
            if(heroData.getStar() > 2){
                isTips = true
            }
        }
        if(DyncHeroIDs.length > 0){
            if(isTips){
                PopMgr.getInstance().popupSimpleWindow("注意","选项中有高品质英雄是否继续分解?",()=>{
                    PopMgr.getInstance().deleteWindow();
                    MsgMgr.getInstance().getMsgDecompose().requestHeroDecompose(DyncHeroIDs);
                },()=>{
                    PopMgr.getInstance().deleteWindow();
                },false);
            }
            else{
                MsgMgr.getInstance().getMsgDecompose().requestHeroDecompose(DyncHeroIDs);
            } 
        }
        
        this._resetHeroState()
    }

    //////////////////////////////////////////////////////
    //分解后 阵容变化 弹出获得物品窗口
    private _notifyDecomposeChangeHandle(data:any){
        this._initBottomHeros();
        let ItemData:Msg.HeroDecomposeA = data[0];

        let arrProp: Array<XStruct.prop_info.Record> = [];
        let stuProp : XStruct.prop_info.Record = {
            nType : 0,
            nPropId : 0,
            nLevel : 0,
            nPropQuality : 0,
            num : 0,
        }

        //金币
        if(ItemData.money > 0){
            stuProp.nType = Msg.TObjectType.EObject_Money;
            stuProp.nPropId = 0;
            stuProp.nLevel = 0;
            stuProp.nPropQuality = 0;
            stuProp.num = ItemData.money;
            arrProp.push(instantiate(stuProp));  
        }
        
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
        //灵魂石
        if(ItemData.soulStone > 0){
            stuProp.nType = Msg.TObjectType.EObject_SoulStone;
            stuProp.nPropId = 0;
            stuProp.nLevel = 0;
            stuProp.nPropQuality = 0;
            stuProp.num = ItemData.soulStone;
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

        if(arrProp.length > 0){
            PopMgr.getInstance().popMultiItemRewardWindow(null,arrProp);  
        }  
    }

    //////////////////////////////////////////////////////
}
