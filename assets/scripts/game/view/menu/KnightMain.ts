
import { _decorator, Component, Node, ToggleContainer, EventHandler, Toggle, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('KnightMain')
export class KnightMain extends Component {
    
    @property({type: Node })
    public pNode:Node | null = null;
    
    @property({type: Node })
    public btnClose:Node | null = null;

    start () {
        this.btnClose?.on(Node.EventType.TOUCH_END, this.closeHandle, this);
        this.show();
    }
    
    show(){
        console.log("show--------------")
        console.log(this.pNode)
        // this.pNode?.setPosition(new Vec3(0,-900,0));
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
