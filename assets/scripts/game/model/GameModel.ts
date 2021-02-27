import { HeroData } from "./HeroData";
import { TableName, ValueMgr } from "./ValueMgr";
import { XConsts } from "./XConsts";
import { XMsgExt } from "./XMsgExt";

export class GameModel{
    private static _instance: GameModel = new GameModel();
    public static getInstance() {
        return this._instance;
    }
    
    private _heroList:Map<number,HeroData> = new Map<number,HeroData>();
    private _playerInfo:Msg.PlayerInfo = new Msg.PlayerInfo();
    private _gameConf:Msg.GameConfig = new Msg.GameConfig();
    private _formationList:Map<number,Map<number,number>> = new Map<number,Map<number,number>>();//阵型数据 索引,英雄动态id和站位
    private _heroBookMap:Map<number, Msg.HeroBookUnit> = new Map<number, Msg.HeroBookUnit>();//图鉴
    private _roleHero:HeroData = null as unknown as HeroData;

    // public initHeroList(hl:Map<number,Msg.HeroInfo>){
    //     hl.forEach((value, key) => {
    //         let hero = new HeroData();
    //         hero.initDataByHero(value,this);
    //         this._heroList.set(key,hero);
    //     })
    // }
    
    public InitHeroList(msg:Msg.GetHeroListA) {
        msg.heroList.forEach((heroInfo)=>{

            if(ValueMgr.getInstance().getItemByField(TableName.heroes,heroInfo.staticID as number)){
                let hero = new HeroData();
                hero.initDataByHero(heroInfo as Msg.HeroInfo,this);
                this._heroList.set(heroInfo.id as number,hero);
            }
        })
        
        for(let key in msg.heroBookInfo){
            let value = msg.heroBookInfo[key];
            this._heroBookMap.set(Number(key),value as Msg.HeroBookUnit);
        }
        this.RefreshHeroBookProperty(); //收到消息后刷新
    }
    
    protected _currentFormationIndex = 0; //当前战斗使用的阵型索引
    public InitPlayerBag(msg:Msg.GetPlayerDataA) {

        this._formationList.clear();
        // for(let key in msg.formationMap){
        //     let value = msg.formationMap[key];
        //     let fi = new Map<number, number> ();
        //     for(let k1 in value.formation){
        //         let v1 = value.formation[k1];
                
        //         //根据英雄ID,判断本地是否存在。不存在就不加到阵容中，防止报错卡住
        //         if (!(Number(k1) != XConsts.KRoleHeroID && !this._heroList.has(Number(key)))){
        //             fi.set(Number(k1), v1);
        //         }
        //     }
        //     this._formationList.set(Number(key), fi);
        // }
        for(let key in msg.formationMap){
            let value = msg.formationMap[key];
            let fi = new Map<number, number> ();
            for(let k1 in value.formation){
                let v1 = value.formation[k1];
                //根据英雄ID,判断本地是否存在。不存在就不加到阵容中，防止报错卡住
                fi.set(Number(k1), v1);
            }
            this._formationList.set(Number(key), fi);
        }

        //初始化当前阵容为挂机阵容
        this._currentFormationIndex = this._playerInfo.idleFormation;
        //本地创建一个用于试炼的阵容
        this._formationList.set(XConsts.KTrailFormationIndex, new Map<number, number>());
    }
    
