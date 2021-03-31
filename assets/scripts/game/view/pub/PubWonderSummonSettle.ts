
import { _decorator, Component, Node,Label } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
const { ccclass, property } = _decorator;

@ccclass('PubWonderSummonSettle')
export class PubWonderSummonSettle extends PopBase {
    @property({type: Label})
    public lab_title:Label | null = null;

    @property({type :  Node})
    public nodelist:Node[] = [];

    start () {
        super.start();
    }
 
}
