/**
 * 弹窗基类
 * @author 陈委津
 * @version 1.0.0,2021.3.1
 */
import { _decorator, Component, Node,Vec3,tween,Scene, EventTouch, UITransform, math, view, UIOpacity,Button} from 'cc';
import { PopType,PopBasic } from './PopCore';
import { PopMgr } from '../../game/control/PopMgr';
const { ccclass, property } = _decorator;
@ccclass('PopBase')
export class PopBase extends PopBasic {

    @property({type: Node, displayName: "关闭按钮[选填项]"})
    public btn_close:Node | null = null;

    // @property({type: Node})
    // public btn_submit:Node | null = null;

    @property({type: Node, displayName: "取消按钮[选填项]"})
    public btn_cancel = null as unknown as Node;

    @property({type: Node, displayName: "弹出窗口[必填项]"})
    public window:Node = null as unknown as Node;

    @property({type: Node, displayName: "遮罩层[必填项]"})
    public mask:Node = null as unknown as Node;
    
    private _isShow:boolean = false;
    private _isLive:boolean = false;
    private _isMaskClose:boolean = true;

    private _showTime:number = 0.2;
    private _hideTime:number = 0.2;
    private _isNeedHide:boolean = true;
    //关闭事件
    protected _closeFunc:Function | null = null;
    //窗口类型
    private _popType:PopType = PopType.window;
    //临时变量
    private _hasPop = false;
    private _hasDel = false;


    //弹窗初始化-----
    onLoad(){
        this.window.addComponent(UIOpacity);
        this.mask.addComponent(UIOpacity);
    }
    onDestroy(){
        
    }
    start () {
        this.btn_close?.on(Node.EventType.TOUCH_END, this._onClose, this);
        // this.btn_submit?.on(Node.EventType.TOUCH_END, this.onSubmit, this);
        this.btn_cancel?.on(Node.EventType.TOUCH_END, this._onClose, this);
        this.mask.on(Node.EventType.TOUCH_END, this._onMaskClick, this);

        this.systemShow();
    }
    /**
     * 弹出当前窗口
     * @param popType 窗口类型
     */
    public popSelf(popType:PopType = PopType.window){
        if(this._hasPop)return;
        this._hasPop = true;
        if(popType == PopType.window){
            PopMgr.getInstance().pushWindow(this.node);
        }else{
            PopMgr.getInstance().pushFullScreen(this.node);
        }
    }

    /**
     * 关闭当前窗口
     */
    public delSelf(){
        if(this._hasDel)return;
        this._hasDel = true;
        PopMgr.getInstance().deleteWindow();
    }

    public setCloseFun(func:Function){
        this._closeFunc = func;
    }

    /**
     * 设置当前窗口是否点击空白区域就关闭,默认为是
     * @param bo 是否点击空白区域关闭窗口
     */
    public setIsMaskClose(bo:boolean){
        this._isMaskClose = bo;
    }

    /**
     * 当弹出下面一个窗口时,是否隐藏当前窗口,默认为是
     * @param bo 是否隐藏当前窗口
     */
    public setIsNeedHide(bo:boolean){
        this._isNeedHide = bo;
    }

    /**
     * 当前窗口是否激活
     */
    public isActive(){
        return this._isShow;
    }

    /**
     * 设置当前窗口类型
     * @param popType 窗口类型
     */
    public setPopType(popType:PopType){
        this._popType = popType
    }

    /**
     * 获取当前窗口类型
     */
    public getPopType(){
        return this._popType;
    }

    //管理器使用方法,逻辑禁止使用----------------------------------------------------------------
    public systemCreateMe(closeFunc:Function){
        // node?.addChild(this.node);
        this._closeFunc = closeFunc;
        this._isLive = true;
        // this.window.scale = new Vec3(0,0,1)
    }
    public systemDeleteMe(){
        this._isLive = false;
        if(!this._isShow){
            this.node.destroy();
        }
    }

    public systemShow(isAnim:boolean = true){
        this.node.active = true;
        if(this._isShow){
            return;
        }
        // this.mask.active = true
        this._setMaskVisible(true);
        this._isShow = true

        //无显示动画
        if(this._popType == PopType.fullscreen){
            this._showEnd();
            return;
        }
        if(!isAnim){
            this._showEnd();
            return;
        }

        this.window.scale = new Vec3(0,0,1)
        tween(this.window)
        .to(this._showTime,{scale:new Vec3(1,1,1)},{easing: 'backOut'})
        .call(() => { 
            this._showEnd();
        })
        .start();

        let uio = this.window.getComponent(UIOpacity) as UIOpacity;
        uio.opacity = 0
        tween(uio)
        .to(this._showTime,{opacity:255},{easing: 'backOut'})
        .start();

    }
    public systemHide(isAnim:boolean = true){
        if(!this._isShow){
            return;
        }
        // this.mask.active = false
        this._setMaskVisible(false);
        this._isShow = false

        if(!this._isNeedHide && this._isLive)return;
        
        //无隐藏动画
        if(this._popType == PopType.fullscreen){
            this._hideEnd();
            return;
        }
        if(!isAnim){
            this._hideEnd();
            return;
        }

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
    //管理器使用方法,逻辑禁止使用----------------------------------------------------------------

    private _showEnd(){
        this.node.active = true;
        this.window.scale = new Vec3(1,1,1);
        console.log('showEnd');
    }
    private _hideEnd(){
        console.log('hideEnd');
        this.node.active = false;
        if(!this._isLive){
            this.node.destroy();
        }
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

}
