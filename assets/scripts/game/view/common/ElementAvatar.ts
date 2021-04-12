
import { Button, ButtonComponent, Component, Sprite, SpriteFrame } from 'cc';
import { _decorator, Node, Label } from 'cc';
import { PopMgr } from '../../control/PopMgr';
const { ccclass, property } = _decorator;

@ccclass('ElementAvatar')
export class ElementAvatar extends Component {

    @property({ type:Sprite, displayName:"头像精灵" })
    public spr_avatar:Sprite = null as unknown as Sprite

    @property({ type:Node, displayName:"远程头像节点" })
    public node_remoteAvatar:Node = null as unknown as Node

    @property({ type:Sprite, displayName:"头像框" })
    public spr_box:Sprite = null as unknown as Sprite

    @property({ type:Sprite, displayName:"等级底图" })
    public spr_lvbg:Sprite = null as unknown as Sprite

    @property({ type:Label, displayName:"等级" })
    public lab_lv:Label = null as unknown as Label

    onLoad() {
        
    }
    start() {

    }
    onDestroy(){
        
    }

    //设置数据
    public setPlayerData() {

    }

    //设置数据
    public setBriefPlayerData(playerInfo:Msg.IPlayerBriefInfo){
        //等级
        this.lab_lv.string = playerInfo.level?.toString() as string
    }

    //隐藏等级
    public hideLevel() {
        this.spr_lvbg.node.active = false
    }

    //开启点击
    public openClick() {
        let button = this.getComponent(ButtonComponent) as ButtonComponent
        button.interactable = true
        //绑定按钮事件
        this.node.on(Button.EventType.CLICK, this._onClick, this)
    }

    //点击回调
    private _onClick(event:any){
        console.log("点击 头像")
        PopMgr.getInstance().popSettingView()
    }
    
}
