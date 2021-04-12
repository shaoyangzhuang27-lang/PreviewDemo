
import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
const { ccclass, property } = _decorator;

@ccclass('PopfShop')
export class PopfShop extends PopBase {

    @property({type :  Label})
    public labTitle:Label = null as unknown as Label; //标题

    @property({type :  Sprite})
    public imgProp:Sprite = null as unknown as Sprite; //资源道具ICON

    @property({type :  Label})
    public labPropNum:Label = null as unknown as Label; //资源道具数量

    @property({type :  Label})
    public labTime:Label = null as unknown as Label; //刷新剩余时间

    @property({type :  Sprite})
    public iconRefhProp:Sprite = null as unknown as Sprite; //刷新消耗的道具

    @property({type :  Label})
    public labRefConsumenum:Label = null as unknown as Label; //刷新消耗资源数量

}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
