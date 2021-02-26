import { HeroData } from "./HeroData";

export class GameModel{
    private static _instance: GameModel = new GameModel();
    public static getInstance() {
        return this._instance;
    }
    
    private _heroList:Map<number,HeroData> = new Map<number,HeroData>();
    private _playerInfo:Msg.PlayerInfo = new Msg.PlayerInfo();
    private _gameConf:Msg.GameConfig = new Msg.GameConfig();
    private _roleHero:HeroData = null as unknown as HeroData;

    public initHeroList(hl:Map<number,Msg.HeroInfo>){
        hl.forEach((value, key) => {
            let hero = new HeroData();
            hero.initDataByHero(value,this);
            this._heroList.set(key,hero);
        })
    }
    public getHeroList(){
        return this._heroList;
    }
    
    public initPlayerData(msg:Msg.PlayerLoginA) {
        this._playerInfo = msg.playerInfo as Msg.PlayerInfo;
        this._gameConf = msg.conf as Msg.GameConfig;
        this._roleHero = new HeroData();
        this._roleHero.initDataByKnight(this._playerInfo,this);
        //默认自动施放技能开启
        this._playerInfo.isAutoSkill = true;

        // _localLoginTimeStamp = (int) (DateTime.UtcNow - new DateTime (1970, 1, 1, 0, 0, 0, 0)).TotalSeconds;
        // Debug.LogFormat ("LocalTimestamp: {0}, ServerTimeStamp: {1}", _localLoginTimeStamp, _PlayerInfo.LoginTimeStamp);
        //Debug.Log(TimeZone.CurrentTimeZone.ToLocalTime(GetZeroTime(_PlayerInfo.LoginTimeStamp)));
        // Debug.Log ("GetDayFromCreate: " + GetDayFromCreate ());
    }

    
    private _heroBookPropertyByHero:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>(); //图鉴单英雄提供的属性
    public GetHeroBookPropertyByHero(proType:Msg.THeroPropertyType) {
        if (this._heroBookPropertyByHero.has(proType)) {
            return this._heroBookPropertyByHero.get(proType) as number;
        }
        return 0;
    }
    
    private _heroBookPropertyByBook:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>(); //图鉴等级提供的属性
    public GetHeroBookPropertyByBook(proType:Msg.THeroPropertyType) {
        if (this._heroBookPropertyByBook.has(proType))
            return this._heroBookPropertyByBook.get(proType) as number;
        return 0;
    }
    
    private _titleProperty:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>(); //头衔提供的属性
    public GetTitleProperty(proType:Msg.THeroPropertyType) {
        if (this._titleProperty.has(proType))
            return this._titleProperty.get(proType) as number;
        return 0;
    }
    
    private _technologyProperty:Map<Msg.TClassesType, Map<Msg.THeroPropertyType, number>> = new Map<Msg.TClassesType, Map<Msg.THeroPropertyType, number>>();
    public GetTechnologyProperty(classes:Msg.TClassesType, proType:Msg.THeroPropertyType) {
        if (this._technologyProperty.has(classes) && this._technologyProperty.get(classes)?.has(proType)) {
            return this._technologyProperty.get(classes)?.get(proType) as number;
        }
        return 0;
    }
    
    private _auraProperty:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>();
    public GetAuraProperty(proType:Msg.THeroPropertyType) {
        if (this._auraProperty.has(proType)) {
            return this._auraProperty.get(proType) as number;
        }
        return 0;
    }
    
    public GetArmorID () {
        return this._playerInfo.armorID;
    }
    public GetArmorLevel() {
        return this._playerInfo.armorLevel;
    }

}