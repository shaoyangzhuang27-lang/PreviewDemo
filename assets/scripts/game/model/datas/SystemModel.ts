import { BaseModel } from "./BaseModel";
import { NotifyMgr } from '../../control/NotifyMgr';

export class SystemModel extends BaseModel{

    //所有服务器的角色数据
    private _allPlayerList:Array<Msg.IPlayerBriefInfo> = [];

    private _accountId:string = "";
    private _deviceId:string  = "";
    private _playerId:number = 0;

    public setDeviceLoginNew(msg:Msg.DeviceLoginNewA){

        this._allPlayerList = msg.allPlayerList;
        this._playerId = msg.loginPlayerID;

    }
    public setDeviceId(deviceId:string){
        this._deviceId = deviceId;
    }
    public getDeviceId(){
        return this._deviceId;
    }
    public getPlayerId(){
        return this._playerId;
    }
    public getAccountId(){
        return this._accountId;
    }

    //保存所有服务器的角色数据
    public setAllPlayerData(allPlayerList:Array<Msg.IPlayerBriefInfo>){
        console.log("所有服务器的角色数据",allPlayerList)
        this._allPlayerList = allPlayerList
    }

    //获取所有服务器的角色数据
    public getAllPlayerData():Msg.IPlayerBriefInfo[]{
        return this._allPlayerList
    }

    //获取单个服务器的角色数据
    public getPlayerDataByServerID(serverID:number):Msg.IPlayerBriefInfo{
        for (let index = 0; index < this._allPlayerList.length; index++) {
            const element = this._allPlayerList[index];
            if (element.serverID == serverID) {
                return element
            }
        }
        return null as unknown as Msg.IPlayerBriefInfo
    }
    

}