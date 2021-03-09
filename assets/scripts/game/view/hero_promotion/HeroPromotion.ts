
import { _decorator, Component, resources,director,tween,Vec3, instantiate, Node, UIOpacity } from 'cc';
import { DataMgr } from '../../model/DataMgr';

import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { PopMgr } from '../../control/PopMgr';
import { MsgMgr } from '../../control/MsgMgr';
import { HeroModel } from '../hero/HeroModel';
const { ccclass, property } = _decorator;
 
//弹窗初始化-----
@ccclass('HeroPromotion')
export class HeroPromotion extends PopBase {
    @property({type: Node, displayName: "锁定"})
    public btn_lock:Node | null = null;

    @property({type: Node, displayName: "分享"})
    public btn_share:Node | null = null;

    @property({type: Node, displayName: "英雄故事"})
    public btn_story:Node | null = null;

    @property({type: Node, displayName: "英雄各属性数值"})
    public btn_fight_params:Node | null = null;

    @property({type: Node, displayName: "左箭头"})
    public btn_arrow_left:Node | null = null;

    @property({type: Node, displayName: "右箭头"})
    public btn_arrow_right:Node | null = null;

    @property({type: Node, displayName: "升级"})
    public btn_up_lv:Node | null = null;

    @property({type: Node, displayName: "升阶"})
    public btn_up_tier:Node | null = null;

    @property({type: Node, displayName: "阵营"})
    public btn_camp:Node | null = null;

    @property({type: Node, displayName: "职业"})
    public btn_career:Node | null = null;

    @property({type: Node, displayName: "升级Tab"})
    public btn_tab_up_lv:Node | null = null;

    @property({type: Node, displayName: "装备Tab"})
    public btn_tab_equip:Node | null = null;

    @property({type: Node, displayName: "全部卸下"})
    public btn_all_unload:Node | null = null;

    @property({type: Node, displayName: "一键装备"})
    public btn_all_load:Node | null = null;

    @property({ type: HeroModel, displayName: "当前英雄形象" })
    public cur_hero_model: HeroModel | null = null;
    

    private _curHeroId: number = 0; //当前英雄ID
    private _curHeroData: HeroData= null as unknown as HeroData; //当前英雄数据
    // private _curHeroEquipData: EquipData= null as unknown as Data; //当前英雄装备数据
    private _allHeroList:Map<number, HeroData> = new Map<number, HeroData>(); //拥有的所有英雄

    private _isHeroUpView: boolean = true; //true标记当前是英雄升级/阶界面，false标记当前是英雄装备界面
    private _isLvUpView: boolean = true; //true标记当前是英雄升级界面，false标记当前是英雄升阶界面

    onLoad(){
        super.onLoad();
        this._allHeroList = GameModel.getInstance().getHeroesModel().getHeroList();

        this.btn_lock?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_share?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_story?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_fight_params?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_arrow_left?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_arrow_right?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_camp?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_career?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_tab_up_lv?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_tab_equip?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_all_unload?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);
        this.btn_all_load?.on(Node.EventType.TOUCH_END,this.buttonBtnClick,this);        
    }

    onDestroy(){
    }
    
    buttonBtnClick(event:any){
        console.log(event)        

        switch (event.target) {
            case this.btn_up_lv:
                console.log("HeroPromotion btn_up_lv")
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
        
        //todo 星级下的每个品阶有对应的等级最大限制，当等级提升到最大限制后，通过升阶操作扩展更高的等级上限。
        this._isLvUpView = true;
        // 英雄等级 this._curHeroData.getLevel();
        // 英雄星级 this._curHeroData.getStar();
        // 英雄品阶 this._curHeroData.tier;

        this.initCurHeroView();
    }

    // 显示当前英雄数据
    initCurHeroView()
    {
        this.showCurHeroModel();
       if(this._isHeroUpView)
       {            
            this._isLvUpView ? this.showHeroLvUpView(): this.showHeroUpgradeView();      
       }
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
    // 展示当前英雄形象
    showCurHeroModel()
    {
        // this.cur_hero_model.updateByHeroPerfabPath();
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
