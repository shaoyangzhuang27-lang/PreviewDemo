import { HeroData } from './HeroData';
import { BaseModel } from "./BaseModel";
import { GameModel } from "../GameModel";
import { XConsts } from "../const/XConsts";
import { NotifyMgr } from '../../control/NotifyMgr';

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
            let sortIndex_1:number = grade*10000 + level*1000 + star*100 + campType*10 + classesType;
            let sortIndex_2:number = 3000000 - sortIndex_1;
            heroDataArr.push([sortIndex_2, key, heroData])
        });

        heroDataArr.sort((n1,n2) => n1[0] - n2[0])
        heroDataArr.forEach((value, key)=>{
            heroSortDatasMap.set(value[1],value[2]);
        })

        return heroSortDatasMap;
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
