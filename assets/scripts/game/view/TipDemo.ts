import { _decorator, Component, Node, Sprite, math } from 'cc';
import { TipBase } from './TipBase';
const { ccclass, property } = _decorator;

@ccclass('TipDemo')
export class TipDemo extends TipBase {
    // [1]
    // dummy = '';

    start () {
        super.start();
    }
}
