/*
 * @Author: zsy
 * @Date: 2021-03-15 12:04:23
 * @LastEditTime: 2021-03-24 20:56:06
 * @LastEditors: Please set LastEditors
 * @Description: 挂机奖励数据
 * @FilePath: \PreviewDemo\assets\scripts\game\model\datas\OfflineModel.ts
 */
import { TableName, ValueMgr } from "../ValueMgr";
import { GameModel } from "../GameModel";
import { BaseModel } from "./BaseModel";

// 挂机数据
export class OfflineModel extends BaseModel
{
    // 存储奖励信息
    private m_bonusInfo: any = []
    // 当前正在挂机的副本id
    private m_copyId: number = 0
    // 当前挂机时间
    private m_idleTime: number = 0

    // 配置数据
    public get configTab(){
        const tab = ValueMgr.getInstance().getTableByName(TableName.copy_loot)
        return tab
    }

    // 根据当前关卡获取相应奖励
    public getBonusByCopy(){
        // 玩家数据
        let rate = this._getPlayerCopyID()
        if(rate){
            let ret = ValueMgr.getInstance().getItemByField(TableName.copy_loot, rate)
            return ret
        }
    }

    // 动态数据
    public get IdleCopyId(): number {
        return this.m_copyId
    }

    public set IdleCopyId(value: number) {
        this.m_copyId = value
    }

    public getPlayerOfflineTime() {
        // const playerData = GameModel.getInstance().getPlayerModel().getPlayerInfo()
        // let lastTime = Math.max(this.m_idleTime, playerData.lastGainOfflineAwardAt)
        // let offLineTime = Math.floor(new Date().getTime() / 1000) - lastTime

        let offLineTime = this.m_idleTime
        let hour = Math.floor(offLineTime / 3600)
        let min = Math.floor((offLineTime % 3600) / 60)
        let sc = Math.floor((offLineTime % 3600) % 60)
        return this._numWithLen(hour, 2) + ":" + this._numWithLen(min, 2) + ":" + this._numWithLen(sc, 2)
    }

    public getBnousInfo() {
        return this.m_bonusInfo
    }

    // 服务器请求后设置数据
    public setBonusInfo(msg: Msg.GainOfflineAwardA) {
        let arrAwardlist: Msg.ILootObject[] = msg.awardList
        this.m_bonusInfo = arrAwardlist
        console.log(arrAwardlist)
        // 更新挂机时间
        this.m_idleTime = msg.offlineTime
    }
    
    /***************************************************************************************/
    private _getPlayerCopyID(){
        // 如果玩家有指定的副本则返回指定副本
        if(this.m_copyId != 0) {
            return this.m_copyId
        }
        // 获取当前的关卡进度
        const playerData = this._gameModel.getPlayerModel().getPlayerInfo()
        const copyInfo = playerData.copy;
        return copyInfo?.copyID
    }

    private _numWithLen(num : number, length : number){
        if(num.toString().length > length){
            return num
        }
        return (Array(length).join('0') + num).slice(-length);
    }
}