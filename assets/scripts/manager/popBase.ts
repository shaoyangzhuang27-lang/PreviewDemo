// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// import { PopManager } from "./popManager";
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopBase')
export class PopBase extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({type: cc.Node})
    public btn_close:cc.Node = null;

    @property({type: cc.Node})
    public btn_submit:cc.Node = null;

    @property({type: cc.Node})
    public btn_cancel:cc.Node = null;

    @property({type: cc.Node})
    public window:cc.Node = null;

    @property({type: cc.Node})
    public mask:cc.Node = null;

    private isShow:bool = false;
    private isLive:bool = false;
    private isMaskClose:bool = true;

    private closeFunc:Function = null;

    //弹窗初始化-----
    start () {
        // Your initialization goes here.
        this.btn_close.on(cc.Node.EventType.MOUSE_UP, this.closeHandle, this);
        this.btn_submit.on(cc.Node.EventType.MOUSE_UP, this.submitHandle, this);
        this.btn_cancel.on(cc.Node.EventType.MOUSE_UP, this.closeHandle, this);
        this.mask.on(cc.Node.EventType.MOUSE_UP, this.maskHandle, this);

        this.show();
        this.mask.active = true

        this.window.scale = cc.Vec3(0,0,1)
    }
    maskHandle(){
        if(this.isMaskClose){
            this.closeFunc();
        }
    }
    closeHandle(){
        this.closeFunc();
    }
    submitHandle(){
        console.log("submit")
    }
    //---------------------


    createMe(node,closeFunc){
        node.addChild(this.node);
        this.closeFunc = closeFunc;
        this.isLive = true;
    }
    deleteMe(){
        this.isLive = false;
        if(!this.isShow){
            this.node.destroy();
        }
    }
    setIsMaskClose(bo){
        this.isMaskClose = bo;
    }



    show(){
        if(this.isShow){
            return;
        }
        this.window.scale = cc.Vec3(0,0,1)
        // this.window.cascadeOpacity = false
        // this.window.setCascadeOpacityEnabled(true)
        // this.window.opacity = 0
        // ,opacity:255
        cc.tween(this.window)
        .to(0.15,{scale:new cc.Vec3(1,1,1)},{easing: 'backOut'})
        .call(() => { 
            this.showEnd();
        })
        .start()
        this.mask.active = true

        this.isShow = true
    }
    hide(){
        if(!this.isShow){
            return;
        }
        cc.tween(this.window)
        .to(0.15,{scale:new cc.Vec3(0,0,1)},{easing: 'backIn'}) 
        .call(() => {
            this.hideEnd();
        })
        .start()
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

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
