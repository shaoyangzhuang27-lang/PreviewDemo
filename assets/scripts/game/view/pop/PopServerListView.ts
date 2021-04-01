
import { Button, Color, instantiate, resources, Size, Sprite, SpriteFrame } from 'cc';
import { _decorator, Node, EventHandler, ToggleContainer, UITransform, Label } from 'cc';
import { PopBase } from '../../../core/control/PopBase';

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

    //阵营技能内容
    private _initServerScrollView() {

        let allServer = [1,2,3,4,5,6]
        console.log("allServer.length????????????????????",allServer.length)
        
        for (let index = 0; index < allServer.length; index++) {
            let itemNode = this._createScrollItem()
            console.log("添加一次")
            this.content?.addChild(itemNode)
            itemNode.zo
        }
    }
    private _createScrollItem() {
        let cell_item = instantiate( this.item_res )

        // //高亮底图
        // if (isHighlight) {
        //     resources.load("ui/common/halo/高亮底/spriteFrame", SpriteFrame, (err, spriteFrame) => {
        //         if (!err && cell_item) {
        //             cell_item.getComponent(Sprite).spriteFrame = spriteFrame
        //         }
        //     });
        // }

        //服务器名字：
        cell_item.getChildByName("lab_serverName").getComponent(Label).string = "服务器名字000"


        //新服务器标识
        cell_item.getChildByName("spr_icon").active = false


        //载入头像
        resources.load('prefabs_ui/main/node_avatar', (err:any,res:any)=>{
            let p = instantiate( res )
            cell_item.getChildByName("node_avatar").addChild(p)

            // let script = p.getComponent("PopSettingView") as PopSettingView;
            // script.setIsMaskClose(false);
        } )

        //昵称
        cell_item.getChildByName("lab_nickName").getComponent(Label).string = "测试名字"

        //等级
        cell_item.getChildByName("lab_lv").getComponent(Label).string = "等级：" + 50

        //点击事件
        cell_item.on(Button.EventType.CLICK, this._onClick_server, this)

        cell_item.name = "669988"

        return cell_item
    }
    private _onServerClick(event:Event, customEventData:string) {
        console.log("点击了服务器************************",customEventData)
    }
    private _onClick_server(button:Button){
        console.log("点击 服务器11111",button.node.name)

        
    }
}
