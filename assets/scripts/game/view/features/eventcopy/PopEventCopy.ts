/**
 * 游戏组件:资源副本
 * @author 施敏昭
 * @version 1.0.0,2021.4.13
 */
import { _decorator, view,UITransform, Node, Sprite,SpriteFrame, Label, ToggleContainer, EventHandler, Toggle, sys, resources, instantiate, Vec3, ScrollView, v3, math, Widget, Button } from 'cc';
const { ccclass, property } = _decorator;
import { PopBase } from '../../../../core/control/PopBase';
import { GameModel } from '../../../model/GameModel';
import { HeroData } from '../../../model/datas/HeroData';
import { ElementHeroIcon } from '../../common/ElementHeroIcon';
import { PopMgr } from '../../../control/PopMgr';
import { MsgMgr } from '../../../control/MsgMgr';
import { NotifyMgr } from '../../../control/NotifyMgr';
import { HeroModel } from '../../common/HeroModel';
import { TableName, ValueMgr } from "../../../model/ValueMgr";
import { ResMgr } from '../../../control/ResMgr';

@ccclass('PopEventCopy')
export class PopEventCopy extends PopBase {

    @property({type: Node, displayName: "说明按钮"})
    public btn_explain:Node | null = null;

    onLoad () {
        super.onLoad();
    }

    start()
    {
        super.start();
    }

}
