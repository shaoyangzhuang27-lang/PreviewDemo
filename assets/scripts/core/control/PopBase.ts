import { _decorator, Component, Node,Vec3,tween,Scene, EventTouch, UITransform, math, view, UIOpacity } from 'cc';
import { PopMgr } from '../../game/control/PopMgr';
const { ccclass, property } = _decorator;

@ccclass('PopBase')
export class PopBase extends Component {

    @property({type: Node, displayName: "关闭按钮[选填项]"})
    public btn_close:Node | null = null;

    // @property({type: Node})
    // public btn_submit:Node | null = null;

    @property({type: Node, displayName: "取消按钮[选填项]"})
    public btn_cancel:Node | null = null;

    @property({type: Node, displayName: "弹出窗口[必填项]"})
    public window:Node = null as unknown as Node;

    @property({type: Node, displayName: "遮罩层[必填项]"})
    public mask:Node = null as unknown as Node;

    private _isShow:boolean = false;
    private _isLive:boolean = false;
    private _isMaskClose:boolean = true;

    private _showTime:number = 0.15;
    private _hideTime:number = 0.15;
    private _isNeedHide:boolean = true;

    protected _closeFunc:Function | null = null;

    //弹窗初始化-----
    onLoad(){
        this.window.addComponent(UIOpacity);
        this.mask.addComponent(UIOpacity);
    }
    onDestroy(){
        
    }
    start () {
        // Your initialization goes here.
        this.btn_close?.on(Node.EventType.TOUCH_END, this._onClose, this);
        // this.btn_submit?.on(Node.EventType.TOUCH_END, this.onSubmit, this);
        this.btn_cancel?.on(Node.EventType.TOUCH_END, this._onClose, this);
        this.mask.on(Node.EventType.TOUCH_END, this._onMaskClick, this);

        this.show();
        // this.mask.active = true
        this.window.scale = new Vec3(0,0,1)
    }
    private _onMaskClick(event:EventTouch){
        let isInWin = this._isInWin(event)
        if(this._isMaskClose && this._isShow && this._closeFunc&&!isInWin){
            this._closeFunc();
        }
    }
    private _onClose(){
        if(this._closeFunc)
            this._closeFunc();
    }
    // onSubmit(){
    //     console.log("submit")
    // }
    //---------------------
    
    private _isInWin(event:EventTouch){

        let nodeSize = this.node.getComponent(UITransform)?.contentSize as math.Size;
        let winSize = this.window.getComponent(UITransform)?.contentSize as math.Size;
        let winPos = this.window.getPosition();

        let posX = event.touch?.getLocationX() as number;
        let posY = event.touch?.getLocationY() as number;
        let pos = new Vec3(posX/view.getFrameSize().width * 720,posY/view.getFrameSize().width * 720,0);

        let isInWin = (Math.abs(pos.x-nodeSize.width/2 - winPos.x) < winSize.width / 2) && (Math.abs(pos.y-nodeSize.height/2 - winPos.y) < winSize.height / 2);
        return isInWin;
    }
    private _setMaskVisible(bo:boolean){
        let op = this.mask.getComponent(UIOpacity) as UIOpacity;
        if(bo){
            op.opacity = 255;
        }else{
            op.opacity = 0;
        }
    }

    private _hasPop = false;
    public popSelf(){
        if(this._hasPop)return;
        this._hasPop = true;
        PopMgr.getInstance().pushWindow(this.node);
    }
    private _hasDel = false
    public delSelf(){
        if(this._hasDel)return;
        this._hasDel = true;
        PopMgr.getInstance().deleteWindow();
    }


    public createMe(closeFunc:Function){
        // node?.addChild(this.node);
        this._closeFunc = closeFunc;
        this._isLive = true;
        this.window.scale = new Vec3(0,0,1)
    }
    public deleteMe(){
        this._isLive = false;
        if(!this._isShow){
            this.node.destroy();
        }
    }
    public setIsMaskClose(bo:boolean){
        this._isMaskClose = bo;
    }

    public setIsNeedHide(bo:boolean){
        this._isNeedHide = bo;
    }

    public show(){
        if(this._isShow){
            return;
        }
        // this.mask.active = true
        this._setMaskVisible(true);
        this._isShow = true

        tween(this.window)
        .to(this._showTime,{scale:new Vec3(1,1,1)},{easing: 'backOut'})
        .call(() => { 
            this._showEnd();
        })
        .start()

        let uio = this.window.getComponent(UIOpacity) as UIOpacity;
        uio.opacity = 0
        tween(uio)
        .to(this._showTime,{opacity:255},{easing: 'backOut'})
        .start()

    }
    public hide(){
        if(!this._isShow){
            return;
        }
        // this.mask.active = false
        this._setMaskVisible(false);
        this._isShow = false

        if(!this._isNeedHide && this._isLive)return;

        tween(this.window)
        .to(this._hideTime,{scale:new Vec3(0,0,1)},{easing: 'backIn'}) 
        .call(() => {
            this._hideEnd();
        })
        .start()
        
        let uio = this.window.getComponent(UIOpacity) as UIOpacity;
        tween(uio)
        .to(this._hideTime,{opacity:0})
        .start()

    }

    private _showEnd(){
        console.log('showEnd');
    }
    private _hideEnd(){
        console.log('hideEnd');
        if(!this._isLive){
            this.node.destroy();
        }
    }

}
