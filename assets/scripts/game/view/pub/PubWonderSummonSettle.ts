import { _decorator, Component, Node,Label } from 'cc';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
const { ccclass, property } = _decorator;

@ccclass('PubWonderSummonSettle')
export class PubWonderSummonSettle extends Component {
    @property({type: Label})
    public lab_title:Label | null = null;

    @property({type :  Node})
    public nodelist:Node[] = [];

    @property({type: Node})
    public node_one:Node | null = null;

    @property({type: Node})
    public node_ten:Node | null = null;

    start () {
        this.lab_title &&  (this.lab_title.string = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_CLICKTOCONTINUE));
    }
 
}
