// import { GameModel } from "../GameModel";
import { HeroData } from "./HeroData";
import { XConsts } from "../const/XConsts";
import { BaseModel } from "./BaseModel";
import { TableName, ValueMgr } from "../ValueMgr";
import { instantiate } from "cc";

export class HeroPubModel extends BaseModel{
    

    private _nLineUpCounts : number = 0;


    private _stuLineUpInfos : XStruct.lineup_item_info.Record[] = [];
    // private _formationList:Map<number,Map<number,number>> = new Map<number,Map<number,number>>();//阵型数据 索引,英雄动态id和站位
    
    
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

    //英雄召唤卷轴
    public getHeroSummonScrollNum()
    {
        return this._gameModel.getPlayerModel().getPlayerInfo().heroicSummonScroll || 0;
    }

    //友情英雄召唤卷轴
    public getFriendSummonScrollNum()
    {
       return this._gameModel.getPlayerModel().getPlayerInfo().basicSummonScroll || 0;
    }

    //玩家身上钻石数量
    public getPlayerDiamondCounts()
    {
        return this._gameModel.getPlayerModel().getPlayerInfo().vrmb || 0;
    }
    
    public initRecLineUpInfos()
    {
        // interface lineup_item_info {
        //     title?: (string|null); 
        //     roleArmor?: (number|null);
        //     coreHeroName?: (string|null);
        //     heorIdList?:(number[]|null);
        //     analysisDetail?:(string|null);
        // }
        if(this._stuLineUpInfos.length > 0)
        {
            return 
        }

        var info : XStruct.lineup_item_info.Record = {
            title : "",
            roleArmor : 0,
            coreHeroName : "",
            heorIdList : [],
            analysisDetail : "",
        };
        var hero_rec_tab = ValueMgr.getInstance().getTableByName(TableName.hero_recommend).records
        this.nLineUpCounts = hero_rec_tab.length;
        console.log("hero_commend",hero_rec_tab.length);
        for (let index = 0; index < hero_rec_tab.length; index++) {
            // console.log("hero_rec_tab", index,hero_rec_tab[index]); 
             //阵容分析
            var lineUpAnalysisTable = ValueMgr.getInstance().getItemByField(TableName.language_data,hero_rec_tab[index].desc) as Config.language_data.Record;
            // console.log("lineUpAnalysisTable",lineUpAnalysisTable);
            info.analysisDetail = lineUpAnalysisTable.cn;
            //阵容标题
            var lineUpTitleTable = ValueMgr.getInstance().getItemByField(TableName.language_data,hero_rec_tab[index].title) as Config.language_data.Record;
            // console.log("lineUpTitleTable",lineUpTitleTable);
            info.title = lineUpTitleTable.cn;
            info.coreHeroName = ""
            //核心英雄
            for(var i=0; i < hero_rec_tab[index].coreHero.length; i++)
            {
                var heroInfoTable = ValueMgr.getInstance().getItemByField(TableName.heroes,hero_rec_tab[index].coreHero[i]) as Config.heroes.Record;
                var heroNameTable = ValueMgr.getInstance().getItemByField(TableName.language_data,heroInfoTable.name) as Config.language_data.Record;
                // console.log("heroNameTable",heroNameTable);
                info.coreHeroName =  info.coreHeroName + heroNameTable.cn + " ";
            }
            // for(var i =0; i < hero_rec_tab[index].otherHero.length;i++)
            // {
            //     var heroInfoTable = ValueMgr.getInstance().getItemByField(TableName.heroes,hero_rec_tab[index].otherHero[i]) as Config.heroes.Record;
            //     var heroNameTable = ValueMgr.getInstance().getItemByField(TableName.language_data,heroInfoTable.name) as Config.language_data.Record;
            //     // info.coreHeroName = info.coreHeroName + heroNameTable.cn + " ";
            // }
            info.heorIdList = hero_rec_tab[index].coreHero.concat(hero_rec_tab[index].otherHero);
            info.roleArmor = hero_rec_tab[index].roleArmor;

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

    
}