/*
 * @Description: 英雄升级/升阶/装备弹窗
 * @Author: 徐涛
 * @Date: 2021-03-09 19:30:14
 * @LastEditTime: 2021-03-16 17:52:53
 */
import { _decorator, Component, resources, director, tween, Vec3, instantiate, Node, UIOpacity, UIMeshRenderer, ToggleContainer, EventHandler, Toggle, UITransform, math, Sprite, SpriteFrame, Layout, Layers } from 'cc';
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
    
    @property({type: Layout, displayName: "layout"})
    public layout_tier:Layout = null as unknown as Layout;   
    
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
    // private _curHeroEquipData: EquipData= null as unknown as Data; //当前英雄装备数据
    private _allHeroList: Map<number, HeroData> = new Map<number, HeroData>(); //拥有的所有英雄
    private _starNodeList: Node[] = [];
    private _starsMiddlePos: Vec3 = new Vec3;
    private _starXSub : number = 10; //星级图片X轴间隔
    private _isHeroUpView: boolean = true; //true标记当前是英雄升级/阶界面，false标记当前是英雄装备界面
    private _isLvUpView: boolean = true; //true标记当前是英雄升级界面，false标记当前是英雄升阶界面

    onLoad() {
        super.onLoad();
        this._allHeroList = GameModel.getInstance().getHeroesModel().getHeroList();
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
            case this.btn_up_lv:
                console.log("HeroPromotion btn_up_lv")
                break;
            case this.btn_up_lv:
                console.log("HeroPromotion btn_up_lv")
                break;
            case this.btn_up_lv:
                console.log("HeroPromotion btn_up_lv")
                break;
            case this.btn_up_lv:
                console.log("HeroPromotion btn_up_lv")
                break;
            case this.btn_up_lv:
                console.log("HeroPromotion btn_up_lv")
                break;
            case this.btn_up_lv:
                console.log("HeroPromotion btn_up_lv")
                break;
            default:
                // code...
                break;
        }
    }
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start() {
        // [3]
        super.start()
        this._initView();
        // this.cur_SkillItem?.setSkillData(0);
        //this.cur_hero_model?.node.setSiblingIndex(100);
        // UIMeshRenderer

        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_hero_locked, this._notifyHeroLockedHandle, this);
    }

    onDestroy() {
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_hero_locked, this._notifyHeroLockedHandle, this);
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
        // let playerInfo = DataMgr.getInstance().getPlayerInfo()
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
        // 英雄等级 this._curHeroData.getLevel();
        // 英雄星级 this._curHeroData.getStar();
        // 英雄品阶 this._curHeroData.tier;
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

        //显示战力数据 

        //显示升级消耗

    }

    private _showTier(tier:number = 0){        
        let star = this._curHeroData.getStar();
        let maxTier= star;//星级就是当前英雄能达到的最大品阶
        tier = this._curHeroData.tier;
        if(tier > XShare.getInstance().KMaxHeroTier)
        {
            tier= XShare.getInstance().KMaxHeroTier;   
        }
        else if( tier <0)
        {
            tier=0;
        }
                
        let target= this;
        let iconPath :string;
        let items: Sprite[]= this.layout_tier.node.getComponentsInChildren(Sprite) as [Sprite];
        if(items.length < maxTier)
        {
            let nSub= maxTier - items.length;
            for (let index = 0; index < nSub; index++) {
                iconPath = "ui/lv_up/黑白进阶宝石/spriteFrame";
                if(tier >= (index+items.length) )
                {
                    iconPath = "ui/lv_up/进阶宝石/spriteFrame";
                } 

                XFuns.CreateSprite(iconPath, target.layout_tier.node, "img_grade_gem_"+(items.length+1+index).toString() );           
                // resources.load(, SpriteFrame, (err, spriteFrame:SpriteFrame) =>
                // {
                //     console.log("_showTier icon _resourceLoad1 ---------",err)
                //     if(!err)
                //     {
                //         let node = new Node( );                     
                //         const sprite = node.addComponent(Sprite);
                //         sprite.spriteFrame = spriteFrame;
                //         node.layer = Layers.Enum.UI_2D;
                        
                //         target.layout_tier.node.addChild(node);
                //     }
                // });
            }
        }
        else if(items.length > maxTier)
        {
            let nSub1= items.length - maxTier;
            let pos= this.layout_tier.node.getPosition();
            for (let i = 0; i < nSub1; i++) {                  
                items[i].node.active =false;
                items[i].onDestroy();
            }
            
            let itemNews: Sprite[]= this.layout_tier.node.getComponentsInChildren(Sprite) as [Sprite];
            for (let index = 0; index < itemNews.length; index++) {
                iconPath = "ui/lv_up/黑白进阶宝石/spriteFrame";
                if(index < tier)
                {
                    iconPath = "ui/lv_up/进阶宝石/spriteFrame";
                }
                
                XFuns.ReplaceSpriteFrame(iconPath, itemNews[index]);
                // resources.load(iconPath, SpriteFrame, (err, spriteFrame:SpriteFrame) =>
                // {
                //     console.log("_showTier icon _resourceLoad2 ---------",err)
                //     if(!err)
                //     {
                //          let sprite = itemNews[index];
                //          sprite.spriteFrame = spriteFrame;
                //     }
                // });
            }
        }
    }
    
    private _showCampAndCareer(){       
        if(!this._curHeroData.isRoleHero() )
        {            
            let name = XConsts.KCampSpriteName[this._curHeroData.getCamp() as number]; 
            let iconPath:string = "ui/lv_up/" + name + "/spriteFrame";
            this._resourceLoad(iconPath, this.btn_camp);
            this.btn_camp.active = true;

            name = XConsts.KClassesSpriteName[this._curHeroData.getClasses() as number];
            iconPath = "ui/lv_up/" + name + "/spriteFrame";
            this._resourceLoad(iconPath, this.btn_career);
            this.btn_career.active = true;
        }
        else
        {
            this.btn_camp.active = false;
            this.btn_career.active = false;
        }
    }

    private _showStars(star: number = 1)
    {
        // star= math.randomRangeInt(1,6);
        star = this._curHeroData.getStar();
        if(star > XShare.getInstance().KMaxHeroStar)
        {
            star= XShare.getInstance().KMaxHeroStar;   
        }
        else if( star <1)
        {
            star=1;
        }
        
        let pos= this._starsMiddlePos; 
        let newStarValue= star;
        if(star > 5)
        {            
            newStarValue= star% 5;                      
        }
        
        // 根据星级替换高等级星星图片资源      
        this._starNodeList.forEach(starNode => {
            starNode.active= false;
            let starName:string = "星星初级";    
            if(star > 5){            
                starName= "星星中级";                    
            }
            else if(star > 10){        
                starName= "星星高级";                            
            }
            let iconPath:string = "ui/icon/"+starName+"/spriteFrame";
            this._resourceLoad(iconPath, starNode);
        });

        switch(newStarValue)
        {
            case 1:
                {
                    this.img_star1.position= pos;                    
                    this.img_star1.active = true;
                }
                break;
            case 2:
                {
                    pos.x -= this._starXSub;
                    this.img_star1.position= pos;    
                    
                    let posNew = new Vec3(this._starsMiddlePos); 
                    posNew.x += this._starXSub;
                    this.img_star2.position= posNew;   
                                     
                    this.img_star1.active = true;
                    this.img_star2.active = true;                    
                }
                break;
            case 3:
                {
                    this.img_star2.position= pos;  

                    let posNew = new Vec3(pos); 
                    posNew.x -=this._starXSub;
                    this.img_star1.position= posNew;    
                    
                    let posNew1 = new Vec3(pos); 
                    posNew1.x += this._starXSub;
                    this.img_star3.position= posNew1;     

                    this.img_star1.active = true;
                    this.img_star2.active = true;                    
                    this.img_star3.active = true;    
                }
                break;
            case 4:
                {
                    pos.x += this._starXSub/2;
                    this.img_star3.position= pos;
                    
                    let posNew = new Vec3(pos);                       
                    posNew.x += this._starXSub;
                    this.img_star4.position= posNew;  
                                        
                    let posNew1 = new Vec3(pos); 
                    posNew1.x -= this._starXSub;
                    this.img_star2.position= posNew1; 

                    let posNew2 = new Vec3(posNew1); 
                    posNew2.x -= this._starXSub;
                    this.img_star1.position= posNew2; 

                    this.img_star1.active = true;
                    this.img_star2.active = true;                    
                    this.img_star3.active = true;    
                    this.img_star4.active = true;    
                }
                break;
            case 5:
                {                    
                    this.img_star3.position= pos; 
                                        
                    let posNew = new Vec3(pos); 
                    posNew.x -= this._starXSub;
                    this.img_star2.position= posNew;  

                    let posNew1 = new Vec3(posNew); 
                    posNew1.x -= this._starXSub;
                    this.img_star1.position= posNew1;                      
                    
                    let posNew2 = new Vec3(this._starsMiddlePos); 
                    posNew2.x += this._starXSub;
                    this.img_star4.position= posNew2; 

                    let posNew3 = new Vec3(posNew2); 
                    posNew3.x += this._starXSub;
                    this.img_star5.position= posNew3; 

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
    private _resourceLoad (path:string,obj:any)
    {
        resources.load(path, SpriteFrame, (err, spriteFrame:SpriteFrame) =>
        {
            console.log("HeroPromotion _resourceLoad ---------",err)
            if(!err)
            {
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
        this._showStars(this._curHeroData.getStar() );        
        //显示阵营，职业
        this._showCampAndCareer();
        //显示品阶
        this._showTier();
        //显示等级

        //显示升阶数据

        //显示升阶消耗
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

        //显示装备按钮
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
