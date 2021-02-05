import { NotifyCore } from "../../core/control/NotifyCore";


export class NotifyMgr extends NotifyCore {
    private static _instance: NotifyMgr = new NotifyMgr();
    public static getInstance() {
        return this._instance;
    }
    public static event_net_version_check:string = "event_net_version_check";
    public static event_net_player_login:string = "event_net_player_login";
    // public static event_net_version_check:string = "event_net_version_check";
    // public static event_net_version_check:string = "event_net_version_check";
    // public static event_net_version_check:string = "event_net_version_check";
}
