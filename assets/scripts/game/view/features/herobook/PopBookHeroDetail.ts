
import { _decorator, Component, Node, Label } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { PopMgr } from '../../../control/PopMgr';
import { TableName, ValueMgr } from '../../../model/ValueMgr';
const { ccclass, property } = _decorator;

@ccclass('PopBookHeroDetail')
export class PopBookHeroDetail extends PopBase {
    @property({type :  Node})
    public btn_story:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_info:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_left:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_right:Node = null as unknown as Node;

    @property({type :  Node})
    public skillNodeList:Node[] =[];

    @property({type :  Node})       //职业
    public img_career:Node = null as unknown as Node;

    @property({type :  Node})
    public img_camp:Node = null as unknown as Node;

    @property({type :  Node})
    public starnode:Node = null as unknown as Node;

    @property({type :  Node})
    public five_Node:Node = null as unknown as Node;

    @property({type :  Node})
    public img_campBg:Node = null as unknown as Node;

    @property({type :  Node})
    public img_titleBg:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_name:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_fivename:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_titlename:Node = null as unknown as Node;

    @property({type :  Node})
    public gemnode:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_lv:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_fightPower:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_hp:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_atk:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_def:Node = null as unknown as Node;
    
    @property({type :  Node})
    public heroModelNode:Node = null as unknown as Node;

    
    private _heroInfo:Config.heroes.Record = null as unknown as Config.heroes.Record;
    start () {
        super.start();
        this.btn_story.on(Node.EventType.TOUCH_END,this._openStoryUI,this);
    }

    private _openStoryUI()
    {
        PopMgr.getInstance().popOpenHeroStoryUI(this._heroInfo.id);
    }

    /**
     * 
     * @param staticId 英雄静态id
     */
    public setBookData(staticId:number)
    {
        this._heroInfo = ValueMgr.getInstance().getItemByField(TableName.heroes,staticId) as Config.heroes.Record;1
    }

}

 