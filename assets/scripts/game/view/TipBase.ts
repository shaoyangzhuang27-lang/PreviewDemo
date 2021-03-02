
import { _decorator, Component, Node, Vec3, UITransform, math, view, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TipBase')
export class TipBase extends Component {
    
    @property({type: Node})
    public mask:Node = null as unknown as Node;
    
    @property({type: Node})
    public window:Node = null as unknown as Node;

    private isWinNotClose = false;
    start () {
        this.mask.on(Node.EventType.TOUCH_END, this.onMaskClick, this);
    }
    onMaskClick(event:EventTouch){
        let notClose = this.isWinNotClose && this.isInWin(event)
        if(!notClose){
            this.node.destroy();
        }
    }
    private isInWin(event:EventTouch){

        let nodeSize = this.node.getComponent(UITransform)?.contentSize as math.Size;
        let winSize = this.window.getComponent(UITransform)?.contentSize as math.Size;
        let winPos = this.window.getPosition();

        let posX = event.touch?.getLocationX() as number;
        let posY = event.touch?.getLocationY() as number;
        let pos = new Vec3(posX/view.getFrameSize().width * 720,posY/view.getFrameSize().width * 720,0);

        let isInWin = (Math.abs(pos.x-nodeSize.width/2 - winPos.x) < winSize.width / 2) && (Math.abs(pos.y-nodeSize.height/2 - winPos.y) < winSize.height / 2);
        return isInWin;
    }

    public setIsWinClose(bo:boolean){
        this.isWinNotClose = bo;
    }

    /**
     * 
     * @param pos 提示窗的界面位置
     * @param align 对齐方式 0:居中对齐 1:上下对齐 2:左右对齐
     * @param isViewPos 是否屏幕真实坐标
     */
    public setWinPos(pos:Vec3,align:number = 0,isViewPos:boolean = true){
        if(isViewPos){
            pos.x = pos.x / view.getFrameSize().width * 720
            pos.y = pos.y / view.getFrameSize().width * 720
        }

        let nodeSize = this.node.getComponent(UITransform)?.contentSize as math.Size;
        let winSize = this.window.getComponent(UITransform)?.contentSize as math.Size;
        pos.x -= nodeSize.width/2;
        pos.y -= nodeSize.height/2;

        if(align == 1){
            if(pos.y < 0){
                pos.y += winSize.height/2;
            }else{
                pos.y -= winSize.height/2;
            }
        }
        
        if(align == 2){
            if(pos.x < 0){
                pos.x += winSize.width/2;
            }else{
                pos.x -= winSize.width/2;
            }
        }


        if(pos.x > nodeSize.width/2 - winSize.width/2){
            pos.x = nodeSize.width/2 - winSize.width/2;
        }else if(pos.x < -(nodeSize.width/2 - winSize.width/2)){
            pos.x = -(nodeSize.width/2 - winSize.width/2);
        }
        
        if(pos.y > nodeSize.height/2 - winSize.height/2){
            pos.y = nodeSize.height/2 - winSize.height/2;
        }else if(pos.y < -(nodeSize.height/2 - winSize.height/2)){
            pos.y  = -(nodeSize.height/2 - winSize.height/2);
        }

        this.window.setPosition(pos)
    }

}
