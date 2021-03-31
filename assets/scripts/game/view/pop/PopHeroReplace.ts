
/*
 * @Author: gyw
 * @Date: 2021-03-29
 * @Description: 置换 弹窗
 * @FilePath: \PreviewDemo\assets\scripts\game\view\pop\PopHeroReplace.ts
 */

import { _decorator, Color, Component, Node, ScrollView, ToggleContainer, EventHandler, Toggle, Label, Event, instantiate, resources, Vec3, Sprite, UITransform, size, SpriteFrame, Layers, Button } from 'cc';
const { ccclass, property } = _decorator;

import { PopBase } from '../../../core/control/PopBase';
import { NotifyMgr } from '../../control/NotifyMgr';
import { PopMgr } from '../../control/PopMgr';
import { MsgMgr } from '../../control/MsgMgr';
import { GameModel } from '../../model/GameModel';
import { XFuns } from '../../model/const/XFuns';
import { XConsts } from "../../model/const/XConsts";
import { HeroData } from '../../model/datas/HeroData';
import { HeroIcon } from '../hero/HeroIcon';
import { HeroModel } from '../hero/HeroModel';
import { HeroSelectIcon } from '../hero/HeroSelectIcon';

@ccclass('PopHeroReplace')
export class PopHeroReplace extends PopBase {
    private _currFragment: number = 0;          // 当前灵魂碎片
    private _currConsumeFragment: number = 0;   // 当前需消耗灵魂碎片
    private _selectHeroData: HeroData | null = null as unknown as HeroData;      // 选择置换的英雄
    private _covertHeroData: HeroData | null = null as unknown as HeroData;      // 置换后的英雄

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

    @property({type: Node, displayName: "置换前英雄信息按钮"})
    public beforeHeroInfoBtn: Node = null as unknown as Node;

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
    public starlist: Node[] = [];

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
        this._starNameList = ["初级星星","中级星星","高级星星"]

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

        this._initHeroItems()
        this._refrushHeroReplaceView()

