/*
 * @Author: zsy
 * @Date: 2021-03-18 17:51:30
 * @LastEditTime: 2021-03-23 11:36:04
 * @LastEditors: Please set LastEditors
 * @Description: 锻造模块
 * @FilePath: \PreviewDemo\assets\scripts\game\model\datas\ForgeModel.ts
 */

import { GameModel } from "../GameModel";
import { XConsts } from "../const/XConsts";
import { BaseModel } from "./BaseModel";
import { NotifyMgr } from '../../control/NotifyMgr';
import { TableName, ValueMgr } from "../ValueMgr";
import { ItemEquipType } from '../../view/menu/ItemEquipCell';
import { math } from "cc";

// 合成所需要的的材料个数 在cs中是从 UniLua 配置中读取 KEquipComposeMaterialNum 数据
export class ForgeModel extends BaseModel{

    // 缓存一份，装备合成表
    equipNextIdMap: any = null

    /**
     * @description: 根据装备位置获取配置装备
     * @param {Msg} pos
     * @param {boolean} withNoForwardId 是否带没有前置id的装备
     * @return {*}
     */    
    public getConfigEquipsByPos(pos: Msg.TEquipLocationType, withNoForwardId: boolean = true):Config.equip.Record[]{
        let tab = ValueMgr.getInstance().getTableByName(TableName.equip)
        let locationList: Map<number, Config.equip.Record[]> = new Map<number, Config.equip.Record[]>();
        tab.records.forEach((element: Config.equip.Record) => {
        if (withNoForwardId || (element.forwardId != undefined && element.forwardId > 0)){
                let arr = locationList.get(element.locationType) || []
                arr.push(element)
                locationList.set(element.locationType, arr)
            }
        });
        let records: Config.equip.Record[] =  locationList.get(pos) || []
        return records
    }

    // 排序 品质-星级 从低到高
    public sortEquipList(equipArr: Config.equip.Record[]): Config.equip.Record[]{
        let sortList = new Array<[number, Config.equip.Record]>();
        equipArr.forEach(equipData => {
            let sortIndex: number = equipData.quality * 1000 + equipData.star;
            sortList.push([sortIndex, equipData]);
        });
        sortList.sort((a, b) => a[0] - b[0])
        // 返回数组
        let retList: Config.equip.Record[] = []
        sortList.forEach(element => {
            retList.push(element[1])
        });

        return retList
    }

    // 判断装备是否可以合成
    // 返回可合成个数
    canCompose(configId: number) : number{
        let configData = ValueMgr.getInstance().getItemByField(TableName.equip, configId) as Config.equip.Record
        if(!configData){
            return 0
        }
        let forwardId = configData.forwardId
        let equipCount = this.getBagEquipCount(forwardId)
        return Math.floor(equipCount / XConsts.KEquipComposeMaterialNum)
    }

    /**
     * @description: 
     * @param {*}  pos 装备位置
     * @return {*} Map<composeId, composeConut>
     */    
    // 获取一键合成装备列表
    public getQuickComposeEquips(pos: Msg.TEquipLocationType): {composeMap: Map<number, number>, composeCost: number} {
        let playerInfo = this._gameModel.getPlayerModel().getPlayerInfo()
        // 花费的金币
        let costMoney = 0
        // 当前页的装备
        let equipArr =  this.getConfigEquipsByPos(pos)
        equipArr = this.sortEquipList(equipArr)
        // 玩家背包装备数量 id - 数量
        let composeEquip: Map<number, number> = new Map(this.getBagEquipList().entries())
        for (let index = 0; index < equipArr.length; index++) {
            const equip = equipArr[index];
            let nextId = this._getEquipNextId(equip.id)
            if (!nextId){
                break;
            }
            let nextEquip = this.getConfigEquipDataById(nextId)
            // 可合成数量
            let composeCount = Math.floor((composeEquip.get(equip.id) || 0) / XConsts.KEquipComposeMaterialNum)
            if(composeCount > 0){
                 // 钱不够
                if (playerInfo.money < costMoney + composeCount * nextEquip.composeMoney){
                    // 剩余钱可合成数
                    composeCount = Math.floor((playerInfo.money - costMoney) / nextEquip.composeMoney)
                    if (composeCount <= 0){
                        break;
                    }
                }
                // 增加合成装备数
                let curNum = composeEquip.get(nextId)
                if (curNum) {
                    composeEquip.set(nextId, composeCount + curNum)
                } else {
                    composeEquip.set(nextId, composeCount)
                }
                // 扣除材料
                let forwardNum = composeEquip.get(equip.id) as number
                composeEquip.set(equip.id, forwardNum - composeCount * XConsts.KEquipComposeMaterialNum)
                // 金币总花销
                costMoney += composeCount * nextEquip.composeMoney
            }
        }

        // for (let enter of composeEquip.entries()){enter[0], enter[1]}
        let records : Map<number, number> = new Map<number, number>()
        for (let [id, count] of composeEquip) {
            let curNum = this.getBagEquipCount(id)
            if(count > curNum){
                records.set(id, count - curNum)
            }
        }
        return { composeMap : records, composeCost : costMoney }
    }

    // 获取静态配置的装备数据
    public getConfigEquip(): Config.equip.Record[] {
        const tab = ValueMgr.getInstance().getTableByName(TableName.equip)
        return tab.records
    }

    public getConfigEquipDataById(id: number): Config.equip.Record{
        let configData = ValueMgr.getInstance().getItemByField(TableName.equip, id) as Config.equip.Record
        return configData
    }

    // 获取背包所有装备
    // map<id, count>
    public getBagEquipList():Map<number, number>{
        const bagEquipList = this._gameModel.getBagModel().getBagEquipList()
        return bagEquipList;
    }

    public getBagEquipCount(equipId: number):number{
        const bagEquipList = this._gameModel.getBagModel().getBagEquipList()
        return bagEquipList.get(equipId) || 0
    }

    // 初始化装备合成表
    private _getEquipNextId(equipId: number): number {
        if (this.equipNextIdMap != null){
            return this.equipNextIdMap.get(equipId)
        }
        // forwardId - equipId
        this.equipNextIdMap = new Map<number, number>()
        let equips: Config.equip.Record[] = this.getConfigEquip()
        equips.forEach(element => {
            if(element.forwardId){
                this.equipNextIdMap.set(element.forwardId, element.id)
            }
        });
        return this.equipNextIdMap.get(equipId)
    }

}