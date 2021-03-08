// import { _decorator, Component, Node, Enum } from 'cc';

import { BattleTest } from "./test/BattleTest";
import { HeroData } from "../game/model/datas/HeroData";

export class BattleMgr {
    private static _instance: BattleMgr = new BattleMgr();

    loadResList: any = [];

    public static getInstance() {
        return this._instance;
    }

    public preloadRes() {

    }

    public buildBattleIdleData() {
        let armyFormation: Map<number, HeroData> = BattleTest.getArmyFormation();

        armyFormation.forEach(function(v, k) {
            let o: any = {}
            o.embattleedSite = k;
            o.heroData = v;
        }) 

    }

    public getIdleArmyInfo() {
        return BattleTest.getArmyFormation();
    }


    public getIdleEnemyInfo() {
        return BattleTest.getEnemyFormation();
    }
}
