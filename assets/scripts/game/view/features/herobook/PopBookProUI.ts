/**
 * 游戏组件:图鉴总属性
 * @author 黄志清
 * @version 1.0.0,2021.3.19
 */
import { _decorator, Component, Node, Label } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { GameModel } from '../../../model/GameModel';
const { ccclass, property } = _decorator;

@ccclass('PopBookProUI')
export class PopBookProUI extends PopBase {
    @property({type: Label})
    public lab_atkNum:Label = null as unknown as Label;

    @property({type: Label})
    public lab_hpNum:Label = null as unknown as Label;

    @property({type: Label})
    public lab_defNum:Label = null as unknown as Label;

    @property({type: Label})
    public lab_atkPro:Label = null as unknown as Label;

    @property({type: Label})
    public lab_hpPro:Label = null as unknown as Label;

    @property({type: Label})
    public lab_defPro:Label = null as unknown as Label;

    start () {
        super.start()
        this._initData();
    }

    private _initData()
    {
        // let curBookLVPoint = GameModel.getInstance().getHeroesModel().getCurHeroBookPoint()
        let heroAllAtk:number = GameModel.getInstance().getHeroesModel().retHeroBookPropertyByHero(Msg.THeroPropertyType.EHeroPropertyType_ATK)
        let heroAllHp:number = GameModel.getInstance().getHeroesModel().retHeroBookPropertyByHero(Msg.THeroPropertyType.EHeroPropertyType_HP)
        let heroAllDef:number = GameModel.getInstance().getHeroesModel().retHeroBookPropertyByHero(Msg.THeroPropertyType.EHeroPropertyType_DEF)

        let bookAllAtk:number = GameModel.getInstance().getHeroesModel().retHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_ATK)
        let bookAllHp:number = GameModel.getInstance().getHeroesModel().retHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_HP)
        let bookAllDef:number = GameModel.getInstance().getHeroesModel().retHeroBookPropertyByBook(Msg.THeroPropertyType.EHeroPropertyType_DEF)

        let atkStr = "+" + (bookAllAtk * 100).toFixed(1) + "%";
        let hpStr = "+" + (bookAllHp * 100).toFixed(1) + "%";
        let defStr = "+" + (bookAllDef * 100).toFixed(1) + "%";

        this.lab_atkNum.string = "+" + heroAllAtk.toString();
        this.lab_hpNum.string = "+" + heroAllHp.toString();
        this.lab_defNum.string = "+" + heroAllDef.toString();

        this.lab_atkPro.string = atkStr;
        this.lab_hpPro.string = hpStr.toString();
        this.lab_defPro.string = defStr.toString();

    }

}
