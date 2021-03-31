// import { GameModel } from "../GameModel";
import { HeroData } from "./HeroData";
import { XConsts } from "../const/XConsts";
import { BaseModel } from "./BaseModel";
import { TableName, ValueMgr } from "../ValueMgr";
import { instantiate, Prefab } from "cc";

export class HeroPubModel extends BaseModel{
    

    private _nLineUpCounts : number = 0;


    //推荐阵容信息
    private _stuLineUpInfos : XStruct.lineup_item_info.Record[] = [];
    // private _formationList:Map<number,Map<number,number>> = new Map<number,Map<number,number>>();//阵型数据 索引,英雄动态id和站位
    


    private _strPubUILabContents : Map<number|string,string> = new Map();

    private _heroIdArray : Array<Array<number>> = [];


    public initPubUILabContents()
    {
        if(this._strPubUILabContents.size !=0)
        {
            return ;
        }
        this._strPubUILabContents.set("lab_title",ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_HEROSUMMON));
        this._strPubUILabContents.set("lab_recteam",ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_CAMPRECOMMEND));
        this._strPubUILabContents.set("lab_detail",ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_NEWSUMMONHEROLOTTO));
        this._strPubUILabContents.set("lab_detail_dimaond",ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_NEWSUMMONJEWELCONSUMEO));
        this._strPubUILabContents.set("lab_bar_info",ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_NEWSUMMONRESIDUE));
        this._strPubUILabContents.set("lab_friend_info",ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_NEWSUMMONFRIENDCONTENT));
        this._strPubUILabContents.set("lab_summon_ad_friend",ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_FRIENDSUMMON));
        this._strPubUILabContents.set("lab_summon_ad_hero",ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_HEROICSUMMON));
    }
    
    public getPubUILabContentByUIName(name : string)
    {
        if(this._strPubUILabContents.size == 0)
        {
            return "";
        }
        else
        {
            var content = this._strPubUILabContents.get(name);
            if(content)
            {
                return content;
            }
            else
            {
                return "";
            }
        }
    }
    // protected _currentFormationIndex = 0; //当前战斗使用的阵型索引
    // public initFormationList(msg:Msg.GetPlayerDataA) {
    //     this._formationList.clear();
        
    //     for(let key in msg.formationMap){
    //         let value = msg.formationMap[key];
    //         let fi = new Map<number, number> ();
    //         for(let k1 in value.formation){
    //             let v1 = value.formation[k1];
    //             fi.set(Number(k1), v1);
    //         }
    //         this._formationList.set(Number(key), fi);
    //     }
        
    //     this._currentFormationIndex = this._gameModel.getPlayerModel().getPlayerInfo().idleFormation;
    //     //本地创建一个用于试炼的阵容
    //     this._formationList.set(XConsts.KTrailFormationIndex, new Map<number, number>());
    // }
    // public getCurFormationIndex(){
    //     return this._currentFormationIndex;
    // }

    
    // //当前阵容
    // public getCurrentFormation():Map<number, HeroData> {
    //     return this.getFormationByIndex(this.getCurFormationIndex());
    // }

    // //根据阵容索引获取阵容
    // //挂机及主线副本索引为1~5
    // //PVP阵容:XConsts.KPVPFormationIndex
    // //试炼阵容:XConsts.KTrailFormationIndex
    // //秘境阵容:XConsts.KMythicalFormationIndex
    // //XConsts.KLadderFormationIndex
    // public getFormationByIndex(index:number):Map<number, HeroData>{
    //     let curFormationData = this._formationList.get(index);
    //     let formation = new Map<number,HeroData>();
    //     curFormationData?.forEach((value,key)=>{
    //         if(key == 0){
    //             formation.set(value, this._gameModel.getPlayerModel().getRoleHero());
    //         }else if(this._gameModel.getHeroesModel().getHeroList().has(key)){
    //             formation.set(value, this._gameModel.getHeroesModel().getHeroList().get(key) as HeroData);
    //         }
    //     })
    //     return formation;
    // }

    //普通-英雄召唤卷轴
    public getBaseSummonScrollNum()
    {
        return this._gameModel.getPlayerModel().getPlayerInfo().heroicSummonScroll || 0;
    }


    //高级 -英雄高级召唤卷轴 80 级以上的高级酒馆
    public getHeroicSummonScrollNum()
    {
        // console.log("zzzzzzzzzzz",this._gameModel.getPlayerModel().getPlayerInfo());
        return this._gameModel.getPlayerModel().getPlayerInfo().WonderGem || 0;
    }
    //友情英雄召唤卷轴
    public getFriendSummonScrollNum()
    {
       return this._gameModel.getPlayerModel().getPlayerInfo().friendGift || 0;
    }

    //玩家身上钻石数量
    public getPlayerDiamondCounts()
    {
        return this._gameModel.getPlayerModel().getPlayerInfo().vrmb || 0;
    }
    

    //玩家英雄召唤积分
    public getPlayerSummonScore()
    {
        return this._gameModel.getPlayerModel().getPlayerInfo().summonScore || 0;
    }

    //玩家奇迹召唤次数
    public getPlayerWonderTimes()
    {
        
        return this._gameModel.getPlayerModel().getPlayerInfo().WonderTimes || 0;
    }


    //玩家心愿奇迹英雄
    public getPlayerWonderHero()
    {
        return this._gameModel.getPlayerModel().getPlayerInfo().WonderHero || XConsts.PUB_UI_WONDER_DEFAULT_HEARTHERO;
    }

    //玩家等级
    public getPlayerLevel()
    {
         
        return  80 ;//this._gameModel.getPlayerModel().getPlayerInfo().level || 0;
    } 

    //玩家1,2星英雄是否自动分解
    public getIsAutoDecompose()
    {
        return  1 ;//this._gameModel.getPlayerModel().getPlayerInfo().isAutoDecompose || 0;
    }

    public initRecLineUpInfos()
    {
        if(this._stuLineUpInfos.length > 0)
        {
            return 
        }

        var info : XStruct.lineup_item_info.Record = {
            title : "",
            coreHeroName : "",
            heorIdList : [],
            analysisDetail : "",
        };
        var hero_rec_tab = ValueMgr.getInstance().getTableByName(TableName.hero_recommend).records
        this.nLineUpCounts = hero_rec_tab.length;
        console.log("hero_commend",hero_rec_tab.length);
        for (let index = 0; index < hero_rec_tab.length; index++) {
             //阵容分析
            info.analysisDetail = ValueMgr.getInstance().getLanguageString(hero_rec_tab[index].desc);
            //阵容标题
            info.title = ValueMgr.getInstance().getLanguageString(hero_rec_tab[index].title);
            info.coreHeroName = ""
            //核心英雄
            for(var i=0; i < hero_rec_tab[index].coreHero.length; i++)
            {
                var heroInfoTable = ValueMgr.getInstance().getItemByField(TableName.heroes,hero_rec_tab[index].coreHero[i]) as Config.heroes.Record;
                info.coreHeroName =  info.coreHeroName + ValueMgr.getInstance().getLanguageString(heroInfoTable.name) + " ";
            }
            info.heorIdList = hero_rec_tab[index].coreHero.concat(hero_rec_tab[index].otherHero);

            this._stuLineUpInfos.push(instantiate(info));
        } 
    } 

    set nLineUpCounts(nCounts : number)
    {
        this._nLineUpCounts = nCounts;
    }

    get nLineUpCounts() : number{
        return this._nLineUpCounts;
    }

    public getRecLineUpItemInfoByIndex(index : number) : XStruct.lineup_item_info.Record
    {
        if(this._stuLineUpInfos[index])
        {
            return  this._stuLineUpInfos[index];
        }
        else
        {
            return  {
                title : "",
                coreHeroName : "",
                heorIdList : [],
                analysisDetail : "",
            };
        }
        
    }
    

    //奇迹召唤传奇英雄id列表
    public initWonderHeartHeroIdList()
    {
        if(this._heroIdArray.length > 0)
        {
            return 
        }
        for(var i =0 ; i < 6; i++)
        {
            this._heroIdArray.push([]);
        }
        var hero_rec_tab = ValueMgr.getInstance().getTableByName(TableName.heroes).records
        for (let index = 0; index < hero_rec_tab.length; index++) {
            if(Math.floor(hero_rec_tab[index].id / 10000) == 505 )
            {
                switch(hero_rec_tab[index].camp)
                {
                    case Msg.TCampType.ECampType_Water:
                        this._heroIdArray[Msg.TCampType.ECampType_Water].push(hero_rec_tab[index].id);
                        break;
                    case Msg.TCampType.ECampType_Fire:
                        this._heroIdArray[Msg.TCampType.ECampType_Fire].push(hero_rec_tab[index].id);
                        break;
                    case Msg.TCampType.ECampType_Wood:
                        this._heroIdArray[Msg.TCampType.ECampType_Wood].push(hero_rec_tab[index].id);
                        break;
                    case Msg.TCampType.ECampType_Light:
                        this._heroIdArray[Msg.TCampType.ECampType_Light].push(hero_rec_tab[index].id);
                        break;
                    case Msg.TCampType.ECampType_Dark:
                        this._heroIdArray[Msg.TCampType.ECampType_Dark].push(hero_rec_tab[index].id);
                        break;
                }
            }
        } 
        for(var i = 1; i < 6; i ++)
        {
            this._heroIdArray[0] = this._heroIdArray[0].concat(this._heroIdArray[i]);
        }
     } 


    public getWonderHeartHeroIdByCamp(nCamp : number)
    {
        return this._heroIdArray[nCamp] || [];
    }
}