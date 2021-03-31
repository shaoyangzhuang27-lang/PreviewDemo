/*
 * @Description: 英雄书院
 * @Author: 徐涛
 * @Date: 2021-03-30 19:49:03
 * @LastEditTime: 2021-03-31 10:39:55
 */
import { _decorator, Component, Node, Sprite, SpriteFrame, Label, ToggleContainer, EventHandler, Toggle, sys, resources, instantiate, Vec3, ScrollView, v3, math, Widget, Button } from 'cc';
const { ccclass, property } = _decorator;
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { HeroIcon } from '../hero/HeroIcon';
import { HeroSelectIconStarUp } from '../hero/HeroSelectIconStarUp';
import { PopMgr } from '../../control/PopMgr';
import { MsgMgr } from '../../control/MsgMgr';
import { XConsts } from "../../model/const/XConsts";
import { NotifyMgr } from '../../control/NotifyMgr';
import { HeroModel } from '../hero/HeroModel';
import { TableName, ValueMgr } from "../../model/ValueMgr";

@ccclass('PopCollege')
export class PopCollege extends PopBase {

    @property({ type: Node, displayName: "说明按钮" })
    public btn_explain: Node | null = null as unknown as Node;

    @property({ type: Label, displayName: "符文水晶" })
    public lab_has_fwsj: Label | null = null as unknown as Label;

    @property({ type: Label, displayName: "英雄1等级" })
    public lab_lv_1: Label | null = null as unknown as Label;
    @property({ type: Label, displayName: "英雄2等级" })
    public lab_lv_2: Label | null = null as unknown as Label;
    @property({ type: Label, displayName: "英雄3等级" })
    public lab_lv_3: Label | null = null as unknown as Label;
    @property({ type: Label, displayName: "英雄4等级" })
    public lab_lv_4: Label | null = null as unknown as Label;
    @property({ type: Label, displayName: "英雄5等级" })
    public lab_lv_5: Label | null = null as unknown as Label;

    @property({ type: Label, displayName: "当前开启槽位数" })
    public lab_has_slot: Label = null as unknown as Label;
    @property({ type: Label, displayName: "当前总槽位数" })
    public lab_all_slot: Label = null as unknown as Label;

    @property({ type: ScrollView, displayName: "英雄滚动视图组件" })
    public scroll_HeroView: ScrollView = null as unknown as ScrollView;

    private _heroPosList:Node[] = [];
    //拥有的所有英雄
    private _allHeroList:Map<number, HeroData> = new Map<number, HeroData>();
    //拥有的所有英雄列表显示对象
    private _bottomHeroItemList:Map<number, Node> = new Map<number, Node>();

    onLoad() {
        super.onLoad();
        // [3]
        this._getAllHeroList();

        this.btn_explain?.on(Node.EventType.TOUCH_END, this._explainHandle, this);
    }

    start() {
        super.start();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_starUp_change,this._notifyStarUpChangeHandle,this);

        this._initBottomHeros();
    }

    //获取列表英雄
    private _getAllHeroList(){
        this._allHeroList = GameModel.getInstance().getHeroList();

    }

    //说明界面
    private _explainHandle(){
        let strTitle = ValueMgr.getInstance().getLanguageString("UI_HeroCollegeTitle") ;
        let strExplain = ValueMgr.getInstance().getLanguageString("UI_HeroCollegeExplainContent") ;        
        PopMgr.getInstance().popExplain(strTitle,strExplain,()=>{
                 PopMgr.getInstance().deleteWindow();
             });
        // ()=>{
        //     PopMgr.getInstance().deleteWindow();
        // },false);
    }

    private _initBottomHeros()
    {
        if(this.scroll_HeroView.content)
        {
            this.scroll_HeroView.content.removeAllChildren();
        }

        resources.load('prefabs_ui/college/college_item', (err:any,res:any)=>{
            this._bottomHeroItemList.clear()
            let k = new Array<[number,Node]>();     //排序存储对象
            for (let heroData of this._allHeroList.values()) {
                let heroIcon = instantiate(res) as Node;
                this.scroll_HeroView.content?.addChild(heroIcon);


                let sortIndex_1:number = heroData.getLevel() * 10000 + heroData.getStar()*1000 + heroData.getCamp() * 10 + heroData.getClasses();
                let sortIndex_2:number = 3000000 - sortIndex_1;
                k.push([sortIndex_2,heroIcon]);



                this._bottomHeroItemList.set(heroData.getDyncID(), heroIcon);
            }


            k.sort((n1,n2) => n1[0] - n2[0])
            k.forEach((value,key)=>{
                value[1].setSiblingIndex(key);
            })
        });
    }


    // //点选英雄
    // private _heroSelect(heroData:HeroData,isSelect:boolean)
    // {
    //     if(isSelect == null)return;

    //     // this._heroToTop(heroData,isSelect);
    //     // this._getBottomHeroItemScript(heroData)?.setSelect(isSelect);
    //     // this._frushButtonHero();
    // }



    // //根据英雄动态id获取英雄静态id
    // private _getTopHeroByStaticID(heroID:number){

    //     let childName = "formationIcon_" + heroID;

    //     for (let index = 0; index < this._heroPosList.length; index++) {
    //         let child = this._heroPosList[index].getChildByName(childName);
    //         if(child)return child
    //     }
    // }

    // //根据herodata获取拥有英雄代码
    // private _getBottomHeroItemScript(heroData:HeroData){
    //     for (let value of this._bottomHeroItemList.values()) {
    //         let script = value.getComponent("HeroSelectIconStarUp") as HeroSelectIconStarUp; 
    //         let scriptHeroInfo = script.getCurHeroInfo() as HeroData;
    //         if(scriptHeroInfo.getDyncID() == heroData.getDyncID())
    //         {
    //             return script;
    //         }
    //     }
    // }


    // //根据动态ID获取HeroData
    // private _getHeroData(heroID:number){
    //     let HeroInfo;
    //     for (let value of this._bottomHeroItemList.values()) {
    //         let script = value.getComponent("HeroSelectIconStarUp") as HeroSelectIconStarUp; 
    //         let scriptHeroInfo = script.getCurHeroInfo() as HeroData;
    //         if(scriptHeroInfo.getDyncID() == heroID)
    //         {
    //             HeroInfo = scriptHeroInfo;
    //         }
    //     }
    //     return HeroInfo;
    // }

    // // 展示当前英雄形象
    // private _showCurHeroModel(_iconName:string)
    // {
    //     // if(this.cur_hero_model)
    //     // {
    //     //     this.cur_hero_model.updateByHeroPerfabPath(_iconName);
    //     // }
    // }

}