        // 注册英雄置换通知
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_camp_change, this._recvClassesExchange, this);
    }

    onDestroy() {
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_camp_change, this._recvClassesExchange, this)
    }

    private _recvClassesExchange(data: any) : void {
        console.log('_recvClassesExchange',data)
        this._covertHeroData = new HeroData()
        this._covertHeroData.ClassesExchange(data.exchangeInfo.newHeroStaticID);
        //this._covertHeroData._
        this._refrushHeroReplaceView()
    }

    private _initHeroItems() : void {
        if(this.scrollContent) {
            this.scrollContent.removeAllChildren()
        }

        resources.load('prefabs_ui/main/hero_selecticon', (err:any,res:any)=>{
            this._heroItemsMap.clear()

            let heroReplaceModel = GameModel.getInstance().getHeroReplaceModel()
            let heroSortDatasMap: Map<Number, HeroData> = heroReplaceModel.sortHeroData();
            for (let heroData of heroSortDatasMap.values()) {
                let heroIcon = instantiate(res) as Node;
                this.scrollContent?.addChild(heroIcon);
                let heroSelectScript = heroIcon.getComponent("HeroSelectIcon") as HeroSelectIcon;  
                let itemSelectType = heroSelectScript.getItemType();

                heroSelectScript.setItemType(itemSelectType);
                heroSelectScript.setSelectData(heroData as HeroData,this._selectIetmCallBack.bind(this));
                this._heroItemsMap.set(heroData.getDyncID(), heroIcon);
            }
        });
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

    //设置星星
    private _setStar(star:number) : void {
        let grade:number = Math.floor(star/5);
        let yu:number = (star - 1) % 5 + 1;

        let starName = this._starNameList[grade];
        let starPath = "ui/icon/" + starName + "/spriteFrame"

        for (let index = 0; index < this.starlist.length; index++) {
            this.starlist[index].active = index < yu || yu == 0
        }
    }

    //获取灵魂碎片颜色
    private _getMiracleShardFontColor() : Color {
        return this._currFragment < this._currConsumeFragment ? XConsts.KColorRed : XConsts.KColorGreen;
    }

    //获取灵魂碎片颜色
    private _getHeorNameFontColor() : Color {
        return this._selectHeroData?.isOrangeQuality() 
            ? XConsts.KQualityColor[5] : XConsts.KQualityColor[4];
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

    private _refrushHeroReplaceView() : void {
        this._frushSelectHeroView()
        this._frushCoverHeroView()
    }

    private _frushSelectHeroView() : void {
        this.platform_normal_node.active = this._selectHeroData == null;
        this.before_paltform_hero_node.active = this._selectHeroData != null;

        this._currFragment = GameModel.getInstance().getPlayerModel().getPlayerInfo().miracleShard;
        this.currLab.string = XFuns.FormatNumber(this._currFragment);
        this.currLab.color = this._getMiracleShardFontColor()
        this.consumpLab.string = "0"

        if (this._selectHeroData != null) {
            let _campName: string = XConsts.KHeroCampIcon[this._selectHeroData?.getCamp() as number];
            let campIconPath: string = "ui/team/" + _campName + "/spriteFrame";
            this._reloadSprFram(this.beforeCampImg, campIconPath);

            let _classesName: string = XConsts.KClassesSpriteName[this._selectHeroData?.getClasses() as number];
            let classesIconPath:string = "ui/lv_up/" + _classesName + "/spriteFrame";
            this._reloadSprFram(this.beforeClassesImg, classesIconPath);

            let _iconName: string = this._selectHeroData?.getName() as string;            
            this.beforeHeroNameLab.string = _iconName.toString(); 
            let nameColor: Color = this._getHeorNameFontColor()           
            this.beforeHeroNameLab.color = nameColor 
            // this._showHeroModel(this.beforeHeroModel, _iconName);

            let _starNum: number = this._selectHeroData?.getStar() as number;
            this._setStar(_starNum);

            this._currConsumeFragment = XConsts.KClassesExchangeMiracleShard[_starNum - 1]
            this.consumpLab.string = XFuns.FormatNumber(this._currConsumeFragment);
        }
    }

    private _frushCoverHeroView() : void {
        this.replaceBtn.active = this._covertHeroData == null
        this.cancel_ok_node.active = this._covertHeroData != null
        this.after_paltform_hero_node.active = this._covertHeroData != null;
        console.log('this._covertHeroData',this._covertHeroData)
        if (this._covertHeroData != null) {
            let _campName: string = XConsts.KHeroCampIcon[this._covertHeroData?.getCamp() as number];
            let campIconPath: string = "ui/team/" + _campName + "/spriteFrame";
            this._reloadSprFram(this.afterCampImg, campIconPath);

            let _classesName: string = XConsts.KClassesSpriteName[this._covertHeroData?.getClasses() as number];
            let classesIconPath:string = "ui/lv_up/" + _classesName + "/spriteFrame";
            this._reloadSprFram(this.afterClassesImg, classesIconPath);

            let _iconName: string = this._covertHeroData?.getName() as string;            
            this.afterHeroNameLab.string = _iconName.toString(); 
            let nameColor: Color = this._getHeorNameFontColor()           
            this.afterHeroNameLab.color = nameColor 
            // this._showHeroModel(this.afterHeroModel, _iconName);

            let _starNum: number = this._covertHeroData?.getStar() as number;
            this._setStar(_starNum);
        }
    }

    // 展示当前英雄形象
    private _showHeroModel(modelNode: HeroModel, _iconName: string) : void {
        if(modelNode) {
            modelNode.updateByHeroPerfabPath(_iconName);
        }
    }

    private _reloadSprFram(objNode: Node, path: string) : void {
        resources.load(path, (err,spriteFrame:SpriteFrame) => {
            if(!err) {
                let sprite = objNode.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });   
    }

    private _selectIetmCallBack(data: any) : void {
        console.log('选中的英雄数据',data)
        if (this._covertHeroData != null) {
            this._showTips("确定", "确定放弃此次置换么?", 2);
            return
        }
        let heroData: any = data;        
        let script: HeroSelectIcon = this._getHeroItemScript(heroData);               
        let selectType: number = script.getItemType() == 0 ? 1 : 0;
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
        // this._covertHeroData = selectType ? heroData : null
        this._refrushHeroReplaceView();
    }

    private _onCampClick(event: Event, customEventData: string) : void {        
        this._frushHeroByCamp();
    }

    private _clickReplace(event : Event) : void {        
        console.log("_clickReplace 点击置换事件")
        if (this._selectHeroData == null) {
            console.log("请选择一个英雄")
        }

        //条件:当前碎片数量小于消耗碎片数量
        if(this._currFragment <= this._currConsumeFragment){
            // this._showTips("错误", "灵魂碎片不足", 1);
        }
        // ToDo 英雄的静态id 还是动态id？
        MsgMgr.getInstance().getMsgHeroReplace().requestClassesExchangeR(this._selectHeroData?.getDyncID() as number);
    }

    private _clickCancel(event : Event) : void {        
        this._showTips("提示", "确定放弃此次置换么？", 2);
    }

    private _clickConfirm(event : Event) : void {
        console.log("_clickReplace 点击确定事件")
        // param ClassesExchangeInfo => HeroID, NewHeroStaticID
        // MsgMgr.getInstance().getMsgHeroReplace().requestClassesExchangeConfirmR(HeroID, NewHeroStaticID);
    }

    private _showTips(title : string, content : string, mode: number) : void {
        PopMgr.getInstance().popCommonOneWindow(title,content,mode,()=>{
            if (mode == 2) {
                let childrens = this.scrollContent.children
                childrens.forEach(element => {
                    let selectNode = element.getComponent("HeroSelectIcon") as HeroSelectIcon
                    selectNode?.setItemType(0)
                });

                this._selectHeroData = null
                this._covertHeroData = null
                this._refrushHeroReplaceView()
            }            
            PopMgr.getInstance().deleteWindow();
        });
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
