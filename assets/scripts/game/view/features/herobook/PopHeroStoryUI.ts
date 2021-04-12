/**
 * 游戏组件:英雄故事弹窗
 * @author 黄志清
 * @version 1.0.0,2021.3.19
 */
import { _decorator, Component, Node, Label, Game, resources, SpriteFrame, Sprite } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { MsgMgr } from '../../../control/MsgMgr';
import { NotifyMgr } from '../../../control/NotifyMgr';
import { HeroData } from '../../../model/datas/HeroData';
import { GameModel } from '../../../model/GameModel';
import { TableName, ValueMgr } from '../../../model/ValueMgr';
const { ccclass, property } = _decorator;

@ccclass('PopHeroStoryUI')
export class PopHeroStoryUI extends PopBase {

    // @property({type :  Node})
    // public btn_sure:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_rewrd:Node = null as unknown as Node;

    @property({type :  Node})
    public img_hero:Node = null as unknown as Node;
    @property({type :  Node})
    public img_reward:Node = null as unknown as Node;

    @property({type: Label})
    public lab_content:Label = null as unknown as Label;
    @property({type: Label})
    public lab_titleName:Label = null as unknown as Label;
    @property({type: Label})
    public lab_heroName:Label = null as unknown as Label;

    private _staticId:number = 0;
    private _heroBookId:number = 0;
    private _heroInfo:Config.heroes.Record = null as unknown as Config.heroes.Record;
    private _heroBookUnit:Msg.HeroBookUnit = null as unknown as Msg.HeroBookUnit;
    //英雄背景介绍 = storyStr + 图鉴id
    private storyStr:string = "DATA_HeroStory";     
    start () {
        super.start(); 
        // this.btn_sure.on(Node.EventType.TOUCH_END, this._closeView, this);
        this.btn_rewrd.on(Node.EventType.TOUCH_END, this._getStrotyAward, this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_hero_book_upgrade,this._notifyBookChangeHandle,this);
    }

    // private _closeView()
    // {
    //     this.deleteMe()
    // }

    private _getStrotyAward()
    {
        MsgMgr.getInstance().getMsgFormation().requestGetBookHeroReward(this._staticId);
    }

    private _notifyBookChangeHandle(data:any)
    {
        this._heroBookUnit = data as Msg.HeroBookUnit;
        if(this._heroInfo.title != null && this._heroInfo.title != "" && this._heroInfo.title != "0")
        {
            if(this._heroBookUnit && this._heroBookUnit.isGetAward == false && this.btn_rewrd.active)
            {
                this.btn_rewrd.active = false;
            }
        }
    }

    /**
     * 
     * @param staticId 英雄静态id
     */
    public setStoryData(staticId:number)
    {
        this._staticId = staticId;
        this._heroInfo = ValueMgr.getInstance().getItemByField(TableName.heroes,staticId) as Config.heroes.Record;
        let bookid = HeroData.GetHeroBookID(staticId)
        this._heroBookId = bookid;
        this._heroBookUnit = GameModel.getInstance().getHeroesModel().getBookHeroDataByBookId(bookid);
        this._initData()
    }

    private _initData()
    {
        this.lab_titleName.node.active = false;
        this.img_reward.active = false;

        let heroNameData = ValueMgr.getInstance().getItemByField(TableName.language_data,this._heroInfo.name) as Config.language_data.Record;

        let contentStr = this.storyStr + this._heroBookId;
        let heroContentData = ValueMgr.getInstance().getItemByField(TableName.language_data,contentStr) as Config.language_data.Record;
        if(this._heroInfo.title != null && this._heroInfo.title != "" && this._heroInfo.title != "0")
        {
            let heroTitileData = ValueMgr.getInstance().getItemByField(TableName.language_data,this._heroInfo.title) as Config.language_data.Record;
            this.lab_titleName.node.active = true;
            this.lab_titleName.string = heroTitileData.cn;

            //有头衔的英雄才有奖励
            if(this._heroBookUnit && this._heroBookUnit.isGetAward == false)
            {
                this.img_reward.active = true;
            }
        }
        this.lab_heroName.string = heroNameData.cn;
        this.lab_content.string = heroContentData.cn;

        let heroImg = this._heroInfo.image + "_image"
        let heroPath = "ui/comm/hero_big/" + heroImg + "/spriteFrame"
        resources.load(heroPath,(err,spriteFrame:SpriteFrame) =>
        {
            if(!err)
            {
                let sprite = this.img_hero.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
        
    }

    onDestroy()
    {
        super.onDestroy()
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_hero_book_upgrade,this._notifyBookChangeHandle,this);
    }
}
