import { GameModel } from "../GameModel";
import { HeroData } from "./HeroData";
import { TableName, ValueMgr } from "../ValueMgr";
import { XMsgExt } from "../const/XMsgExt";
import { BaseModel } from "./BaseModel";
import { NotifyMgr } from '../../control/NotifyMgr';

export class HeroesModel extends BaseModel{

    
    private _heroList:Map<number,HeroData> = new Map<number,HeroData>();
    private _heroBookMap:Map<number, Msg.HeroBookUnit> = new Map<number, Msg.HeroBookUnit>();//图鉴

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

    //根据阵营获取当前英雄
    public getHeroListByCampType(_campType:number)
    {
        let _campHeroList:Map<number,HeroData> = new Map<number,HeroData>();
        this._heroList.forEach((heroInfo)=>{
            if(ValueMgr.getInstance().getItemByField(TableName.heroes, heroInfo.getStaticID() as number) && heroInfo.getCamp() == _campType){
                _campHeroList.set(heroInfo.getDyncID() as number, heroInfo);
            }
        });
        return _campHeroList;
    }

    //根据id获取英雄信息
    public getHeroInfoByDyncID(dyncID:number) : HeroData | null
    {
        if(this._heroList && this._heroList.has(dyncID))
        {
            return this._heroList.get(dyncID) as HeroData;
        }
        return null;
    }

    /**
     * 升星之后 改变英雄数据
     * @param id 
     */
    public resetHeroStarUpInfo(msg:Msg.HeroStarUpA) {
        let dyncHeroID = msg.heroID;
        let newStar = msg.newStar;
        let advanceExpConsume = msg.advanceExpConsume;
        let materialHeroIDList = msg.materialHeroIDList;
        let upgradePoint = msg.upgradePoint;
        let equipList = msg.equipList;
        let advanceExp = msg.advanceExp;
        let magicDust = msg.magicDust;
        let money = msg.money;

        if(this._heroList.has(dyncHeroID))
        {
            let oldHeroData = this._heroList.get(dyncHeroID) as HeroData;
            let newHeroData = new HeroData();
            let heroInfo  = new Msg.HeroInfo();
            heroInfo.id = dyncHeroID;
            heroInfo.staticID = oldHeroData.getStaticID() + 10000;
            heroInfo.level = oldHeroData.getLevel();
            //heroInfo.isLocked = 
            let newEquipOnList: number[]= [];
            for(let key in equipList){
                newEquipOnList.push(Number(key));
            }
            heroInfo.equipOnList = newEquipOnList;
            //heroInfo.crystal = 
            heroInfo.tier = 0;

            let hero = new HeroData();
            hero.initDataByHero(heroInfo as Msg.HeroInfo, this._gameModel);
            this._heroList.delete(dyncHeroID);
            this._heroList.set(heroInfo.id as number,hero);

            for(let key in materialHeroIDList){
                let value = materialHeroIDList[key];
                this._heroList.delete(value);
            }
            //抛出通知  升星发生变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_net_starUp_change);
        }
    }
    
    /////////////////////////////////////////////////////
    //////////////////////图鉴相关///////////////////////
    /////////////////////////////////////////////////////
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

    //根据阵营获取当前图鉴英雄列表
    public getBooKHeroListByCampType(_campType:number)
    {
        let _campHeroList:Map<number, Msg.HeroBookUnit> = new Map<number, Msg.HeroBookUnit>();//图鉴
        this._heroBookMap.forEach((heroInfo)=>{
            var _hero = ValueMgr.getInstance().getItemByField(TableName.heroes, heroInfo.heroBookId as number) as Config.heroes.Record;
            if(_hero && _hero.camp == _campType){
                _campHeroList.set(heroInfo.heroBookId as number, heroInfo);
            }
        });
        return _campHeroList;
    }

    //根据静态id获取图鉴英雄
    public getBookHeroDataByStaticID(staticId:number):Msg.HeroBookUnit
    {
        let tempBookId = HeroData.GetHeroBookID(staticId);
        let tempBookHero:Msg.HeroBookUnit = new Msg.HeroBookUnit();
        if(this._heroBookMap.has(tempBookId))
        {
            tempBookHero = this._heroBookMap.get(tempBookId) as Msg.HeroBookUnit;
        }
        // this._heroBookMap.forEach((heroInfo)=>{
        //     var _hero = ValueMgr.getInstance().getItemByField(TableName.heroes, heroInfo.heroBookId as number) as Config.heroes.Record;
        //     if(heroInfo && heroInfo.heroBookId == tempBookId){
        //         tempBookHero = heroInfo;      
        //         return;          
        //     }
        // });
        return tempBookHero;
    }


    // 设置英雄锁定状态
    public setHeroLocked(msg: Msg.SyncHeroLocked) {
        //根据id获取英雄信息
        let heroData = this.getHeroInfoByDyncID(msg.heroID); //HeroData
        if(heroData)
        {   
            heroData.isLocked= msg.isLocked;
            //抛出通知 英雄锁定状态 变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_net_hero_locked, msg);
        }        
    }
}