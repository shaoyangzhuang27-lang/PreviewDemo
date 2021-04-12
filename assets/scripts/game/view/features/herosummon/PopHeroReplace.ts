
/*
 * @Author: gyw
 * @Date: 2021-03-29
 * @Description: 置换 弹窗
 * @FilePath: \PreviewDemo\assets\scripts\game\view\pop\PopHeroReplace.ts
 */

import { _decorator, Color, Component, Node, ScrollView, ToggleContainer, EventHandler, Toggle, Label, Event, instantiate, Vec3, Sprite, UITransform, size, SpriteFrame, Layers, Button } from 'cc';
const { ccclass, property } = _decorator;

import { PopBase } from '../../../../core/control/PopBase';
import { NotifyMgr } from '../../../control/NotifyMgr';
import { PopMgr } from '../../../control/PopMgr';
import { MsgMgr } from '../../../control/MsgMgr';
import { ResMgr } from '../../../control/ResMgr';
import { GameModel } from '../../../model/GameModel';
import { XFuns } from '../../../model/const/XFuns';
import { XConsts } from "../../../model/const/XConsts";
import { HeroData } from '../../../model/datas/HeroData';
import { ElementHeroIcon } from '../../common/ElementHeroIcon';
import { HeroModel } from '../../common/HeroModel';
import { HeroSelectIcon } from '../../hero/HeroSelectIcon';
import { ResCore } from '../../../../core/control/ResCore';

@ccclass('PopHeroReplace')
export class PopHeroReplace extends PopBase {
    private _isDel = false;
    private _currFragment: number = 0;          // 当前灵魂碎片
    private _currConsumeFragment: number = 0;   // 当前需消耗灵魂碎片
    private _selectHeroData: HeroData | null = null as unknown as HeroData;      // 选择置换的英雄
    private _covertHeroData: HeroData | null = null as unknown as HeroData;      // 置换后的英雄

    private _starInitPosxArr: number[] = new Array<number>()
    private _starNameList:string[] = new Array<string>();
    private _heroItemsMap: Map<number, Node> = new Map<number, Node>();        //拥有的所有英雄列表显示对象

    // 标签页
    @property({type: ToggleContainer , displayName: "阵营" })
    public campGroup:ToggleContainer | null = null as unknown as ToggleContainer;

    @property({type: Node, displayName: "英雄列表滑动区域"})
    public scrollContent: Node = null as unknown as Node;

    // 按钮
    @property({type: Node, displayName: "置换按钮"})
    public replaceBtn: Node = null as unknown as Node;

    @property({type: Node, displayName: "取消按钮"})
    public cancelBtn: Node = null as unknown as Node;

    @property({type: Node, displayName: "确定按钮"})
    public confirmBtn: Node = null as unknown as Node;

    @property({type: Node, displayName: "置换后英雄信息按钮"})
    public afterHeroInfoBtn: Node = null as unknown as Node;

    // 文本
    @property({type: Label, displayName: "置换前英雄名字"})
    public beforeHeroNameLab: Label = null as unknown as Label;

    @property({type: Label, displayName: "置换后英雄名字"})
    public afterHeroNameLab: Label = null as unknown as Label;

    @property({type: Label, displayName: "当前碎片数量"})
    public currLab: Label = null as unknown as Label;

    @property({type: Label, displayName: "消耗碎片数量"})
    public consumpLab: Label = null as unknown as Label;

    // icon
    @property({type: Node, displayName: "置换前阵营图标"})
    public beforeCampImg: Node = null as unknown as Node;

    @property({type: Node, displayName: "置换前职业图标"})
    public beforeClassesImg: Node = null as unknown as Node;

    @property({type: HeroModel, displayName: "置换前英雄模型"})
    public beforeHeroModel: HeroModel = null as unknown as HeroModel;

    @property({type: Node, displayName: "置换后阵营图标"})
    public afterCampImg: Node = null as unknown as Node;
    
    @property({type: Node, displayName: "置换后职业图标"})
    public afterClassesImg: Node = null as unknown as Node;

    @property({type: HeroModel, displayName: "置换后英雄模型"})
    public afterHeroModel: HeroModel = null as unknown as HeroModel;

    @property({type: Node, displayName: "当前英雄星级"})
    public beforeStarList: Node[] = [];

    @property({type: Node, displayName: "置换后英雄星级"})
    public afterStarList: Node[] = [];

    // 常用node，仅做显示交互
    @property({type: Node, displayName: "确定/取消父节点"})
    public cancel_ok_node: Node = null as unknown as Node;

    @property({type: Node, displayName: "默认英雄显示区域节点"})
    public platform_normal_node: Node = null as unknown as Node;

    @property({type: Node, displayName: "置换前英雄显示区域节点"})
    public before_paltform_hero_node: Node = null as unknown as Node;

