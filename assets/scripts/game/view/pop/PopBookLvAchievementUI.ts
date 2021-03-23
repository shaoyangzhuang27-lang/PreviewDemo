/**
 * 游戏组件:图鉴总等级属性
 * @author 黄志清
 * @version 1.0.0,2021.3.19
 */
 import { _decorator, Component, Node, Label, resources, instantiate, ScrollView } from 'cc';
 import { PopBase } from '../../../core/control/PopBase';
 import { TableName, ValueMgr } from '../../model/ValueMgr';
import { BookProCell } from '../hero/BookProCell';
 const { ccclass, property } = _decorator;

@ccclass('PopBookLvAchievementUI')
export class PopBookLvAchievementUI extends PopBase {
    @property({type :  ScrollView})
    public scrov_book:ScrollView = null as unknown as ScrollView;

    @property({type: Label})
    public lab_lvTip:Label = null as unknown as Label;

    @property({type: Label})
    public lab_nextLvTip:Label = null as unknown as Label;

    private _propretyListMap:Map<number,Array<[number,number]>> = new Map<number,Array<[number,number]>>();
    start () {
        super.start()
        this._initView()
    }

    _initView()
    {
        let btp = ValueMgr.getInstance().getTableByName(TableName.book_total_property) as Config.book_total_property;
        for (let index = 0; index < btp.records.length; index++) {
            let tempArr:Array<[number,number]> = new Array<[number,number]>();
            let lastTempArr:Array<[number,number]> = new Array<[number,number]>();
            let record = btp.records[index] as Config.book_total_property.Record;

            for (let i = 0; i < record.heroProType.length; i++) {
                let propertyType = record.heroProType[i] as Msg.THeroPropertyType;
                let proNum = record.heroProNum[i]; 
                tempArr.push([propertyType, Number(proNum.toFixed(2))]);
            }
            if(index != 0)
            {
                let lastRecord = btp.records[index-1] as Config.book_total_property.Record;
                for (let index = 0; index < lastRecord.heroProType.length; index++) {
                    let propertyType = lastRecord.heroProType[index] as Msg.THeroPropertyType;
                    let proNum = lastRecord.heroProNum[index]; 
                    lastTempArr.push([propertyType,Number(proNum.toFixed(2))]);                    
                }

                let newArr:Array<[number,number]> = new Array<[number,number]>();
                for (let index = 0; index < tempArr.length; index++) {
                    let arr = tempArr[index];
                    let lastArr = lastTempArr[index] || [0,0]
                    if(lastArr[0] != 0 && lastArr[0] == arr[0])
                    {
                        let value = Number((arr[1] - lastArr[1]).toFixed(2));
                        if(value != 0)
                        {
                            newArr.push([arr[0], value]);
                        }
                    }
                    else
                    {
                        newArr.push([arr[0], Number(arr[1].toFixed(2))]);
                    }                    
                }
                this._propretyListMap.set(record.reqPoint,newArr);
            }
            else{
                this._propretyListMap.set(record.reqPoint,tempArr);
            }
        }

        resources.load('prefabs_ui/main/bookpropretycell', (err:any,res:any)=>{
            for (let key of this._propretyListMap.keys()) {
                let propretyCell = instantiate(res) as Node;
                this.scrov_book.content?.addChild(propretyCell);

                let value = this._propretyListMap.get(key) as Array<[number,number]>;
                let script = propretyCell.getComponent("BookProCell") as BookProCell;
                script.setData(key,value);
            }
        })
        
    }
}
