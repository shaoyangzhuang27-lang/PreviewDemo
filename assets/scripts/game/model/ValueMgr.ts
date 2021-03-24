/*
 * @Description: 表格管理器
 * @Author: xxxxxx
 * @Date: 2021-02-23 16:07:59
 * @LastEditTime: 2021-03-23 20:35:36
 */

import { ValueCore } from '../../core/control/ValueCore';
import { XConsts } from './const/XConsts';
export enum TableName {
    achievement, activity, activity_accumulation, activity_quest, activity_rank_award, activity_sell, aura, aura_hunting, book_hero_property,
    book_total_property, buff_new, challenge_copy, challenge_extra_award, copy, copy_extra_award, copy_loot, country, crystal,
    daily_recharge_award, equip, equip_role, event_copy, frame, gift_code_award, guide_text, guild_boss, guild_monster, guild_monster_rank_award,
    guildConfig, guildExpData, guildOrderData, hero_animation, hero_mission, hero_recommend, hero_text, heroes, hunting_boss, hunting_rank_award,
    iap, iap_package, item_usable, ladder_achievement, language_data, language_dync, language_error, language_ui, login_award, map, monsters,
    mythical_copy, mythical_extra_award, pet, pet_skill, portrait, pvp_rank_award, quest_award, quest_loop, rank_node, rookie_award, rookie_checkin,
    rookie_quest, shop_goods, skill, suit, talent, technology, title, trail, trail_buff, upgrade_exp, vip_award, wonder_summon, skin, camp_copy,
    artifact,//limit_task,
}

export enum TLanguageType {
    ELanguage_en = 1,
    ELanguage_cn = 2,
    Elanguage_tw = 3,
    Elanguage_ja = 4,
    Elanguage_kr = 5,
}

export class ValueMgr extends ValueCore {
    private static _instance: ValueMgr = new ValueMgr();
    public static getInstance() {
        return this._instance;
    }

    private _bInit: boolean = false;
    private _languageType:TLanguageType =TLanguageType.ELanguage_cn; //默认语言类型为中文
    private dataMap: Map<string, Map<number | string, {}>> = new Map<string, Map<number | string, {}>>();

    public setInit(b: boolean) {
        this._bInit = b;
    }

    public isInit(): boolean {
        return this._bInit;
    }
    /**
     * @description: 设置表格语言类型
     * @param {TLanguageType} type
     */
    public setLanguageType(type:TLanguageType){
        this._languageType = type;
    }

    public loadData(func: Function) {
        let tabName: Array<string> = [];
        for (var key in TableName) {
            var keyToAny: any = key;
            if (isNaN(keyToAny)) {
                tabName.push(key)
            }
        }

        this.initData(tabName, func);
    }
    public getTableByName(t: TableName) {
        let name: string = TableName[t];
        return this.getTable(name);
    }
    public getItemByField(t: TableName, key: number | string, fieldName: string = "id") {
        let tab = this.getTableByName(t).records;

        let name: string = TableName[t];
        let mapName = name + "_" + fieldName;
        let tabMap = this.dataMap.get(mapName);
        if (tabMap) {
            return tabMap.get(key);
        } else {
            tabMap = new Map<number | string, {}>();
            this.dataMap.set(mapName, tabMap);

            for (let index = 0; index < tab.length; index++) {
                const element = tab[index];
                tabMap.set(element[fieldName], element);
            }

            return tabMap.get(key);
        }
    }
    public optimizationTable() {
        // return;
        let tab = (this.getTableByName(TableName.language_data) as Config.language_data).records;
        tab.forEach((value, index) => {
            value.en = "";
            value.ja = "";
            value.kr = "";
            value.tw = "";
        })
        let tab2 = (this.getTableByName(TableName.language_ui) as Config.language_ui).records;
        tab2.forEach((value, index) => {
            value.en = "";
            value.ja = "";
            value.kr = "";
            value.tw = "";
        })
        let tab3 = (this.getTableByName(TableName.copy_loot) as Config.copy_loot).records;
        let index2 = 0;
        while (index2 < tab3.length) {
            let value = tab3[index2];
            let id = value.id as number;
            if (id >= 0 && id <= 200) {
                index2++;
            } else {
                tab3.splice(index2, 1);
            }
        }
        let tab4 = (this.getTableByName(TableName.copy) as Config.copy_loot).records;
        let index3 = 0;
        while (index3 < tab4.length) {
            let value = tab4[index3];
            let id = value.id as number;
            if (id >= 0 && id <= 200) {
                index3++;
            } else {
                tab4.splice(index3, 1);
            }
        }

    }

    /**
     * @description: 根据languageKey的前缀获取对应表的文字，默认都是返回中文cn
     * @param {string} strLanguageKey  语言表格key
     * @param {string} strDefault 默认值
     */
    public getLanguageString(strLanguageKey: string, strDefault:string ="") {
        let tablename: TableName= TableName.language_data;

        // strLanguageKey 前缀判断属于哪个静态表
        let strKeytype = strLanguageKey.substring(0, strLanguageKey.indexOf("_"));
        if (strKeytype == XConsts.KLanguegeTypeUI) {
            tablename = TableName.language_ui;
        } else if (strKeytype == XConsts.KLanguegeTypeError) {
            tablename = TableName.language_error; 
        } else if (strKeytype == XConsts.KLanguegeTypeData) {
            tablename = TableName.language_data; 
        } else if (strKeytype == XConsts.KLanguegeTypeDync) {
            tablename = TableName.language_dync; 
        } else {
            return strDefault;
        }        
        
        let record = this.getItemByField(tablename, strLanguageKey) as Config.language_data.Record;
        switch (this._languageType) {
            case TLanguageType.ELanguage_cn:
                return record.cn;
                break;
            case TLanguageType.ELanguage_en:
                return record.en;
                break;
            case TLanguageType.Elanguage_tw:
                return record.tw;
                break;
            case TLanguageType.Elanguage_ja:
                return record.ja;
                break;
            case TLanguageType.Elanguage_kr:
                return record.kr;
                break;
            default:
                break;
        }
        return strDefault;
    }

}
// ValueMgr.getInstance().getTableByName(TableName.language_data)["id"]