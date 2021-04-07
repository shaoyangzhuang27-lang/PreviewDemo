
import { _decorator, Component, Node,Label,resources,instantiate,ScrollView } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { GameModel } from '../../../model/GameModel';
import { XConsts } from '../../../model/const/XConsts';
import { TableName, ValueMgr } from "../../../model/ValueMgr";
import { PopMgr } from '../../../control/PopMgr';
import { CellPubWonderRewardList } from "./CellPubWonderRewardList";
import { HeroIcon } from '../../hero/HeroIcon';
import { ResMgr } from '../../../control/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('PopPubWonderRewardList')
export class PopPubWonderRewardList extends PopBase {
    @property({type: Label})
    public lab_title= null as unknown as Label;

    @property({type :  ScrollView})
    public scroll_reward:ScrollView = null as unknown as ScrollView;

    start () {
        super.start();
        this.lab_title.string = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_RAREAWARD);
        this.initListItemInfo();
    }

    public setTitle(title:string){
        if(this.lab_title)
            this.lab_title.string = title
    }


    public initListItemInfo()
    {
        var itemList = ValueMgr.getInstance().getTableByName(TableName.wonder_summon).records
        let dataList : Array<any> = [];
        let temp : Array<any> = []
        temp.push(itemList[0]);
        temp.push(itemList[1]);
        dataList.push(temp.concat([]));

        for(var i =0;  i < 6; i++)
        {
            temp = [];
            temp.push(itemList[2 + 4*i]);
            temp.push(itemList[3 + 4*i]);
            temp.push(itemList[4 + 4*i]);
            temp.push(itemList[5 + 4*i]);
            dataList.push(temp.concat([]));
        }
        if(this.scroll_reward.content)
        {
            this.scroll_reward.content.removeAllChildren()
        }
        for(let index = 0 ; index < dataList.length; ++index)
        {
            ResMgr.getInstance().loadPrefab('prefabs_ui/features/pub/cell_pubwonderrewardlist', (err:any,res:any)=>{
                    let wonder_item = instantiate( res );
                    let script = wonder_item.getComponent(CellPubWonderRewardList);
                    script.initItemInfo(dataList[index]);
                    script.setParentNode(this);
                    this.scroll_reward.content?.addChild(wonder_item);   
             },"PopPubWonderRewardList");
        }
    }

    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }
}

