import { GameModel } from "../GameModel";
import { HeroData } from "./HeroData";
import { TableName, ValueMgr } from "../ValueMgr";
import { XMsgExt } from "../const/XMsgExt";
import { BaseModel } from "./BaseModel";
import { NotifyMgr } from '../../control/NotifyMgr';
import {XConsts} from "../const/XConsts";
import { XList } from "../const/XList";

export class HeroesModel extends BaseModel{

    
    private _heroList:Map<number,HeroData> = new Map<number,HeroData>();
    private _heroBookMap:Map<number, Msg.HeroBookUnit> = new Map<number, Msg.HeroBookUnit>();//图鉴
    private _sortedHeroList = new XList<HeroData> (); //已排序的英雄队列

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

        this._sortHeroList();
    }

    //排序英雄,英雄升级界面左右按钮用到
    private _sortHeroList(){
        this._sortedHeroList.Clear();  

        //优先加入当前阵容英雄
        let curFormationList:Map<number,HeroData> = GameModel.getInstance().getFormationModel().getCurrentFormation();   
        curFormationList.forEach((heroData,key, m)=>{
            console.log(" heroData=",heroData)
            console.log(" key=",key)
            console.log(" m=",m)
            this._sortedHeroList.Add(heroData);
        });

        //接着加入剩余所有已排序后的英雄
        let retHeroList= this.sortHeroList(this._heroList);
        retHeroList.forEach(element => {
            if( !this._sortedHeroList.Contains(element) )
                this._sortedHeroList.Add(element);
        });
    }

    /**
     * @description: 获取前一个英雄
     * @param {HeroData} curHero 当前英雄数据
     */    
    public getPrevHero (curHero:HeroData) {
        let i = this._sortedHeroList.IndexOf(curHero);
        if (i > 0)
            return this._sortedHeroList.Get(i-1);
        else
            return this._sortedHeroList.Get(this._sortedHeroList.Count - 1);
    }
    /**
     * @description: 获取后一个英雄
     * @param {HeroData} curHero 当前英雄数据
     */
    public getNextHero (curHero:HeroData) {
        let i = this._sortedHeroList.IndexOf(curHero);
        if (i < (this._sortedHeroList.Count - 1) )
            return this._sortedHeroList.Get(i+1);
        else
            return this._sortedHeroList.Get(0);
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

    /**
     * 排序英雄数据
     * @param heroDatas       排序数据
     * @param sortForward     正向排序从小到大 默认false等级高排前面
     */
    public sortHeroList(heroDatas : Map<number, HeroData>, sortForward : boolean = false){
        let sortList = new Array<[number, HeroData]>();
        heroDatas.forEach(heroInfo => {
            let sortIndex_1: number = heroInfo.getLevel() * 10000 + heroInfo.getStar() * 1000 + heroInfo.getCamp() * 10 + heroInfo.getClasses();
            let sortIndex_2: number = 3000000 - sortIndex_1;
            let sort = sortForward ? sortIndex_1 : sortIndex_2
            sortList.push([sort, heroInfo]);
        });
        sortList.sort((a, b) => a[0] - b[0])
        // 返回数组
        let retHeroList: HeroData[] = []
        sortList.forEach(element => {
            retHeroList.push(element[1])
        });

        return retHeroList
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

        let playerModel = GameModel.getInstance().getPlayerModel();
        //金币增加
        playerModel.addMoney(msg.money, Msg.TMoneyAddType.EMoneyAddType_HeroStarupReturn);

        if(this._heroList.has(dyncHeroID))
    {
            let oldHeroData = this._heroList.get(dyncHeroID) as HeroData;
            let heroInfo  = new Msg.HeroInfo();
            heroInfo.id = dyncHeroID;
            heroInfo.staticID = oldHeroData.getStaticID() + 10000;
            heroInfo.level = oldHeroData.getLevel();
            heroInfo.isLocked = oldHeroData.isLocked;
            let newEquipOnList: number[]= [];
            for(let key in equipList){
                newEquipOnList.push(Number(key));
            }
            heroInfo.equipOnList = newEquipOnList;
            //heroInfo.crystal = 
            heroInfo.tier = oldHeroData.tier;

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

    /**
     * 一键升星之后 改变英雄数据
     * @param id 
     */
    public resetOneKeyStarUpInfo(msg:Msg.HeroStarUpMultiA) {
        let heroNewStar = msg.heroNewStar;
        let advanceExpConsume = msg.advanceExpConsume;
        let materialHeroIDList = msg.materialHeroIDList;
        let upgradePoint = msg.upgradePoint;
        let equipList = msg.equipList;
        let advanceExp = msg.advanceExp;
        let magicDust = msg.magicDust;
        let money = msg.money;

        let playerModel = GameModel.getInstance().getPlayerModel();
        //金币增加
        playerModel.addMoney(msg.money, Msg.TMoneyAddType.EMoneyAddType_HeroStarupReturn);

        for (let key in heroNewStar){
            if(this._heroList.has(Number(key)))
        {
                let oldHeroData = this._heroList.get(Number(key)) as HeroData;
            let heroInfo  = new Msg.HeroInfo();
                heroInfo.id = Number(key);
                heroInfo.staticID = oldHeroData.getStaticID() + 10000;
                heroInfo.level = oldHeroData.getLevel();
                heroInfo.isLocked = oldHeroData.isLocked;
                let newEquipOnList: number[]= [];
                for(let key in equipList){
                    newEquipOnList.push(Number(key));
        }
                heroInfo.equipOnList = newEquipOnList;
                //heroInfo.crystal = 
                heroInfo.tier = oldHeroData.tier;

                let hero = new HeroData();
                hero.initDataByHero(heroInfo as Msg.HeroInfo, this._gameModel);
                this._heroList.delete(Number(key));
                this._heroList.set(heroInfo.id as number,hero);

                for(let key in materialHeroIDList){
                    let value = materialHeroIDList[key];
                    this._heroList.delete(value);
    }
            }
        }
        //抛出通知  一键升星升星发生变化
        NotifyMgr.getInstance().notify(NotifyMgr.event_net_OneKeyStarUp_change,[msg]);
    }

    /**
     * 重置之后 改变英雄数据
     * @param id 
     */
    public resetHeroResetInfo(msg:Msg.HeroResetA) {
        let dyncHeroID = msg.heroID;
        let money = msg.money;
        let upgradePoint = msg.upgradePoint;
        let advanceExp = msg.advanceExp;
        let magicDust = msg.magicDust;
        let equipList = msg.equipList;
        let vrmbConsume = msg.vrmbConsume;

        //扣除消耗
        let playerModel = GameModel.getInstance().getPlayerModel();
        if(vrmbConsume > 0){
            playerModel.subVrmb(msg.vrmbConsume, Msg.TVRmbSubType.EVRmbSubType_HeroReset);
        }
        //金币增加
        playerModel.addMoney(msg.money, Msg.TMoneyAddType.EMoneyAddType_HeroReset);
        //升级点 进阶点增加

        if(this._heroList.has(dyncHeroID))
        {
            let oldHeroData = this._heroList.get(dyncHeroID) as HeroData;
            let heroInfo  = new Msg.HeroInfo();
            heroInfo.id = dyncHeroID;
            heroInfo.staticID = oldHeroData.getStaticID();
            heroInfo.level = 1;
            heroInfo.isLocked = oldHeroData.isLocked;
            let newEquipOnList: number[]= [];
            for(let key in equipList){
                newEquipOnList.push(Number(key));
            }
            heroInfo.equipOnList = newEquipOnList;
            //heroInfo.crystal = 
            heroInfo.tier = 1;

            let hero = new HeroData();
            hero.initDataByHero(heroInfo as Msg.HeroInfo, this._gameModel);
            this._heroList.delete(dyncHeroID);
            this._heroList.set(heroInfo.id as number,hero);

            //抛出通知  重置发生变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_net_hero_reset_change,[msg]);
        }
    }
    
    /////////////////////////////////////////////////////
    //////////////////////图鉴相关///////////////////////
    /////////////////////////////////////////////////////
    private _heroBookLevel = 0;
    private _heroBookPoint = 0;
    public refreshHeroBookProperty() { //刷新英雄图鉴提供的属性
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

    //获取当前图鉴所有英雄等级
    public getCurHeroBookPoint()
    {
        return this._heroBookPoint;
    }

    //获取当前图鉴等级
    public getCurHeroBookLevel()
    {
        return this._heroBookLevel;
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
        let tempBookHero = this.getBookHeroDataByBookId(tempBookId);
        return tempBookHero;
    }

    //根据图鉴id获取图鉴英雄信息
    public getBookHeroDataByBookId(bookid:number)
    {
        let tempBookHero:Msg.HeroBookUnit = new Msg.HeroBookUnit();
        if(this._heroBookMap.has(bookid))
        {
            tempBookHero = this._heroBookMap.get(bookid) as Msg.HeroBookUnit;
        }
        return tempBookHero;
    }

    /**
     * @description: 英雄升阶
     * @param {Msg} msg
     */
    public setHeroTierUp(msg: Msg.HeroTierUpA){
        let heroData = this.getHeroInfoByDyncID(msg.heroID); 
        if(heroData)
        {   
            //抛出通知 英雄升阶 变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_net_hero_tier_up, msg);
        }  
    }
    /**
     * @description: 英雄升级
     * @param {Msg} msg
     */
    public setHeroLvUp(msg: Msg.HeroUpgradeA){
        let heroData = this.getHeroInfoByDyncID(msg.heroID); 
        if(heroData)
        {   
            //抛出通知 英雄升级 变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_net_hero_lv_up, msg);
        }  
    }

    /**
     * @description: 设置英雄锁定状态
     * @param {*}
     */    
    public setHeroLocked(msg: Msg.SyncHeroLocked) {
        //根据id获取英雄信息
        let heroData = this.getHeroInfoByDyncID(msg.heroID); 
        if(heroData)
        {   
            heroData.isLocked= msg.isLocked;
            //抛出通知 英雄锁定状态 变化
            NotifyMgr.getInstance().notify(NotifyMgr.event_net_hero_locked, msg);
        }        
    }
    
    /**
     * @description: 英雄穿上装备
     * @param {Msg} msg
     */
    public setHeroPutOnEquip(msg: Msg.PutOnEquipA) {
        //根据id获取英雄信息
        let heroData = this.getHeroInfoByDyncID(msg.heroID); 
        if(heroData)
        {   
            //抛出通知 英雄穿上装备 
            NotifyMgr.getInstance().notify(NotifyMgr.event_net_hero_put_on_equip, msg);
        }        
    }

    /**
     * @description: 英雄卸下装备
     * @param {Msg} msg
     */
    public setHeroTakeOffEquip(msg: Msg.TakeOffEquipA) {
        //根据id获取英雄信息
        let heroData = this.getHeroInfoByDyncID(msg.heroID); 
        if(heroData)
        {   
            //抛出通知 英雄卸下装备 
            NotifyMgr.getInstance().notify(NotifyMgr.event_net_hero_take_off_equip, msg);
        }        
    }

    //酒馆推荐阵容英雄信息
    public getHeroIconInfoByHeroId(id : number) : XStruct.hero_icon_info.Record{

        let info :  XStruct.hero_icon_info.Record = {
            camp : "",
            star : 0,
            level : 1,
            frame : "",
            icon : "",

        }
        var _hero = ValueMgr.getInstance().getItemByField(TableName.heroes, id) as Config.heroes.Record;
        info.camp = XConsts.KHeroCampIcon[_hero.camp];
        info.star = _hero.star;
        info.frame = XConsts.GetQualityBgByStar(_hero.star);
        info.icon = _hero.image;
        return info
    }


    public updateHeroListFromSummon(msgData: Array<Msg.IHeroInfo>)
    {
        msgData.forEach((heroInfo)=>{
                if(ValueMgr.getInstance().getItemByField(TableName.heroes,heroInfo.staticID as number)){
                    let hero = new HeroData();
                    hero.initDataByHero(heroInfo as Msg.HeroInfo, this._gameModel);
                    this._heroList.set(heroInfo.id as number,hero);
                }
            })
    }


    
    public getAutoDecomposeHeroDyncIDList(starCounts : number)
    {
        let dyncIDList:Array<number> = [];
        this._heroList.forEach((heroInfo)=>{
            if(ValueMgr.getInstance().getItemByField(TableName.heroes, heroInfo.getStaticID() as number) && heroInfo.getStar() < starCounts){
                dyncIDList.push(heroInfo.getDyncID() as number);
            }
        });
        return dyncIDList;
    }

    public removeHeroByHeroDyncID(dyncID : number)
    {
        this._heroList.delete(dyncID);
    }
}