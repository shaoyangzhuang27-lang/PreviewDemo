import {resources, instantiate} from 'cc';

import { EHeroType } from "../BattleHero";
import { HeroData } from "../../game/model/datas/HeroData";

import { TestHeroData } from "./TestHeroData";


let HeroModelPrefabPath: {[key: string]: string} = {
    "主角_1": "leader_00"
}


let SkillPrefabPath: {[key: number]: string} = {
    1001 : "skill_0001"
}

let HeroTestInfo: {[key: number]: any} = {
    0: {
        prefab: "leader_00",
        skillID: 1001,
        hp: 100,
        atk: 5,
        range: 3,
        speed: 1,
    },
    29: {
        prefab: "hero_029",
        hp: 100,
        atk: 4,
        range: 3,
        speed: 1.3,
    },
    30: {
        prefab: "hero_030",
        hp: 100,
        atk: 4,
        range: 3,
        speed: 1.3,
    },
    25: {
        prefab: "hero_025",
        hp: 100,
        atk: 6,
        range: 6,
        speed: 1.3,
    },
    26: {
        prefab: "hero_026",
        hp: 100,
        atk: 6,
        range: 6,
        speed: 1.3,
    },
    33: {
        prefab: "hero_033",
        hp: 100,
        atk: 6,
        range: 6,
        speed: 1.3,
    },
}


let MonsterTestInfo: {[key: number]: any}= {
    40: {
        prefab: "hero_040",
        hp: 300,
        atk: 2,
        range: 3,
        speed: 1.3,
    },
    44: {
        prefab: "hero_044",
        hp: 500,
        atk: 2,
        range: 3,
        speed: 1.3,
    },
    45: {
        prefab: "hero_045",
        hp: 400,
        atk: 2,
        range: 3,
        speed: 1.3,
    },
    41: {
        prefab: "hero_041",
        hp: 200,
        atk: 3,
        range: 6,
        speed: 1.3,
    },
    42: {
        prefab: "hero_042",
        hp: 150,
        atk: 3,
        range: 6,
        speed: 1.3,
    },
    46: {
        prefab: "hero_046",
        hp: 500,
        atk: 3,
        range: 6,
        speed: 1.3,
    },
}


let ArmyTestInfo =  [
    {
        id: 0,
        type: EHeroType.LEADER,
        embattleedSite: 1,
    },
    {
        id: 29,
        type: EHeroType.HERO,
        embattleedSite: 0,
    },
    {
        id: 30,
        type: EHeroType.HERO,
        embattleedSite: 2,
    },
    {
        id: 25,
        type: EHeroType.HERO,
        embattleedSite: 3,
    },
    {
        id: 26,
        type: EHeroType.HERO,
        embattleedSite: 4,
    },
    {
        id: 33,
        type: EHeroType.HERO,
        embattleedSite: 5,
    },
]

let EnemyTestInfo = [
    {
        id: 40,
        type: EHeroType.MONSTER,
        embattleedSite: 0,
    },
    {
        id: 44,
        type: EHeroType.MONSTER,
        embattleedSite: 1,
    },
    {
        id: 45,
        type: EHeroType.MONSTER,
        embattleedSite: 2,
    },
    {
        id: 41,
        type: EHeroType.MONSTER,
        embattleedSite: 3,

    },
    {
        id: 42,
        type: EHeroType.MONSTER,
        embattleedSite: 4,

    },
    {
        id: 46,
        type: EHeroType.MONSTER,
        embattleedSite: 5,
    },
]

for (let k in HeroModelPrefabPath) {
    HeroModelPrefabPath[k] = "prefabs/hero/" + HeroModelPrefabPath[k];
}

for (let k in SkillPrefabPath) {
    SkillPrefabPath[k] = "prefabs/battle/skill/" + SkillPrefabPath[k];
}

for (let k in HeroTestInfo) {
    HeroTestInfo[k].prefab = "prefabs/hero/" + HeroTestInfo[k].prefab;
}

for (let k in MonsterTestInfo) {
    MonsterTestInfo[k].prefab = "prefabs/hero/" + MonsterTestInfo[k].prefab;
}


