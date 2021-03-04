
import { _decorator, Component, resources,director,tween,Vec3, instantiate, Node, UIOpacity } from 'cc';
import { DataMgr } from '../../model/DataMgr';

import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { PopMgr } from '../../control/PopMgr';
import { MsgMgr } from '../../control/MsgMgr';
const { ccclass, property } = _decorator;
 
//弹窗初始化-----
@ccclass('HeroPromotion')
export class HeroPromotion extends PopBase {
    
    @property({type: Node, displayName: "升级"})
    public btn_up:Node | null = null;

    private _curHeroId: number = 0; //当前英雄ID
    private _curHeroData: HeroData= null as unknown as HeroData; //当前英雄数据
    private _allHeroList:Map<number, HeroData> = new Map<number, HeroData>(); //拥有的所有英雄

    private _isHeroUpView: boolean = true; //true标记当前是英雄升级/阶界面，false标记当前是英雄装备界面
    private _isLvUpView: boolean = true; //true标记当前是英雄升级界面，false标记当前是英雄升阶界面

    onLoad(){
        super.onLoad();
        this._allHeroList = GameModel.getInstance().getHeroesModel().getHeroList();
        this.btn_up?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        
    }

    onDestroy(){
    }
    
    buttonBtnClick(event:any){
        console.log(event)        

        switch (event.target) {
            case this.btn_up:
                console.log("HeroPromotion btn_up")
                break;
            default:
                // code...
                break;
        }
    }
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
        super.start()
        this.initView();
    }

    initView(){
        let playerInfo = DataMgr.getInstance().getPlayerInfo()
        console.log(" HeroPromotion initView +++++++++++++++++++++")
    }
   
    update (deltatime: number) {
        // [4] 
        // console.log("HeroPromotion update() number= ", deltatime)
    }

    public setCurrentHeroId(heroId:number = 1)
    {
        this._curHeroId = heroId;
        this._curHeroData  = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(this._curHeroId) as HeroData;        
        // this._isHeroUpView = this._curHeroData.calcTalentSkillProperty
        this.initCurHeroView();
    }

    // 显示当前英雄数据
    initCurHeroView()
    {
       if(this._isHeroUpView)
       {            
            this._isHeroUpView ? this.showHeroLvUpView(): this.showHeroUpgradeView();       }
       else
       {
            this.showEquipView();
       }
    }

    // 展示英雄升级界面
    showHeroLvUpView()
    {

    }

    // 展示英雄升阶界面
    showHeroUpgradeView()
    {

    }

    // 展示英雄装备界面
    showEquipView()
    {

    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
