
import { _decorator, Component, Node,LabelComponent } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
const { ccclass, property } = _decorator;

@ccclass('PopWarning')
export class PopWarning extends PopBase {
    @property({type: LabelComponent})
    public lab_title:LabelComponent | null = null;

    @property({type: LabelComponent})
    public lab_content:LabelComponent | null = null;

    @property({type: Node})
    public btn_submit:Node | null = null;

    private _submitCallFun:Function | null = null;

    start () {
        super.start();
        this.btn_submit?.on(Node.EventType.TOUCH_END, this._onSubmit, this);
    }
    private _onSubmit(){
        if(this._submitCallFun){
            this._submitCallFun();
        }
    }
    public setTitle(title:string){
        if(this.lab_title)
            this.lab_title.string = title
    }
    public setContent(content:string){
        if(this.lab_content)
            this.lab_content.string = content
    }
    public setSubmitCallBack(func:Function){
        this._submitCallFun = func;
    }

    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