const type_map: {[key: string]: string} = {
    '[object Boolean]'  : 'boolean',
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]'     : 'null',
    '[object Object]'   : 'object'
};
/*
    * 描述：返回obj对象的字符串类型
    * 参数：任意数据格式
*/
function getType(obj: any) {
    return type_map[Object.prototype.toString.call(obj)];
}

/*
    * 描述：数组和字典数据的深拷贝
*/
function deepClone(data: any) {
    let type = getType(data);
    let obj: any;
    if (type === 'array') {
        obj = [];
    } else if (type === 'object') {
        obj = {};
    } else {
        return data;
    }

    if (type === 'array') {
        for (let i = 0, len = data.length; i < len; i++) {
            let tmpData = data === data[i] ? data : deepClone(data[i])
            obj.push(tmpData)
        }
    } else if (type === 'object') {
        for (let key in data) {
            obj[key] = data === data[key] ? data : deepClone(data[key])
        }
    }
    return obj;
}


export class BattleTest {

    public static isInit: boolean = false

    public static loadResList: any = []

    public static mapInfo: any = {}
    public static armyFormation: Map<number, HeroData> = new Map<number, TestHeroData>();
    public static enemyFormation: Map<number, HeroData> = new Map<number, TestHeroData>();

    public static buildMapInfo() {
        // TODO
        BattleTest.mapInfo.prefab = "prefabs/battle/map/battle_idle_ground_001";
        BattleTest.loadResList.push(BattleTest.mapInfo.prefab);
    }

    public static createHeroInfo(embattleedInfo: any) {
        if (embattleedInfo.type == EHeroType.LEADER || embattleedInfo.type == EHeroType.HERO) {
            embattleedInfo.heroInfo = deepClone(HeroTestInfo[embattleedInfo.id]);
            embattleedInfo.heroInfo.isRoleHero = embattleedInfo.type == EHeroType.LEADER;
        } else {
            embattleedInfo.heroInfo = deepClone(MonsterTestInfo[embattleedInfo.id]);
        }
        BattleTest.loadResList.push(embattleedInfo.heroInfo.prefab);
        embattleedInfo.heroInfo.type = embattleedInfo.type;
        embattleedInfo.heroInfo.embattleedSite = embattleedInfo.embattleedSite;
    }

    public static createTestHeroData(testCfg: any): TestHeroData{
        let heroData = new TestHeroData();
        heroData.setTestCfg(testCfg);
        return heroData;
    }

    public static buildArmy() {
        let armyInfo = deepClone(ArmyTestInfo);

        for (let i in armyInfo) {
            BattleTest.createHeroInfo(armyInfo[i]);
            BattleTest.armyFormation.set(armyInfo[i].embattleedSite, BattleTest.createTestHeroData(armyInfo[i].heroInfo));
        }
    }

    public static buildEnemyInfo() {
        let enemyInfo = deepClone(EnemyTestInfo);
        for (let i in enemyInfo) {
            BattleTest.createHeroInfo(enemyInfo[i]);
            BattleTest.enemyFormation.set(enemyInfo[i].embattleedSite, BattleTest.createTestHeroData(enemyInfo[i].heroInfo));
        }
    }

    public static getLoadResList() {
        return BattleTest.loadResList
    }

    public static getMapInfo() {
        return BattleTest.mapInfo;
    }

    public static getArmyFormation(): Map<number, HeroData> {
        return BattleTest.armyFormation;
    }

    public static getEnemyFormation() {
        return BattleTest.enemyFormation;
    }

    public static getSkillPrefabPath(skillID: number) {
        return SkillPrefabPath[skillID];
    }

    public static getHeroModelPrefabPath(path: string): string {
        let s = HeroModelPrefabPath[path];
        if (s) {
            return s;
        }
        
        return HeroModelPrefabPath["主角_1"];
    }

    public static buildTestBattle() {
        BattleTest.loadResList = [];
        BattleTest.buildMapInfo();
        BattleTest.buildArmy();
        BattleTest.buildEnemyInfo();


        // TODO
        BattleTest.loadResList.push("prefabs/battle/hero/battle_hero");
        BattleTest.loadResList.push("prefabs/battle/skill/skill_0001");

        BattleTest.isInit = true;
    }
}
