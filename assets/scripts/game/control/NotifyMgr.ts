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
    
    public static event_equip_item_change:string = "event_equip_item_change";       //装备道具数量变化
    // public static event_net_version_check:string = "event_net_version_check";
    // public static event_net_version_check:string = "event_net_version_check";
    public static event_net_hero_locked:string = "event_net_hero_locked";     //英雄锁定状态变化
    public static event_net_starUp_change:string = "event_net_starUp_change";     //升星变化
}
