/*
 * @Author: zsy
 * @Date: 2021-03-18 17:51:30
 * @LastEditTime: 2021-03-19 22:01:06
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
    /**
     * @description: 根据装备位置获取配置装备
     * @param {Msg TEquipLocationType} pos
     * @return {*}
     */
    public getConfigEquipsByPos(pos: Msg.TEquipLocationType):Config.equip.Record[]{
        let tab = ValueMgr.getInstance().getTableByName(TableName.equip)
        let locationList: Map<number, Config.equip.Record[]> = new Map<number, Config.equip.Record[]>();
        tab.records.forEach((element: Config.equip.Record) => {
            // 没有前置id的装备无法锻造合成，不加入数据
            if(element.forwardId != undefined && element.forwardId > 0){
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
        let bagEquipList = GameModel.getInstance().getBagModel().getBagEquipList()
        return bagEquipList;
    }

    public getBagEquipCount(equipId: number):number{
        let bagEquipList = GameModel.getInstance().getBagModel().getBagEquipList()
        return bagEquipList.get(equipId) || 0
    }
        

}