
import { _decorator, Component, Node, ToggleContainer, EventHandler, Toggle, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BagMain')
export class BagMain extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({type: ToggleContainer })
    public selectGroup:ToggleContainer | null = null;
    
    @property({type: Node })
    public fragNode:Node | null = null;
    
    @property({type: Node })
    public equipNode:Node | null = null;
    
    @property({type: Node })
    public propsNode:Node | null = null;
    
    @property({type: Node })
    public pNode:Node | null = null;
    
    @property({type: Node })
    public btnClose:Node | null = null;

    start () {
        // [3]
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'BagMain';// 这个是代码文件名
        containerEventHandler.handler = 'tabClick';
        containerEventHandler.customEventData = '';
        this.selectGroup?.checkEvents.push(containerEventHandler);
        this.btnClose?.on(Node.EventType.TOUCH_END, this.closeHandle, this);
        this.show();
    }
    
    tabClick(event: Event, customEventData: string){
        //这里 event 是一个 Touch Event 对象，你可以通过 event.target 取到事件的发送节点
        // 这里的 customEventData 参数就等于之前设置的 'foobar'
        // console.log(event)
        // console.log(customEventData)
        let tog:Toggle = (event as Toggle);
        if(!(this.fragNode && this.equipNode && this.propsNode) )return;

        if(tog.node.name == "Toggle1"){
            this.fragNode.active = true;
            this.equipNode.active = false;
            this.propsNode.active = false;
        }else if(tog.node.name == "Toggle2"){
            this.fragNode.active = false;
            this.equipNode.active = true;
            this.propsNode.active = false;
        }else{
            this.fragNode.active = false;
            this.equipNode.active = false;
            this.propsNode.active = true;
        }
    }
    show(){
        tween(this.pNode)
        .to(0.1,{position:new Vec3(this.pNode?.getPosition().x,-340,0)})
        .call(() => {
        }).start()
    }
    hide(){
        
        tween(this.pNode)
        .to(0.1,{position:new Vec3(this.pNode?.getPosition().x,-900,0)})
        .call(() => {
            this.node.removeFromParent();
        }).start()
    }
    closeHandle(){
        this.hide();
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
