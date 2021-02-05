
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { BaseScene } from './BaseScene';

@ccclass('SceneBattle')
export class SceneBattle extends BaseScene {

    start () {
        this.initUI();
    }

}