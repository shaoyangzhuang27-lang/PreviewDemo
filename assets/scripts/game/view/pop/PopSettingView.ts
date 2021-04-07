
import { Button, Color, instantiate, Prefab, ProgressBar, resources, Size, Sprite, SpriteFrame, Toggle, ToggleComponent } from 'cc';
import { _decorator, Node, EventHandler, ToggleContainer, UITransform, Label } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { PopMgr } from '../../control/PopMgr';
import { ResMgr } from '../../control/ResMgr';
import { GameModel } from '../../model/GameModel';
import { TableName, ValueMgr } from '../../model/ValueMgr';
import { AvatarNode } from '../menu/AvatarNode';
const { ccclass, property } = _decorator;

@ccclass('PopSettingView')
export class PopSettingView extends PopBase {

    @property({ type:ToggleContainer })
    public node_tabBtn:ToggleContainer = null as unknown as ToggleContainer
    
    @property({ type:Node, displayName:"信息节点" })
    public node_info:Node = null as unknown as Node

    @property({ type:Node, displayName:"设置节点" })
    public node_set:Node = null as unknown as Node

    @property({ type:Node, displayName:"头像节点" })
    public node_avatar:Node = null as unknown as Node

    @property({ type:Label, displayName:"昵称" })
    public lab_nickName:Label = null as unknown as Label

    @property({ type:Label, displayName:"id" })
    public lab_id:Label = null as unknown as Label

    @property({ type:Node, displayName:"同步按钮" })
    public labbtn_updateInfo:Node = null as unknown as Node

    @property({ type:ProgressBar, displayName:"经验条" })
    public progressBar_exp:ProgressBar = null as unknown as ProgressBar

    @property({ type:Label, displayName:"经验值" })
    public lab_exp:Label = null as unknown as Label

    @property({ type:Button, displayName:"服务器按钮" })
    public btn_server:Button = null as unknown as Button

    @property({ type:Button, displayName:"客服按钮" })
    public btn_service:Button = null as unknown as Button

    @property({ type:Button, displayName:"兑换按钮" })
    public btn_gift:Button = null as unknown as Button

    @property({ type:ToggleComponent, displayName:"音乐开关" })
    public toggle_music:ToggleComponent = null as unknown as ToggleComponent

    @property({ type:ToggleComponent, displayName:"音效开关" })
    public toggle_effect:ToggleComponent = null as unknown as ToggleComponent
    
    onLoad() {
        super.onLoad()

        //绑定按钮组点击事件
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'PopSettingView';// 这个是脚本类名
        containerEventHandler.handler = '_tabBtnClick';
        this.node_tabBtn.checkEvents.push(containerEventHandler)

        //绑定按钮事件
        this.labbtn_updateInfo.on(Node.EventType.TOUCH_END, this._onClick_updateInfo, this)

        //绑定按钮事件
        this.btn_server.node.on(Button.EventType.CLICK, this._onClick_server, this)
        this.btn_service.node.on(Button.EventType.CLICK, this._onClick_service, this)
        this.btn_gift.node.on(Button.EventType.CLICK, this._onClick_gift, this)

        //绑定复选框事件
        this.toggle_music.node.on(Toggle.EventType.TOGGLE, this._onClick_music,this)
        this.toggle_effect.node.on(Toggle.EventType.TOGGLE, this._onClick_effect,this)
    }
    start() {
        super.start()

        //默认显示信息
        this._showInfoView()

        //赋值信息显示
        let playerInfo = GameModel.getInstance().getPlayerModel().getPlayerInfo()

        //玩家昵称
        this.lab_nickName.string = playerInfo.name

        //玩家ID
        this.lab_id.string = "ID：" + playerInfo.id

        //经验
        let curLv = playerInfo.level
        let curExp = playerInfo.exp
        let dataItem = ValueMgr.getInstance().getItemByField(TableName.upgrade_exp,curLv) as Config.upgrade_exp.Record
        let curLvAllExp = dataItem.playerExp
        console.log("经验值==========", playerInfo.level, curExp, curLvAllExp)
        //经验条
        this.progressBar_exp.progress = curExp/curLvAllExp
        //经验值
        this.lab_exp.string = curExp + "/" + curLvAllExp

        //游戏音乐开启/禁止
        let forbid_music = localStorage.getItem("forbid_music")
        if (forbid_music == "true") {
            this.toggle_music.setIsCheckedWithoutNotify(true)
        }
        else {
            this.toggle_music.setIsCheckedWithoutNotify(false)
        }

        //游戏音效开启/禁止
        let forbid_effect = localStorage.getItem("forbid_effect")
        if (forbid_effect == "true") {
            this.toggle_effect.setIsCheckedWithoutNotify(true)
        }
        else {
            this.toggle_effect.setIsCheckedWithoutNotify(false)
        }

        //载入头像
        ResMgr.getInstance().loadPrefab("prefabs_ui/main/node_avatar", (err:any, res:Prefab | null)=>{
            let p = instantiate( res as Prefab ) as Node
            this.node_avatar.addChild(p)

            // let script = p.getComponent("AvatarNode") as AvatarNode;
            // script.openClick()
        })
    }
    onDestroy(){
        super.onDestroy()
    }

    //按钮组点击事件
    private _tabBtnClick(event:Event, customEventData:string) {
        let targetNode = event.target as any
        console.log("PopSettingView 按钮组点击事件 ",targetNode.name)
        if (targetNode.name == "Toggle1") {
            this._showInfoView()
        }
        else {
            this._showSetView()
        }
    }
    //显示信息
    private _showInfoView() {
        this.node_info.active = true
        this.node_set.active = false
    }
    //显示设置
    private _showSetView() {
        this.node_info.active = false
        this.node_set.active = true
    }

    private _onClick_updateInfo(event:any){
        console.log("点击 同步微信")
    }

    private _onClick_server(button:Button){
        console.log("点击 服务器")

        PopMgr.getInstance().popServerListView()
    }
    private _onClick_service(button:Button){
        console.log("点击 客服")

        //https://developers.weixin.qq.com/minigame/dev/api/open-api/customer-message/wx.openCustomerServiceConversation.html
        // if (window.wx) {
        //     window.wx.openCustomerServiceConversation({});
        // }
    }
    private _onClick_gift(button:Button){
        console.log("点击 兑换")

        PopMgr.getInstance().popGiftCodeExchangeWindow()
    }

    private _onClick_music(toggle:ToggleComponent){
        console.log("点击 音乐")
        
        if (toggle.isChecked) {
            console.log("禁止音乐：选中了")
            localStorage.setItem("forbid_music","true")

            console.log("禁止音乐 功能待实现")
        }
        else {
            console.log("禁止音乐：关闭了")
            localStorage.setItem("forbid_music","false")

            console.log("禁止音乐 功能待实现")
        }
    }
    private _onClick_effect(toggle:ToggleComponent){
        console.log("点击 音效")

        if (toggle.isChecked) {
            console.log("禁止音效：选中了")
            localStorage.setItem("forbid_effect","true")

            console.log("禁止音效：选中了 功能待实现")
        }
        else {
            console.log("禁止音效：关闭了")
            localStorage.setItem("forbid_effect","false")

            console.log("禁止音效：选中了 功能待实现")
        }
    }
}
