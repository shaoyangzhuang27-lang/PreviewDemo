
import { Button, Color, game, instantiate, Prefab, resources, Size, Sprite, SpriteFrame, tween } from 'cc';
import { _decorator, Node, EventHandler, ToggleContainer, UITransform, Label } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { MsgMgr } from '../../../control/MsgMgr';
import { PopMgr } from '../../../control/PopMgr';
import { ResMgr } from '../../../control/ResMgr';
import { DataMgr } from '../../../model/DataMgr';
import { GameModel } from '../../../model/GameModel';
import { ElementAvatar } from '../../common/ElementAvatar';


const { ccclass, property } = _decorator;

@ccclass('PopServerList')
export class PopServerList extends PopBase {

    @property({ type:Label, displayName:"标题" })
    public lab_title:Label = null as unknown as Label

    @property({ type:Node, displayName:"滚动内容节点" })
    public content:Node = null as unknown as Node

    @property({ type:Button, displayName:"确定按钮" })
    public btn_sure:Button = null as unknown as Button

    //单项子节点预制体资源
    private item_res:Prefab = null as unknown as Prefab

    //当前服务器id
    private _curSelectServerID:number = 0
    private _curAtServerID:number = 0

    onLoad() {
        super.onLoad()

        //顶部标题
        this.lab_title.string = "选择服务器"

        //绑定事件
        this.btn_sure.node.on(Button.EventType.CLICK, this._onClick_sure, this)
    }
    start () {
        super.start()

        tween(this.node)
            .delay(0.01)
            .call(()=>{
                this._loadData()
            })
            .start()
    }
    onDestroy() {
        super.onDestroy()
    }

    public _loadData() {
        ResMgr.getInstance().loadPrefab("prefabs_ui/features/setting/cell_server", (err:any, res:Prefab | null)=>{
            this.item_res = res as Prefab
            
            this._initServerScrollView()
        })
    }

    private _onClick_sure(button:Button) {
        if (this._curSelectServerID == this._curAtServerID) {
            return
        }
        //弹窗确认
        PopMgr.getInstance().popupSimpleWindow("注意","不同服务器之间角色数据不互通，是否确定切换？",()=>{
            console.log("确认切换服务器 serverID=",this._curSelectServerID)

            PopMgr.getInstance().deleteWindow()
			MsgMgr.getInstance().getMsgLogin().requestChangeServer(this._curSelectServerID);
        })
    }

    //服务器列表
    private _initServerScrollView() {
        //最大服务器id 从1开始的
        let maxServerID = DataMgr.getInstance().getGameConfig()?.maxServerID as number
        // console.log("maxServerID????????????????????",maxServerID)

        //当前所在服务器id
        this._curAtServerID = GameModel.getInstance().getPlayerModel().getPlayerInfo().serverID
        this._curSelectServerID = this._curAtServerID

        for (let serverID = 1; serverID <= maxServerID; serverID++) {
            let itemNode = this._createScrollItem(serverID)
            this.content?.addChild(itemNode)
        }
        this._highLightCell()
    }

    //高亮处理
    private _highLightCell() {
        let allCell = this.content.children
        for (let index = 0; index < allCell.length; index++) {
            const cell_item = allCell[index];
            let serverID = Number(cell_item.name)
            
            //高亮底图
            if (serverID == this._curSelectServerID) {
                ResMgr.getInstance().loadSpriteFrame("ui/features/setting/bnt_biaoqianye_xuanzhong/spriteFrame", (err:any, spriteFrame:SpriteFrame | null)=>{
                    if (!err && cell_item) {
                        let spr = cell_item.getComponent(Sprite) as Sprite
                        spr.spriteFrame = spriteFrame
                    }
                });
            }
            else {
                ResMgr.getInstance().loadSpriteFrame("ui/features/setting/bnt_biaoqianye_weixuanzhong/spriteFrame", (err:any, spriteFrame:SpriteFrame | null)=>{
                    if (!err && cell_item) {
                        let spr = cell_item.getComponent(Sprite) as Sprite
                        spr.spriteFrame = spriteFrame
                    }
                });
            }
        }
    }

    //服务器cell
    private _createScrollItem(serverID:number) {
        let cell_item = instantiate( this.item_res as Prefab ) as Node

        //添加点击事件
        cell_item.name = serverID.toString()
        cell_item.on(Button.EventType.CLICK, this._onClick_server, this)
        
        //服务器名字：
        let serverName = "S"
        if (serverID < 100) { serverName += "0" }
        if (serverID < 10) { serverName += "0" }
        serverName += serverID.toString()
        let lab = cell_item.getChildByName("lab_serverName")?.getComponent(Label) as Label
        lab.string = serverName

        //新服务器标识
        let spr_icon = cell_item.getChildByName("spr_icon") as Node
        spr_icon.active = false

        //此服务器的玩家数据
        let playerData = GameModel.getInstance().getSystemModel().getPlayerDataByServerID(serverID)

        //载入头像
        ResMgr.getInstance().loadPrefab("prefabs_ui/common/element_avatar", (err:any, res:Prefab | null)=>{
            if (!cell_item) { return }
            let p = instantiate( res as Prefab ) as Node

            let node_avatar = cell_item.getChildByName("node_avatar") as Node
            node_avatar.addChild(p)

            let script = p.getComponent("ElementAvatar") as ElementAvatar;
            if (playerData) {
                script.setBriefPlayerData(playerData)
            }
        } )

        if (!playerData) {
            return cell_item
        }

        //昵称 当前版本没有昵称 先用id做测试
        let lab_nickName = cell_item.getChildByName("lab_nickName")?.getComponent(Label) as Label
        lab_nickName.string = playerData.playerID?.toString() as string

        //等级
        let lab_lv = cell_item.getChildByName("lab_lv")?.getComponent(Label)  as Label
        lab_lv.string = "等级：" + playerData.level

        return cell_item
    }

    //点击服务器处理
    private _onClick_server(button:Button){
        console.log("点击 服务器 id=",button.node.name)
        let serverID = Number(button.node.name)

        this._curSelectServerID = serverID

        this._highLightCell()
    }
}
