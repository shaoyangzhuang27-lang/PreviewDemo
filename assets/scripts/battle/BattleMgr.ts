// import { _decorator, Component, Node, Enum } from 'cc';

import { BattleTest } from "./test/BattleTest";
import { HeroData } from "../game/model/datas/HeroData";

export class BattleMgr {
    private static _instance: BattleMgr = new BattleMgr();

    loadResList: any = [];

    public static getInstance() {
        return this._instance;
    }

    public buildPreloadRes() {
        this.loadResList = [];
        let armyFormation: Map<number, HeroData> = BattleTest.getArmyFormation();
        armyFormation.forEach((v: HeroData, k: Number) => {
            if(v.getPrefabPath() != "0") {
                this.loadResList.push(v.getPrefabPath());
            }
        }) 
    }

    public getIdleArmyInfo() {
        return BattleTest.getArmyFormation();
    }


    public getIdleEnemyInfo() {
        return BattleTest.getEnemyFormation();
    }
}
