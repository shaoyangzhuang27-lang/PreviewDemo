import { GameModel } from "../GameModel";
import { HeroData } from "../HeroData";
import { XConsts } from "../XConsts";

export class FormationModel{
    
    private _formationList:Map<number,Map<number,number>> = new Map<number,Map<number,number>>();//阵型数据 索引,英雄动态id和站位
    private _gameModel:GameModel = null as unknown as GameModel;
    
    constructor(gameModel:GameModel){
        this._gameModel = gameModel;
    }
    
    protected _currentFormationIndex = 0; //当前战斗使用的阵型索引
    public initFormationList(msg:Msg.GetPlayerDataA) {
        this._formationList.clear();
        
        for(let key in msg.formationMap){
            let value = msg.formationMap[key];
            let fi = new Map<number, number> ();
            for(let k1 in value.formation){
                let v1 = value.formation[k1];
                fi.set(Number(k1), v1);
            }
            this._formationList.set(Number(key), fi);
        }
        
        this._currentFormationIndex = this._gameModel.getPlayerModel().getPlayerInfo().idleFormation
        //本地创建一个用于试炼的阵容
        this._formationList.set(XConsts.KTrailFormationIndex, new Map<number, number>());
    }
    public getCurFormationIndex(){
        return this._currentFormationIndex
    }

    
    //当前阵容
    public getCurrentFormation():Map<number, HeroData> {
        return this.getFormationByIndex(this.getCurFormationIndex())
    }

    //根据阵容索引获取阵容
    //挂机及主线副本索引为1~5
    //PVP阵容:XConsts.KPVPFormationIndex
    //试炼阵容:XConsts.KTrailFormationIndex
    //秘境阵容:XConsts.KMythicalFormationIndex
    //XConsts.KLadderFormationIndex
    public getFormationByIndex(index:number):Map<number, HeroData>{
        let curFormationData = this._formationList.get(index);
        let formation = new Map<number,HeroData>();
        curFormationData?.forEach((value,key)=>{
            if(key == 0){
                formation.set(value,this._gameModel.getPlayerModel().getRoleHero())
            }else if(this._gameModel.getHeroesModel().getHeroList().has(key)){
                formation.set(value,this._gameModel.getHeroesModel().getHeroList().get(key) as HeroData)
            }
        })
        return formation
    }
}