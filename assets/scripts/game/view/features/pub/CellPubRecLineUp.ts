import { _decorator, Component, Node,resources,instantiate,Vec3,Button,Label, UITransform, size, Size, Script,Prefab } from 'cc';
import { XConsts } from '../../../model/const/XConsts';
import { TableName, ValueMgr } from "../../../model/ValueMgr";
import { PopMgr } from '../../../control/PopMgr';
import { HeroIcon } from '../../hero/HeroIcon';
import { ResMgr } from '../../../control/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('CellPubRecLineUp')
export class CellPubRecLineUp extends Component {

    @property({type: Node })
    public node_hero_0 = null as unknown as Node;
    @property({type: Node })
    public node_hero_1 = null as unknown as Node;
    @property({type: Node })
    public node_hero_2 = null as unknown as Node;
    @property({type: Node })
    public node_hero_3 = null as unknown as Node;
    @property({type: Node })
    public node_hero_4 = null as unknown as Node;

    @property({type: Node })
    public bg_dec = null as unknown as Node;
    //查看详情
    @property({type: Node })
    public btn_view_detail = null as unknown as Node;
    //收起
    @property({type: Node })
    public btn_retract = null as unknown as Node;

    @property({type: Label })
    public lab_team_name = null as unknown as Label;

    @property({type: Label })
    public lab_core_hero_title = null as unknown as Label;

    @property({type: Label })
    public lab_lineup_analysis_title = null as unknown as Label;
    @property({type: Label })
    public lab_core_hero = null as unknown as Label;

    @property({type: Label })
    public lab_lineup_analysis = null as unknown as Label;

    //推荐英雄ID
    private _HeroIdArray : number[] = [];
 
    start () {
        this.node_hero_0?.on(Node.EventType.TOUCH_END, this._onNodeClick, this);
        this.node_hero_1?.on(Node.EventType.TOUCH_END, this._onNodeClick, this);
        this.node_hero_2?.on(Node.EventType.TOUCH_END, this._onNodeClick, this);
        this.node_hero_3?.on(Node.EventType.TOUCH_END, this._onNodeClick, this);
        this.node_hero_4?.on(Node.EventType.TOUCH_END, this._onNodeClick, this);
        this.btn_view_detail?.on(Node.EventType.TOUCH_END, this._onViewDetailClick, this);
        this.btn_retract?.on(Node.EventType.TOUCH_END, this._onRetractClick, this);
       
        this.initUI();
       
    }


    private _onNodeClick(event : any)
    {
        console.log("clickNode");
        PopMgr.getInstance().popupSimpleWindow("推荐阵容","111111",()=>{console.log("")});
    }
    private _onViewDetailClick(event : any)
    {
       this.setShowViewDetailState(true);
        this.setAllDesLabelAndBtnState(false);
        this.setAllDesLabelAndBtnState(true);
        console.log("查看详情");
        //PopMgr.getInstance().popRecLineUpWindow("推荐阵容",()=>{console.log("")});
    }
    private _onRetractClick(event : any)
    {
        this.setShowViewDetailState(false);
        this.setAllDesLabelAndBtnState(false);
        console.log("收起");
        //PopMgr.getInstance().popRecLineUpWindow("推荐阵容",()=>{console.log("")});
    }
    
    public initHeroIconPrefab(index : number,id : number)
    {
        ResMgr.getInstance().loadPrefab('prefabs_ui/main/hero_icon', (err: Error | null, res: Prefab | null)=>{
            let _heroIcon = instantiate(res as Prefab) ;
            let script = _heroIcon.getComponent(HeroIcon) as HeroIcon ; 
            // script.setHeroID(this._heroInfo as HeroData);
            script.initUIHeroIconInfo(id,XConsts.HERO_ICON_TYPE.RecLineUp);
                   
            // _heroIcon.scale = new Vec3(0.5,0.5,1);
            switch(index)
            {
                case 0:
                    this.node_hero_0?.addChild(_heroIcon);
                    break;
                case 1:
                    this.node_hero_1?.addChild(_heroIcon);
                    break;
                case 2:
                    this.node_hero_2?.addChild(_heroIcon);
                    break;
                case 3:
                    this.node_hero_3?.addChild(_heroIcon);
                    break;
                case 4:
                    this.node_hero_4?.addChild(_heroIcon);
                    break;
            }
           
        },"CellPubRecLineUp");
    }
    public setAllDesLabelAndBtnState(state : boolean)
    {
        this.btn_view_detail.active = !state;
        this.btn_retract.active = state;
        // this.lab_team_name.node.active = state;
        this.lab_core_hero.node.active = state;
        this.lab_lineup_analysis.node.active = state;
        this.lab_core_hero_title.node.active = state;
        this.lab_lineup_analysis_title.node.active = state;
        
    } 

    public initUI()
    {
        var packUpInfo = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.PUB_RECOMMEND_LINEUP_UI_PACKUP) as Config.language_ui.Record;
        var detailInfo = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.PUB_RECOMMEND_LINEUP_UI_VIEWDETAIL) as Config.language_ui.Record;
        var coreHeroInfo = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.PUB_RECOMMEND_LINEUP_UI_COREHERO) as Config.language_ui.Record;
        var campAnalyseInfo = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.PUB_RECOMMEND_LINEUP_UI_CAMPANALYSE) as Config.language_ui.Record;
        this.lab_core_hero_title.string = coreHeroInfo.cn;
        this.lab_lineup_analysis_title.string = campAnalyseInfo.cn;
        var lab_detail = this.btn_view_detail.getChildByName("lab_veiw_detail")?.getComponent(Label);
        if(lab_detail)
        {
            lab_detail.string = detailInfo.cn;
        }
        var lab_retract = this.btn_view_detail.getChildByName("lab_retract")?.getComponent(Label);
        if(lab_retract)
        {
            lab_retract.string = packUpInfo.cn;
        }
        for(var i=0; i < this._HeroIdArray.length; i++)
        {
            this.initHeroIconPrefab(i,this._HeroIdArray[i]);
        }
        this.setAllDesLabelAndBtnState(false);
        this.setShowViewDetailState(false);
    }

    public setShowViewDetailState(bShow:boolean)
    {
        var nodeTransForm = this.node.getComponent(UITransform); //.contentSize = 
        let node = this.node?.getChildByName("node");
        //.getComponent(UITransform);
        
        if(nodeTransForm)
        {
            nodeTransForm.contentSize = bShow? new Size(600,360) : new Size(600,190);
        }
        if(node)
        {
            let bgDescTransForm = node?.getChildByName("bg_dec")?.getComponent(UITransform);;
            if(bgDescTransForm)
            {
                bgDescTransForm.contentSize = bShow? new Size(600,210) : new Size(600,40) ;
            }
        }
        
    }

    public setViewDetaiLabelContent(data : XStruct.lineup_item_info.Record)
    {
        // let data = instantiate(info);
        this.lab_team_name.string = data.title;
        this.lab_core_hero.string  = data.coreHeroName;
        this.lab_lineup_analysis.string = data.analysisDetail ;
        this._HeroIdArray = data.heorIdList;
    }
}


