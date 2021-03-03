
import { _decorator, Component, Node,LabelComponent,resources,instantiate,Vec3 } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
const { ccclass, property } = _decorator;

@ccclass('PopHeroPub')
export class PopHeroPub extends PopBase {
    @property({type: LabelComponent})
    public lab_title:LabelComponent | null = null;

    @property({type: LabelComponent})
    public lab_content:LabelComponent | null = null;

    private submitCallFun:Function | null = null;

    start () {
        super.start();
        this.btn_submit?.on(Node.EventType.TOUCH_END, this.submitHandle, this);
        this.showPubHeroIconPrefab()
    }

    submitHandle(){
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
            this.closeFunc = func;
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    public showPubHeroIconPrefab()
    {
        resources.load('prefabs_ui/pub/pub_heroicon', (err:any,res:any)=>{
            let p = instantiate( res );
            var nodWindow = this.node.getChildByName("window");
            var nodeDiamond = nodWindow?.getChildByName("node_diamond");
            var imgFiveStarBg = nodeDiamond?.getChildByName("img_fivestar_bg");
            var nodeFiveStar = imgFiveStarBg?.getChildByName("node_fivestar");
            if(nodeFiveStar)
            {
                p.setScale(0.4,0.4)
                nodeFiveStar.addChild(p)
            }
            // let script = p.getComponent("node_diamond");
            // script.setTitle(title)
            // script.setContent(content)
            // script.setSubmitCallBack(submitCallBack)
            // script.setCloseCallBack(closeCallBack);
            // script.setIsMaskClose(isMaskClose);

        } );
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
