/* 游戏组件:碎片合成
* @author 郭刚
* @version 1.0.0,2021.3.13
*/
import { _decorator, Component, Node,Label,Button, instantiate,UITransform,Vec3,Size,resources } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { XConsts } from '../../model/const/XConsts';
import { HeroFragment } from '../hero/HeroFragment';
import { TableName, ValueMgr } from "../../model/ValueMgr";
const { ccclass, property } = _decorator;

@ccclass('PopFragmentSynthesis')
export class PopFragmentSynthesis extends PopBase {


    @property({type: Label})
    public lab_title = null as unknown as Label;

    @property({type: Label})
    public lab_fragment_title = null as unknown as Label;

    @property({type: Label})
    public lab_fragment_tips = null as unknown as Label;

    @property({type: Label})
    public lab_ban_sell = null as unknown as Label;

    @property({type: Label})
    public lab_num = null as unknown as Label;

    @property({type: Node})
    public btn_add = null as unknown as Node;

    @property({type: Node})
    public btn_reduce = null as unknown as Node;

    @property({type: Node})
    public btn_info = null as unknown as Node;

    @property({type: Node})
    public btn_summon = null as unknown as Node;

    @property({type: Node})
    public btn_submit = null as unknown as Node;
    
    // @property({type: LabelComponent})
    // public lab_content:LabelComponent | null = null;

    @property({type: Node})
    public node_hero_fragment = null as unknown as Node;

    // private _submitCallFun:Function | null = null;


    private _fragmentSysthesisInfo : XStruct.fragment_synthesis_info.IRecord = {
        frame :"",
        camp : "",
        star : 0,
        quality : "",
        img : "",
        type : 0,
        maxNum : 0,
        curNum : 0
    }  

    public set FragmentSysthesisInfo(data : XStruct.fragment_synthesis_info.IRecord)
    {
        this._fragmentSysthesisInfo = data;
        this.initUI();
    }

    public initUI()
    {
        resources.load('prefabs_ui/main/hero_fragment', (err:any,res:any)=>{
                let fragment_item = instantiate( res );
                let script = fragment_item.getComponent(HeroFragment);
                fragment_item.scale = new Vec3(0.7,0.7,1);
                let subWidget = fragment_item.getComponent(UITransform) as UITransform;
                subWidget.contentSize = new Size(105,126);
                script.FragmentInfo = this._fragmentSysthesisInfo;
                this.node_hero_fragment?.addChild(fragment_item);
        });


        let labtitle = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.UI_FRAGMENT) as Config.language_ui.Record;
        this.lab_title.string = labtitle.cn;

        let labbansell = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.UI_NOTFORSALE) as Config.language_ui.Record;
        this.lab_ban_sell.string = labbansell.cn;


        this.initLabelFromBtn(this.btn_submit,XConsts.UI_FRAGMENTUSE);
        this.initLabelFromBtn(this.btn_info,XConsts.UI_INFO);
        this.initLabelFromBtn(this.btn_summon,XConsts.UI_FRAGMENTUSE);
        // var lab = this.btn_submit.getChildByName("lab");
        // var labComponet = lab && lab.getComponent(Label);
        // if(labComponet)
        // {
        //     var labinfo = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.UI_FRAGMENTUSE) as Config.language_ui.Record;
        //     labComponet.string = labinfo.cn;
        //     console.log("zzzzzz11",labinfo.cn)
        // }

        // var lab = this.btn_info.getChildByName("lab");
        // var labComponet = lab && lab.getComponent(Label);
        // if(labComponet)
        // {
        //     var labinfo = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.UI_INFO) as Config.language_ui.Record;
        //     labComponet.string = labinfo.cn;
        //     console.log("zzzzzz",labinfo.cn)
        // }

        // var lab = this.btn_summon.getChildByName("lab");
        // var labComponet = lab && lab.getComponent(Label);
        // if(labComponet)
        // {
        //     var labinfo = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.UI_FRAGMENTUSE) as Config.language_ui.Record;
        //     labComponet.string = labinfo.cn;
        //     console.log("zzzzzz11",labinfo.cn)
        // }
        
    }


    public initLabelFromBtn(obj : any, content : string)
    {
        var lab = obj.getChildByName("lab");
        var labComponet = lab && lab.getComponent(Label);
        if(labComponet)
        {
            var labinfo = ValueMgr.getInstance().getItemByField(TableName.language_ui,content) as Config.language_ui.Record;
            labComponet.string = labinfo.cn;
            console.log("zzzzzz",labinfo.cn)
        }
    }
    // start () {
    //     super.start();
    //     this.btn_submit?.on(Node.EventType.TOUCH_END, this._onSubmit, this);
    // }
    // private _onSubmit(){
    //     if(this._submitCallFun){
    //         this._submitCallFun();
    //     }
    // }
    // public setTitle(title:string){
    //     if(this.lab_title)
    //         this.lab_title.string = title
    // }
    // public setContent(content:string){
    //     console.log(content)
    //     if(this.lab_content)
    //         this.lab_content.string = content
    // }
    // public setSubmitCallBack(func:Function){
    //     this._submitCallFun = func;
    // }

    // public setCloseCallBack(func:Function | null){
    //     if(func)
    //         this._closeFunc = func;
    // }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
