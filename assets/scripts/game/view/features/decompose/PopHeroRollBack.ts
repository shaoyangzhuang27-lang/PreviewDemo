/**
 * 游戏组件:融魂祭坛 重置
 * @author 施敏昭
 * @version 1.0.0,2021.3.26
 */
import { _decorator,Label,Size,Component, Button,instantiate,Widget,Vec3, Node,resources,ToggleContainer,EventHandler,Toggle,ScrollView } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { HeroSelectIcon } from '../../hero/HeroSelectIcon';
import { GameModel } from '../../../model/GameModel';
import { HeroData } from '../../../model/datas/HeroData';
import { HeroIcon } from '../../hero/HeroIcon';
import { TableName, ValueMgr } from "../../../model/ValueMgr";
import { XShare } from '../../../model/const/XShare';
import { PopMgr } from '../../../control/PopMgr';
import { NotifyMgr } from '../../../control/NotifyMgr';
import { MsgMgr } from '../../../control/MsgMgr';
import { PopDecompose } from "../../../view/features/decompose/PopDecompose";
import { ItemEquipCell, ItemEquipType } from '../../menu/ItemEquipCell';
const { ccclass, property } = _decorator;

@ccclass('PopHeroRollBack')
export class PopHeroRollBack extends Component {

    @property({type: Button, displayName: "回退按钮"})
    public btn_rollback:Button | null = null;

    @property({type: Node, displayName: "回退按钮lable"})
    public btn_rollback_lable:Node  = null as unknown as Node;

    @property({type: Node, displayName: "回退按钮砖石消耗节点"})
    public btn_rollback_moneyNode:Node = null as unknown as Node;

    @property({type: Node, displayName: "回退人"})
    public btn_rollback_icon:Node = null as unknown as Node;

    @property({type: Node, displayName: "回退头像节点"})
    public head_Node:Node = null as unknown as Node;

    @property({type: Node, displayName: "回退label"})
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
        const containerCampEventHandler = new EventHandler();
        containerCampEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerCampEventHandler.component = 'PopHeroRollBack';// 这个是代码文件名
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
        for(let index = 0;index < this.goodsNodes.length;index++){
            if(this.goodsNodes[index].getChildByName("lab_heroCount")){
                let node = this.goodsNodes[index].getChildByName("lab_heroCount") as Node;
                node.active = false;
            }
        }
        

        this._resetBtnStateChange()
        var clickEventHandler = new EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "PopHeroRollBack";//这个是代码文件名
        clickEventHandler.handler = "_onRollBackClick";
        clickEventHandler.customEventData = "";
        this.btn_rollback?.clickEvents.push(clickEventHandler);

