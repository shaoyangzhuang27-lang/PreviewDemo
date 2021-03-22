import {  Node,resources,instantiate,LabelComponent,Vec3,tween,Scene, Script } from 'cc';
import { PopSimple } from "../view/pop/PopSimple";
import { PopRisingStarTower } from "../view/pop/PopRisingStarTower";
import { PopStarUpResult } from "../view/pop/PopStarUpResult";
import { PopOneKeyStarUp } from "../view/pop/PopOneKeyStarUp";
import { PopCommonOne } from "../view/pop/PopCommonOne";
import { PopCore } from "../../core/control/PopCore";
import { NetLoading } from '../view/NetLoading';
import { TipDemo } from '../view/TipDemo';
import { TipHeroAttribute } from '../view/TipHeroAttribute';
import { XConsts } from '../model/const/XConsts';
import { TipSkill } from '../view/TipSkill';
import { PopHeroBookView } from "../view/pop/PopHeroBookView";
import { PopItemUseWin } from "../view/pop/PopItemUseWin";
import { PopEquipInfoWin } from "../view/pop/PopEquipInfoWin";
import { PopEquipSaleView } from "../view/pop/PopEquipSaleView";
import { PopItemReward } from '../view/pop/popItemReward';
import { HeroData } from '../model/datas/HeroData';
import { PopHeroChoiceGiftView } from '../view/pop/PopHeroChoiceGiftView';
import { PopHeroPub } from "../view/pop/PopHeroPub";
import { PopRecLineUp } from "../view/pub/PopRecLineUp";
import { PopSummonSettle } from "../view/pop/PopSummonSettle";
import { PopFragmentSynthesis } from "../view/pop/PopFragmentSynthesis";
import { PopBookActive } from '../view/pop/PopBookActive';
import { PopHeroEquipReplace } from '../view/hero_promotion/PopHeroEquipReplace';
import { PopBookUpGrade } from '../view/pop/PopBookUpgrade';
import { PopMultiItemReward } from "../view/pop/PopMultiItemReward";
import { PopBookHeroDetail } from '../view/pop/PopBookHeroDetail';
import { PopHeroStoryUI } from '../view/pop/PopHeroStoryUI';
export class PopMgr extends PopCore  {

    private static _instance: PopMgr = new PopMgr();
    public static getInstance() {
        return this._instance;
    }
    
    public clearPop(){

    }

    public setNetLoading(bo:boolean,content:string){
        resources.load('prefabs_ui/net_loading', (err:Error | null,res:any)=>{
            // this.netLoading = instantiate( res );

            let net_loading = this.parent?.getChildByName("net_loading")
            if(!net_loading){
                net_loading = instantiate( res );
                if(net_loading)
                    this.parent?.addChild(net_loading);
            }
            if(net_loading){
                let script = net_loading.getComponent("NetLoading") as NetLoading;
                script.setContent(content);
                net_loading.active = bo;
                net_loading.setSiblingIndex(XConsts.OrderLoading);
            }
        })
    }

