/*
 * @Description: 事件通知管理器
 * @Author: xxxx
 * @Date: 2021-02-23 16:07:59
 * @LastEditTime: 2021-03-31 14:43:13
 */
import { NotifyCore } from "../../core/control/NotifyCore";


export class NotifyMgr extends NotifyCore {
    private static _instance: NotifyMgr = new NotifyMgr();
    public static getInstance() {
        return this._instance;
    }
    public static event_net_version_check:string = "event_net_version_check";
    public static event_net_player_login:string = "event_net_player_login";
    public static event_coin_diamond_level_change:string = "event_coin_diamond_level_change";       //金币钻石变化
    public static event_net_formation_change:string = "event_net_formation_change";     //英雄阵容变化
    public static event_net_offline: string = "event_net_offline"
    
    public static event_equip_item_change:string = "event_equip_item_change";       //装备道具数量变化
    // public static event_net_version_check:string = "event_net_version_check";
    // public static event_net_version_check:string = "event_net_version_check";
    // public static event_net_version_check:string = "event_net_version_check";
    public static event_net_hero_tier_up:string = "event_net_hero_tier_up";         //英雄升阶事件
    public static event_net_hero_lv_up:string = "event_net_hero_lv_up";             //英雄升级事件
    public static event_net_hero_locked:string = "event_net_hero_locked";           //英雄锁定状态变化
    public static event_net_hero_put_on_equip:string = "event_net_hero_put_on_equip";//英雄穿上装备事件
    public static event_net_hero_take_off_equip:string = "event_net_hero_take_off_equip";//英雄卸下装备事件
    public static event_net_set_college_hero: string = "event_net_set_college_hero";            //设置英雄到书院槽位
    public static event_net_starUp_change:string = "event_net_starUp_change";    //升星变化
    public static event_net_OneKeyStarUp_change:string = "event_net_OneKeyStarUp_change";     //一键升星变化
    public static event_net_hero_reset_change:string = "event_net_hero_reset_change";    //英雄重置变化
    public static event_net_hero_decompose_change:string = "event_net_hero_decompose_change";    //英雄分解变化
    public static event_net_hero_returnBack_change: string = "event_net_hero_returnBack_change";   //英雄回退变化

    public static event_net_pub_summon_hero: string = "event_net_pub_summon_hero";              //酒馆召唤
    public static event_hero_book_active: string = "event_hero_book_active";                    //英雄图鉴激活
    public static event_hero_book_upgrade: string = "event_hero_book_upgrade";                  //英雄图鉴升级

    public static event_net_pub_hero_decompose: string = "event_net_pub_hero_decompose";        //酒馆召唤英雄分解

    public static event_net_pub_summon_hero : string = "event_net_pub_summon_hero";     //酒馆召唤
    public static event_hero_book_active:string = "event_hero_book_active";         //英雄图鉴激活
    public static event_hero_book_upgrade:string = "event_hero_book_upgrade";         //英雄图鉴升级

    public static event_net_pub_hero_decompose : string = "event_net_pub_hero_decompose"; //酒馆召唤英雄分解
    public static event_equip_compose_suc: string = "event_equip_compose_suc";         //装备合成
    public static event_player_levelup:string = "event_player_levelup";                         //玩家升级
    public static event_giftCode_award:string = "event_giftCode_award";                         //兑换礼品

    public static event_player_levelup:string = "event_player_levelup";         //玩家升级

    public static event_net_pub_wonder_summon_hero : string = "event_net_pub_wonder_summon_hero"; //奇迹召唤英雄

    public static event_net_pub_wonder_hero_select : string = "event_net_pub_wonder_hero_select"; //奇迹心愿英雄选择
}
    public static event_net_changeserver:string = "event_net_changeserver";                     //切换服务器
    public static event_net_getherolist:string = "event_net_getherolist";                     //获取英雄列表
    public static event_net_getplayerdata:string = "event_net_getplayerdata";                     //获取玩家信息
