import { _decorator, Component, Node,Vec3,tween,Scene } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopBase')
export class PopBase extends Component {

    @property({type: Node})
    public btn_close:Node | null = null;

    @property({type: Node})
    public btn_submit:Node | null = null;

    @property({type: Node})
    public btn_cancel:Node | null = null;

    @property({type: Node})
    public window:Node | null = null;

    @property({type: Node})
    public mask:Node | null = null;

    private isShow:boolean = false;
    private isLive:boolean = false;
    private isMaskClose:boolean = true;

    protected closeFunc:Function | null = null;

    //弹窗初始化-----
    start () {
        // Your initialization goes here.
        this.btn_close?.on(Node.EventType.TOUCH_END, this.closeHandle, this);
        this.btn_submit?.on(Node.EventType.TOUCH_END, this.submitHandle, this);
        this.btn_cancel?.on(Node.EventType.TOUCH_END, this.closeHandle, this);
        this.mask?.on(Node.EventType.TOUCH_END, this.maskHandle, this);

        this.show();
        if(this.mask)
            this.mask.active = true
        if(this.window)
            this.window.scale = new Vec3(0,0,1)
    }
    maskHandle(){
        if(this.isMaskClose && this.closeFunc){
            this.closeFunc();
        }
    }
    closeHandle(){
        if(this.closeFunc)
            this.closeFunc();
    }
    submitHandle(){
        console.log("submit")
    }
    //---------------------


    createMe(closeFunc:Function){
        // node?.addChild(this.node);
        this.closeFunc = closeFunc;
        this.isLive = true;
    }
    deleteMe(){
        this.isLive = false;
        if(!this.isShow){
            this.node.destroy();
        }
    }
    setIsMaskClose(bo:boolean){
        this.isMaskClose = bo;
    }



    show(){
        if(this.isShow){
            return;
        }

        if(this.window)
            this.window.scale = new Vec3(0,0,1)
        // this.window.cascadeOpacity = false
        // this.window.setCascadeOpacityEnabled(true)
        // this.window.opacity = 0
        // ,opacity:255
        tween(this.window)
        .to(0.15,{scale:new Vec3(1,1,1)},{easing: 'backOut'})
        .call(() => { 
            this.showEnd();
        })
        .start()

        if(this.mask)
            this.mask.active = true

        this.isShow = true
    }
    hide(){
        if(!this.isShow){
            return;
        }
        tween(this.window)
        .to(0.15,{scale:new Vec3(0,0,1)},{easing: 'backIn'}) 
        .call(() => {
            this.hideEnd();
        })
        .start()

        if(this.mask)
            this.mask.active = false

        this.isShow = false
    }

    showEnd(){
        console.log('showEnd');
    }
    hideEnd(){
        console.log('hideEnd');
        if(!this.isLive){
            this.node.destroy();
        }
    }

}
