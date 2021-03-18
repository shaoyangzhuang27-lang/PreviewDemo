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

// 数据结构跟config.proto一致
// export interface IEquipConfigData {
// 	id: number;                 //int32  id = 1;		// ID
//     name: string;               //string name = 2;		// 名称
//     locationType: number;       //int32  location_type = 3;		// 位置类型
//     quality: number;            //int32  quality = 4;		// 品质
//     star: number;               //int32  star = 5;		// 星级
//     propertyType: number[];     //repeated int32  property_type = 6;		// 属性类型
//     propertyNum: number[];      //repeated int32  property_num = 7;		// 属性值
//     forwardId: number[];        //int32  forward_id = 8;		// 前置ID
//     composeMoney: number;       //int32  compose_money = 9;		// 合成消耗金币
//     imageName: string;          //string image_name = 10;		// 图标
//     suitId: number;             //int32  suit_id = 11;		// 套装ID
//     price: number;              //int32  price = 12;		// 出售价格
// }
export class ForgeModel extends BaseModel{

    // 获取静态配置的装备数据
    public getConfigEquip(){
        const tab = ValueMgr.getInstance().getTableByName(TableName.equip)
        return tab
    }

    // 根据装备位置获取配置装备
    public getConfigEquipsByPos(pos: Msg.TEquipLocationType){
        let tab = ValueMgr.getInstance().getTableByName(TableName.equip)
        let locationList: Map<number, Config.equip.Record[]> = new Map<number, Config.equip.Record[]>();
        tab.records.forEach((element: Config.equip.Record) => {
            let arr = locationList.get(element.locationType) || []
            arr.push(element)
            locationList.set(element.locationType, arr)
        });
        return locationList.get(pos)
    }

    // 排序 品质-星级 从低到高
    public sortEquipList(){

    }

    // 获取背包所有装备
    public getBagEquipList()
    {
        let bagEquipList = GameModel.getInstance().getBagModel().getBagEquipList()
        return bagEquipList;
    }



}