    @property({type: Node, displayName: "置换后英雄显示区域节点"})
    public after_paltform_hero_node: Node = null as unknown as Node;

    start () {
        super.start();
        this._starNameList = ["星星初级","星星中级","星星高级"]

        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PopHeroReplace';// 这个是代码文件名
        containerEventHandler.handler = '_onCampClick';
        containerEventHandler.customEventData = '';
        this.campGroup?.checkEvents.push(containerEventHandler);
        this.campGroup?.toggleItems.forEach((tog)=>{
            tog?.checkEvents.push(containerEventHandler);
        });

        this.replaceBtn?.on(Node.EventType.TOUCH_END, this._clickReplace, this);
        this.cancelBtn?.on(Node.EventType.TOUCH_END, this._clickCancel, this);
        this.confirmBtn?.on(Node.EventType.TOUCH_END, this._clickConfirm, this);
        this.afterHeroInfoBtn?.on(Node.EventType.TOUCH_END, this._clickHeroInfo, this);
        
        this._initHeroItems()
        this._recodeStarsInitPos()
        this._refrushHeroReplaceView()

        // 注册英雄置换通知
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_camp_change, this._recvClassesExchange, this);
        // 注册英雄确定置换通知
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_camp_change_confirm, this._recvClassesExchangeConfirm, this);
    }

    onDestroy() {
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_camp_change, this._recvClassesExchange, this)
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_camp_change_confirm, this._recvClassesExchangeConfirm, this)
    }

    private _recvClassesExchange(data: any) : void {
        let heroReplaceModel = GameModel.getInstance().getHeroReplaceModel()
        this._covertHeroData = heroReplaceModel.changeHeroData(data, this._selectHeroData as HeroData)
        this._refrushHeroReplaceView()
    }

    private _recvClassesExchangeConfirm(data: any) : void {
        let heroReplaceModel = GameModel.getInstance().getHeroReplaceModel()
        heroReplaceModel.updateHeroCoverInfo(data)
        heroReplaceModel.addHeroBook(data.exchangeInfo.newHeroStaticID)

        this._selectHeroData = null
        this._covertHeroData = null
        
        this._refrushHeroReplaceView()
        this._initHeroItems()
        
        PopMgr.getInstance().popHeroChangeResult(data.exchangeInfo.newHeroStaticID)
    }

    private _initHeroItems() : void {
        this.scrollContent.destroyAllChildren()
        ResMgr.getInstance().loadPrefab('prefabs_ui/common/hero_selecticon', (err:any,res:any)=>{
            this._heroItemsMap.clear()

            let heroReplaceModel = GameModel.getInstance().getHeroReplaceModel()
            let heroSortDatasMap: Map<Number, HeroData> = heroReplaceModel.sortHeroData();
            for (let heroData of heroSortDatasMap.values()) {
                //过滤超过5星的英雄
                if (heroReplaceModel?.isHeroStarOverFive(heroData)) {
                    continue
                }
                let heroIcon = instantiate(res) as Node;
                this.scrollContent?.addChild(heroIcon);
                let heroSelectScript = heroIcon.getComponent("HeroSelectIcon") as HeroSelectIcon;  
                let itemSelectType = heroSelectScript.getItemType();

                heroSelectScript.setItemType(itemSelectType);
                heroSelectScript.setSelectData(heroData as HeroData,this._selectIetmCallBack.bind(this));
                this._heroItemsMap.set(heroData.getDyncID(), heroIcon);
            }
            this._frushHeroByCamp()
        },"PopHeroReplace");
    }

    private _refrushHeroReplaceView() : void {
        this._frushSelectHeroView()
        this._frushCoverHeroView()
    }

    private _frushSelectHeroView() : void {
        this.platform_normal_node.active = this._selectHeroData == null;
        this.before_paltform_hero_node.active = this._selectHeroData != null;

        this._currFragment = GameModel.getInstance().getPlayerModel().getPlayerInfo().miracleShard;
        this.currLab.string = "??";
        this.currLab.color = this._getMiracleShardFontColor(true)
        this.consumpLab.string = "??"

        if (this._selectHeroData != null) {
            let _campName: string = XConsts.KHeroCampIcon[this._selectHeroData?.getCamp() as number];
            let campIconPath: string = "ui/team/" + _campName + "/spriteFrame";
            this._reloadSprFram(this.beforeCampImg, campIconPath);

            let _classesName: string = XConsts.KClassesSpriteNameForHeroPromotion[this._selectHeroData?.getClasses() as number];
            let classesIconPath:string = "ui/features/heropromotion/" + _classesName + "/spriteFrame";
            this._reloadSprFram(this.beforeClassesImg, classesIconPath);

            let _iconName: string = this._selectHeroData?.getName() as string;            
            this.beforeHeroNameLab.string = _iconName.toString(); 
            let nameColor: Color = this._getHeorNameFontColor(this._selectHeroData)           
            this.beforeHeroNameLab.color = nameColor 
            this._showHeroModel(this.beforeHeroModel, this._selectHeroData);

            let _starNum: number = this._selectHeroData?.getStar() as number;
            this._setStar(_starNum, this.beforeStarList);

            this._currConsumeFragment = XConsts.KClassesExchangeMiracleShard[_starNum - 1]
            this.consumpLab.string = XFuns.FormatNumber(this._currConsumeFragment);
            this.currLab.string = XFuns.FormatNumber(this._currFragment);
            this.currLab.color = this._getMiracleShardFontColor()            
        }
    }

    private _frushCoverHeroView() : void {
        this.replaceBtn.active = this._covertHeroData == null
        this.cancel_ok_node.active = this._covertHeroData != null
        this.after_paltform_hero_node.active = this._covertHeroData != null;

        if (this._covertHeroData != null) {
            let _campName: string = XConsts.KHeroCampIcon[this._covertHeroData?.getCamp() as number];
            let campIconPath: string = "ui/team/" + _campName + "/spriteFrame";
            this._reloadSprFram(this.afterCampImg, campIconPath);

            let _classesName: string = XConsts.KClassesSpriteNameForHeroPromotion[this._covertHeroData?.getClasses() as number];
            let classesIconPath:string = "ui/features/heropromotion/" + _classesName + "/spriteFrame";
            this._reloadSprFram(this.afterClassesImg, classesIconPath);

            let _iconName: string = this._covertHeroData?.getName() as string;            
            this.afterHeroNameLab.string = _iconName.toString(); 
            let nameColor: Color = this._getHeorNameFontColor(this._covertHeroData)           
            this.afterHeroNameLab.color = nameColor 
            this._showHeroModel(this.afterHeroModel, this._covertHeroData);

            let _starNum: number = this._covertHeroData?.getStar() as number;
            this._setStar(_starNum, this.afterStarList);
        }
    }

    private _frushHeroByCamp() : void {
        this._heroItemsMap.forEach((heroNode,dyncid)=>{
            let heroSelectScript = heroNode.getComponent("HeroSelectIcon") as HeroSelectIcon;
            let heroData = heroSelectScript.getHeroData() as HeroData;
            let itemType =  heroSelectScript.getItemType();
            heroSelectScript.setItemType(itemType);
            
            let campType: number | null = this._getCampType()
            if (campType != null) {
                let activeStatus: boolean = campType == Msg.TCampType.ECampType_NULL || campType == heroData.getCamp()
                heroNode.active = activeStatus
            }
        });
    }

    
    //设置星星
    private _setStar(star:number, starlist: Node[]) : void {
        let grade:number = Math.ceil(star/5) - 1;
        let yu:number = (star - 1) % 5 + 1;

        let starName = this._starNameList[grade];
        let starPath = "ui/common/icon/" + starName + "/spriteFrame"
        for (let index = 0; index < starlist.length; index++) {
            starlist[index].active = index < yu || yu == 0
            if (starlist[index].active) {
                this._reloadSprFram(starlist[index], starPath);
            }            
        }
        
        this._resetStarsPos(starlist)
    }

    private _recodeStarsInitPos() : void {
        this.beforeStarList.forEach((node)=>{
            let oldPosx: number = node?.getPosition().x as number
            this._starInitPosxArr.push(oldPosx)
        })
    }

    private _resetStarsPos(starlist: Node[]) : void {
        let activeNodeArr: Array<Node> = new Array<Node>()
        let nodeWidth: number = starlist[0]?.getComponent(UITransform)?.contentSize.width as number
        starlist.forEach((node)=>{
            if (node.active != false) {
                activeNodeArr.push(node)
            }
        })
        
        // 隐藏1个以上才会存在间距
        let space: number = 5-activeNodeArr.length > 1 ? 20 : 0
        let offPosx: number = ((5-activeNodeArr.length)*nodeWidth-space)/2
        starlist.forEach((node, index)=>{
            if (node.active != false) {
                node?.setPosition(this._starInitPosxArr[index] - offPosx, node.getPosition().y)
            }            
        })
    }

    private _selectIetmCallBack(data: any) : void {
        if (this._covertHeroData != null) {
            let info: XStruct.common_one_info.Record ={
                title :"确定",
                content : "确定放弃此次置换么?",
                mode : 2,
                isRichLabMode : false,
                isChangeBtnSpriteFrame : false,
                submitContent:"" ,
                cancelContent:"" 
            }; 
            this._showTips(info);
            return
        }
        let heroData: any = data;        
        let script: HeroSelectIcon = this._getHeroItemScript(heroData);               
        let selectType: number = script.getItemType() == 0 ? 1 : 0;
        // if (script.getItemType() == 1) {
        //     // 再次点击同一个图鉴不取消选中状态
        //     return
        // }
        
        // 清除其他节点上的选中状态
        let childrens = this.scrollContent.children
        childrens.forEach(element => {
            let selectNode = element.getComponent("HeroSelectIcon") as HeroSelectIcon
            if (selectType != 0) {
                selectNode?.setItemType(0)
            }            
        }); 
        script.setItemType(selectType);
        this._selectHeroData = selectType ? heroData : null;
        this._refrushHeroReplaceView();
    }
    
    private _onCampClick(event: Event, customEventData: string) : void {        
        this._frushHeroByCamp();
    }

    private _clickReplace(event : Event) : void {        
        if (this._selectHeroData == null) {
            PopMgr.getInstance().popupPrompt("请选择一个英雄")
            return
        }

        //条件:当前碎片数量小于消耗碎片数量
        if(this._currFragment == 0 || this._currFragment < this._currConsumeFragment){
            let info: XStruct.common_one_info.Record ={
                title :"错误",
                content : "灵魂碎片不足?",
                mode : 1,
                isRichLabMode : false,
                isChangeBtnSpriteFrame : false,
                submitContent:"" ,
                cancelContent:"" 
            }; 
            this._showTips(info);
        }
        MsgMgr.getInstance().getMsgHeroReplace().requestClassesExchangeR(this._selectHeroData?.getDyncID() as number);
    }

    private _clickCancel(event : Event) : void { 
        let info: XStruct.common_one_info.Record ={
            title :"确定",
            content : "确定放弃此次置换么?",
            mode : 2,
            isRichLabMode : false,
            isChangeBtnSpriteFrame : false,
            submitContent:"" ,
            cancelContent:"" 
        };           
        this._showTips(info);
    }

    private _clickConfirm(event : Event) : void {
        if (this._covertHeroData != null) {
            let heroId: number = this._selectHeroData?.getDyncID() as number
            let newHeroId: number = this._covertHeroData?.getStaticID() as number
            MsgMgr.getInstance().getMsgHeroReplace().requestClassesExchangeConfirmR(heroId, newHeroId);
        }       
    }
    
    private _clickHeroInfo(event : Event) : void {
        if (this._covertHeroData != null) {
            console.log('打开英雄属性')
            let heroId: number = this._covertHeroData?.getStaticID() as number
            PopMgr.getInstance().popOpenBookHeroDetail(heroId);
        }       
    }
   
    // 展示当前英雄形象
    private _showHeroModel(modelNode: HeroModel, currHeroData: HeroData) : void {
        if(modelNode && currHeroData) {
            let prefabPath: string = currHeroData.getPrefabPath()
            modelNode.updateByHeroPerfabPath(prefabPath);
        }
    }

    private _reloadSprFram(objNode: Node, path: string) : void {
        ResMgr.getInstance().loadSpriteFrame(path, (err,spriteFrame:SpriteFrame | null) => {
            if(!err) {
                let sprite = objNode.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        },"PopHeroReplace");   
    }

    private _showTips(info : XStruct.common_one_info.Record) : void {
        PopMgr.getInstance().popCommonOneWindow(info, ()=>{
            if (info.mode == 2) {
                this._covertHeroData = null
                this._refrushHeroReplaceView()
            }            
            PopMgr.getInstance().deleteWindow();
        });
    }
    
    //获取灵魂碎片颜色
    private _getMiracleShardFontColor(isDefault?: boolean) : Color {
        if (isDefault) {
            return XConsts.KColorGreen
        }
        return this._currFragment < this._currConsumeFragment 
            ? XConsts.KColorRed : XConsts.KColorGreen;
    }

    //获取英雄名字颜色
    private _getHeorNameFontColor(data: HeroData) : Color {
        let heroReplaceModel = GameModel.getInstance().getHeroReplaceModel()
        return heroReplaceModel?.getHeorNameFontColor(data);
    }

    //获取当前阵营类型
    private _getCampType() : number | null {
        let togs = this.campGroup?.activeToggles();
        if(!togs)return null;

        if(togs?.length == 0) {
            return Msg.TCampType.ECampType_NULL
        }

        let tog = togs[0] as Toggle;
        let index:number = Number(tog.node.name.charAt(tog.node.name.length-1));
        return index;
    }
    
    //根据herodata获取拥有英雄代码
    private _getHeroItemScript(heroData:HeroData) : HeroSelectIcon {
        let script : HeroSelectIcon = null as unknown as HeroSelectIcon
        for (let value of this._heroItemsMap.values()) {
            script = value.getComponent("HeroSelectIcon") as HeroSelectIcon; 
            let scriptHeroInfo = script.getCurHeroInfo() as HeroData;
            if(scriptHeroInfo.getDyncID() == heroData.getDyncID()) {
                break;
            }
        }

        return script
    }
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
