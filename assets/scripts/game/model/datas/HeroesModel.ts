import { GameModel } from "../GameModel";
import { HeroData } from "./HeroData";
import { TableName, ValueMgr } from "../ValueMgr";
import { XMsgExt } from "../const/XMsgExt";

export class HeroesModel{

    
    private _heroList:Map<number,HeroData> = new Map<number,HeroData>();
    private _heroBookMap:Map<number, Msg.HeroBookUnit> = new Map<number, Msg.HeroBookUnit>();//图鉴
    private _gameModel:GameModel = null as unknown as GameModel;

    constructor(gameModel:GameModel){
        this._gameModel = gameModel;
    }
    public getHeroList(){
        return this._heroList;
    }
    
    public getBookMap(){
        return this._heroBookMap
    }

    public initHeroList(msg:Msg.GetHeroListA) {
        msg.heroList.forEach((heroInfo)=>{

            if(ValueMgr.getInstance().getItemByField(TableName.heroes,heroInfo.staticID as number)){
                let hero = new HeroData();
                hero.initDataByHero(heroInfo as Msg.HeroInfo, this._gameModel);
                this._heroList.set(heroInfo.id as number,hero);
            }
        })
         
        for(let key in msg.heroBookInfo){
            let value = msg.heroBookInfo[key];
            this._heroBookMap.set(Number(key),value as Msg.HeroBookUnit);
        }
        this.refreshHeroBookProperty(); //收到消息后刷新
    }

    
    
    private _heroBookLevel = 0;
    private _heroBookPoint = 0;
    private refreshHeroBookProperty() { //刷新英雄图鉴提供的属性
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
            var record = ValueMgr.getInstance().getItemByField(TableName.book_hero_property, XMsgExt.GetHeroPropertyStaticID(value)) as Config.book_hero_property.Record;
            if (record){
                for (let i = 0; i < record.proType.length; i++) {
                    let propertyType = record.proType[i] as Msg.THeroPropertyType;
                    let proNum = record.proNum[i];
                    if (this._heroBookPropertyByHero.has(propertyType))
                        this._heroBookPropertyByHero.set(propertyType, this._heroBookPropertyByHero.get(propertyType) as number + proNum);
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
        

        var recordTotal = ValueMgr.getInstance().getItemByField(TableName.book_total_property, this._heroBookLevel) as Config.book_total_property.Record;
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
    
    
    //英雄图鉴
    private _heroBookPropertyByHero:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>(); //图鉴单英雄提供的属性
    public retHeroBookPropertyByHero(proType:Msg.THeroPropertyType) {
        if (this._heroBookPropertyByHero.has(proType)) {
            return this._heroBookPropertyByHero.get(proType) as number;
        }
        return 0;
    }
    
    //图鉴等级提供的属性
    private _heroBookPropertyByBook:Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>(); 
    public retHeroBookPropertyByBook(proType:Msg.THeroPropertyType) {
        if (this._heroBookPropertyByBook.has(proType))
            return this._heroBookPropertyByBook.get(proType) as number;
        return 0;
    }
    
}