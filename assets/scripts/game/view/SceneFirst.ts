
import { _decorator, Component, Node,ProgressBarComponent } from 'cc';
import { DataCore } from '../../core/control/DataCore';
import { MsgMgr } from '../control/MsgMgr';
import { NotifyMgr } from '../control/NotifyMgr';
import { SceneMgr } from '../control/SceneMgr';
import { DataMgr } from '../model/DataMgr';
import { BaseScene } from './BaseScene';
const { ccclass, property } = _decorator;

@ccclass('SceneFirst')
export class SceneFirst extends BaseScene {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    
    @property({type: Node})
    public progress_bar:Node | null = null;

    private isVersionComplete = false;
    private isConfigComplete = false;

    start () {
        // Your initialization goes here.
        this.initNet();
        
        // DataMgr.getInstance().loadAllData((loadTotal:number,loadIndex:number)=>{
            // console.log("loadPro!!!")
            // console.log(loadTotal);
            // console.log(loadIndex);
        // });
        DataCore.getInstance().initData(["achievement","activity","activity_accumulation","activity_quest","activity_rank_award","activity_sell",
        "aura","aura_hunting","book_hero_property","book_total_property","buff_new","challenge_copy","challenge_extra_award","copy",
        "copy_extra_award","copy_loot","country","crystal","daily_recharge_award","equip","equip_role","event_copy","frame","gift_code_award","guide_text",
        "guild_boss","guild_monster","guild_monster_rank_award","guildConfig","guildExpData","guildOrderData","hero_animation","hero_mission","hero_recommend",
        "hero_text","heroes","hunting_boss","hunting_rank_award","iap","iap_package","item_usable","ladder_achievement","language_data","language_dync","language_error",
        "language_ui","login_award","map","monsters","mythical_copy","mythical_extra_award","pet","pet_skill","portrait","pvp_rank_award","quest_award",
        "quest_loop","rank_node","rookie_award","rookie_checkin","rookie_quest","shop_goods","skill","suit","talent","technology","title","trail","trail_buff",
        "upgrade_exp","vip_award","wonder_summon"],(cur:number,total:number)=>{this.setProgress(cur,total)});//,"limit_task","skin","camp_copy","artifact"
    }
    setProgress(cur:number,total:number){
        let p = this.progress_bar?.getComponent(ProgressBarComponent) as ProgressBarComponent;
        p.progress = cur/total;
        if(cur == total){
            this.isConfigComplete = true;
        }
        console.log("loading files:")
        console.log(cur)
        console.log(total)
        this.checkComplete();
    }
    initNet(){
        // MsgMgr.getInstance().initLoginNet();
        MsgMgr.getInstance().initLoginServer();
        MsgMgr.getInstance().connectLoginServer();
        MsgMgr.getInstance().getMsgLogin().requestVersionCheck();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_version_check,this.notifyVersionCheckHandle,this);
    }
    checkComplete(){
        if(this.isConfigComplete && this.isVersionComplete){
            SceneMgr.getInstance().changeToLogin();
        }
    }
    notifyVersionCheckHandle(data:any){
        //进入登陆界面
        console.log("notifyVersionCheckHandle")
        this.isVersionComplete = true;
        this.checkComplete();
    }

}
