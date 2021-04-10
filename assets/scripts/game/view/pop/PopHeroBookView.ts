/**
 * 游戏组件:英雄图鉴主界面
 * @author 黄志清
 * @version 1.0.0,2021.3.17
 */
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
import { HeroBookCell } from '../hero/HeroBookCell';
import { NotifyMgr } from '../../control/NotifyMgr';
import { PopMgr } from '../../control/PopMgr';

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
    private _curCampType:number = 1;
    private _heroStaticIdList:number[] = new Array<number>()

    private _itemHeroListForBook:Map<string,number[]> = new Map<string, number[]>();

    //储存当前阵营的图鉴节点
    private _bookCellList:Map<number,Node> = new Map<number,Node>();

    start () {        
        super.start()
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PopHeroBookView';// 这个是代码文件名
        containerEventHandler.handler = '_tabCampClick';
        containerEventHandler.customEventData = '';
        this.selectGroup?.checkEvents.push(containerEventHandler);

        this.btnRules.on(Node.EventType.TOUCH_END, this._openRuleView, this);
        this.btnDetails.on(Node.EventType.TOUCH_END, this._openDetailInfoView, this);
        this.btnProperty.on(Node.EventType.TOUCH_END, this._openPropertyView, this);
        // this.btnRules.on(Node.EventType.TOUCH_END, this.openRuleView, this);

        // this._bookHeroList = GameModel.getInstance().getHeroesModel().getBookMap();

        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_hero_book_active,this._notifyBookChangeHandle,this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_hero_book_upgrade,this._notifyBookChangeHandle,this);
        
        this._refreshData()
        this._refreshHBTotalPanel()
    }

    private _refreshData()
    {
        let countLegend:number = 0; //传说数量
        let countSenior:number = 0; //高级数量
        let countOrdinary:number = 0; //普通数量

        this._itemHeroListForBook.clear()
        this._heroStaticIdList = new Array<number>();

        let heroStaticId2List:number[] = new Array<number>();
        let heroStaticId3List:number[] = new Array<number>();
        let heroDataes = ValueMgr.getInstance().getTableByName(TableName.heroes).records ;
        for (let herodata of heroDataes) {
            let record = herodata as Config.heroes.Record;
            // console.log("英雄id及下一个id",record.id,record.nextId);
            if(record.classes == 1 || record.nextId != 0) { continue; }
            if(record.camp == this._curCampType)
            {
                let id1st = HeroData.getInitialStarByID(record.id);
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
        resources.load('prefabs_ui/features/herobook/cell_booktitle', (err:any,res:any)=>{
            let k = new Array<[number,Node]>();     //排序存储对象
            for (let key of this._itemHeroListForBook.keys()) {  
                let bookTitleCell = instantiate(res) as Node;
                this.scrov_book.content?.addChild(bookTitleCell);

                let value = this._itemHeroListForBook.get(key) as number[];
                let titleScript = bookTitleCell.getComponent("HeroBookTitleCell") as HeroBookTitleCell;
                titleScript.setBookHeroData(key);                  

                let sortIndex = 1000;
                if(key == "senior")
                {
                    sortIndex = 2000;
                }
                else if(key == "ordinary")
                {
                    sortIndex = 3000;
                }
                bookTitleCell.name = sortIndex.toString()
                k.push([sortIndex,bookTitleCell]);
                resources.load('prefabs_ui/features/herobook/cell_book', (err:any,res:any)=>{                    
                    for (let index = 0; index < value.length; index++) {
                        let bookcell = instantiate(res) as Node;
                        this.scrov_book.content?.addChild(bookcell);
                        

                        let script = bookcell.getComponent("HeroBookCell") as HeroBookCell; 
                        let heroId = value[index];
                        this._bookCellList.set(heroId, bookcell);
                
                        let heroBookInfo:Msg.HeroBookUnit = GameModel.getInstance().getHeroesModel().getBookHeroDataByStaticID(heroId);
                        let showType:number = XConsts.HeroBookState.Null;   //显示类型:0显示遮罩 1可激活 2可升级 3常态无遮罩
                        if(heroBookInfo.level == 0 && heroBookInfo.curTopStar == 0)
                        {
                            showType = XConsts.HeroBookState.Null;
                        }
                        else if(heroBookInfo.level == 0 && heroBookInfo.curTopStar != 0)
                        {
                            showType = XConsts.HeroBookState.CanActive;
                        }
                        else if(XMsgExt.IsCanLevelUp(heroBookInfo))
                        {
                            showType = XConsts.HeroBookState.CanUpGrade;
                        }
                        else if(heroBookInfo.level != 0 && heroBookInfo.curTopStar == heroBookInfo.level)
                        {
                            showType = XConsts.HeroBookState.Normal;
                        }
                        script.setHeroBookData(showType,heroId,(itemState:number, heroid:number)=>{
                            console.log("图鉴点击回调")
                            this._bookCellClickCallback(itemState,heroid);
                        });

                        sortIndex = 1000 + index + 1;
                        if(key == "senior")
                        {
                            sortIndex = 2000 + index + 1;;
                        }
                        else if(key == "ordinary")
                        {
                            sortIndex = 3000 + index + 1;;
                        }
                        bookcell.name = sortIndex.toString()
                        k.push([sortIndex,bookcell]);
                    }
                    // k.sort((n1,n2) => n1[0] - n2[0])
                    // k.forEach((value,key)=>{
                    //     value[1].setSiblingIndex(key);
                    // })

                    console.log("界十大杀手打出",this._bookCellList.size);
                })       
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
    private _openRuleView()
    {
        var title = ValueMgr.getInstance().getItemByField(TableName.language_ui,"UI_HeroBookExplain") as Config.language_ui.Record;
        var desc = ValueMgr.getInstance().getItemByField(TableName.language_ui,"UI_HeroBookContent") as Config.language_ui.Record;
        PopMgr.getInstance().popExplain(title.cn,desc.cn,()=>{ PopMgr.getInstance().deleteWindow();});
    }

    //图鉴总等级
    private _openDetailInfoView()
    {
        PopMgr.getInstance().popOpenBookPropretyLevelUI()
    }

    //加成属性
    private _openPropertyView()
    {
        PopMgr.getInstance().popOpenBookAllPropretyUI()
    }

    //图鉴点击回调
    private _bookCellClickCallback(itemState:number, heroid:number)
    {   
        let heroBookId = HeroData.GetHeroBookID(heroid);
        if(itemState == XConsts.HeroBookState.CanActive)
        {
            MsgMgr.getInstance().getMsgFormation().requestHeroBookActive(heroBookId)
        }
        else if(itemState == XConsts.HeroBookState.CanUpGrade)
        {
            PopMgr.getInstance().popBookHeroUpgradeView(heroid)            
        }
        else{
            PopMgr.getInstance().popOpenBookHeroDetail(heroid);
        }
    }

    //图鉴激活通知
    private _notifyBookChangeHandle(data:any)
    {
        let hbu = data as Msg.HeroBookUnit;
        let heroStaticID = HeroData.getHeroStaticIdByBookId(hbu.heroBookId);
        if(this._bookCellList.has(heroStaticID))
        {
            let isCanUpgrade = XMsgExt.IsCanLevelUp(hbu);
            let showType = XConsts.HeroBookState.Normal;
            if(isCanUpgrade)
            {
                showType = XConsts.HeroBookState.CanUpGrade;
            }
            let bookNode = this._bookCellList.get(heroStaticID) as Node;
            let script = bookNode.getComponent("HeroBookCell") as HeroBookCell;
            script.resetBookView(showType);
        }
        this._refreshHBTotalPanel();
    }

    private _refreshHBTotalPanel()
    {
        let _curLvReqPoint:number = 0;
		let _nextReqPoint:number = 0;
		let _maxPoint:number = 0;

        let btp = ValueMgr.getInstance().getTableByName(TableName.book_total_property) as Config.book_total_property;
        let heroBookLevel = GameModel.getInstance().getHeroesModel().getCurHeroBookLevel()
        let heroBookPoint = GameModel.getInstance().getHeroesModel().getCurHeroBookPoint()
        for (let index = 0; index < btp.records.length; index++) {
            const record = btp.records[index];
            _maxPoint = Number(record.reqPoint);
            if(record.id == heroBookLevel)
				_curLvReqPoint = Number(record.reqPoint);
			if (Number(record.reqPoint) > heroBookPoint && _nextReqPoint == 0) 
				_nextReqPoint = Number(record.reqPoint);
        }

		// foreach (let record in CfgMgr.GetTable<Config.book_total_property> ().Records) {
		// 	_maxPoint = record.ReqPoint;
		// 	if(record.Id == PlayerData.instance.HeroBookLevel)
		// 		_curLvReqPoint = record.ReqPoint;
		// 	if (record.ReqPoint > PlayerData.instance.HeroBookPoint && _nextReqPoint == 0) 
		// 		_nextReqPoint = record.ReqPoint;
		// }
		// HBTotalLvText.text = "Lv." + _curLvReqPoint;
		// if(_nextReqPoint == 0)
		// 	_nextReqPoint = _maxPoint;

		// if (_nextReqPoint == _maxPoint) 
		// 	HBTotalNextLvText.text = LanguageManager.instance.GetString("UI_LvMax");
		// else 
		// 	HBTotalNextLvText.text = "Lv." + _nextReqPoint;
		
		// if ((_nextReqPoint - _curLvReqPoint) != 0)
		// 	HBTotalLvImg.fillAmount = (float) (PlayerData.instance.HeroBookPoint - _curLvReqPoint) / (float) (_nextReqPoint - _curLvReqPoint);
		// else
		// 	HBTotalLvImg.fillAmount = 1.0f;
    }

    onDestroy()
    {
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_hero_book_active,this._notifyBookChangeHandle,this);
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_hero_book_upgrade,this._notifyBookChangeHandle,this);
    }

}
