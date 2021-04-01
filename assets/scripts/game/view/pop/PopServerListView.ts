
import { Button, Color, game, instantiate, resources, Size, Sprite, SpriteFrame } from 'cc';
import { _decorator, Node, EventHandler, ToggleContainer, UITransform, Label } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { PopMgr } from '../../control/PopMgr';
import { DataMgr } from '../../model/DataMgr';
import { GameModel } from '../../model/GameModel';
import { AvatarNode } from '../menu/AvatarNode';

const { ccclass, property } = _decorator;

@ccclass('PopServerListView')
export class PopServerListView extends PopBase {

    @property({ type:Node, displayName:"滚动内容节点" })
    public content:Node = null as unknown as Node

    //单项子节点预制体资源
    private item_res: any;

    onLoad() {
        super.onLoad()
    }
    start () {
        super.start()
    }
    onDestroy(){
        super.onDestroy()
    }

    public setData() {
        resources.load('prefabs_ui/main/server_item', (err:any,res:any)=>{
            this.item_res = res
            console.log("加载成功1111111111111111111111111111")
            this._initServerScrollView()
        })
    }

    //服务器列表
    private _initServerScrollView() {
        //最大服务器id 从1开始的
        let maxServerID = DataMgr.getInstance().getGameConfig()?.maxServerID as number

        //当前所在服务器id
        let curServerID = GameModel.getInstance().getPlayerModel().getPlayerInfo().serverID

        //所有觉得信息
        let allPlayerList = GameModel.getInstance().getSystemModel().getAllPlayerData()

        console.log("maxServerID????????????????????",maxServerID)

        for (let serverID = 1; serverID <= maxServerID; serverID++) {
            let isCurServer = serverID == curServerID
            let itemNode = this._createScrollItem(serverID, isCurServer)
            this.content?.addChild(itemNode)
        }
    }

    //服务器cell
    private _createScrollItem(serverID:number, isCurServer:boolean) {
        let cell_item = instantiate( this.item_res )

        //高亮底图
        if (isCurServer) {
            resources.load("ui/common/halo/高亮底/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                if (!err && cell_item) {
                    cell_item.getComponent(Sprite).spriteFrame = spriteFrame
                }
            });
        }
        else {
            //不是当前所在服务器 添加点击事件
            cell_item.name = serverID.toString()
            cell_item.on(Button.EventType.CLICK, this._onClick_server, this)
        }

        //服务器名字：
        let serverName = "S"
        if (serverID < 100) { serverName += "0" }
        if (serverID < 10) { serverName += "0" }
        serverName += serverID.toString()
        cell_item.getChildByName("lab_serverName").getComponent(Label).string = serverName

        //新服务器标识
        cell_item.getChildByName("spr_icon").active = false

        //此服务器的玩家数据
        let playerData = GameModel.getInstance().getSystemModel().getPlayerDataByServerID(serverID)

        //载入头像
        resources.load('prefabs_ui/main/node_avatar', (err:any,res:any)=>{
            if (!cell_item) { return }
            let p = instantiate( res )
            cell_item.getChildByName("node_avatar").addChild(p)

            let script = p.getComponent("AvatarNode") as AvatarNode;
            if (playerData) {
                script.setBriefPlayerData(playerData)
            }
        } )

        if (!playerData) {
            return cell_item
        }

        //昵称 当前版本没有昵称 先用id做测试
        cell_item.getChildByName("lab_nickName").getComponent(Label).string = playerData.playerID?.toString()

        //等级
        cell_item.getChildByName("lab_lv").getComponent(Label).string = "等级：" + playerData.level

        return cell_item
    }

    //点击服务器处理
    private _onClick_server(button:Button){
        console.log("点击 服务器 id=",button.node.name)
        let serverID = Number(button.node.name)
        //弹窗确认
        PopMgr.getInstance().popupSimpleWindow("注意","不同服务器之间角色数据不互通，是否确定切换？",()=>{
            console.log("确认切换服务器 serverID=",serverID)
        })
    }
}
