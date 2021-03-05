
import { ValueCore } from '../../core/control/ValueCore';
export enum TableName {
    achievement,activity,activity_accumulation,activity_quest,activity_rank_award,activity_sell,aura,aura_hunting,book_hero_property,
    book_total_property,buff_new,challenge_copy,challenge_extra_award,copy,copy_extra_award,copy_loot,country,crystal,
    daily_recharge_award,equip,equip_role,event_copy,frame,gift_code_award,guide_text,guild_boss,guild_monster,guild_monster_rank_award,
    guildConfig,guildExpData,guildOrderData,hero_animation,hero_mission,hero_recommend,hero_text,heroes,hunting_boss,hunting_rank_award,
    iap,iap_package,item_usable,ladder_achievement,language_data,language_dync,language_error,language_ui,login_award,map,monsters,
    mythical_copy,mythical_extra_award,pet,pet_skill,portrait,pvp_rank_award,quest_award,quest_loop,rank_node,rookie_award,rookie_checkin,
    rookie_quest,shop_goods,skill,suit,talent,technology,title,trail,trail_buff,upgrade_exp,vip_award,wonder_summon,skin,camp_copy,
    artifact,//limit_task,
}
export class ValueMgr extends ValueCore{
    private static _instance: ValueMgr = new ValueMgr();
    public static getInstance() {
        return this._instance;
    }

    private _bInit: boolean = false;

    private dataMap:Map<string,Map<number|string,{}>>  = new Map<string,Map<number|string,{}>>();

    public setInit(b: boolean) {
        this._bInit = b;
    }

    public isInit(): boolean {
        return this._bInit;
    }

    public loadData(func:Function){
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
    public getItemByField(t:TableName,key:number|string,fieldName:string = "id"){
        let tab = this.getTableByName(t).records;

        let name:string = TableName[t];
        let mapName = name+"_"+fieldName;
        let tabMap = this.dataMap.get(mapName);
        if(tabMap){
            return tabMap.get(key);
        }else{
            tabMap = new Map<number|string,{}>();
            this.dataMap.set(mapName,tabMap);

            for (let index = 0; index < tab.length; index++) {
                const element = tab[index];
                tabMap.set(element[fieldName],element);
            }
            
            return tabMap.get(key);
        }
    }
}
// ValueMgr.getInstance().getTableByName(TableName.language_data)["id"]