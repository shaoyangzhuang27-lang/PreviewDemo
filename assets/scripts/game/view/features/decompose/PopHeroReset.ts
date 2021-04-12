/**
 * 游戏组件:融魂祭坛 重置
 * @author 施敏昭
 * @version 1.0.0,2021.3.26
 */
import { _decorator,Label,SpriteFrame,Sprite, Button,instantiate,Widget,Vec3, Node,resources,ToggleContainer,EventHandler,Toggle,ScrollView } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { ResMgr } from '../../../control/ResMgr';
import { GameModel } from '../../../model/GameModel';
import { HeroData } from '../../../model/datas/HeroData';
import { ElementHeroIcon } from '../../common/ElementHeroIcon';
import { TableName, ValueMgr } from "../../../model/ValueMgr";
import { XShare } from '../../../model/const/XShare';
import { PopMgr } from '../../../control/PopMgr';
import { NotifyMgr } from '../../../control/NotifyMgr';
import { MsgMgr } from '../../../control/MsgMgr';
import { PopDecompose } from "../../../view/features/decompose/PopDecompose";
import { PopHeroRollBack } from "../../../view/features/decompose/PopHeroRollBack";
import { ElementEquipProp, EquipPropType } from '../../common/ElementEquipProp';
import { XFuns } from '../../../model/const/XFuns';
const { ccclass, property } = _decorator;

@ccclass('PopHeroReset')
export class PopHeroReset extends PopBase {

    @property({type: ToggleContainer , displayName: "底部选择按钮"})
    public selectGroup:ToggleContainer | null = null;

    @property({type: Node, displayName: "说明按钮"})
    public btn_explain:Node | null = null;

    @property({type: Button, displayName: "重置按钮"})
    public btn_reset:Button | null = null;

    @property({type: Node, displayName: "重置按钮lable"})
    public btn_reset_lable:Node  = null as unknown as Node;

    @property({type: Node, displayName: "重置按钮砖石消耗节点"})
    public btn_reset_moneyNode:Node = null as unknown as Node;

    @property({type: Node, displayName: "重置节点"})
    public top_reset:Node | null = null as unknown as Node;

    @property({type: Node, displayName: "重置人"})
    public btn_reset_icon:Node = null as unknown as Node;

    @property({type: Label, displayName: "重置金币"})
    public lab_Goid:Label = null as unknown as Label;

    @property({type: Label, displayName: "重置升级点"})
    public lab_upgrade:Label = null as unknown as Label;

    @property({type: Label, displayName: "重置进阶点"})
    public lab_Advanced:Label = null as unknown as Label;

    @property({type: ToggleContainer , displayName: "阵营" })
    public campGroup:ToggleContainer | null = null as unknown as ToggleContainer;

    @property({type :  Node, displayName: "重置获得的物品"})
    public goodsNodes:Node[] = [];

    @property({type :  Node, displayName: "重置获得的物品节点"})
    public node_goods:Node = null as unknown as Node;

    @property({type :  Node})
    public btnFrame:Node = null as unknown as Node;

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
        containerEventHandler.component = 'PopHeroReset';// 这个是代码文件名
        containerEventHandler.handler = 'tabClick';
        containerEventHandler.customEventData = '';
        this.selectGroup?.checkEvents.push(containerEventHandler);

        const containerCampEventHandler = new EventHandler();
        containerCampEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerCampEventHandler.component = 'PopHeroReset';// 这个是代码文件名
        containerCampEventHandler.handler = '_onCampClick';
        containerCampEventHandler.customEventData = '';
        if(this.campGroup){
            this.campGroup.checkEvents.push(containerCampEventHandler);
            this.campGroup.toggleItems.forEach((tog)=>{
                tog?.checkEvents.push(containerCampEventHandler);
            });
        }

        this._resetBtnStateChange()
        var clickEventHandler = new EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "PopHeroReset";//这个是代码文件名
        clickEventHandler.handler = "_onResetClick";
        clickEventHandler.customEventData = "";
        this.btn_reset?.clickEvents.push(clickEventHandler);

