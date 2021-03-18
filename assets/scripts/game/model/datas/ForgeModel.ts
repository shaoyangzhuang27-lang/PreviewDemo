/**
* 锻造模块
* @author zsy
* @version
*/
import { GameModel } from "../GameModel";
import { XConsts } from "../const/XConsts";
import { BaseModel } from "./BaseModel";
import { NotifyMgr } from '../../control/NotifyMgr';
import { TableName, ValueMgr } from "../ValueMgr";
import { ItemEquipType } from '../../view/menu/ItemEquipCell';

export class ForgeModel extends BaseModel{

    // 获取静态配置的装备数据
    public getConfigEquip(){
        const tab = ValueMgr.getInstance().getTableByName(TableName.equip)
        return tab
    }

    // 根据装备位置获取配置装备
    public getConfigEquipByPos(pos: Msg.TEquipLocationType){
        let tab = ValueMgr.getInstance().getTableByName(TableName.equip)
        // tab.forEach(element => {
            
        // });
    }

    // 获取背包所有装备
    public getBagEquipList()
    {
        let bagEquipList = GameModel.getInstance().getBagModel().getBagEquipList()
        return bagEquipList;
    }



}