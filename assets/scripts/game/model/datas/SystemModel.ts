import { BaseModel } from "./BaseModel";
import { NotifyMgr } from '../../control/NotifyMgr';

export class SystemModel extends BaseModel{

    //所有服务器的角色数据
    private _allPlayerList:Array<Msg.IPlayerBriefInfo> = []

    
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