        this.btn_reset_icon?.on(Node.EventType.TOUCH_END, this._platformViceHeadHandle, this);
        this.btn_explain?.on(Node.EventType.TOUCH_END, this._explainHandle, this);
    }
    start () {
        super.start();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_hero_reset_change,this._notifyResetChangeHandle,this);
        
        if(this._selectBattleList == null)
        {
            this._selectBattleList = new Map<number, number>();
        }
        this._selectBattleList.clear();  
        
        //物品栏
        let posX = -164
        let posY = -28
        for(let i = 2;i <= 10;i++){
            let node = instantiate(this.goodsNodes[0]) as Node;
            node.name = "goods"+i
            posX = posX + 80
            if(i == 6){
                posY = -93
                posX = -164
            }
            node.setPosition(new Vec3(posX,posY,0))
            this.goodsNodes.push(node)
            this.node_goods?.addChild(node);
        }

        this._initBottomHeros();
    }

    //刷新金币 进化点 进阶点
    private _updataMoney(){
        let playerInfo = GameModel.getInstance().getPlayerModel().getPlayerInfo();
        this.lab_Goid.string = XFuns.FormatNumber(playerInfo.money);
        this.lab_upgrade.string = XFuns.FormatNumber(playerInfo.heroUpgradeExp);
        this.lab_Advanced.string = XFuns.FormatNumber(playerInfo.heroAdvanceExp);
    }

    //获取升星列表英雄
    private _getAllHeroList(){
        this._allHeroList = GameModel.getInstance().getHeroList();
    }
    //是否排除这个英雄
    private _isDeleteHero(Data : HeroData){
        //排除一级
        if(1 == Data.getLevel()){
            return true
        }
        return false
    }


    private _initBottomHeros()
    {
        this._getAllHeroList();  
        this._updataMoney();
        let scroll:ScrollView = null as unknown as ScrollView;
        if(this.top_reset?.active){
            scroll = this.scroll_HeroView
        }
        if(scroll.content)
        {
            scroll.content.removeAllChildren()
            scroll.content.destroyAllChildren()
        }

        resources.load('prefabs_ui/common/element_heroicon', (err:any,res:any)=>{
            this._bottomHeroItemList.clear()
            let k = new Array<[number,Node]>();     //排序存储对象
            let isShowOneKey = 0;       //是否显示一键升星按钮
            for (let heroData of this._allHeroList.values()) {
                let isDeleteHero = this._isDeleteHero(heroData)
                if(isDeleteHero){continue}
                let heroIcon = instantiate(res) as Node;
                heroIcon.setScale(0.5,0.5,0.5)
                heroIcon.addComponent(Widget);

                let FrameNode = instantiate(this.btnFrame) as Node;
                FrameNode.addComponent(Button);
                FrameNode.addChild(heroIcon);
                FrameNode.name = ""+heroData.getDyncID()

                scroll.content?.addChild(FrameNode);
                let heroSelectScript = heroIcon.getComponent("ElementHeroIcon") as ElementHeroIcon;  
                heroSelectScript.setHeroData(heroData as HeroData); 

                //添加按钮事件
                var clickEventHandler = new EventHandler();
                clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
                clickEventHandler.component = "PopHeroReset";//这个是代码文件名
                clickEventHandler.handler = "heroiconClick";
                clickEventHandler.customEventData = heroData.getDyncID().toString();
                let btnItem = FrameNode.getComponent(Button);;
                if(btnItem){
                    btnItem.clickEvents.push(clickEventHandler);
                }

                let sortIndex_1:number = heroData.getLevel() * 10000 + heroData.getStar()*1000 + heroData.getCamp() * 10 + heroData.getClasses();
                let sortIndex_2:number = 3000000 - sortIndex_1;
                k.push([sortIndex_2,FrameNode]);
                


                this._bottomHeroItemList.set(heroData.getDyncID(), FrameNode);
            }
            
            k.sort((n1,n2) => n1[0] - n2[0])
            k.forEach((value,key)=>{
                value[1].setSiblingIndex(key);
            })
        });
    }

    //滚动区域头像点击事件
    private heroiconClick(event: Event, customEventData: string){
        let heroData = this._getHeroData(Number(customEventData))as HeroData
        let itemType =  this._getItemType(heroData);
        
        let isSelect = null;
        if(itemType == 0){
            isSelect = true;
        }else if(itemType == 1){
            isSelect = false;
        }
        
        if(isSelect != null){
            this._heroSelect(heroData,isSelect);
        } 
    }

    //设置头像状态
    private setItemState(heroData:HeroData,number : number){
        let Node = this.scroll_HeroView.content?.getChildByName(String(heroData.getDyncID()))
        if(!Node){return}
        if(Node.getChildByName("StateSprNode")){
            Node.getChildByName("StateSprNode")?.removeFromParent()
            Node.getChildByName("StateSprNode")?.destroy()
        }
        //选中状态
        if(number == 1){
            var sprNode = instantiate(this.btnFrame)
            let framePath: string = "ui/comm/hall/other/img_hero_selected/spriteFrame"
            this._resourceLoad(framePath, sprNode);
            sprNode.name = "StateSprNode"
            Node.addChild(sprNode)
        }
    }
    //资源替换
    private _resourceLoad(path:string,obj:any)
    {
        ResMgr.getInstance().loadSpriteFrame(path,(err,spriteFrame:SpriteFrame | null) =>
        {
            if(!err)
            {
                let sprite = obj.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
    }

    //点选英雄
    private _heroSelect(heroData:HeroData,isSelect:boolean)
    {
        if(isSelect == null)return;

        this._heroToTop(heroData,isSelect);
        if(isSelect){
            this.setItemState(heroData,1)
        }
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
        //重置界面
        if( this.top_reset?.active){
            this._resetBtnStateChange()
        }  
    }

    //重置按钮状态变化
    private _resetBtnStateChange(){
        if(this._curResetHero != 0){
            let HeroInfo = this._getHeroData(this._curResetHero)as HeroData
            let costGold = XShare.getInstance().KHeroResetVrmbConsume[HeroInfo.getStar()];
            if(this.btn_reset && costGold != 0){
                this.btn_reset_lable.setPosition(new Vec3(0, 20 , 0))
                this.btn_reset_moneyNode.active = true;
                let monet = this.btn_reset_moneyNode.getChildByName("money")?.getComponent(Label) as Label;
                monet.string = costGold.toString();
                this.btn_reset.interactable = true;  
            }
            else{
                if(this.btn_reset){
                    this.btn_reset_lable.setPosition(new Vec3(0, 5 , 0))
                    this.btn_reset_moneyNode.active = false;
                    this.btn_reset.interactable = true;
                }
            }
            return
        }
        if(this.btn_reset){
            this.btn_reset_lable.setPosition(new Vec3(0, 5 , 0))
            this.btn_reset_moneyNode.active = false;
            this.btn_reset.interactable = false;            //重置按钮禁用
        }
    }

    //平台展示
    private _platformExhibition(){
        let HeroInfo = this._getHeroData(this._curResetHero)as HeroData
        this.btn_reset_icon.getChildByName("heroIcon")?.removeFromParent();
        this.btn_reset_icon.getChildByName("heroIcon")?.destroy();
        resources.load('prefabs_ui/common/element_heroicon', (err:any,res:any)=>{
            let heroIcon = instantiate(res) as Node;
            heroIcon.scale = new Vec3(0.5,0.5,1);
            heroIcon.addComponent(Widget);

            let script = heroIcon.getComponent("ElementHeroIcon") as ElementHeroIcon; 
            script.setHeroData(HeroInfo as HeroData);
            this.btn_reset_icon.addChild(heroIcon);
            heroIcon.name = "heroIcon";
        });

        //物品栏展示
        let index = 1;
        //1级英雄
        resources.load('prefabs_ui/common/element_heroicon', (err:any,res:any)=>{
            let Info = ValueMgr.getInstance().getItemByField(TableName.heroes,HeroInfo.getStaticID()) as Config.heroes.Record;
            let heroIcon = instantiate(res) as Node;
            heroIcon.scale = new Vec3(0.42,0.42,1);
            heroIcon.addComponent(Widget);

            let script = heroIcon.getComponent("ElementHeroIcon") as ElementHeroIcon; 
            script.setHeroData(HeroInfo as HeroData);
            script.setHeroInfo(Info,1);//设置等级1
            this.goodsNodes[0].addChild(heroIcon);
            heroIcon.name = "heroIcon";
        });
        //其他物品
        resources.load('prefabs_ui/common/element_equipprop', (err:any,res:any)=>{
            let index = 1;
            //金币
            let ID = Msg.TObjectType.EObject_Money;
            let num = this._getHeroUpgradeMoney(HeroInfo.getLevel(),HeroInfo.tier);  //数量   
            let equipCell = instantiate(res) as Node;
            equipCell.setScale(new Vec3(0.6, 0.6, 0.7))
            equipCell.name = "heroIcon";
            this.goodsNodes[index]?.addChild(equipCell);
            this._initPrefab(equipCell, Number(ID), Number(num), EquipPropType.goods,
             Number(Msg.TObjectType.EObject_Money)); 
             index++;
             //升级点
            ID = Msg.TObjectType.EObject_UpgradePoint;
            num = 0;
            for(let index = 0;index < HeroInfo.tier-1;index++){
                let costGold = XShare.getInstance().KHeroTierUpAdvanceExp[index];
                num += costGold;
            }
            if(num > 0){
                equipCell = instantiate(res) as Node;
                equipCell.setScale(new Vec3(0.6, 0.6, 0.8))
                equipCell.name = "heroIcon";
                this.goodsNodes[index]?.addChild(equipCell);
                this._initPrefab(equipCell, Number(ID), Number(num), EquipPropType.goods,
                Number(Msg.TObjectType.EObject_UpgradePoint)); 
                index++;
            }
            
             //进阶点
            ID = Msg.TObjectType.EObject_AdvanceExp;
            num = 0;
            for(let index = 0;index < HeroInfo.tier-1;index++){
                let costGold = XShare.getInstance().KHeroTierUpAdvanceExp[index];
                num += costGold;
            }
            if(num > 0){
                equipCell = instantiate(res) as Node;
                equipCell.setScale(new Vec3(0.6, 0.6, 0.8))
                equipCell.name = "heroIcon";
                this.goodsNodes[index]?.addChild(equipCell);
                this._initPrefab(equipCell, Number(ID), Number(num), EquipPropType.goods,
                Number(Msg.TObjectType.EObject_AdvanceExp)); 
                index++;
            }
            
             //装备
             if(HeroInfo.getEquipPropertyList().size > 0){
                for (let key of HeroInfo.getEquipPropertyList().keys()) {
                    let value = HeroInfo.getEquipPropertyList().get(key);  //数量   
                    let equipCell = instantiate(res) as Node;
                    equipCell.setScale(new Vec3(0.6, 0.6, 0.8))
                    this.goodsNodes[index]?.addChild(equipCell);
                    equipCell.name = "heroIcon";
                    this._initPrefab(equipCell, Number(key), Number(value), EquipPropType.equip, Number(Msg.TObjectType.EObject_Equip)); 
                    index++;
                }
             }
        })  
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

    private _initPrefab(iconNode:Node,key:number,value:number,itemType:EquipPropType, objType:number)
    {        
        let script = iconNode.getComponent("ElementEquipProp") as ElementEquipProp;
        script.setItemUseType(objType)
      
        script.setItemType(Number(key),Number(value),itemType,(id:number,itemClickType:number,objClickType:number)=>{
            this._itemEqipCallBack(id,itemClickType,objClickType)
        })
    }

    private _itemEqipCallBack(itemID:number,itemType:number,objType:number)
    {
        if(itemType == EquipPropType.goods)
        {
            PopMgr.getInstance().popItemUseSellView(itemID,objType);
        }
        else{
            PopMgr.getInstance().popEquipInfoView(itemID);            
        }   
    }

    //根据动态ID获取HeroData
    private _getHeroData(heroID:number){
        for (let heroData of this._allHeroList.values()) {
            if(heroData.getDyncID() == heroID){
                return heroData;
            }
        }
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
            let heroData = this._getHeroData(dyncid)as HeroData
            let itemType =  this._getItemType(heroData);
            this.setItemState(heroData,itemType)
            
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
        this.btn_reset_icon.getChildByName("heroIcon")?.removeFromParent();
        this.btn_reset_icon.getChildByName("heroIcon")?.destroy();

        //清空物品栏
        for (let index = 0; index < this.goodsNodes.length; index++) {
            if(this.goodsNodes[index].getChildByName("heroIcon")){
                this.goodsNodes[index].getChildByName("heroIcon")?.removeFromParent();
                this.goodsNodes[index].getChildByName("heroIcon")?.destroy();
            }
        }
    }

    //---------------按钮事件---------------------------
    //底部选择事件
    tabClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        console.log(tog.node.name)
        if(this.window.getChildByName("pop_decompose")){
            this.window.getChildByName("pop_decompose")?.removeFromParent();
            this.window.getChildByName("pop_decompose")?.destroy();
        }
        if(this.window.getChildByName("pop_herorollback")){
            this.window.getChildByName("pop_herorollback")?.removeFromParent();
            this.window.getChildByName("pop_herorollback")?.destroy();
        }

        if(!(this.top_reset) )return;
        if(tog.node.name == "Toggle1"){
            this.top_reset.active = true;
            this._initBottomHeros();
        } else if (tog.node.name == "Toggle2"){
            this.top_reset.active = false;
            resources.load('prefabs_ui/features/decompose/pop_decompose', (err:any,res:any)=>{
                let p = instantiate( res );
                p.name = "pop_decompose"
                let script = p.getComponent("PopDecompose") as PopDecompose;
                this.window.addChild(p);
            } );
        }else if (tog.node.name == "Toggle3"){
            this.top_reset.active = false;
            resources.load('prefabs_ui/features/decompose/pop_herorollback', (err:any,res:any)=>{
                let p = instantiate( res );
                p.name = "pop_herorollback"
                let script = p.getComponent("PopHeroRollBack") as PopHeroRollBack;
                this.window.addChild(p);
            } );
        }
    }

    //说明界面
    private _explainHandle(){
        let heroDataes = ValueMgr.getInstance().getTableByName(TableName.language_ui).records ;
        let strExplain= ""
        for (let herodata of heroDataes) {
            let record = herodata as Config.language_ui.Record;
            //重置
            if(this.top_reset?.active){
                if(record.id == "UI_HeroResetExplain") { 
                    strExplain = record.cn;
                    break;
                }
            }else if(this.window.getChildByName("pop_decompose")){
                if(record.id == "UI_AltarExplain") { 
                    strExplain = record.cn;
                    break;
                }
            }else{
                if(record.id == "UI_HeroReturnBackExplainContent") { 
                    strExplain = record.cn;
                    break;
                }
            }
        }

        PopMgr.getInstance().popExplain("",strExplain,()=>{
            PopMgr.getInstance().deleteWindow();
        },()=>{
            PopMgr.getInstance().deleteWindow();
        },false);
    }

    //重置按钮
    private _onResetClick(){
        let HeroInfo = this._getHeroData(this._curResetHero)as HeroData
        let costGold = XShare.getInstance().KHeroResetVrmbConsume[HeroInfo.getStar()];
        let playerInfo = GameModel.getInstance().getPlayerModel().getPlayerInfo();
        //砖石不足
        if(playerInfo.vrmb < costGold){
            PopMgr.getInstance().popupSimpleWindow("","砖石不足,无法重置",()=>{
                PopMgr.getInstance().deleteWindow();
            },()=>{
                PopMgr.getInstance().deleteWindow();
            },false);
        }else{
            console.log("发送重置");

            MsgMgr.getInstance().getMsgDecompose().requestHeroReset(this._curResetHero);
        }
        this._platformViceHeadHandle()
    }

    //////////////////////////////////////////////////////
    //重置后 阵容变化 弹出获得物品窗口
    private _notifyResetChangeHandle(data:any){
        //清空物品栏
        for (let index = 0; index < this.goodsNodes.length; index++) {
            if(this.goodsNodes[index].getChildByName("heroIcon")){
                this.goodsNodes[index].getChildByName("heroIcon")?.removeFromParent();
                this.goodsNodes[index].getChildByName("heroIcon")?.destroy();
            }
        }
        this._initBottomHeros();
        let ItemData:Msg.HeroResetA = data[0];

        let HeroInfo = this._getHeroData(ItemData.heroID)as HeroData

        let arrProp: Array<XStruct.prop_info.Record> = [];
        let stuProp : XStruct.prop_info.Record = {
            nType : 0,
            nPropId : 0,
            nLevel : 0,
            nPropQuality : 0,
            num : 0,
        }
        //英雄
        stuProp.nType = Msg.TObjectType.EObject_Hero;
        stuProp.nPropId = HeroInfo.getStaticID();
        stuProp.nLevel = 1;
        stuProp.nPropQuality = 1;
        stuProp.num = 1;
        arrProp.push(instantiate(stuProp));  
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
}
