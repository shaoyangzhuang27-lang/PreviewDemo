// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopSimple')
export class PopSimple extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    @property({type: cc.Node})
    public btn_submit:cc.Node = null;

    @property({type: cc.LabelComponent})
    public lab_title:cc.LabelComponent = null;

    @property({type: cc.LabelComponent})
    public lab_content:cc.LabelComponent = null;

    private submitCallFun:Function = null;

    start () {
        this.btn_submit.on(cc.Node.EventType.TOUCH_END, this.submitHandle, this);
    }
    submitHandle(){
        console.log("submit")
        if(this.submitCallFun){
            this.submitCallFun();
        }
    }
    setTitle(title){
        console.log(title)
        this.lab_title.string = title
    }
    setContent(content){
        console.log(content)
        this.lab_content.string = content
    }
    setSubmitCallBack(func){
        this.submitCallFun = func
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