    //弹窗放这里------------------------------------------------------------
    public popupSimpleWindow(title:string,content:string,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true){

        resources.load('prefabs_ui/pop/pop_simple', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p);

            let script = p.getComponent("PopSimple") as PopSimple;
            script.setTitle(title);
            script.setContent(content);
            script.setSubmitCallBack(submitCallBack);
            script.setCloseCallBack(closeCallBack);
            script.setIsMaskClose(isMaskClose);
            
            // script.popSelf();
            // script.setIsNeedHide(false);

        } );
    }

    //type
    /**
     * 阵容更换界面  
     * @param typeIndex 当前使用的阵型索引 数值参考XConsts的阵容索引
     */
    public popBattleTeamView(typeIndex:number|null = null)
    {
        resources.load('prefabs_ui/pop/pop_battleteam', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopBattleTeam");
            // script.setIsMaskClose(isMaskClose);
            // script.setInitTeamView(type)
        } );
            }

    /**
     * @description:  英雄升级,升阶,装备弹窗
     * @param {heroId} 英雄动态Id
     */
    public popHeroPromotionView(heroId:number=0,closeCallBack:Function|null = null,isMaskClose:boolean = true)
    {
        resources.load('prefabs_ui/pop/pop_heropromotion', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p);
            let script = p.getComponent("HeroPromotion");
            script.setIsMaskClose(isMaskClose);
            script.setCurrentHeroId(heroId);
        } );
    }

    /**
     * @description: 弹出升星塔界面界面 
     * @param {boolean} isMaskClose
     */
    public popStarUpView(isMaskClose:boolean = true)
    {
        resources.load('prefabs_ui/pop/pop_risingstartower', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopRisingStarTower") as PopRisingStarTower;
            script.setIsMaskClose(isMaskClose);
        } );
    }

    /**
     * @description: 弹出升星成功界面 
     * @param {HeroData} HeroInfo
     * @param {HeroData} newHeroInfo
     * @param {Function} closeCallBack
     * @param {boolean} isMaskClose
     */
    public popStarUpResultView(HeroInfo:HeroData,newHeroInfo:HeroData,closeCallBack:Function|null = null,isMaskClose:boolean = true)
    {
        resources.load('prefabs_ui/pop/pop_starup_result', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopStarUpResult") as PopStarUpResult;
            script.setHeroData(HeroInfo);
            script.setnewHeroData(newHeroInfo);
            script.setIsMaskClose(isMaskClose);
            script.setCloseCallBack(closeCallBack);
        } );
    }

    /**
     * @description: 弹出一键升星界面 
     * @param {HeroData} HeroInfo
     * @param {HeroData} newHeroInfo
     * @param {Function} closeCallBack
     * @param {boolean} isMaskClose
     */
    public popOneKeyStarUpView(closeCallBack:Function|null = null,isMaskClose:boolean = true)
    {
        resources.load('prefabs_ui/pop/pop_onekeystarup', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopOneKeyStarUp") as PopOneKeyStarUp;
            script.setIsMaskClose(isMaskClose);
            script.setCloseCallBack(closeCallBack);
        } );
    }

    //弹出说明界面
    /**
     * @description: 弹出说明界面 
     * @param {string} title
     * @param {string} content
     * @param {Function} submitCallBack
     * @param {Function} closeCallBack
     * @param {boolean} isMaskClose
     */
    public popExplain(title:string,content:string,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true)
    {
        resources.load('prefabs_ui/pop/pop_explain', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p);

            let script = p.getComponent("PopSimple") as PopSimple;
            script.setTitle(title);
            script.setContent(content);
            script.setSubmitCallBack(submitCallBack);
            script.setCloseCallBack(closeCallBack);
            script.setIsMaskClose(isMaskClose);
        } );
    }
    //弹窗放这里------------------------------------------------------------


    //弹出提示窗放这里-------------------------------------------------
    public tipSimpleWindow(pos:Vec3){
        
        resources.load('prefabs_ui/pop/tip_demo', (err:any,res:any)=>{
            let p = instantiate( res ) as Node;
            this.parent?.addChild(p);
            p.setSiblingIndex(XConsts.OrderTip);

            let script = p.getComponent("TipDemo") as TipDemo;
            script.setWinPos(pos);
        });
            }

    /**
     * @description: 英雄属性值弹窗tip
     * @param {Vec3} pos
     * @param {number} heroId
     */
    public tipHeroAttributeWindow(pos:Vec3, heroId:number = 0){

        resources.load('prefabs_ui/pop/tip_hero_attribute', (err:any,res:any)=>{
            let p = instantiate( res ) as Node;
            this.parent?.addChild(p);
            p.setSiblingIndex(XConsts.OrderTip);

            let script = p.getComponent("TipHeroAttribute") as TipHeroAttribute;
            script.setWinPos(pos,1);
            script.setHeroId(heroId);
            script.setIsWinClose(true);
        });
    }

    /**
     * @description: 英雄技能弹窗tip
     * @param {Vec3} pos
     * @param {any} skillData={skillId: 技能id, talentId:天赋id, isUnlock:是否解锁, unlockTier:解锁星级(天赋会用到)}
     */    
    public tipSkillWindow(pos:Vec3, skillData:any){
        // // test测试数据
        // if(!skillData || (!skillData.skillId && !skillData.talentId) )
        // {
        //     skillData= {skillId:535002};// 破甲弹2级
        // }
        resources.load('prefabs_ui/pop/tip_skill', (err:any,res:any)=>{
            let p = instantiate( res ) as Node;
            this.parent?.addChild(p);
            p.setSiblingIndex(XConsts.OrderTip);

            let script = p.getComponent("TipSkill") as TipSkill;
            script.setWinPos(pos, 1);
            script.setSkillData(skillData);
            script.setIsWinClose(true);
        });
    }


    //弹出提示窗放这里-------------------------------------------------

    //弹出图鉴界面
    public popBookLibraryView()
    {
        resources.load('prefabs_ui/pop/pop_bookview', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopHeroBookView") as PopHeroBookView;
            script.setIsMaskClose(false);
        } );
    }

    /**
     * 道具使用(信息)界面
     * @param id    道具id
     * @param objType   道具类型  数值对应Msg.TObjectType
     * @param isVisit   参观模式 不可使用、出售       
     */
    public popItemUseSellView(id:number,objType:number, isVisit:boolean|null = null)
    {
        resources.load('prefabs_ui/pop/pop_itemuse', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopItemUseWin") as PopItemUseWin;
            script.setUseItemType(id,objType,isVisit);
        } );
    }

    
    public popItemRewardView(id:number,num:number)
    {
        resources.load('prefabs_ui/pop/pop_itemreward', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopItemReward") as PopItemReward;
            script.setItemInfo(id,num);
        } );
    }

    /**
     * 装备信息界面
     * @param id    装备id
     * @param isVisit   参观模式   不显示出售按钮
     */
    public popEquipInfoView(id:number,isVisit:boolean|null = null)
    {
        resources.load('prefabs_ui/pop/pop_equipinfo', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopEquipInfoWin") as PopEquipInfoWin;
            script.setEquipItemType(id,isVisit);
        } );
    }

    /**
     * 装备出售界面
     * @param id  装备id
     */
    public popEquipSellView(id:number)
    {
        resources.load('prefabs_ui/pop/pop_equipsell', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopEquipSaleView") as PopEquipSaleView;
            script.setEquipSaleType(id);
        } );
    }
    
    /**
     * 打开背包中的礼包道具  海珠区
     * @param giftId 礼包id
     * @param visit 预览/参观模式
     */
    public popOpenHeroGiftView(giftId:number,visit:boolean = false)
    {
        resources.load('prefabs_ui/pop/pop_herogiftview', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopHeroChoiceGiftView") as PopHeroChoiceGiftView;
            script.setGiftID(giftId, visit);
        } );
    }


    public popHeroPubWindow(closeCallBack:Function|null = null,isMaskClose:boolean = true){

        resources.load('prefabs_ui/pop_hero_pub', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)
            let script = p.getComponent("PopHeroPub") as PopHeroPub;
            script.setCloseCallBack(closeCallBack);
            script.setIsMaskClose(isMaskClose);

        } );
    }
    
      /**
     * 通用类型一弹窗
     * @param title     窗口标题
     * @param content   窗体描述内容
     * @param mode      底部按钮显示样式
     */
    public popCommonOneWindow(title:string,content:string,mode : number ,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true){

        resources.load('prefabs_ui/pop/pop_common_one', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p);
            let script = p.getComponent("PopCommonOne") as PopCommonOne;
            script.setTitle(title);
            script.setContent(content);
            script.setShowMode(mode);
            script.setSubmitCallBack(submitCallBack)
            script.setCloseCallBack(closeCallBack);
            script.setIsMaskClose(isMaskClose);
            // script.popSelf();
            // script.setIsNeedHide(false);

        } );
    }

     //弹出酒馆推荐阵容
    public popRecLineUpWindow(title:string,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true)
    {
        resources.load('prefabs_ui/pop/pop_reclineup', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)
            let script = p.getComponent("PopRecLineUp") as PopRecLineUp;
            script.setTitle(title);
            script.setIsMaskClose(isMaskClose);

        } );
    }

    /**
     * @description: 召唤结算界面弹窗
     * @param {number} nType  召唤类型
     * @param {number} nCounts 召唤个数
     * @param {Function} closeCallBack
     */ 
    public popSummonSettleWindow(msgData: Msg.SummonHeroA,nType : number,closeCallBack:Function|null = null,isMaskClose:boolean = true)
    {
        resources.load('prefabs_ui/pop/pop_summonsettle', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)
            let script = p.getComponent("PopSummonSettle") as PopSummonSettle;
            script.initDataFromMsgData(msgData,nType);
            script.setIsMaskClose(isMaskClose);

        } );
    }


    public popFragmentSynthesisWindow(data : XStruct.fragment_synthesis_info.IRecord,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true){

        resources.load('prefabs_ui/pop/pop_fragment_synthesis', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p);

            let script = p.getComponent("PopFragmentSynthesis") as PopFragmentSynthesis;
            script.FragmentSysthesisInfo = data;
            script.setIsMaskClose(isMaskClose);
        } );
    }

    /**
     * 图鉴激活界面
     * @param id 英雄id
     */
    public popBookHeroActiveView(id:number)
    {
        resources.load('prefabs_ui/pop/pop_bookactive', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p);

            let script = p.getComponent("PopBookActive") as PopBookActive;
            script.setActiveHeroInfo(id);
        } );
    }

    /**
     * 图鉴升级界面
     * @param id 
     */
     public popBookHeroUpgradeView(id:number)
     {
         resources.load('prefabs_ui/pop/pop_bookupgrade', (err:any,res:any)=>{
             let p = instantiate( res );
             this.pushWindow(p);
 
             let script = p.getComponent("PopBookUpGrade") as PopBookUpGrade;
             script.setBookUpgradeHeroData(id);
         } );
     }


    /**
     * @description: 装备替换弹窗
     * @param {number} heroId 英雄动态Id
     * @param {number} equipId 装备Id
     * @param {Function} closeCallBack
     */    
    public popHeroEquipReplaceWindow(heroId: number, equipId:number=0, closeCallBack:Function|null = null){

        resources.load('prefabs_ui/pop/pop_replaceequip', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p);
            let script = p.getComponent("PopHeroEquipReplace") as PopHeroEquipReplace;
            script.setEquipData(heroId, equipId);
            script.setCloseCallBack(closeCallBack);
        } );
    }

     /**
     * @description: 获得物品(多个)弹窗
     * @param {Array<XStruct.prop_info.IRecord>} data 物品信息
     * @param {boolean} bAutoDecompsePop 是否自动分解弹窗
     * @param {Function} closeCallBack
     */
    public popMultiItemRewardWindow(data :Array<XStruct.prop_info.IRecord>,bAutoDecompsePop : boolean = false,submitCallBack:Function | null = null,closeCallBack:Function|null = null,isMaskClose:boolean = true){

        resources.load('prefabs_ui/pop/pop_multi_itemreward', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p);
            let script = p.getComponent("PopMultiItemReward") as PopMultiItemReward;
            script.setPropsInfo(data);
            script.autoDecompsePop = bAutoDecompsePop;
            script.setSubmitCallBack(submitCallBack);
            script.setCloseCallBack(closeCallBack);
            script.setIsMaskClose(isMaskClose);
        } );
    }

    /**
     * 打开图鉴详情
     * @param sid 英雄静态id
     */
    public popOpenBookHeroDetail(sid:number)
    {
        resources.load('prefabs_ui/pop/pop_bookherodetail', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p);

            let script = p.getComponent("PopBookHeroDetail") as PopBookHeroDetail;
            script.setBookData(sid);

        } );
    }

    /**
     * 打开英雄故事
     * @param sid 英雄静态id
     */
    public popOpenHeroStoryUI(sid:number)
    {
        resources.load('prefabs_ui/pop/pop_herostory', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p);

            let script = p.getComponent("PopHeroStoryUI") as PopHeroStoryUI;
            script.setBookData(sid);

        } );
    }
}