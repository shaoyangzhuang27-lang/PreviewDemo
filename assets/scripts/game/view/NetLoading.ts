// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, LabelComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NetLoading')
export class NetLoading extends Component {
    @property({type: LabelComponent})
    public lab_content:LabelComponent | null = null;
    
    @property({type: Node})
    public mask:Node | null = null;

    start () {
        // Your initialization goes here.
        this.mask?.on(Node.EventType.TOUCH_END, this.maskHandle, this);
    }
    public setContent(content:string){
        console.log(content)
        if(this.lab_content)
            this.lab_content.string = content
    }
    maskHandle(){
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