        this.btn_rollback_icon?.on(Node.EventType.TOUCH_END, this._platformViceHeadHandle, this);
    }
    start () {
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_hero_returnBack_change,this._notifyReturnBackChangeHandle,this);
        
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
    private _isDeleteHero(Data : HeroData){
        //排除非一级
        if(1 != Data.getLevel()){
            return true
        }
        //排除星级小于6
        if(Data.getStar() <= 6){
            return true
        }
        //3个分别为 7 8 9 星，会将7 8星的显示出来
        if(this._isMaxStar(Data)){
            return true
        }
        return false
    }
    //是否为最大星级 最大星级的隐藏
    private _isMaxStar(Data : HeroData){
        let heros:HeroData[] =new Array<HeroData>();
        //一样的英雄
        for (let heroData of this._allHeroList.values()){
            if(heroData.getName() == Data.getName()){
                heros.push(heroData);
            }
        }
        let maxStar = Data.getStar()
        let maxLevel = Data.getLevel()
        for(let i = 0;i < heros.length;i++){
            if(heros[i].getStar() > maxStar){
                maxStar = heros[i].getStar()
            }
        }
        //最大星级英雄数组
        let maxStarHeros:HeroData[] =new Array<HeroData>();
        for(let i = 0;i < heros.length;i++){
            if(heros[i].getStar() == maxStar){
                maxStarHeros.push(heros[i])
            }
        }
        for(let i = 0;i < maxStarHeros.length;i++){
            if(heros[i].getLevel() > maxLevel){
                maxLevel = heros[i].getLevel()
            }
        }
        if(Data.getStar() == maxStar){
            if(maxStarHeros.length == 1){
                return true
            }
            if(maxLevel > Data.getLevel()){
                return true
            }
            //有2个一样的最大 第一个排除
            if(Data.getDyncID() == maxStarHeros[0].getDyncID()){
                return true
            }
        }
        return false
    }


    private _initBottomHeros()
    {
        this._getAllHeroList();  
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
        this._resetBtnStateChange()
    }

    //重置按钮状态变化
    private _resetBtnStateChange(){
        if(this._curResetHero != 0){
            let HeroInfo = this._getHeroData(this._curResetHero)as HeroData
            let costGold = XShare.getInstance().KHeroReturnBackConsumeVrmb[HeroInfo.getStar()];
            if(this.btn_rollback && costGold != 0){
                this.btn_rollback_lable.setPosition(new Vec3(0, 20 , 0))
                this.btn_rollback_moneyNode.active = true;
                let monet = this.btn_rollback_moneyNode.getChildByName("money")?.getComponent(Label) as Label;
                monet.string = costGold.toString();
                this.btn_rollback.interactable = true;  
            }
            else{
                if(this.btn_rollback){
                    this.btn_rollback_lable.setPosition(new Vec3(0, 5 , 0))
                    this.btn_rollback_moneyNode.active = false;
                    this.btn_rollback.interactable = true;
                }
            }
            return
        }
        if(this.btn_rollback){
            this.btn_rollback_lable.setPosition(new Vec3(0, 5 , 0))
            this.btn_rollback_moneyNode.active = false;
            this.btn_rollback.interactable = false;            //重置按钮禁用
        }
    }

    //平台展示
    private _platformExhibition(){
        let HeroInfo = this._getHeroData(this._curResetHero)as HeroData
        this.btn_rollback_icon.getChildByName("heroIcon")?.removeFromParent();
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
            let heroIcon = instantiate(res) as Node;
            heroIcon.scale = new Vec3(0.5,0.5,1);
            heroIcon.addComponent(Widget);

            let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
            script.setHeroData(HeroInfo as HeroData);

            this.btn_rollback_icon.addChild(heroIcon);
            heroIcon.name = "heroIcon";
        });

        //物品栏展示
        //1级英雄
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
            //本体
            let heroIcon = instantiate(res) as Node;
            heroIcon.scale = new Vec3(0.5,0.5,1);
            heroIcon.addComponent(Widget);
            let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
            script.setHeroData(HeroInfo as HeroData);
            script.setNewStar(6)
            this.goodsNodes[0].addChild(heroIcon);
            heroIcon.name = "heroIcon";

            if(this.goodsNodes[0].getChildByName("lab_heroCount")){
                let node = this.goodsNodes[0].getChildByName("lab_heroCount") as Node;
                node.active = true;
                let Lable= node?.getComponent(Label) as Label;
                Lable.string = "1"
                node.setSiblingIndex(100)
            }

            let countData = this._getHeroeCount(HeroInfo)
            let index = 1
            //其他主体
            for(let i = 0;i < countData[0];i++){
                let heroIcon = instantiate(res) as Node;
                heroIcon.scale = new Vec3(0.5,0.5,1);
                heroIcon.addComponent(Widget);
                let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                script.setHeroData(HeroInfo as HeroData);
                script.setNewStar(6)
                this.goodsNodes[index].addChild(heroIcon);
                heroIcon.name = "heroIcon";

                if(this.goodsNodes[index].getChildByName("lab_heroCount")){
                    let node = this.goodsNodes[index].getChildByName("lab_heroCount") as Node;
                    node.active = true;
                    let Lable= node?.getComponent(Label) as Label;
                    Lable.string = "1"
                    node.setSiblingIndex(100)
                }
                index++
            }
            //5星材料
            let heroInfo5  = new Msg.HeroInfo();
            heroInfo5.id = 5;
            heroInfo5.staticID = 3051202;
            heroInfo5.level = 1;
            heroInfo5.equipOnList = [];
            heroInfo5.tier = 0;
            let hero = new HeroData();
            hero.initDataByHero(heroInfo5 as Msg.HeroInfo, GameModel.getInstance());
            if(countData[1] > 0){
                let heroIcon = instantiate(res) as Node;
                heroIcon.scale = new Vec3(0.5,0.5,1);
                heroIcon.addComponent(Widget);
                let script = heroIcon.getComponent("HeroIcon") as HeroIcon; 
                script.setHeroData(hero as HeroData);
                this.goodsNodes[index].addChild(heroIcon);
                heroIcon.name = "heroIcon";

                if(this.goodsNodes[index].getChildByName("lab_heroCount")){
                    let node = this.goodsNodes[index].getChildByName("lab_heroCount") as Node;
                    node.active = true;
                    let Lable= node?.getComponent(Label) as Label;
                    Lable.string = ""+countData[1]
                    node.setSiblingIndex(100)
                }
                index++
            }            
        });
    }

    // 从heroes文件获取升星 数量 返回6星升到现在需要多少个6星
    private _getHeroeCount(Data:HeroData)
    {
        let data = []
        let mainCount = 0//本体6星
        let viceCount = 0//5星材料
        let heroDataes = ValueMgr.getInstance().getTableByName(TableName.heroes).records ;

        let index = 0
        for(let i = 0;i < Data.getStar()-6;i++){
            for (let herodata of heroDataes) {
                let record = herodata as Config.heroes.Record;
                let ID = Data.getStaticID()-10000 * (Data.getStar() - (Data.getStar()-6))
                if(record.id == Data.getStaticID() - 10000 - i*10000) {
                    if(record.starupType == 1){
                        mainCount += record.starupNum
                    }else if(record.starupType == 2){
                        if(record.starupParam == 6){
                            viceCount += 4
                        }
                        else if(record.starupParam == 8){
                            viceCount += 8
                        }
                    }
                    index++
                    break;
                }
            }
        }
        
        data.push(mainCount)
        data.push(viceCount)
        return data
    }

    //返回1级升到当前级别需要的金币 进阶需要的金币
    private _getHeroUpgradeMoney(Level:number,tier:number){
        let money = 0;
        //升级的
        for(let index = 1;index < Level;index++){
            let record = ValueMgr.getInstance().getItemByField(TableName.upgrade_exp, index) as Config.upgrade_exp.Record;
            money += record.heroMoney;
        }

        //进阶的
        for(let index = 0;index < tier-1;index++){
            let costGold = XShare.getInstance().KHeroTierUpMoney[index];
            money += costGold;
        }

        return money; 
    }

    private _initPrefab(iconNode:Node,key:number,value:number,itemType:ItemEquipType, objType:number)
    {        
        let script = iconNode.getComponent("ItemEquipCell") as ItemEquipCell;
        script.setItemUseType(objType)
      
        script.setItemType(Number(key),Number(value),itemType,(id:number,itemClickType:number,objClickType:number)=>{
            this._itemEqipCallBack(id,itemClickType,objClickType)
        })
    }

    private _itemEqipCallBack(itemID:number,itemType:number,objType:number)
    {
        if(itemType == ItemEquipType.goods)
        {
            PopMgr.getInstance().popItemUseSellView(itemID,objType);
        }
        else{
            PopMgr.getInstance().popEquipInfoView(itemID);            
        }   
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

    //重置点击英雄事件
    private _platformViceHeadHandle(){
        if(this._curResetHero == 0){
            return;
        }
        let heroData = this._getHeroData(this._curResetHero);
        this._heroSelect(heroData as HeroData,false); 

        this._curResetHero = 0;
        this.btn_rollback_icon.getChildByName("heroIcon")?.destroy();

        //清空物品栏
        for (let index = 0; index < this.goodsNodes.length; index++) {
            if(this.goodsNodes[index].getChildByName("heroIcon")){
                this.goodsNodes[index].getChildByName("heroIcon")?.destroy();
            }
            if(this.goodsNodes[index].getChildByName("lab_heroCount")){
                let node = this.goodsNodes[index].getChildByName("lab_heroCount") as Node;
                node.active = false;
            }
        }
    }

    //---------------按钮事件---------------------------

    //回退按钮
    private _onRollBackClick(){
        let HeroInfo = this._getHeroData(this._curResetHero)as HeroData
        let costGold = XShare.getInstance().KHeroReturnBackConsumeVrmb[HeroInfo.getStar()];
        let playerInfo = GameModel.getInstance().getPlayerModel().getPlayerInfo();
        //砖石不足
        if(playerInfo.vrmb < costGold){
            PopMgr.getInstance().popupSimpleWindow("","砖石不足,无法回退",()=>{
                PopMgr.getInstance().deleteWindow();
            },()=>{
                PopMgr.getInstance().deleteWindow();
            },false);
        }else{
            console.log("发送回退");

            MsgMgr.getInstance().getMsgDecompose().requestHeroRollback(this._curResetHero);
        }
        this._platformViceHeadHandle()
    }

    //////////////////////////////////////////////////////
    //回退后 阵容变化 弹出获得物品窗口
    private _notifyReturnBackChangeHandle(data:any){
        //清空物品栏
        for (let index = 0; index < this.goodsNodes.length; index++) {
            if(this.goodsNodes[index].getChildByName("heroIcon")){
                this.goodsNodes[index].getChildByName("heroIcon")?.destroy();
            }
            if(this.goodsNodes[index].getChildByName("lab_heroCount")){
                let node = this.goodsNodes[index].getChildByName("lab_heroCount") as Node;
                node.active = false;
            }
        }

        this._initBottomHeros();
        let ItemData:Msg.HeroReturnBackA = data[0];

        let HeroInfo:HeroData = null as unknown as HeroData;
        for (let heroData of this._allHeroList.values()) {
            if(heroData.getDyncID() == ItemData.heroID){
                HeroInfo = heroData;
                break;
            }
        }

        let arrProp: Array<XStruct.prop_info.Record> = [];
        let stuProp : XStruct.prop_info.Record = {
            nType : 0,
            nPropId : 0,
            nLevel : 0,
            nPropQuality : 0,
            num : 0,
        }
        //英雄本体
        stuProp.nType = Msg.TObjectType.EObject_Hero;
        stuProp.nPropId = HeroInfo.getStaticID();
        stuProp.nLevel = 1;
        stuProp.nPropQuality = 1;
        stuProp.num = 1;
        arrProp.push(instantiate(stuProp));  
        //其他主体
        let count = 0
        for (let index = 0; index < ItemData.heroList.length; index++) {
            if(ItemData.heroList[index].staticID == HeroInfo.getStaticID()){
                stuProp.nType = Msg.TObjectType.EObject_Hero;
                stuProp.nPropId = HeroInfo.getStaticID();
                stuProp.nLevel = 1;
                stuProp.nPropQuality = 1;
                stuProp.num = 1;
                arrProp.push(instantiate(stuProp));  
                count++
            }
        }
        //5星材料
        if(ItemData.heroList.length - count > 0){
            stuProp.nType = Msg.TObjectType.EObject_Hero;
            stuProp.nPropId = 3051202;
            stuProp.nLevel = 1;
            stuProp.nPropQuality = 1;
            stuProp.num = ItemData.heroList.length - count;
            arrProp.push(instantiate(stuProp)); 
        }
         

        PopMgr.getInstance().popMultiItemRewardWindow(null,arrProp);  
    }

    //////////////////////////////////////////////////////
}
