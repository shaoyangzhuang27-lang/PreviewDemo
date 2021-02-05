// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node,LabelComponent } from 'cc';
import { PopBase } from '../../core/control/PopBase';
const { ccclass, property } = _decorator;

@ccclass('PopSimple')
export class PopSimple extends PopBase {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    // @property({type: Node})
    // public btn_submit:Node | null = null;

    @property({type: LabelComponent})
    public lab_title:LabelComponent | null = null;

    @property({type: LabelComponent})
    public lab_content:LabelComponent | null = null;

    private submitCallFun:Function | null = null;

    start () {
        super.start();
        this.btn_submit?.on(Node.EventType.TOUCH_END, this.submitHandle, this);
    }
    submitHandle(){
        console.log("submit")
        if(this.submitCallFun){
            this.submitCallFun();
        }
    }
    public setTitle(title:string){
        console.log(title)
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
            this.closeFunc = func;
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
