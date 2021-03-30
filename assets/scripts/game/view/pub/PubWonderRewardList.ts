
import { _decorator, Component, Node,Label } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
const { ccclass, property } = _decorator;

@ccclass('PubWonderRewardList')
export class PubWonderRewardList extends PopBase {
    @property({type: Label})
    public lab_title= null as unknown as Label;

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
        console.log("iiiiiiiiiiiiii",itemList);
        var nType : number = 1;

        
        switch (nType)
        {
            case Msg.TObjectType.EObject_VRmb:
                break;
            case Msg.TObjectType.EObject_Fragment:
                break;
            case Msg.TObjectType.EObject_Equip://ID （若参数1为0，则参数2为品质参数3为星级，随机从特定品质特定星级的装备中掉落一件）
                break;
            case Msg.TObjectType.EObject_MagicDust:
                break;
            case Msg.TObjectType.EObject_AdvanceExp:
                break;
            case Msg.TObjectType.EObject_UsableItem:
                break;
            default: //心愿英雄


        }
    }

    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }
}

