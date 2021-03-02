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
    public window:Node = null as unknown as Node;

    @property({type: Node})
    public mask:Node = null as unknown as Node;

    private isShow:boolean = false;
    private isLive:boolean = false;
    private isMaskClose:boolean = true;

    protected closeFunc:Function | null = null;

    //弹窗初始化-----
    start () {
        // Your initialization goes here.
        this.btn_close?.on(Node.EventType.TOUCH_END, this.onClose, this);
        this.btn_submit?.on(Node.EventType.TOUCH_END, this.onSubmit, this);
        this.btn_cancel?.on(Node.EventType.TOUCH_END, this.onClose, this);
        this.mask.on(Node.EventType.TOUCH_END, this.onMaskClick, this);

        this.show();
        this.mask.active = true
        this.window.scale = new Vec3(0,0,1)
    }
    onMaskClick(){
        if(this.isMaskClose && this.closeFunc){
            this.closeFunc();
        }
    }
    onClose(){
        if(this.closeFunc)
            this.closeFunc();
    }
    onSubmit(){
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
