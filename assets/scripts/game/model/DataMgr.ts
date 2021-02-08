
import { DataCore } from '../../core/control/DataCore';
export enum TableName {
    achievement,activity,activity_accumulation,activity_quest,activity_rank_award,activity_sell,aura,aura_hunting,book_hero_property,
    book_total_property,buff_new,challenge_copy,challenge_extra_award,copy,copy_extra_award,copy_loot,country,crystal,
    daily_recharge_award,equip,equip_role,event_copy,frame,gift_code_award,guide_text,guild_boss,guild_monster,guild_monster_rank_award,
    guildConfig,guildExpData,guildOrderData,hero_animation,hero_mission,hero_recommend,hero_text,heroes,hunting_boss,hunting_rank_award,
    iap,iap_package,item_usable,ladder_achievement,language_data,language_dync,language_error,language_ui,login_award,map,monsters,
    mythical_copy,mythical_extra_award,pet,pet_skill,portrait,pvp_rank_award,quest_award,quest_loop,rank_node,rookie_award,rookie_checkin,
    rookie_quest,shop_goods,skill,suit,talent,technology,title,trail,trail_buff,upgrade_exp,vip_award,wonder_summon,
}
export class DataMgr extends DataCore{
    private static _instance: DataMgr = new DataMgr();
    public static getInstance() {
        return this._instance;
    }
    public loadData(func:Function){
        //,"limit_task","skin","camp_copy","artifact"
        let tabName:Array<string> = [];
        for (var key in TableName) 
        {
            var keyToAny:any = key;
            if(isNaN(keyToAny))
            {
                tabName.push(key)
            }
        }

        this.initData(tabName,func);
    }
    public getTableByName(t:TableName){
        let name:string = TableName[t];
        return this.getTable(name);
    }
    
}