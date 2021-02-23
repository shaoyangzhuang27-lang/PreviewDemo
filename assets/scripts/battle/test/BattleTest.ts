import {resources, instantiate} from 'cc';

import {BattleHero} from "../BattleHero"


const type_map = {
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
function getType(obj)
{
    return type_map[Object.prototype.toString.call(obj)];
}

/*
    * 描述：数组和字典数据的深拷贝
*/
function deepClone(data)
{
    var type = getType(data);
    var obj;
    if(type === 'array')
    {
        obj = [];
    }
    else if(type === 'object')
    {
        obj = {};
    }
    else
    {
        return data;
    }

    if(type === 'array')
    {
        for(var i = 0, len = data.length; i < len; i++)
        {
            var tmpData = data===data[i] ? data : deepClone(data[i])
            obj.push(tmpData)
        }
    }
    else if(type === 'object')
    {
        for(var key in data)
        {
            obj[key] = data===data[key] ? data : deepClone(data[key])
        }
    }
    return obj;
}


export class BattleTest {
    public static heroTestInfo = {
        0: {
            prefab: "hero00",
            hp: 100,
            atk: 5,
            hitTime: 0.6,
            range: 3,
            speed: 1,
        },
        29: {
            prefab: "hero29",
            hp: 100,
            atk: 4,
            hitTime: 0.5,
            range: 3,
            speed: 1.3,
        },
        30: {
            prefab: "hero30",
            hp: 100,
            atk: 4,
            hitTime: 0.5,
            range: 3,
            speed: 1.3,
        },
        25: {
            prefab: "hero25",
            hp: 100,
            atk: 6,
            hitTime: 0.5,
            range: 6,
            speed: 1.3,
        },
        26: {
            prefab: "hero26",
            hp: 100,
            atk: 6,
            hitTime: 0.5,
            range: 6,
            speed: 1.3,
        },
        33: {
            prefab: "hero33",
            hp: 100,
            atk: 6,
            hitTime: 0.5,
            range: 6,
            speed: 1.3,
        },
    }

    
    public static monsterTestInfo = {
        40: {
            prefab: "hero40",
            hp: 30,
            atk: 2,
            hitTime: 0.5,
            range: 3,
            speed: 1.3,
        },
        44: {
            prefab: "hero44",
            hp: 50,
            atk: 2,
            hitTime: 0.5,
            range: 3,
            speed: 1.3,
        },
        45: {
            prefab: "hero45",
            hp: 40,
            atk: 2,
            hitTime: 0.5,
            range: 3,
            speed: 1.3,
        },
        41: {
            prefab: "hero41",
            hp: 20,
            atk: 3,
            hitTime: 0.5,
            range: 6,
            speed: 1.3,
        },
        42: {
            prefab: "hero42",
            hp: 15,
            atk: 3,
            hitTime: 0.5,
            range: 6,
            speed: 1.3,
        },
        46: {
            prefab: "hero46",
            hp: 50,
            atk: 3,
            hitTime: 0.5,
            range: 6,
            speed: 1.3,
        },
    }


    public static armyTestInfo =  [
        {
            id: 0,
            type: BattleHero.HeroType.LEADER,
            embattleedSite: 1,
        },
        {
            id: 29,
            type: BattleHero.HeroType.HERO,
            embattleedSite: 0,
        },
        {
            id: 30,
            type: BattleHero.HeroType.HERO,
            embattleedSite: 2,
        },
        {
            id: 25,
            type: BattleHero.HeroType.HERO,
            embattleedSite: 3,

        },
        {
            id: 26,
            type: BattleHero.HeroType.HERO,
            embattleedSite: 4,
        },
        {
            id: 33,
            type: BattleHero.HeroType.HERO,
            embattleedSite: 5,
        },
    ]

    public static enemyTestInfo = [
        {
            id: 40,
            type: BattleHero.HeroType.MONSTER,
            embattleedSite: 0,
        },
        {
            id: 44,
            type: BattleHero.HeroType.MONSTER,
            embattleedSite: 1,
        },
        {
            id: 45,
            type: BattleHero.HeroType.MONSTER,
            embattleedSite: 2,
        },
        {
            id: 41,
            type: BattleHero.HeroType.MONSTER,
            embattleedSite: 3,

        },
        {
            id: 42,
            type: BattleHero.HeroType.MONSTER,
            embattleedSite: 4,

        },
        {
            id: 46,
            type: BattleHero.HeroType.MONSTER,
            embattleedSite: 5,
        },
    ]

    public static isInit: boolean = false

    public static loadResList: any = []

    public static mapInfo: any = {}
    public static armyInfo: any = []
    public static enemyInfo: any = []

    public static buildMapInfo() {
        // TODO
        BattleTest.mapInfo.prefab = "prefabs/battle/pingtai01";
        BattleTest.loadResList.push(BattleTest.mapInfo.prefab);
    }

    public static createHeroInfo(embattleedInfo: any) {
        if (embattleedInfo.type == BattleHero.HeroType.LEADER || embattleedInfo.type == BattleHero.HeroType.HERO) {
            embattleedInfo.heroInfo = deepClone(BattleTest.heroTestInfo[embattleedInfo.id]);
        } else {
            embattleedInfo.heroInfo = deepClone(BattleTest.monsterTestInfo[embattleedInfo.id]);
        }
        embattleedInfo.heroInfo.prefab = "prefabs/hero/" + embattleedInfo.heroInfo.prefab
        BattleTest.loadResList.push(embattleedInfo.heroInfo.prefab);
        embattleedInfo.heroInfo.type = embattleedInfo.type;
        embattleedInfo.heroInfo.embattleedSite = embattleedInfo.embattleedSite;
    }

    public static buildArmyInfo() {
        let armyInfo = deepClone(BattleTest.armyTestInfo);
        for (let i in armyInfo) {
            BattleTest.createHeroInfo(armyInfo[i]);
        }

        BattleTest.armyInfo = armyInfo;
    }

    public static buildEnemyInfo() {
        let enemyInfo = deepClone(BattleTest.enemyTestInfo);
        for (let i in enemyInfo) {
            BattleTest.createHeroInfo(enemyInfo[i]);
        }

        BattleTest.enemyInfo = enemyInfo;
    }

    public static getLoadResList() {
        return BattleTest.loadResList
    }

    public static getMapInfo() {
        return BattleTest.mapInfo;
    }

    public static getArmyInfo() {
        return BattleTest.armyInfo;
    }

    public static getEnemyInfo() {
        return BattleTest.enemyInfo;
    }

    public static buildTestBattle() {
        BattleTest.loadResList = [];
        BattleTest.buildMapInfo();
        BattleTest.buildArmyInfo();
        BattleTest.buildEnemyInfo();

        BattleTest.isInit = true;
    }
}
