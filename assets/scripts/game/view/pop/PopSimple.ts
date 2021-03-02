
import { _decorator, Component, Node,LabelComponent } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
const { ccclass, property } = _decorator;

@ccclass('PopSimple')
export class PopSimple extends PopBase {
    @property({type: LabelComponent})
    public lab_title:LabelComponent | null = null;

    @property({type: LabelComponent})
    public lab_content:LabelComponent | null = null;

    @property({type: Node})
    public btn_submit:Node | null = null;
    
    private submitCallFun:Function | null = null;

    start () {
        super.start();
        this.btn_submit?.on(Node.EventType.TOUCH_END, this.onSubmit, this);
    }
    onSubmit(){
        if(this.submitCallFun){
            this.submitCallFun();
        }
    }
    public setTitle(title:string){
        if(this.lab_title)
            this.lab_title.string = title
    }
    public setContent(content:string){
        console.log(content)
        if(this.lab_content)
            this.lab_content.string = content
    }
    public setSubmitCallBack(func:Function){
        this.submitCallFun = func;
    }

    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
