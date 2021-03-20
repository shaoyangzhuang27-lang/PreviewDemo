/**
 * 游戏组件:英雄图鉴升级
 * @author 黄志清
 * @version 1.0.0,2021.3.18
 */
import { _decorator, Component, Node, Label, resources, instantiate, Vec3, Button } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { MsgMgr } from '../../control/MsgMgr';
import { NotifyMgr } from '../../control/NotifyMgr';
import { XConsts } from '../../model/const/XConsts';
import { XMsgExt } from '../../model/const/XMsgExt';
import { HeroData } from '../../model/datas/HeroData';
import { GameModel } from '../../model/GameModel';
import { TableName, ValueMgr } from '../../model/ValueMgr';
import { HeroIcon } from '../hero/HeroIcon';
const { ccclass, property } = _decorator;

@ccclass('PopBookUpGrade')
export class PopBookUpGrade extends PopBase {
    @property({type :  Node})
    public iconNode:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_heroName:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_oldLv:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_newLv:Label = null as unknown as Label;

    @property({type :  Node})
    public btn_upgrade:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_oldAtk:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_newAtk:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_oldHp:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_newHp:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_oldDef:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_newDef:Label = null as unknown as Label;

    private _heroUnit:Msg.HeroBookUnit = null as unknown as Msg.HeroBookUnit;
    private _heroId:number = -1;
    private _bookid:number = -1;

    start () {
        super.start()
        this.btn_upgrade.on(Node.EventType.TOUCH_END, this._upGradeBookInfo, this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_hero_book_upgrade,this._notifyChangeBookInfo,this);
    }

    private _initData()
    {
        if(this._heroId == -1)
        {
            this.deleteMe();
            return;
        }
        this._bookid = HeroData.GetHeroBookID(this._heroId);        
        let bookMap = GameModel.getInstance().getHeroesModel().getBookMap();
        this._heroUnit = bookMap.get(this._bookid) as Msg.HeroBookUnit;        
        this._refreshViewData(this._heroUnit)

        let heroInfo = ValueMgr.getInstance().getItemByField(TableName.heroes,this._heroId) as Config.heroes.Record;
        let lanData = ValueMgr.getInstance().getItemByField(TableName.language_data,heroInfo.name) as Config.language_data.Record;
        this.lab_heroName.string = lanData.cn;

        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
            let iconCell = instantiate(res) as Node;
            this.iconNode.addChild(iconCell);
            iconCell.scale = new Vec3(0.5,0.5,1);

            
            let script = iconCell.getComponent("HeroIcon") as HeroIcon;
            script.setHeroInfo(heroInfo,0);
        })
    }

    //升级按钮
    private _upGradeBookInfo()
    {
        MsgMgr.getInstance().getMsgFormation().requestUpgradeHeroBook(this._bookid)
    }

    //刷新界面
    private _notifyChangeBookInfo(data:any)
    {
        let hbu = data as Msg.HeroBookUnit;
        this._refreshViewData(hbu)
        let isCanUpgrade = XMsgExt.IsCanLevelUp(hbu);        
        if(!isCanUpgrade)
        {
            let upgradeBtn = this.btn_upgrade.getComponent(Button) as Button;
            upgradeBtn.interactable = false;
            //不可升级 取消点击事件注册
            this.btn_upgrade.off(Node.EventType.TOUCH_END,this._upGradeBookInfo,this)
        }
    }

    private _refreshViewData(hbu:Msg.HeroBookUnit)
    {
        let heroInfo = ValueMgr.getInstance().getItemByField(TableName.heroes,this._heroId) as Config.heroes.Record;
        let hubInfo = hbu || this._heroUnit;
        let id1st = Number((heroInfo.id/1000000).toFixed())
        let oldProId = id1st *100 + hbu.level;
        let isCanUpgrade = XMsgExt.IsCanLevelUp(hbu);

        this.lab_oldLv.string = hubInfo.level.toString()
        this.lab_newLv.string = hubInfo.level.toString()

        let oldProData = ValueMgr.getInstance().getItemByField(TableName.book_hero_property, oldProId) as Config.book_hero_property.Record;
        let oldProNum = oldProData.proNum;

        this.lab_oldAtk.string = oldProNum[0].toString();
        this.lab_oldHp.string = oldProNum[1].toString();
        this.lab_oldDef.string = oldProNum[2].toString();

        if(isCanUpgrade)
        {
            let newProId = id1st *100 + hbu.level + 1;            
            let newProData = ValueMgr.getInstance().getItemByField(TableName.book_hero_property, newProId) as Config.book_hero_property.Record;            
            let newProNum = newProData.proNum;
            
            this.lab_newAtk.string = newProNum[0].toString();
            this.lab_newHp.string = newProNum[1].toString();
            this.lab_newDef.string = newProNum[2].toString();

            this.lab_newLv.string = (hubInfo.level + 1).toString()
        }
        else{
            this.lab_newAtk.string = oldProNum[0].toString();
            this.lab_newHp.string = oldProNum[1].toString();
            this.lab_newDef.string = oldProNum[2].toString();
        }
    }
    
    
    onDestroy()
    {
        super.onDestroy();
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_hero_book_upgrade,this._notifyChangeBookInfo,this);
    }
    

    /**
     * 英雄图鉴数据
     * @param id 英雄id
     * @param hu 英雄图鉴数据
     */
    public setBookUpgradeHeroData(id:number)
    {
        this._heroId = id;
        this._initData()        
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
