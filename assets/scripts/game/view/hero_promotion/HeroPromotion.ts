/*
 * @Description: 英雄升级/升阶/装备弹窗
 * @Author: 徐涛
 * @Date: 2021-03-09 19:30:14
 * @LastEditTime: 2021-03-19 16:20:44
 */
import { _decorator, Component, resources, director, tween, Vec3, instantiate, Node, UIOpacity, UIMeshRenderer, ToggleContainer, EventHandler, Toggle, UITransform, math, Sprite, SpriteFrame, Layout, Layers, Label, Color } from 'cc';
import { DataMgr } from '../../model/DataMgr';

import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { PopMgr } from '../../control/PopMgr';
import { MsgMgr } from '../../control/MsgMgr';
import { HeroModel } from '../hero/HeroModel';
import { SkillItem } from '../hero/SkillItem';
import { NotifyMgr } from '../../control/NotifyMgr';
import { XShare } from '../../model/const/XShare';
import { XConsts } from '../../model/const/XConsts';
import { XFuns } from '../../model/const/XFuns';
import { TableName, ValueMgr } from '../../model/ValueMgr';
import { ItemEquipCell, ItemEquipType } from '../menu/ItemEquipCell';
const { ccclass, property } = _decorator;

@ccclass('HeroPromotion')
export class HeroPromotion extends PopBase {
    @property({ type: Node, displayName: "锁定" })
    public btn_lock: Node = null as unknown as Node;

    @property({ type: Node, displayName: "解锁" })
    public btn_unlock: Node = null as unknown as Node;

    @property({ type: Node, displayName: "分享" })
    public btn_share: Node = null as unknown as Node;

    @property({ type: Node, displayName: "英雄故事" })
    public btn_story: Node = null as unknown as Node;

    @property({ type: Node, displayName: "英雄各属性数值" })
    public btn_fight_params: Node = null as unknown as Node;

    @property({ type: Node, displayName: "左箭头" })
    public btn_arrow_left: Node = null as unknown as Node;

    @property({ type: Node, displayName: "右箭头" })
    public btn_arrow_right: Node = null as unknown as Node;

    @property({ type: Node, displayName: "升级" })
    public btn_up_lv: Node = null as unknown as Node;

    @property({ type: Node, displayName: "升阶" })
    public btn_up_tier: Node = null as unknown as Node;

    @property({ type: Node, displayName: "阵营" })
    public btn_camp: Node = null as unknown as Node;

    @property({ type: Node, displayName: "职业" })
    public btn_career: Node = null as unknown as Node;

    @property({ type: Node, displayName: "星级1" })
    public img_star1: Node = null as unknown as Node;
    @property({ type: Node, displayName: "星级2" })
    public img_star2: Node = null as unknown as Node;
    @property({ type: Node, displayName: "星级3" })
    public img_star3: Node = null as unknown as Node;
    @property({ type: Node, displayName: "星级4" })
    public img_star4: Node = null as unknown as Node;
    @property({ type: Node, displayName: "星级5" })
    public img_star5: Node = null as unknown as Node;

    @property({ type: Layout, displayName: "layout" })
    public layout_tier: Layout = null as unknown as Layout;

    @property({ type: Label, displayName: "称号" })
    public lab_title: Label = null as unknown as Label;
    @property({ type: Label, displayName: "姓名" })
    public lab_name: Label = null as unknown as Label;
    @property({ type: Sprite, displayName: "姓名背景" })
    public sp_title_bg: Sprite = null as unknown as Sprite;
    
    @property({ type: Label, displayName: "等级" })
    public lab_lv: Label = null as unknown as Label;
    @property({ type: Layout, displayName: "layout_lv" })
    public layout_lv: Layout = null as unknown as Layout; 
       
    @property({ type: Sprite, displayName: "升阶等级箭头绿图标" })
    public sp_arrow_tier: Sprite = null as unknown as Sprite;

    @property({ type: Layout, displayName: "layout_lv_tier" })    
    public layout_lv_tier: Layout = null as unknown as Layout;
    @property({ type: Label, displayName: "升阶等级" })
    public lab_lv_tier: Label = null as unknown as Label;
    @property({ type: Label, displayName: "升阶后最大等级" })
    public lab_lv_max_tier: Label = null as unknown as Label;

    @property({ type: Label, displayName: "升阶战力原值" })
    public lab_fight_upgrade_value_1: Label = null as unknown as Label;
    @property({ type: Label, displayName: "升阶战力新值" })
    public lab_fight_upgrade_value_2: Label = null as unknown as Label;
    @property({ type: Label, displayName: "升阶血量原值" })
    public lab_hp_upgrade_value_1: Label = null as unknown as Label;
    @property({ type: Label, displayName: "升阶血量新值" })
    public lab_hp_upgrade_value_2: Label = null as unknown as Label;
    @property({ type: Label, displayName: "升阶攻击原值" })
    public lab_atk_upgrade_value_1: Label = null as unknown as Label;
    @property({ type: Label, displayName: "升阶攻击新值" })
    public lab_atk_upgrade_value_2: Label = null as unknown as Label;
    @property({ type: Label, displayName: "升阶防御原值" })
    public lab_def_upgrade_value_1: Label = null as unknown as Label;
    @property({ type: Label, displayName: "升阶防御新值" })
    public lab_def_upgrade_value_2: Label = null as unknown as Label;

