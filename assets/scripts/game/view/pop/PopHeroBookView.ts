
import { _decorator, Component, Node, ToggleContainer, Label, instantiate, EventHandler,Toggle,resources,ScrollView } from 'cc';
const { ccclass, property } = _decorator;
import { HeroData } from '../../model/datas/HeroData';
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { MsgMgr } from '../../control/MsgMgr';
import { XConsts } from "../../model/const/XConsts";
import { XFuns } from "../../model/const/XFuns";
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { XMsgExt } from "../../model/const/XMsgExt";
import { HeroBookTitleCell} from '../../view/hero/HeroBookTitleCell';

@ccclass('PopHeroBookView')
export class PopHeroBookView extends PopBase {

    @property({type: ToggleContainer })
    public selectGroup:ToggleContainer | null = null as unknown as ToggleContainer;

    @property({type :  Node})
    public btnRules:Node = null as unknown as Node;

    @property({type :  Node})
    public btnDetails:Node = null as unknown as Node;

    @property({type :  Node})
    public btnProperty:Node = null as unknown as Node;

    @property({type :  Node})
    public probar_lv:Node = null as unknown as Node;
    
    @property({type :  ScrollView})
    public scrov_book:ScrollView = null as unknown as ScrollView;

    @property({type: Label})
    public lab_beforelv:Label = null as unknown as Label;

    @property({type: Label})
    public lab_afterlv:Label = null as unknown as Label;

    //图鉴列表
    private _bookHeroList:Map<number, Msg.HeroBookUnit> = new Map<number, Msg.HeroBookUnit>();
    //阵营图鉴列表
    private _bookHeroToggleList:Map<number, Msg.HeroBookUnit>[] = new Array();
    private _curCampType:number = 1;
    private _heroStaticIdList:number[] = new Array<number>()

    private _itemHeroListForBook:Map<string,number[]> = new Map<string, number[]>();

    start () {        
        super.start()
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PopHeroBookView';// 这个是代码文件名
        containerEventHandler.handler = '_tabCampClick';
        containerEventHandler.customEventData = '';
        this.selectGroup?.checkEvents.push(containerEventHandler);

        this.btnRules.on(Node.EventType.TOUCH_END, this.openRuleView, this);
        this.btnDetails.on(Node.EventType.TOUCH_END, this.openDetailInfoView, this);
        this.btnProperty.on(Node.EventType.TOUCH_END, this.openPropertyView, this);
        // this.btnRules.on(Node.EventType.TOUCH_END, this.openRuleView, this);

        this._bookHeroList = GameModel.getInstance().getHeroesModel().getBookMap();
        // for (let iterator of this._bookHeroList.keys()) {
        //     console.log("sdaczxcascascq",iterator)
        // }
        this._refreshData()
    }

    private _refreshData()
    {
        let countLegend:number = 0; //传说数量
        let countSenior:number = 0; //高级数量
        let countOrdinary:number = 0; //普通数量


        let heroStaticId2List:number[] = new Array<number>();
        let heroStaticId3List:number[] = new Array<number>();
        let heroDataes = ValueMgr.getInstance().getTableByName(TableName.heroes).records ;
        for (let herodata of heroDataes) {
            let record = herodata as Config.heroes.Record;
            // console.log("英雄id及下一个id",record.id,record.nextId);
            if(record.classes == 1 || record.nextId != 0) { continue; }
            if(record.camp == this._curCampType)
            {
                let id1st = Number((record.id/1000000).toFixed())
                if(id1st == 5)
                {
                    if(countLegend >= this._heroStaticIdList.length)
                    {
                        this._heroStaticIdList.push(record.id);
                    }
                    countLegend++;
                }
                else if(id1st == 3){
                    if(countSenior >= heroStaticId2List.length)
                    {
                        heroStaticId2List.push(record.id);
                    }
                    countSenior++;
                }
                else if(id1st == 1 || id1st == 2){
                    if(countOrdinary >= heroStaticId3List.length)
                    {
                        heroStaticId3List.push(record.id);
                    }
                    countOrdinary++;
                }
            }
        }
        this._itemHeroListForBook.set("legend", this._heroStaticIdList);
        if(heroStaticId2List.length > 0)
        {
            this._itemHeroListForBook.set("senior", heroStaticId2List);
        }
        if(heroStaticId3List.length > 0)
        {
            this._itemHeroListForBook.set("ordinary", heroStaticId3List);
        }

        this._initScrollview()
    }

    private _initScrollview()
    {
        if(this.scrov_book.content)
        {
            this.scrov_book.content.removeAllChildren()
        }
        resources.load('prefabs_ui/main/booktitlecell', (err:any,res:any)=>{
            for (let key of this._itemHeroListForBook.keys()) {  
                let bookTitleCell = instantiate(res) as Node;
                this.scrov_book.content?.addChild(bookTitleCell);

                let value = this._itemHeroListForBook.get(key) as number[];
                let script = bookTitleCell.getComponent("HeroBookTitleCell") as HeroBookTitleCell;
                script.setBookHeroData(key,value);            
            }

        })
    }

    //阵营切换
    private _tabCampClick(event: Event, customEventData: string)
    {
        let tog:Toggle = (event as any);
        console.log(tog.node.name)
        var _length = tog.node.name.length;
        var _index = tog.node.name.charAt(_length-1);
        console.log("tab 阵营切换",_index,_length,XConsts.KHeroCampIcon[Number(_index)]);

        this._curCampType = Number(_index);
        this._refreshData()
    }

    //打开规则界面
    private openRuleView()
    {

    }

    //加成细节
    private openDetailInfoView()
    {
        
    }

    //加成属性
    private openPropertyView()
    {
        
    }

    onDestroy()
    {
        
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
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
