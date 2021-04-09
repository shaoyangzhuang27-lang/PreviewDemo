
import { Button, Color, instantiate, Prefab, ProgressBar, resources, Size, Sprite, SpriteFrame, Toggle, ToggleComponent, tween, Tween } from 'cc';
import { _decorator, Node, EventHandler, ToggleContainer, UITransform, Label } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { PopMgr } from '../../../control/PopMgr';
import { ResMgr } from '../../../control/ResMgr';
import { GameModel } from '../../../model/GameModel';
import { TableName, ValueMgr } from '../../../model/ValueMgr';
import { AvatarNode } from '../../menu/AvatarNode';

const { ccclass, property } = _decorator;

@ccclass('PopSetting')
export class PopSetting extends PopBase {

    @property({ type:Label, displayName:"标题" })
    public lab_title:Label = null as unknown as Label

    @property({ type:Node, displayName:"头像节点" })
    public node_avatar:Node = null as unknown as Node

    @property({ type:Label, displayName:"昵称" })
    public lab_nickName:Label = null as unknown as Label

    @property({ type:Label, displayName:"id" })
    public lab_id:Label = null as unknown as Label

    @property({ type:Label, displayName:"服务器" })
    public lab_server:Label = null as unknown as Label

    @property({ type:Node, displayName:"同步按钮" })
    public labbtn_updateInfo:Node = null as unknown as Node

    @property({ type:ProgressBar, displayName:"经验条" })
    public progressBar_exp:ProgressBar = null as unknown as ProgressBar

    @property({ type:Label, displayName:"经验值" })
    public lab_exp:Label = null as unknown as Label


    @property({ type:ToggleComponent, displayName:"信息按钮" })
    public toggle_info:ToggleComponent = null as unknown as ToggleComponent
    @property({ type:ToggleComponent, displayName:"设置按钮" })
    public toggle_set:ToggleComponent = null as unknown as ToggleComponent
    
    @property({ type:Node, displayName:"信息节点" })
    public node_info:Node = null as unknown as Node

    @property({ type:Node, displayName:"设置节点" })
    public node_set:Node = null as unknown as Node

    @property({ type:Button, displayName:"服务器按钮" })
    public btn_server:Button = null as unknown as Button

    @property({ type:Button, displayName:"客服按钮" })
    public btn_service:Button = null as unknown as Button

    @property({ type:Button, displayName:"兑换按钮" })
    public btn_gift:Button = null as unknown as Button

    @property({ type:ToggleComponent, displayName:"音乐开" })
    public toggle_music_on:ToggleComponent = null as unknown as ToggleComponent
    @property({ type:ToggleComponent, displayName:"音乐关" })
    public toggle_music_off:ToggleComponent = null as unknown as ToggleComponent

    @property({ type:ToggleComponent, displayName:"音效开" })
    public toggle_effect_on:ToggleComponent = null as unknown as ToggleComponent
    @property({ type:ToggleComponent, displayName:"音效关" })
    public toggle_effect_off:ToggleComponent = null as unknown as ToggleComponent

    @property({ type:ToggleComponent, displayName:"画质高" })
    public toggle_max:ToggleComponent = null as unknown as ToggleComponent
    @property({ type:ToggleComponent, displayName:"画质底" })
    public toggle_min:ToggleComponent = null as unknown as ToggleComponent

    @property({ type:ToggleComponent, displayName:"左边操作" })
    public toggle_left:ToggleComponent = null as unknown as ToggleComponent
    @property({ type:ToggleComponent, displayName:"右边操作" })
    public toggle_right:ToggleComponent = null as unknown as ToggleComponent

    @property({ type:ToggleComponent, displayName:"固定镜头" })
    public toggle_static:ToggleComponent = null as unknown as ToggleComponent
    @property({ type:ToggleComponent, displayName:"跟随镜头" })
    public toggle_move:ToggleComponent = null as unknown as ToggleComponent
    
    onLoad() {
        super.onLoad()

        //绑定按钮事件
        this.toggle_info.node.on(Toggle.EventType.TOGGLE, this._onClick_view, this)
        this.toggle_set.node.on(Toggle.EventType.TOGGLE, this._onClick_view, this)

        this.labbtn_updateInfo.on(Node.EventType.TOUCH_END, this._onClick_updateInfo, this)

        this.btn_server.node.on(Button.EventType.CLICK, this._onClick_server, this)
        this.btn_service.node.on(Button.EventType.CLICK, this._onClick_service, this)
        this.btn_gift.node.on(Button.EventType.CLICK, this._onClick_gift, this)

        //音乐
        this.toggle_music_on.node.on(Toggle.EventType.TOGGLE, this._onClick_music, this)
        this.toggle_music_off.node.on(Toggle.EventType.TOGGLE, this._onClick_music, this)
        //音效
        this.toggle_effect_on.node.on(Toggle.EventType.TOGGLE, this._onClick_effect, this)
        this.toggle_effect_off.node.on(Toggle.EventType.TOGGLE, this._onClick_effect, this)
        //画质
        this.toggle_max.node.on(Toggle.EventType.TOGGLE, this._onClick_quality, this)
        this.toggle_min.node.on(Toggle.EventType.TOGGLE, this._onClick_quality, this)
        //操作
        this.toggle_left.node.on(Toggle.EventType.TOGGLE, this._onClick_handle, this)
        this.toggle_right.node.on(Toggle.EventType.TOGGLE, this._onClick_handle, this)
        //镜头
        this.toggle_static.node.on(Toggle.EventType.TOGGLE, this._onClick_camera, this)
        this.toggle_move.node.on(Toggle.EventType.TOGGLE, this._onClick_camera, this)
    }
    start() {
        super.start()

        //顶部标题
        this.lab_title.string = "角色信息"

        //默认显示信息
        this._showInfoView()

        tween(this.node)
            .delay(0.01)
            .call(()=>{
                this._loadData()
            })
            .start()
    }
    onDestroy(){
        super.onDestroy()
    }

