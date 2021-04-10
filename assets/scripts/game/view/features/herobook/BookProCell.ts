/**
 * 游戏组件:图鉴总等级cell
 * @author 黄志清
 * @version 1.0.0,2021.3.22
 */
import { _decorator, Component, Label } from 'cc';
import { TableName, ValueMgr } from '../../../model/ValueMgr';
const { ccclass, property } = _decorator;

@ccclass('BookProCell')
export class BookProCell extends Component {
    @property({type: Label})
    public lab_titleName:Label = null as unknown as Label;

    @property({type: Label})
    public lab_Pro_1:Label = null as unknown as Label;

    @property({type: Label})
    public lab_Pro_2:Label = null as unknown as Label;

    start () {        
    }

    setData(key:number,arr:Array<[number,number]>)
    {
        var re = "\{+\d+\}"; 
        let nameData = ValueMgr.getInstance().getItemByField(TableName.language_ui,"UI_HeroBookAchievementActive") as Config.language_ui.Record;
        let str = nameData.cn.replace("{0}",key.toString());
        console.log("zxczxcascasc",str,arr)
        this.lab_titleName.string = str.toString();

        // if(arr[0][0] == Number(Msg.THeroPropertyType.EHeroPropertyType_ATK))
        // {

        // }

    }
}
