import {  Node,resources,instantiate,LabelComponent,Vec3,tween,Scene, Script } from 'cc';
import { PopSimple } from "../view/pop/PopSimple";
import { PopCommonOne } from "../view/pop/PopCommonOne";
import { PopCore } from "../../core/control/PopCore";
import { NetLoading } from '../view/NetLoading';
import { TipDemo } from '../view/TipDemo';
import { TipHeroAttribute } from '../view/TipHeroAttribute';
import { XConsts } from '../model/const/XConsts';
import { TipSkill } from '../view/TipSkill';
import { PopHeroPub } from "../view/pop/PopHeroPub";
import { PopRecLineUp } from "../view/pub/PopRecLineUp";
import { PopSummonSettle } from "../view/pop/PopSummonSettle";
import { PopFragmentSynthesis } from "../view/pop/PopFragmentSynthesis";
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

    //弹出阵容更换界面
    //type
    public popBattleTeamView(type:number,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true)
    {
        resources.load('prefabs_ui/pop/pop_battleteam', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopBattleTeam");
            script.setIsMaskClose(isMaskClose);
            // script.setInitTeamView(type)
        } );
            }


    //弹出英雄升级,升阶,装备界面
    public popHeroPromotionView(heroId:number,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true)
    {
        resources.load('prefabs_ui/pop/pop_heropromotion', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("HeroPromotion");
            script.setIsMaskClose(isMaskClose);
            script.setCurrentHeroId(heroId);
        } );
    }

    //弹出说明界面
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
    //英雄属性值弹窗tip
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

    //英雄技能弹窗tip
    public tipSkillWindow(pos:Vec3, skillId:number){

        resources.load('prefabs_ui/pop/tip_skill', (err:any,res:any)=>{
            let p = instantiate( res ) as Node;
            this.parent?.addChild(p);
            p.setSiblingIndex(XConsts.OrderTip);

            let script = p.getComponent("TipSkill") as TipSkill;
            script.setWinPos(pos, 1);
            if(skillId ==0)
            {
                skillId= 535002;//破甲弹2级
            }
            script.setSkillData(skillId);
            script.setIsWinClose(true);
        });
    }


    //弹出提示窗放这里-------------------------------------------------

    //弹出图鉴界面
    public popBoolLibraryView()
    {
        resources.load('prefabs_ui/pop/pop_bookview', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopHeroBookView");
            script.setIsMaskClose(false);
        } );
    }
    public popHeroPubWindow(title:string,content:string,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true){

        resources.load('prefabs_ui/pop_hero_pub', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopHeroPub") as PopHeroPub;
            // script.setTitle(title)
            // script.setContent(content)
            script.setSubmitCallBack(submitCallBack)
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

    public popSummonSettleWindow(title:string,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true)
    {
        resources.load('prefabs_ui/pop/pop_summonsettle', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)
            let script = p.getComponent("PopSummonSettle") as PopSummonSettle;
            // script.setTitle(title);
            script.setIsMaskClose(isMaskClose);

        } );
    }


    public popFragmentSynthesisWindow(title:string,content:string,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true){

        resources.load('prefabs_ui/pop/pop_fragment_synthesis', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p);

            let script = p.getComponent("PopFragmentSynthesis") as PopFragmentSynthesis;
            script.setTitle(title);
            script.setContent(content);
            script.setSubmitCallBack(submitCallBack);
            script.setCloseCallBack(closeCallBack);
            script.setIsMaskClose(isMaskClose);
            
            // script.popSelf();
            // script.setIsNeedHide(false);

        } );
    }
}