
import { _decorator, Component, Node,Label,ProgressBar,Button } from 'cc';
import { GameModel } from '../../model/GameModel';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
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
    @property({type: Label})
    public lab_bar_info:Label | null = null;

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
    }


    public updateProgressProcess()
    {
        this._nWonderSummonProgress = GameModel.getInstance().getHeroPubModel().getPlayerSummonScore();

        if(this.lab_bar_info)
        {
            var strInfo = GameModel.getInstance().getHeroPubModel().getPubUILabContentByUIName("lab_bar_info");
            var newStr = strInfo.replace("{0}",String(XConsts.PUB_HERO_SUMMON_COUNT_MAX - this._nWonderSummonProgress));
            this.lab_bar_info.string = newStr
        }
        var nodWindow = this.node.getChildByName("window");
        var node_ordinary = nodWindow?.getChildByName("node_ordinary");
        var nodeDiamond = node_ordinary?.getChildByName("node_diamond");
        var barProgress = nodeDiamond?.getChildByName("bar_progress");
        var barCompoent = barProgress?.getComponent(ProgressBar);
        var labBarProgress = nodeDiamond?.getChildByName("lab_bar_progress");
        var labCompoent = labBarProgress?.getComponent(Label);
        if(barCompoent)
        {
            barCompoent.progress = this._nWonderSummonProgress /XConsts.PUB_HERO_SUMMON_COUNT_MAX ;
        }
        if(labCompoent)
        {
            var str = "{0}/30";
            labCompoent.string = str.replace("{0}",String(this._nWonderSummonProgress));
        }
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
}

