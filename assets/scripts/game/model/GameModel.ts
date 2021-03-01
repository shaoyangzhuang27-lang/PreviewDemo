import { FormationModel } from "./datas/FormationModel";
import { HeroData } from "./datas/HeroData";
import { HeroesModel } from "./datas/HeroesModel";
import { PlayerModel } from "./datas/PlayerModel";
import { TechnologyModel } from "./datas/TechnologyModel";
import { TableName, ValueMgr } from "./ValueMgr";

export class GameModel{
    private static _instance: GameModel = new GameModel();
    public static getInstance() {
        return this._instance;
    }
    

    private _heroesModel:HeroesModel = new HeroesModel(this);
    private _technologyModel:TechnologyModel = new TechnologyModel(this);
    private _playerModel:PlayerModel =  new PlayerModel(this);
    private _formationModel:FormationModel = new FormationModel(this);

    public getHeroesModel(){
        return this._heroesModel;
    }
    public getTechnologyModel(){
        return this._technologyModel;
    }
    public getPlayerModel(){
        return this._playerModel;
    }
    public geFormationModel(){
        return this._formationModel;
    }
    
    public initHeroList(msg:Msg.GetHeroListA) {
        this._heroesModel.initHeroList(msg);
    }

    public initPlayerData(msg:Msg.PlayerLoginA) {
        this._playerModel.initPlayerData(msg);
    }
    
    public initPlayerBag(msg:Msg.GetPlayerDataA) {
        this._formationModel.initFormationList(msg);
    }
    
    //将弃用-----------------
    //当前阵容
    public getCurrentFormation():Map<number, HeroData> {
        return this._formationModel.getCurrentFormation();
    }
    public getFormationByIndex(index:number):Map<number, HeroData>{
        return this._formationModel.getFormationByIndex(index);
    }
    

    public getHeroList(){
        return this._heroesModel.getHeroList();
    }
    public getBookMap(){
        return this._heroesModel.getBookMap();
    }
    public getRoleHero(){
        return this._playerModel.getRoleHero();
    }
    //将弃用-----------------
    

    //---------------------herodata 里需要使用到的方法--------------------------------------------

    public getHeroBookPropertyByHero(proType:Msg.THeroPropertyType) {
        return this._heroesModel.retHeroBookPropertyByHero(proType);
    }
    
    public getHeroBookPropertyByBook(proType:Msg.THeroPropertyType) {
        return this._heroesModel.retHeroBookPropertyByBook(proType);
    }

    //头衔提供的属性
    private _titleProperty:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>(); 
    public getTitleProperty(proType:Msg.THeroPropertyType) {
        if (this._titleProperty.has(proType))
            return this._titleProperty.get(proType) as number;
        return 0;
    }
    
    //光环
    private _auraProperty:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>();
    public getAuraProperty(proType:Msg.THeroPropertyType) {
        if (this._auraProperty.has(proType)) {
            return this._auraProperty.get(proType) as number;
        }
        return 0;
    }
    
    //盔甲id
    public getArmorID() {
        return this._playerModel.getPlayerInfo().armorID;
    }
    //盔甲等级
    public getArmorLevel() {
        return this._playerModel.getPlayerInfo().armorLevel;
    }
    public getTechnologyProperty(classes:Msg.TClassesType, proType:Msg.THeroPropertyType) {
        return this._technologyModel.GetTechnologyProperty(classes,proType);
    }

}