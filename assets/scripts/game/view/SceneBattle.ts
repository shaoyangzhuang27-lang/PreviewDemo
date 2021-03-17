
import { _decorator, Node } from 'cc';
const { ccclass, property } = _decorator;


import { BattleCtrl } from '../../battle/BattleCtrl';
import { BaseScene } from './BaseScene';
import { MainUI } from './menu/MainUI';

@ccclass('SceneBattle')
export class SceneBattle extends BaseScene {

    @property(Node)
    private mainNode: Node = null as unknown as Node;

    private _mainUI: MainUI = null as unknown as MainUI;
    private _battleCtrl: BattleCtrl = null as unknown as BattleCtrl;

    onLoad() {
        super.onLoad();
        this._battleCtrl = this.mainNode.getComponent("BattleCtrl") as BattleCtrl
        
        
    }
    start () {


        super.start();
        this.initUI((node: Node)=> {
            this._mainUI = node.getComponent("MainUI") as MainUI;
            this._battleCtrl.setBossBtn(this._mainUI.btn_fight);
            
            if (!this._battleCtrl.isStart()) {
                this._mainUI.btn_fight.active = false;
            }

            this._mainUI.setClickBossFightFunc(()=>{
                this._battleCtrl.onClickBossFight();
            })
        });
    }

}