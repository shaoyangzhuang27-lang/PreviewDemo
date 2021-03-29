
import { _decorator, Component, Node,Label,ProgressBar,Button,Sprite,Color,resources,RichText,instantiate } from 'cc';
import { GameModel } from '../../model/GameModel';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { HeroIcon } from '../hero/HeroIcon';
import { ItemEquipType,ItemEquipCell } from '../menu/ItemEquipCell';
import { PopMgr } from '../../control/PopMgr';
const { ccclass, property } = _decorator;

@ccclass('PubWonderSummon')
export class PubWonderSummon extends Component {
    @property({type: Node})
    public node_hero:Node | null = null;
    @property({type: Node})
    public node_dimond:Node | null = null;
    @property({type: Node})
    public node_equip_0:Node | null = null;
    @property({type: Node})
    public node_equip_1:Node | null = null;
    @property({type: Node})
    public node_equip_2:Node | null = null;
    @property({type: Node})
    public node_fragment_0:Node | null = null;
    @property({type: Node})
    public node_fragment_1:Node | null = null;
    @property({type: Label})
    public lab_prop_num = null as unknown as Label;
    @property({type: RichText})
    public lab_bar_rich = null as unknown as RichText;

    @property({type: Label})
    public lab_summon_ad:Label | null = null;

    @property({type: Label})
    public lab_summon_detail:Label | null = null;


    @property({type: Button})
    public btn_detail = null as unknown as Button;

    @property({type: Button})
    public btn_summon_one = null as unknown as Button;

    @property({type: Button})
    public btn_summon_ten = null as unknown as Button;

    //奇迹召唤召唤进度
    private _nWonderSummonProgress : number = 0;
    start () {
        // [3]
        this.updateProgressProcess();
        this.updateBtnSummonState();
        this.initHeroIconPrefab();
    }


    public updateBtnSummonState()
    {
        var lab_one = this.btn_summon_one.node.getChildByName("lab_summon_num")?.getComponent(Label);
        var img_one_remind = this.btn_summon_one.node.getChildByName("img_summon_remind")?.getComponent(Sprite);
        var lab_ten = this.btn_summon_ten.node.getChildByName("lab_summon_num")?.getComponent(Label);
        var img_ten_remind = this.btn_summon_ten.node.getChildByName("img_summon_remind")?.getComponent(Sprite);
        let changeLabColor = (obj : Label,bWhite : boolean)=>{
            obj.color = bWhite ? Color.WHITE :  Color.RED ;
        }

        var nCurDiamonds =  GameModel.getInstance().getHeroPubModel().getPlayerDiamondCounts();
        lab_one && (lab_one.string = "x" + String(XConsts.PUB_SUMMON_WONDER_ONE_COSUME)) && changeLabColor(lab_one,nCurDiamonds >= XConsts.PUB_SUMMON_WONDER_ONE_COSUME);
        lab_ten && (lab_ten.string = String(XConsts.PUB_SUMMON_WONDER_TEN_COSUME)) && changeLabColor(lab_ten,nCurDiamonds >= XConsts.PUB_SUMMON_WONDER_TEN_COSUME);
        img_one_remind && (img_one_remind.node.active = nCurDiamonds >= XConsts.PUB_SUMMON_WONDER_ONE_COSUME);
        img_ten_remind && (img_ten_remind.node.active = nCurDiamonds >= XConsts.PUB_SUMMON_WONDER_TEN_COSUME);

    }
    public updateProgressProcess()
    {
        this._nWonderSummonProgress = GameModel.getInstance().getHeroPubModel().getPlayerWonderTimes();

        if(this.lab_bar_rich)
        {
            var strInfo = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_WONDERSUMMONRESIDUE);
            var newStr = strInfo.replace("{0}",String(XConsts.PUB_WONDER_SUMMON_COUNT_MAX - this._nWonderSummonProgress));
            this.lab_bar_rich.string = newStr
        }
        var nodWindow = this.node.getChildByName("window");
        var node_wonder_progress = nodWindow?.getChildByName("node_wonder_progress");
        var barProgress = node_wonder_progress?.getChildByName("bar_progress");
        var barCompoent = barProgress?.getComponent(ProgressBar);
        if(barCompoent)
        {
            barCompoent.progress = this._nWonderSummonProgress /XConsts.PUB_WONDER_SUMMON_COUNT_MAX ;
        }

    }


    public initHeroIconPrefab()
    {
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
            let _heroIcon = instantiate(res);
            _heroIcon.setScale(0.4,0.4,1)
            let script = _heroIcon.getComponent(HeroIcon); 
            script.initUIHeroIconInfo(GameModel.getInstance().getHeroPubModel().getPlayerWonderHero(),XConsts.HERO_ICON_TYPE.WonderSummon);    
            script.setBtnCallBack(()=>{
                PopMgr.getInstance().popOpenBookHeroDetail(GameModel.getInstance().getHeroPubModel().getPlayerWonderHero());
            })
            this.node_hero?.addChild(_heroIcon);   
        });

        resources.load('prefabs_ui/main/itemequip_cell', (err:any,res:any)=>{
            let itemEquipCell = instantiate(res);
            //钻石 
            itemEquipCell.setScale(0.6,0.6,1)
            let id = Msg.TObjectType.EObject_VRmb; 
            let num = XConsts.PUB_UI_WONDER_DEFAULT_DIAMOND_REWARD;
            // 设置装备点击回调
            let script = itemEquipCell.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemType(id, num, ItemEquipType.goods, 
                ()=>{
                    console.log("点击钻石显示道具信息")
                    PopMgr.getInstance().popItemUseSellView(id,ItemEquipType.goods,true);
            });  

            this.node_dimond?.addChild(itemEquipCell);   
        });
    }
  
}

