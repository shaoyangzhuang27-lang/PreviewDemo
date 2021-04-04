/*
 * @Description: 英雄书院卸下英雄
 * @Author: 徐涛
 * @Date: 2021-04-01 20:40:35
 * @LastEditTime: 2021-04-04 12:08:15
 */
import { _decorator, Node, Label, resources, instantiate, ScrollView, Vec3, UITransform, math, Layout } from 'cc';
const { ccclass, property } = _decorator;
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { PopMgr } from '../../control/PopMgr';
import { NotifyMgr } from '../../control/NotifyMgr';
import { HeroModel } from '../hero/HeroModel';
import { ValueMgr } from "../../model/ValueMgr";
import { XFuns } from '../../model/const/XFuns';
import { XShare } from '../../model/const/XShare';
import { CollegeItem } from './CollegeItem';
import { CollegeCostItem } from './CollegeCostItem';
import { MsgMgr } from '../../control/MsgMgr';
import { HeroIcon } from '../hero/HeroIcon';

@ccclass('PopCollegeUnload')
export class PopCollegeUnload extends PopBase {

    @property({ type: Node, displayName: "确定卸下" })
    public btn_unLoad: Node = null as unknown as Node;

    @property({ type: Label, displayName: "标题" })
    public lab_title: Label = null as unknown as Label;

    @property({ type: Label, displayName: "内容" })
    public lab_content: Label = null as unknown as Label;

    @property({ type: HeroIcon, displayName: "在学院英雄" })
    public hero_icon_college: HeroIcon = null as unknown as HeroIcon;
    
    @property({ type: HeroIcon, displayName: "卸下英雄" })
    public hero_icon_unload: HeroIcon = null as unknown as HeroIcon;
    
    private _heroId:number = 0;
    private _pos:number =0;        
    
    onLoad() {
        super.onLoad();
        this.btn_unLoad?.on(Node.EventType.TOUCH_END, this._unLoadHandle, this);
    }

    start() {
        super.start();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_set_college_hero, this._notifySetCollegeHeroHandle, this);
       
    }

    onDestroy() {
        super.onDestroy();        
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_set_college_hero, this._notifySetCollegeHeroHandle, this);
    }

    private _notifySetCollegeHeroHandle(data:any = null){
        if (!data) {
            return;
        }

        let msg = data as Msg.SetCollegeHeroA;
        if (msg.err == Msg.TErrorCode.ERR_OK) {
            //关闭当前窗体
            this.delSelf();
        }
    }

    private _unLoadHandle() {
        if(this._heroId !=0 || this._pos != 0){
            let msg = new Msg.SetCollegeHeroR({ heroId: this._heroId, isAdd: false, pos: this._pos });
            NotifyMgr.getInstance().notify(NotifyMgr.event_ui_set_college_hero, msg);
            MsgMgr.getInstance().getMsgHeroCollege().requestSetCollegeHero(this._heroId, false, this._pos);
            
        }
    }
    
    /**
     * @description: 设置数据
     * @param {number} heroId
     * @param {number} pos
     */
    public setData(heroId:number , pos:number){
        this._heroId=heroId;
        this._pos=pos;
        this._initView();
    }

    private _initView() {
        this.lab_title.string = ValueMgr.getInstance().getLanguageString("UI_HeroCollegeRemoveHeroTitle");
        let strContent = ValueMgr.getInstance().getLanguageString("UI_HeroCollegeRemoveHeroContent");
        this.lab_content.string =strContent;
        //显示英雄
        let heroData = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(this._heroId) as HeroData;        
        this.hero_icon_college.setHeroData(heroData, true);
        this.hero_icon_unload.setHeroData(heroData, false);        
    }

}