    @property({ type: Label, displayName: "战力值" })
    public lab_fight_value: Label = null as unknown as Label;
    @property({ type: Label, displayName: "血量值" })
    public lab_hp_value: Label = null as unknown as Label;
    @property({ type: Label, displayName: "攻击值" })
    public lab_atk_value: Label = null as unknown as Label;
    @property({ type: Label, displayName: "防御值" })
    public lab_def_value: Label = null as unknown as Label;

    @property({ type: Label, displayName: "灵魂碎片" })
    public lab_need_exp_1: Label = null as unknown as Label;
    @property({ type: Label, displayName: "灵魂碎片消耗" })
    public lab_need_exp_2: Label = null as unknown as Label;
    @property({ type: Label, displayName: "金币升级" })
    public lab_need_gold_1: Label = null as unknown as Label;
    @property({ type: Label, displayName: "金币消耗升级" })
    public lab_need_gold_2: Label = null as unknown as Label;

    @property({ type: Label, displayName: "灵魂水晶" })
    public lab_need_exp_1_tier: Label = null as unknown as Label;
    @property({ type: Label, displayName: "灵魂水晶消耗" })
    public lab_need_exp_2_tier: Label = null as unknown as Label;
    @property({ type: Label, displayName: "金币升阶" })
    public lab_need_gold_1_tier: Label = null as unknown as Label;
    @property({ type: Label, displayName: "金币消耗升阶" })
    public lab_need_gold_2_tier: Label = null as unknown as Label;

    @property({ type: Node, displayName: "武器" })
    public btn_equip_1: Node = null as unknown as Node;
    @property({ type: Node, displayName: "头盔" })
    public btn_equip_2: Node = null as unknown as Node;
    @property({ type: Node, displayName: "宝石" })
    public btn_equip_3: Node = null as unknown as Node;
    @property({ type: Node, displayName: "胸甲" })
    public btn_equip_4: Node = null as unknown as Node;
    @property({ type: Node, displayName: "饰品" })
    public btn_equip_5: Node = null as unknown as Node;
    // @property({ type: Node, displayName: "法器-待开放" })
    // public btn_equip_6: Node = null as unknown as Node;
    
    @property({ type: Node, displayName: "全部卸下" })
    public btn_all_unload: Node = null as unknown as Node;

    @property({ type: Node, displayName: "一键装备" })
    public btn_all_load: Node = null as unknown as Node;

    @property({ type: HeroModel, displayName: "英雄形象" })
    public cur_hero_model: HeroModel = null as unknown as HeroModel;

    @property({ type: SkillItem, displayName: "主动技能" })
    public skillItem0: SkillItem = null as unknown as SkillItem;

    @property({ type: SkillItem, displayName: "天赋技能1" })
    public skillItem1: SkillItem = null as unknown as SkillItem;

    @property({ type: SkillItem, displayName: "天赋技能2" })
    public skillItem2: SkillItem = null as unknown as SkillItem;

    @property({ type: SkillItem, displayName: "天赋技能3" })
    public skillItem3: SkillItem = null as unknown as SkillItem;

    @property({ type: ToggleContainer, displayName: "升级装备tab" })
    public tabGroup: ToggleContainer = null as unknown as ToggleContainer;

    @property({ type: Node, displayName: "升级界面" })
    public node_up: Node = null as unknown as Node;

    @property({ type: Node, displayName: "装备界面" })
    public node_equip: Node = null as unknown as Node;

    @property({ type: Node, displayName: "英雄品阶对应的钻石数" })
    public node_grade_gem: Node = null as unknown as Node;

    @property({ type: Node, displayName: "升阶底部属性" })
    public node_upgrade: Node = null as unknown as Node;

    @property({ type: Node, displayName: "升级底部属性" })
    public node_fight_param: Node = null as unknown as Node;

    private _curHeroId: number = 0; //当前英雄ID
    private _curHeroData: HeroData = null as unknown as HeroData; //当前英雄数据    
    private _starNodeList: Node[] = [];
    private _starsMiddlePos: Vec3 = new Vec3;
    private _starXSub: number = 10; //星级图片X轴间隔
    private _isHeroUpView: boolean = true; //true标记当前是英雄升级/阶界面，false标记当前是英雄装备界面
    private _isLvUpView: boolean = true; //true标记当前是英雄升级界面，false标记当前是英雄升阶界面
    private _equipNodeMap: Map<Msg.TEquipLocationType, ItemEquipCell> = new Map<Msg.TEquipLocationType, ItemEquipCell>();  //装备宝石列表
    
