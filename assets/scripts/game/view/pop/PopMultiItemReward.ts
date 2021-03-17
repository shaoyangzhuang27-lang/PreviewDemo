import { _decorator, Component, Node,LabelComponent,resources,ScrollView,instantiate,Vec3,UITransform,Size } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
const { ccclass, property } = _decorator;

@ccclass('PopMultiItemReward')
export class PopMultiItemReward extends PopBase {
    @property({type: LabelComponent})
    public lab_title:LabelComponent | null = null;

    @property({type: LabelComponent})
    public lab_content:LabelComponent | null = null;

    @property({type: Node})
    public btn_submit:Node | null = null;

    private _submitCallFun:Function | null = null;

    @property({type :  ScrollView})
    public scroll_item_view:ScrollView = null as unknown as ScrollView;

    start () {
        super.start();
        this.btn_submit?.on(Node.EventType.TOUCH_END, this._onSubmit, this);
        this.initUI();
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


    public initUI()
    {
          resources.load('prefabs_ui/main/item_multi_reward', (err:any,res:any)=>{
            for (var i = 0 ; i < 9; i++) {
                let reclineup_item = instantiate( res );
                 reclineup_item.scale = new Vec3(0.7,0.7,1);
                 let subWidget = reclineup_item.getComponent(UITransform) as UITransform;
                 subWidget.contentSize = new Size(105,126);
                this.scroll_item_view.content?.addChild(reclineup_item);
            }
        });
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}