    public _loadData(){
        //赋值信息显示
        let playerInfo = GameModel.getInstance().getPlayerModel().getPlayerInfo()

        //头像
        ResMgr.getInstance().loadPrefab("prefabs_ui/main/node_avatar", (err:any, res:Prefab | null)=>{
            let p = instantiate( res as Prefab ) as Node
            this.node_avatar.addChild(p)

            let script = p.getComponent("AvatarNode") as AvatarNode;
            //当前所在服务器id
            let curServerID = GameModel.getInstance().getPlayerModel().getPlayerInfo().serverID
            //此服务器的玩家数据
            let playerData = GameModel.getInstance().getSystemModel().getPlayerDataByServerID(curServerID)
            if (playerData) {
                script.setBriefPlayerData(playerData)
            }
        })

        //玩家昵称
        this.lab_nickName.string = playerInfo.name

        //玩家ID
        this.lab_id.string = "ID：" + playerInfo.id

        //经验
        let curLv = playerInfo.level
        let curExp = playerInfo.exp
        let dataItem = ValueMgr.getInstance().getItemByField(TableName.upgrade_exp,curLv) as Config.upgrade_exp.Record
        let curLvAllExp = dataItem.playerExp
        // console.log("经验值==========", playerInfo.level, curExp, curLvAllExp)
        //经验条
        this.progressBar_exp.progress = curExp/curLvAllExp
        //经验值
        this.lab_exp.string = curExp + "/" + curLvAllExp

        //所在服务器
        let curServerID = GameModel.getInstance().getPlayerModel().getPlayerInfo().serverID
        let serverName = "服务器："
        if (curServerID < 100) { serverName += "0" }
        if (curServerID < 10) { serverName += "0" }
        serverName += curServerID.toString()
        this.lab_server.string = serverName

        
        //音乐
        let set_music = localStorage.getItem("set_music")
        if (set_music == "off") { this.toggle_music_off.setIsCheckedWithoutNotify(true) }
        else { this.toggle_music_on.setIsCheckedWithoutNotify(true) }

        //音效
        let set_effect = localStorage.getItem("set_effect")
        if (set_effect == "off") { this.toggle_effect_off.setIsCheckedWithoutNotify(true) }
        else { this.toggle_effect_on.setIsCheckedWithoutNotify(true) }

        //画质
        let set_quality = localStorage.getItem("set_quality")
        if (set_quality == "min") { this.toggle_min.setIsCheckedWithoutNotify(true) }
        else { this.toggle_max.setIsCheckedWithoutNotify(true) }

        //操作
        let set_handle = localStorage.getItem("set_handle")
        if (set_handle == "left") { this.toggle_left.setIsCheckedWithoutNotify(true) }
        else { this.toggle_right.setIsCheckedWithoutNotify(true) }

        //相机
        let set_camera = localStorage.getItem("set_camera")
        if (set_camera == "static") { this.toggle_static.setIsCheckedWithoutNotify(true) }
        else { this.toggle_move.setIsCheckedWithoutNotify(true) }
    }

    //按钮组点击事件
    private _onClick_view(toggle:ToggleComponent){
        if (toggle == this.toggle_info) {
            console.log("点击 信息")
            this._showInfoView()
        }
        else if (toggle == this.toggle_set) {
            console.log("点击 设置")
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
        if (toggle == this.toggle_music_on && toggle.isChecked) {
            console.log("点击 音乐开")
            
            localStorage.setItem("set_music","on")
        }
        else if (toggle == this.toggle_music_off && toggle.isChecked) {
            console.log("点击 音乐关")
            
            localStorage.setItem("set_music","off")
        }
    }
    private _onClick_effect(toggle:ToggleComponent){
        if (toggle == this.toggle_effect_on && toggle.isChecked) {
            console.log("点击 音效开")
            
            localStorage.setItem("set_effect","on")
        }
        else if (toggle == this.toggle_effect_off && toggle.isChecked) {
            console.log("点击 音效关")
            
            localStorage.setItem("set_effect","off")
        }
    }
    private _onClick_quality(toggle:ToggleComponent){
        if (toggle == this.toggle_max && toggle.isChecked) {
            console.log("点击 画质高")
            
            localStorage.setItem("set_quality","max")
        }
        else if (toggle == this.toggle_min && toggle.isChecked) {
            console.log("点击 画质低")
            
            localStorage.setItem("set_quality","min")
        }
    }
    private _onClick_handle(toggle:ToggleComponent){
        if (toggle == this.toggle_left && toggle.isChecked) {
            console.log("点击 左边操作")
            
            localStorage.setItem("set_handle","left")
        }
        else if (toggle == this.toggle_right && toggle.isChecked) {
            console.log("点击 右边操作")
            
            localStorage.setItem("set_handle","right")
        }
    }
    private _onClick_camera(toggle:ToggleComponent){
        if (toggle == this.toggle_static && toggle.isChecked) {
            console.log("点击 固定镜头")
            
            localStorage.setItem("set_camera","static")
        }
        else if (toggle == this.toggle_move && toggle.isChecked) {
            console.log("点击 跟随镜头")
            
            localStorage.setItem("set_camera","move")
        }
    }
}