    onLoad() {
        super.onLoad();  
        this._starNodeList = [this.img_star1, this.img_star2, this.img_star3, this.img_star4, this.img_star5];
        this._starsMiddlePos = this.img_star3.getPosition();
        
        this.btn_lock?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_unlock?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_share?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_story?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_fight_params?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_arrow_left?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_arrow_right?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_camp?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_career?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_all_unload?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_all_load?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);        
        this.btn_equip_1?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_equip_2?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_equip_3?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_equip_4?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);
        this.btn_equip_5?.on(Node.EventType.TOUCH_END, this._buttonBtnClick, this);        

        // tabGroup
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'HeroPromotion';// 这个是代码文件名
        containerEventHandler.handler = '_onTabClick';
        containerEventHandler.customEventData = '';
        this.tabGroup?.checkEvents.push(containerEventHandler);

        //

    }

    private _onTabClick(event: Event, customEventData: string) {
        //let tog = event.target as unknown as Toggle;
        let tog: Toggle = (event as any);
        if (tog.node.name == "btn_tab_up") //升级tab
        {
            console.log(" btn_tab_up clicked!");
            this._isHeroUpView = true;
            this.node_equip.active = false; //装备界面

            this.node_up.active = true;//升级升阶大界面            
            this.node_fight_param.active = this._isLvUpView; //升级底部属性界面
            this.btn_up_lv.active = this._isLvUpView;        //升级按钮
            this.node_upgrade.active = !this._isLvUpView;    //升阶底部属性界面
            this.btn_up_tier.active = !this._isLvUpView;     //升阶按钮

        }
        else if (tog.node.name == "btn_tab_equip")//装备tab
        {
            console.log(" btn_tab_equip clicked!");
            this._isHeroUpView = false;
            this.node_equip.active = true; //装备界面

            this.node_up.active = false;//升级升阶大界面            
            this.node_fight_param.active = this._isLvUpView; //升级底部属性界面
            this.btn_up_lv.active = false;        //升级按钮
            this.node_upgrade.active = !this._isLvUpView;    //升阶底部属性界面
            this.btn_up_tier.active = false;     //升阶按钮
        }
    }

    private _buttonBtnClick(event: any) {
        console.log(" HeroPromotion _buttonBtnClick: " + event.target?._name)

        switch (event.target) {
            case this.btn_lock:
                this.btn_unlock.active = true;
                this.btn_lock.active = false;
                MsgMgr.getInstance().getMsgFormation().requestHeroLocked(this._curHeroId, true);
                break;
            case this.btn_unlock:
                this.btn_unlock.active = false;
                this.btn_lock.active = true;
                MsgMgr.getInstance().getMsgFormation().requestHeroLocked(this._curHeroId, false);
                break;
            case this.btn_share:
                //todo
                break;
            case this.btn_story:
                //todo
                break;
            case this.btn_fight_params:
                //todo
                let pos = this.btn_fight_params.getWorldPosition();
                let nodeSize = this.btn_fight_params.getComponent(UITransform)?.contentSize as math.Size;
                pos.x -= nodeSize.width / 2;
                pos.y += nodeSize.height / 2;
                PopMgr.getInstance().tipHeroAttributeWindow(pos);
                break;
            case this.btn_arrow_left:
                console.log("HeroPromotion btn_arrow_left");
                let preHeroData =GameModel.getInstance().getHeroesModel().getPrevHero(this._curHeroData);
                this.setCurrentHeroId(preHeroData.getDyncID() );                
                break;
            case this.btn_arrow_right:
                let nextHeroData =GameModel.getInstance().getHeroesModel().getNextHero(this._curHeroData);
                this.setCurrentHeroId(nextHeroData.getDyncID() );
                console.log("HeroPromotion btn_arrow_right");
                break;
            case this.btn_equip_1:
                {
                    console.log("HeroPromotion btn_equip_1");
                    let equipCell =this._equipNodeMap.get(Msg.TEquipLocationType.EEquipLocationType_Weapon);
                    if(equipCell){
                        PopMgr.getInstance().popHeroEquipReplaceWindow(this._curHeroData.getDyncID(), equipCell.getItemId() );
                    }                    
                }
                break;
            case this.btn_equip_2:
                {
                    console.log("HeroPromotion btn_equip_2");
                    let equipCell =this._equipNodeMap.get(Msg.TEquipLocationType.EEquipLocationType_Head);
                    if(equipCell){
                        PopMgr.getInstance().popHeroEquipReplaceWindow(this._curHeroData.getDyncID(), equipCell.getItemId() );                        
                    }                    
                }
                break;
            case this.btn_equip_3:
                {
                    console.log("HeroPromotion btn_equip_3");
                    let equipCell =this._equipNodeMap.get(Msg.TEquipLocationType.EEquipLocationType_Chest);
                    if(equipCell){
                        PopMgr.getInstance().popHeroEquipReplaceWindow(this._curHeroData.getDyncID(), equipCell.getItemId() );
                    }                    
                }
                break;
            case this.btn_equip_4:
                {
                    console.log("HeroPromotion btn_equip_4");
                    let equipCell =this._equipNodeMap.get(Msg.TEquipLocationType.EEquipLocationType_Trinket);
                    if(equipCell){
                        PopMgr.getInstance().popHeroEquipReplaceWindow(this._curHeroData.getDyncID(), equipCell.getItemId() );
                    }                    
                }
                break;
            case this.btn_equip_5:
                {
                    console.log("HeroPromotion btn_equip_5");
                    // 钻石下阶段待开发                                    
                }
                break;
            case this.btn_all_load:
                {
                    console.log("HeroPromotion btn_all_load");                   
                    let putonEquipIDList:number[] = [];
                    for(let i=Msg.TEquipLocationType.EEquipLocationType_NULL; i< Msg.TEquipLocationType.EEquipLocationType_Trinket; i++){
                        let bestEquipInBag = GameModel.getInstance().getBagModel().getBestEquipInBag (i);
                        if (bestEquipInBag == null){
                            continue;                            
                        }
                        else {
                            let itemEquipCell= this._equipNodeMap.get(i);
                            if (!itemEquipCell || itemEquipCell.getItemId()==0 ){
                                putonEquipIDList.push(bestEquipInBag.id);                                
                            }
                            else {
                                let record = ValueMgr.getInstance().getItemByField(TableName.equip, itemEquipCell.getItemId() ); 
                                if (record) {
                                    let curEquipRecord= record as Config.equip.Record;
                                    if (bestEquipInBag.quality > curEquipRecord.quality ||
                                        (bestEquipInBag.quality == curEquipRecord.quality && bestEquipInBag.star > curEquipRecord.star)){                                         
                                            putonEquipIDList.push(bestEquipInBag.id);   
                                        }
                                }
                            }
                        }
                    }                                        

                    MsgMgr.getInstance().getMsgFormation().requestHeroPutOnEquip(this._curHeroId, putonEquipIDList);
                }
                break;
            case this.btn_all_unload:
                {
                    console.log("HeroPromotion btn_all_unload");
                    let takeoffEquipLocList: number[] =[];
                    this._equipNodeMap.forEach((itemEquipCell, locType, m)=>{
                        if (itemEquipCell && itemEquipCell.getItemId()!=0 ){
                            takeoffEquipLocList.push(locType);                                
                        }
                    });
                    MsgMgr.getInstance().getMsgFormation().requestHeroTakeOffEquip(this._curHeroId, takeoffEquipLocList);
                }
                break;
            default:
                break;
        }
    }

    start() {
        // [3]
        super.start()
        this._initView();
        
        //this.cur_hero_model?.node.setSiblingIndex(100);
        // UIMeshRenderer

        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_hero_locked, this._notifyHeroLockedHandle, this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_hero_put_on_equip, this._notifyHeroAllLoadEquipHandle, this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_hero_take_off_equip, this._notifyHeroAllUnLoadEquipHandle, this);
    }

    onDestroy() {
        super.onDestroy();
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_hero_locked, this._notifyHeroLockedHandle, this);
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_hero_put_on_equip, this._notifyHeroAllLoadEquipHandle, this);
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_hero_take_off_equip, this._notifyHeroAllUnLoadEquipHandle, this);
    }
    
    private _notifyHeroAllUnLoadEquipHandle(data: any= null){
        if (!data) {
            return ;
        }
        let msg = data as Msg.TakeOffEquipA; 
        if (msg.err == Msg.TErrorCode.ERR_OK){
            if (msg.heroID == this._curHeroId) {
                let proBefore = new Map<Msg.THeroPropertyType, number> (); // 之前属性
                for (let i:Msg.THeroPropertyType  = Msg.THeroPropertyType.EHeroPropertyType_NULL; i <= Msg.THeroPropertyType.EHeroPropertyType_DEFBreak; i++) {
                    if (i == Msg.THeroPropertyType.EHeroPropertyType_NULL ){
                        proBefore.set(i, this._curHeroData.getFighting() );
                    }
                    else{
                        proBefore.set(i, this._curHeroData.getProperty(i, false) );
                    }
                }

                //换下装备
                for (let i:number = 0; i < msg.takeoffEquipLocList.length; i++) {
                    let equipTmp = ValueMgr.getInstance().getItemByField(TableName.equip,msg.takeoffEquipLocList[i]); 
                    if(!equipTmp){
                        let equipData = equipTmp as Config.equip.Record;                            
                        if(equipData&& this._curHeroData.equipOnList.get(equipData.locationType) ) {
                                this._curHeroData.equipOnList.delete(equipData.locationType);
                                GameModel.getInstance().getBagModel().addEquipBag (equipData.id, 1);
                        }
                    }
                }

                //刷新套装属性
                this._curHeroData.refreshEquipProperty();

                //计算属性变化
                let proChangeMap = new Map<Msg.THeroPropertyType, number> (); // 改变后的属性
                for (let i:Msg.THeroPropertyType = Msg.THeroPropertyType.EHeroPropertyType_NULL; i <= Msg.THeroPropertyType.EHeroPropertyType_DEFBreak; i++) {
                    let pro:number = 0;
                    let tmp = proBefore.get(i) as unknown as number;
                    if (i == (Msg.THeroPropertyType.EHeroPropertyType_NULL) ) {
                        pro = this._curHeroData.getFighting();
                        if (pro != tmp)
                            proChangeMap.set(i, pro - tmp);
                    } else {
                        pro = this._curHeroData.getProperty(i, false);
                        if (pro != tmp)
                            proChangeMap.set(i, pro - tmp);
                    }
                }

                // oldFight = proBefore.get(Msg.THeroPropertyType.EHeroPropertyType_NULL);
                // StartCoroutine (StartFight ()); //x战力提升动画
                //显示属性变化动画x
                // showPropertyChange (proChangeMap);//
                //刷新界面数据
                this._showEquipCells();
                this._showFightValues();
                //穿装备音效
                // AudioController.Play (XConsts.KSoundEffect_TakeoffEquip);

                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.RPFormation);
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.RefreshGuide);                
            }
        }
        else{            
            console.log(msg.errStr+" errCode="+ msg.err.toString() );
            // TipsMgr.instance.ShowErrDialog(msg.Err);
        }
    }
    
    private _notifyHeroAllLoadEquipHandle(data: any= null){
        if (!data) {
            return ;
        }

        let msg = data as Msg.PutOnEquipA; 
        if (msg.err == Msg.TErrorCode.ERR_OK) {        
            if (msg.heroID == this._curHeroId) {
                let proBefore = new Map<Msg.THeroPropertyType, number> (); // 之前属性
                for (let i:Msg.THeroPropertyType  = Msg.THeroPropertyType.EHeroPropertyType_NULL; i <= Msg.THeroPropertyType.EHeroPropertyType_DEFBreak; i++) {
                    if (i == Msg.THeroPropertyType.EHeroPropertyType_NULL ){
                        proBefore.set(i, this._curHeroData.getFighting() );
                    }
                    else{
                        proBefore.set(i, this._curHeroData.getProperty(i, false) );
                    }
                }

                //换下装备
                for (let i:number = 0; i < msg.takeoffEquipIDList.length; i++) {
                    let equipTmp = ValueMgr.getInstance().getItemByField(TableName.equip,msg.takeoffEquipIDList[i]); 
                    if(!equipTmp){
                        let equipData = equipTmp as Config.equip.Record;                            
                        if(equipData&& this._curHeroData.equipOnList.get(equipData.locationType) ) {
                                this._curHeroData.equipOnList.set(equipData.locationType, null);
                                GameModel.getInstance().getBagModel().addEquipBag (equipData.id, 1);
                        }
                    }
                }

                //换上装备
                for (let i:number = 0; i < msg.putonEquipIDList.length; i++) {
                    let equipTmp = ValueMgr.getInstance().getItemByField(TableName.equip,msg.takeoffEquipIDList[i]); 
                    if(!equipTmp){
                        let equipData = equipTmp as Config.equip.Record;                            
                        if(equipData) {
                            this._curHeroData.equipOnList.set(equipData.locationType, equipData);
                            GameModel.getInstance().getBagModel().subEquipBag (equipData.id, 1);
                        }
                    }                        
                }
                
                //刷新套装属性
                this._curHeroData.refreshEquipProperty();

                //计算属性变化
                let proChangeMap = new Map<Msg.THeroPropertyType, number> (); // 改变后的属性
                for (let i:Msg.THeroPropertyType = Msg.THeroPropertyType.EHeroPropertyType_NULL; i <= Msg.THeroPropertyType.EHeroPropertyType_DEFBreak; i++) {
                    let pro:number = 0;
                    let tmp = proBefore.get(i) as unknown as number;
                    if (i == (Msg.THeroPropertyType.EHeroPropertyType_NULL) ) {
                        pro = this._curHeroData.getFighting();
                        if (pro != tmp)
                            proChangeMap.set(i, pro - tmp);
                    } else {
                        pro = this._curHeroData.getProperty(i, false);
                        if (pro != tmp)
                            proChangeMap.set(i, pro - tmp);
                    }
                }

                // oldFight = proBefore.get(Msg.THeroPropertyType.EHeroPropertyType_NULL);
                // StartCoroutine (StartFight ()); //x战力提升动画
                //显示属性变化动画x
                // showPropertyChange (proChangeMap);//
                //刷新界面数据
                this._showEquipCells();
                this._showFightValues();
                //穿装备音效
                // AudioController.Play (XConsts.KSoundEffect_PutonEquip);

                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.RPFormation);
                // UINotificationCenter.Instance ().PostNotification ((int) NotificationMsg.RefreshGuide);
            }
        } else {
            // TipsMgr.instance.ShowErrDialog(msg.Err);
            console.log(msg.errStr+" errCode="+ msg.err.toString() );
        }
    
    }

    private _notifyHeroLockedHandle(data: any = null) {
        
        if (data) {
            let msg = data as Msg.SyncHeroLocked;
            if (msg.heroID == this._curHeroId) {
                this._curHeroData.isLocked = msg.isLocked;
                this.btn_lock.active = !msg.isLocked;
                this.btn_unlock.active = msg.isLocked;
            }
        }
    }

    _initView() {
    }

    update(deltatime: number) {
        // [4] 
        // console.log("HeroPromotion update() number= ", deltatime)
    }

    /**
     * @description: 设置当前英雄id
     * @param {number} heroId
     */
    public setCurrentHeroId(heroId: number = 0) {
        let heroData = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(heroId);
        if (!heroData) {
            this._initDefaultKnight();
            return;
        }

        this._curHeroData = heroData as HeroData;
        this._curHeroId = heroId;

        // 星级下的每个品阶有对应的等级最大限制，当等级提升到最大限制后，通过升阶操作扩展更高的等级上限。       
        let curMaxLv = XShare.getInstance().KHeroMaxLevelForTier[this._curHeroData.tier];
        if (this._curHeroData.getLevel() < curMaxLv) {
            this._isLvUpView = true; // 当前应该显示升级界面
        }
        else {
            this._isLvUpView = false;// 当前应该显示升阶界面
        }
        this._initCurHeroView();
    }

    // 显示当前英雄数据
    private _initCurHeroView() {
        this._showCurHeroModel();
        this._showTitleAndName();
        if (this._isHeroUpView) {
            if (this._isLvUpView) {
                this._showHeroLvUpView();
            }
            else {
                this._showHeroUpgradeView();
            }
        }
        else {
            this._showEquipView();
        }
    }
    
    private _showTitleAndName(){                
        this.lab_name.string = this._curHeroData.getName();
        let pos= this.lab_name.node.getPosition();
        let title= this._curHeroData.getTitleName();
        if(title != ""){
            this.lab_title.string = title;            
            pos.y= 378;//下移显示            
            this.lab_title.node.active= true;
        }else{                    
            this.lab_title.node.active= false;
            pos.y= 387;//居中显示
        }
        this.lab_name.node.setPosition(pos);
        let id1st = Number((this._curHeroId/1000000).toFixed())
        // if(id1st == 5) // 传奇
        // else if(id1st == 3){// 高级
        // else if(id1st == 1 || id1st == 2){// 普通
        let imgPath = "ui/lv_up/英雄详情_标题背景品质紫/spriteFrame";// 高级
        // if (id1st==5) {// 传奇
            imgPath = "ui/lv_up/英雄详情_标题背景品质橙/spriteFrame";
        // }
        XFuns.ReplaceSpriteFrame(imgPath, this.sp_title_bg);        
    }
    // 展示英雄升级界面
    private _showHeroLvUpView() {
        this.node_equip.active = false; //装备界面        
        this.node_up.active = true;//升级升阶大界面            
        this.node_fight_param.active = this._isLvUpView; //升级底部属性界面
        this.btn_up_lv.active = this._isLvUpView;        //升级按钮
        this.node_upgrade.active = !this._isLvUpView;    //升阶底部属性界面
        this.btn_up_tier.active = !this._isLvUpView;     //升阶按钮

        //显示技能
        this._showSkillItems();
        //显示星级
        this._showStars();
        //显示阵营，职业
        this._showCampAndCareer();
        //显示品阶        
        this._showTier();
        //显示等级  
        this._showLv();
        //显示战力数据 
        this._showFightValues();
        //显示升级消耗
        this._showUpLvCost();

    }

    private _showUpTierCost() {
        let tier = this._curHeroData.tier;
        let costExp = XShare.getInstance().KHeroTierUpAdvanceExp[tier];
        let costGold = XShare.getInstance().KHeroTierUpMoney[tier];

        let playerInfo = GameModel.getInstance().getPlayerModel().getPlayerInfo();
        let color = Color.WHITE;
        // 升阶消耗金币
        if (playerInfo.money < costGold) {
            color = Color.RED;
        }
        this.lab_need_gold_1_tier.string = XFuns.FormatNumber(playerInfo.money);
        this.lab_need_gold_1_tier.color = color;
        this.lab_need_gold_2_tier.string = "/" + XFuns.FormatNumber(costGold);

        // 升阶消耗灵魂水晶
        color = Color.WHITE;
        if (playerInfo.heroAdvanceExp < costExp) {
            color = Color.RED;
        }
        this.lab_need_exp_1_tier.string = XFuns.FormatNumber(playerInfo.heroUpgradeExp);
        this.lab_need_exp_1_tier.color = color;
        this.lab_need_exp_2_tier.string = "/" + XFuns.FormatNumber(costExp);
    }

    private _showUpLvCost() {
        let lv = this._curHeroData.getLevel();
        let record = ValueMgr.getInstance().getItemByField(TableName.upgrade_exp, lv) as Config.upgrade_exp.Record;
        let playerInfo = GameModel.getInstance().getPlayerModel().getPlayerInfo();
        let color = Color.WHITE;
        // 升级消耗金币
        if (playerInfo.money < record.heroMoney) {
            color = Color.RED;
        }
        this.lab_need_gold_1.string = XFuns.FormatNumber(playerInfo.money);
        this.lab_need_gold_1.color = color;
        this.lab_need_gold_2.string = "/" + XFuns.FormatNumber(record.heroMoney);

        // 升级消耗灵魂碎片
        color = Color.WHITE;
        if (playerInfo.heroUpgradeExp < record.heroExp) {
            color = Color.RED;
        }
        this.lab_need_exp_1.string = XFuns.FormatNumber(playerInfo.heroUpgradeExp);
        this.lab_need_exp_1.color = color;
        this.lab_need_exp_2.string = "/" + XFuns.FormatNumber(record.heroExp);
    }

    private _showFightValues() {
        let fightValue = Math.floor(this._curHeroData.getFighting());
        this.lab_fight_value.string = XFuns.FormatNumber(fightValue);

        let hp = Math.floor(this._curHeroData.getMaxHP());
        this.lab_hp_value.string = XFuns.FormatNumber(hp);

        let atk = Math.floor(this._curHeroData.getATK());
        this.lab_atk_value.string = XFuns.FormatNumber(atk);

        let def = Math.floor(this._curHeroData.getDEF());
        this.lab_def_value.string = XFuns.FormatNumber(def);
    }

    private _showUpTierFightValues() {
        let _nextTierHeroData=  new HeroData;
        _nextTierHeroData = this._curHeroData;
        _nextTierHeroData.tier= this._curHeroData.tier+1;

        let fightValue = Math.floor(this._curHeroData.getFighting());
        this.lab_fight_upgrade_value_1.string = XFuns.FormatNumber(fightValue);
        let fightValueNext = Math.floor(_nextTierHeroData.getFighting());
        this.lab_fight_upgrade_value_2.string = XFuns.FormatNumber(fightValueNext);

        
        let hp = Math.floor(this._curHeroData.getMaxHP());
        this.lab_hp_upgrade_value_1.string = XFuns.FormatNumber(hp);
        let hpNext = Math.floor(_nextTierHeroData.getMaxHP());
        this.lab_hp_upgrade_value_2.string = XFuns.FormatNumber(hpNext);

        let atk = Math.floor(this._curHeroData.getATK());
        this.lab_atk_upgrade_value_1.string = XFuns.FormatNumber(atk);
        let atkNext = Math.floor(_nextTierHeroData.getATK());
        this.lab_atk_upgrade_value_2.string = XFuns.FormatNumber(atkNext);
        
        let def = Math.floor(this._curHeroData.getDEF());
        this.lab_def_upgrade_value_1.string = XFuns.FormatNumber(def);
        let defNext = Math.floor(_nextTierHeroData.getDEF());
        this.lab_def_upgrade_value_2.string = XFuns.FormatNumber(defNext);
    }

    private _showUpTierLv() {
       this._showLv(true);
    }

    private _showLv(isUpTier: boolean = false) {
        let tier = this._curHeroData.tier;
        let lv = this._curHeroData.getLevel();
        let maxLv = XShare.getInstance().KHeroMaxLevelForTier[tier];
        this.lab_lv.string = lv.toString() + "/" + maxLv.toString();

        let tierNext = this._curHeroData.tier+1;
        let isMaxTier= tierNext > XShare.getInstance().KMaxHeroTier;

        
        let pos= this.layout_lv.node.getPosition();
        let nodeSize = this.layout_lv.getComponent(UITransform)?.contentSize as math.Size;
        // 升级界面等级显示
        if(!isUpTier || isMaxTier){
            pos.x = nodeSize.width/2;
            this.layout_lv.node.setPosition(pos);
            
            this.sp_arrow_tier.node.active= false;
            this.layout_lv_tier.node.active= false;        
        }else{//升阶界面等级显示            
            pos.x = -nodeSize.width/2;
            this.layout_lv.node.setPosition(pos);
            
            this.lab_lv_tier.string = maxLv.toString()+ "/";
            let nextMaxLv= XShare.getInstance().KHeroMaxLevelForTier[tierNext];
            this.lab_lv_max_tier.string = nextMaxLv.toString();
            this.sp_arrow_tier.node.active= true;
            this.layout_lv_tier.node.active= true;        
        }        
    }

    private _showTier(tier: number = 0) {
        let star = this._curHeroData.getStar();
        let maxTier = star;//星级就是当前英雄能达到的最大品阶
        tier = this._curHeroData.tier;
        if (tier > XShare.getInstance().KMaxHeroTier) {
            tier = XShare.getInstance().KMaxHeroTier;
        }
        else if (tier < 0) {
            tier = 0;
        }

        let target = this;
        let iconPath: string;
        let items: Sprite[] = this.layout_tier.node.getComponentsInChildren(Sprite) as [Sprite];
        if (items.length < maxTier) {
            let nSub = maxTier - items.length;
            for (let index = 0; index < nSub; index++) {
                iconPath = "ui/lv_up/黑白进阶宝石/spriteFrame";
                if (tier >= (index + items.length)) {
                    iconPath = "ui/lv_up/进阶宝石/spriteFrame";
                }

                XFuns.CreateSprite(iconPath, target.layout_tier.node, "img_grade_gem_" + (items.length + 1 + index).toString());
            }
        }
        else if (items.length > maxTier) {
            let nSub1 = items.length - maxTier;
            let pos = this.layout_tier.node.getPosition();
            for (let i = 0; i < nSub1; i++) {
                items[i].node.active = false;
                items[i].onDestroy();
            }

            let itemNews: Sprite[] = this.layout_tier.node.getComponentsInChildren(Sprite) as [Sprite];
            for (let index = 0; index < itemNews.length; index++) {
                iconPath = "ui/lv_up/黑白进阶宝石/spriteFrame";
                if (index < tier) {
                    iconPath = "ui/lv_up/进阶宝石/spriteFrame";
                }

                XFuns.ReplaceSpriteFrame(iconPath, itemNews[index]);
            }
        }
    }

    private _showCampAndCareer() {
        if (!this._curHeroData.isRoleHero()) {
            let name = XConsts.KCampSpriteName[this._curHeroData.getCamp() as number];
            let iconPath: string = "ui/lv_up/" + name + "/spriteFrame";
            this._resourceLoad(iconPath, this.btn_camp);
            this.btn_camp.active = true;

            name = XConsts.KClassesSpriteName[this._curHeroData.getClasses() as number];
            iconPath = "ui/lv_up/" + name + "/spriteFrame";
            this._resourceLoad(iconPath, this.btn_career);
            this.btn_career.active = true;
        }
        else {
            this.btn_camp.active = false;
            this.btn_career.active = false;
        }
    }

    private _showStars(star: number = 1) {
        // star= math.randomRangeInt(1,6);
        star = this._curHeroData.getStar();
        if (star > XShare.getInstance().KMaxHeroStar) {
            star = XShare.getInstance().KMaxHeroStar;
        }
        else if (star < 1) {
            star = 1;
        }

        let pos = new Vec3(this._starsMiddlePos);
        let newStarValue = star;
        if (star > 5) {
            newStarValue = star % 5;
        }

        // 根据星级替换高等级星星图片资源      
        this._starNodeList.forEach(starNode => {
            starNode.active = false;
            let starName: string = "星星初级";
            if (star > 5) {
                starName = "星星中级";
            }
            else if (star > 10) {
                starName = "星星高级";
            }
            let iconPath: string = "ui/common/icon/" + starName + "/spriteFrame";
            this._resourceLoad(iconPath, starNode);
        });

        switch (newStarValue) {
            case 1:
                {
                    this.img_star1.position = pos;
                    this.img_star1.active = true;
                }
                break;
            case 2:
                {
                    pos.x -= this._starXSub;
                    this.img_star1.position = pos;

                    let posNew = new Vec3(this._starsMiddlePos);
                    posNew.x += this._starXSub;
                    this.img_star2.position = posNew;

                    this.img_star1.active = true;
                    this.img_star2.active = true;
                }
                break;
            case 3:
                {
                    this.img_star2.position = pos;

                    let posNew = new Vec3(pos);
                    posNew.x -= this._starXSub;
                    this.img_star1.position = posNew;

                    let posNew1 = new Vec3(pos);
                    posNew1.x += this._starXSub;
                    this.img_star3.position = posNew1;

                    this.img_star1.active = true;
                    this.img_star2.active = true;
                    this.img_star3.active = true;
                }
                break;
            case 4:
                {
                    pos.x += this._starXSub / 2;
                    this.img_star3.position = pos;

                    let posNew = new Vec3(pos);
                    posNew.x += this._starXSub;
                    this.img_star4.position = posNew;

                    let posNew1 = new Vec3(pos);
                    posNew1.x -= this._starXSub;
                    this.img_star2.position = posNew1;

                    let posNew2 = new Vec3(posNew1);
                    posNew2.x -= this._starXSub;
                    this.img_star1.position = posNew2;

                    this.img_star1.active = true;
                    this.img_star2.active = true;
                    this.img_star3.active = true;
                    this.img_star4.active = true;
                }
                break;
            case 5:
                {
                    this.img_star3.position = pos;

                    let posNew = new Vec3(pos);
                    posNew.x -= this._starXSub;
                    this.img_star2.position = posNew;

                    let posNew1 = new Vec3(posNew);
                    posNew1.x -= this._starXSub;
                    this.img_star1.position = posNew1;

                    let posNew2 = new Vec3(this._starsMiddlePos);
                    posNew2.x += this._starXSub;
                    this.img_star4.position = posNew2;

                    let posNew3 = new Vec3(posNew2);
                    posNew3.x += this._starXSub;
                    this.img_star5.position = posNew3;

                    this.img_star1.active = true;
                    this.img_star2.active = true;
                    this.img_star3.active = true;
                    this.img_star4.active = true;
                    this.img_star5.active = true;
                }
                break;
                deault:
                break;
        }
    }

    //资源替换
    private _resourceLoad(path: string, obj: any) {
        resources.load(path, SpriteFrame, (err, spriteFrame: SpriteFrame) => {
            console.log("HeroPromotion _resourceLoad ---------", err)
            if (!err) {
                let sprite = obj.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
    }

    private _showSkillItems() {
        let star = this._curHeroData.getStar();
        this.skillItem0.setSkillData(this._curHeroData.getSkillID(), star);
        this.skillItem1.setTalentData(this._curHeroData.getTalentID(0), star, this._curHeroData.tier, this._curHeroData.getTalentUnLockTier(0));
        this.skillItem2.setTalentData(this._curHeroData.getTalentID(1), star, this._curHeroData.tier, this._curHeroData.getTalentUnLockTier(1));
        this.skillItem3.setTalentData(this._curHeroData.getTalentID(2), star, this._curHeroData.tier, this._curHeroData.getTalentUnLockTier(2));
    }

    // 展示英雄升阶界面
    private _showHeroUpgradeView() {
        this.node_equip.active = false; //装备界面        
        this.node_up.active = true;//升级升阶大界面            
        this.node_fight_param.active = this._isLvUpView; //升级底部属性界面
        this.btn_up_lv.active = this._isLvUpView;        //升级按钮
        this.node_upgrade.active = !this._isLvUpView;    //升阶底部属性界面
        this.btn_up_tier.active = !this._isLvUpView;     //升阶按钮

        //显示技能
        this._showSkillItems();
        //显示星级
        this._showStars(this._curHeroData.getStar());
        //显示阵营，职业
        this._showCampAndCareer();
        //显示品阶
        this._showTier();
        //显示升阶等级        
        this._showUpTierLv();
        //显示战力数据
        // this._showFightValues();
        //显示升阶数据
        this._showUpTierFightValues();
        //显示升阶消耗
        this._showUpTierCost();
    }

    // 展示英雄装备界面
    private _showEquipView() {
        this.node_equip.active = true; //装备界面
        this.node_up.active = false;//升级升阶大界面            
        this.node_fight_param.active = this._isLvUpView; //升级底部属性界面
        this.btn_up_lv.active = false;        //升级按钮
        this.node_upgrade.active = !this._isLvUpView;    //升阶底部属性界面
        this.btn_up_tier.active = false;     //升阶按钮

        //显示技能

        //显示品阶

        //显示等级

        //显示升阶数据 ? 显示升级数据

        //显示装备列表
        this._showEquipCells();
    }

    private _showEquipCells(){        
        if(!this._curHeroData.equipOnList){     
            this._equipNodeMap.forEach ( (v, k, m)=>{
                v.node.active= false;
            });
            
        }else{
            let equipOnList = this._curHeroData.equipOnList as unknown as Map<Msg.TEquipLocationType, Config.equip.Record>;            
            equipOnList.forEach((equipData,key, m)=>{
                console.log("!!!!!!!!!!!!!!!! equipData=",equipData);
                console.log(" key=",key);
                console.log(" m=",m);

                let itemEquipCell= this._equipNodeMap.get(key);                
                if(!itemEquipCell){
                    resources.load('prefabs_ui/main/itemequip_cell', (err:any,res:any)=>{
                        let equipCell = instantiate(res) as ItemEquipCell;
                        equipCell.name = "equipCell_" + key.toString();                                      
                        equipCell.setItemType(equipData.id, 0, ItemEquipType.equip,()=>{
                            console.log(" 显示装备具体界面 ");
                            PopMgr.getInstance().popHeroEquipReplaceWindow(this._curHeroData.getDyncID(), equipCell.getItemId() );
                        });

                        this._equipNodeMap.set(key, equipCell);
                    })   
                }
                else{
                    let equipCell = itemEquipCell as ItemEquipCell;
                    equipCell.setItemType(equipData.id, 0, ItemEquipType.equip,()=>{
                        console.log(" 显示装备具体界面 ");
                        PopMgr.getInstance().popHeroEquipReplaceWindow(this._curHeroData.getDyncID(), equipCell.getItemId() );
                    });
                }                
            });
        }
    }

    // 展示当前英雄模型形象
    private _showCurHeroModel() {
        // this.cur_hero_model.updateByHeroPerfabPath();
    }

    // 默认展示骑士主角升级UI
    private _initDefaultKnight() {
        this._curHeroId = 0;
        //todo
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