    //当前阵容
    public getCurrentFormation():Map<number, HeroData> {
        return this.getFormationByIndex(this._currentFormationIndex)
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
                formation.set(value,this._roleHero)
            }else{
                formation.set(value,this._heroList.get(key) as HeroData)
            }
        })
        return formation
    }
    
    private _heroBookLevel = 0;
    private _heroBookPoint = 0;
    public RefreshHeroBookProperty() { //刷新英雄图鉴提供的属性
        if (this._heroBookPropertyByHero == null)
        this._heroBookPropertyByHero = new Map<Msg.THeroPropertyType, number>();
        this._heroBookPropertyByHero.clear();
        if (this._heroBookPropertyByBook == null)
        this._heroBookPropertyByBook = new Map<Msg.THeroPropertyType, number>();
        this._heroBookPropertyByBook.clear();
        this._heroBookLevel = 0;
        this._heroBookPoint = 0;
        //图鉴中每个英雄提供的属性
        this._heroBookMap.forEach((value,key)=> {
            this._heroBookPoint += value.level;
            var record = ValueMgr.getInstance().getItemByField(TableName.book_hero_property,XMsgExt.GetHeroPropertyStaticID(value)) as Config.book_hero_property.Record;
            if (record){
                for (let i = 0; i < record.proType.length; i++) {
                    let propertyType = record.proType[i] as Msg.THeroPropertyType;
                    let proNum = record.proNum[i];
                    if (this._heroBookPropertyByHero.has(propertyType))
                        this._heroBookPropertyByHero.set(propertyType,this._heroBookPropertyByHero.get(propertyType) as number + proNum);
                    else
                        this._heroBookPropertyByHero.set(propertyType, proNum);
                }
            }
        })
        //图鉴等级提供的总属性
        let btp = ValueMgr.getInstance().getTableByName(TableName.book_total_property) as Config.book_total_property;
        btp.records.forEach((record)=>{
            if (record.reqPoint && record.reqPoint <= this._heroBookPoint){
                if (record.id && record.id > this._heroBookLevel)
                this._heroBookLevel = record.id;
            }
        })
        

        var recordTotal = ValueMgr.getInstance().getItemByField(TableName.book_total_property,this._heroBookLevel) as Config.book_total_property.Record;
        if (recordTotal) {
            for (let i = 0; i < recordTotal.heroProType.length; i++) {
                let propertyType = recordTotal.heroProType[i] as Msg.THeroPropertyType;
                let proNum = recordTotal.heroProNum[i];
                if (this._heroBookPropertyByBook.has (propertyType))
                    this._heroBookPropertyByBook.set(propertyType, this._heroBookPropertyByBook.get(propertyType) as number+ proNum / 100.0);
                else
                    this._heroBookPropertyByBook.set(propertyType, proNum / 100.0);
            }
        }
    }

    public getHeroList(){
        return this._heroList;
    }
    public getRoleHero(){
        return this._roleHero
    }
    public getFormationList(){
        return this._formationList
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

    //英雄图鉴
    private _heroBookPropertyByHero:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>(); //图鉴单英雄提供的属性
    public GetHeroBookPropertyByHero(proType:Msg.THeroPropertyType) {
        if (this._heroBookPropertyByHero.has(proType)) {
            return this._heroBookPropertyByHero.get(proType) as number;
        }
        return 0;
    }
    
    //图鉴等级提供的属性
    private _heroBookPropertyByBook:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>(); 
    public GetHeroBookPropertyByBook(proType:Msg.THeroPropertyType) {
        if (this._heroBookPropertyByBook.has(proType))
            return this._heroBookPropertyByBook.get(proType) as number;
        return 0;
    }

    //头衔提供的属性
    private _titleProperty:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>(); 
    public GetTitleProperty(proType:Msg.THeroPropertyType) {
        if (this._titleProperty.has(proType))
            return this._titleProperty.get(proType) as number;
        return 0;
    }

    //技术提供的属性
    private _technologyProperty:Map<Msg.TClassesType, Map<Msg.THeroPropertyType, number>> = new Map<Msg.TClassesType, Map<Msg.THeroPropertyType, number>>();
    public GetTechnologyProperty(classes:Msg.TClassesType, proType:Msg.THeroPropertyType) {
        if (this._technologyProperty.has(classes) && this._technologyProperty.get(classes)?.has(proType)) {
            return this._technologyProperty.get(classes)?.get(proType) as number;
        }
        return 0;
    }
    
    //光环
    private _auraProperty:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>();
    public GetAuraProperty(proType:Msg.THeroPropertyType) {
        if (this._auraProperty.has(proType)) {
            return this._auraProperty.get(proType) as number;
        }
        return 0;
    }
    
    //盔甲id
    public GetArmorID() {
        return this._playerInfo.armorID;
    }
    //盔甲等级
    public GetArmorLevel() {
        return this._playerInfo.armorLevel;
    }

}