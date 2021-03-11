
import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemEquipCell')
export class ItemEquipCell extends Component {
    @property({type :  Node})
    public img_bg:Node = null as unknown as Node;

    @property({type :  Node})
    public img_icon:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_frame:Node = null as unknown as Node;

    @property({type :  Node})
    public starlist:Node[] = [];

    @property({type :  Label})
    public lab_count:Label = null as unknown as Label;

    @property({type :  Label})
    public lab_info:Label = null as unknown as Label;

    @property({type :  Node})
    public img_infoBg:Node = null as unknown as Node;

    private _itemType : number = 1;     //区分道具:1、装备:2 
    start () {
        this.btn_frame.on(Node.EventType.TOUCH_END, this._openItemEquipInfoView, this);
    }

    public setItemType(type:number)
    {
        this._initIcon();
    }

    private _initIcon()
    {

    }

    private _openItemEquipInfoView()
    {

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
