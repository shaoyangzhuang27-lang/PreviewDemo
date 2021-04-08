import { Color } from "cc";
import { HeroData } from './HeroData';
import { BaseModel } from "./BaseModel";
import { XConsts } from "../const/XConsts";

export class HeroReplaceModel extends BaseModel {

    // 排序 品级 > 等级 > 星级 > 阵营 > 职业
    public sortHeroData() : Map<Number, HeroData> {
        let heroSortDatasMap: Map<Number, HeroData> = new Map<Number, HeroData>();        
        let heroDataArr: Array<[number,number,HeroData]> = new Array<[number,number,HeroData]>();

        let heroDatasMap:Map<number,HeroData> = this._gameModel.getHeroList();
        heroDatasMap.forEach((heroData,key, m)=>{
            let star: number = heroData.getStar()
            let level: number = heroData.getLevel()
            let campType: number = heroData.getCamp()
            let classesType: number = heroData.getClasses()
            let isOrgGrade: boolean = heroData.isOrangeQuality()
            let grade: number = isOrgGrade ? Msg.TQualityType.EQuality_Orange : Msg.TQualityType.EQuality_Purple
            
            // 品级 > 等级 > 星级 > 阵营 > 职业
            let sortIndex_1:number = grade*100000 + level*1000 + star*100 + campType*10 + classesType;
            let sortIndex_2:number = 3000000 - sortIndex_1;
            heroDataArr.push([sortIndex_2, key, heroData])
        });

        heroDataArr.sort((n1,n2) => n1[0] - n2[0])
        heroDataArr.forEach((value, key)=>{
            heroSortDatasMap.set(value[1],value[2]);
        })

        return heroSortDatasMap;
    }

    
    /**
     * 置换后改变英雄数据
     * @param id 
     */
    public changeHeroData(data: any, selectHero: HeroData) : HeroData {
        let newHeroStaticID = data.exchangeInfo.newHeroStaticID;    
        let heroInfo  = new Msg.HeroInfo();
        heroInfo.id = selectHero.getDyncID();
        heroInfo.staticID = newHeroStaticID;
        heroInfo.level = selectHero.getLevel();
        heroInfo.isLocked = selectHero.isLocked;
        heroInfo.tier = selectHero.tier;

        let hero = new HeroData();
        hero.initDataByHero(heroInfo as Msg.HeroInfo, this._gameModel);
        hero.calcTalentSkillProperty()
        return hero
    }

    /**
     * 置换成功后改变英雄数据
     * @param id 
     */
    public updateHeroCoverInfo(data: any) : void {
        let heroID = data.exchangeInfo.heroID;
        let newHeroStaticID = data.exchangeInfo.newHeroStaticID;     

        let heroList = this._gameModel.getHeroList()
        if(heroList.has(heroID))
        {
            let herodata = heroList.get(heroID) as HeroData;
            let heroInfo  = new Msg.HeroInfo();
            heroInfo.id = heroID;
            heroInfo.staticID = newHeroStaticID;
            heroInfo.level = herodata.getLevel();
            heroInfo.isLocked = herodata.isLocked;
            heroInfo.tier = herodata.tier;

            let hero = new HeroData();
            hero.initDataByHero(heroInfo as Msg.HeroInfo, this._gameModel);
            hero.calcTalentSkillProperty()
            heroList.delete(heroID);
            heroList.set(heroInfo.id as number,hero);
        }
    }

    // 置换成功后添加图鉴
    public addHeroBook(staticId: number) : void {
        let bookId = HeroData.GetHeroBookID(staticId)
        let star = HeroData.GetHeroStar (staticId);
        let bookList = this._gameModel.getBookMap()

        if(bookList.has(bookId)) {
            let bookItem = bookList.get(bookId) as Msg.HeroBookUnit 
            if (bookItem.curTopStar < star) {
                bookItem.curTopStar = star
            }
        }
        else {
            var heroBookUnit = new Msg.HeroBookUnit()
            heroBookUnit.heroBookId = bookId,
            heroBookUnit.isGetAward = false,
            heroBookUnit.curTopStar = star,
            heroBookUnit.level = 0
            bookList.set (bookId, heroBookUnit);
        }
    }

    //获取影响名字颜色
    public getHeorNameFontColor(data: HeroData) : Color {
        return data?.isOrangeQuality() 
            ? XConsts.KQualityColor[5] : XConsts.KQualityColor[4];
    }

    //英雄是否超过5星
    public isHeroStarOverFive(data: HeroData) : boolean {
        return data?.getStar() > 5;
    }
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
