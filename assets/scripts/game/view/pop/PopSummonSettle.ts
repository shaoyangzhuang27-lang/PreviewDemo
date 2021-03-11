import { _decorator, Component, Node,Label } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
const { ccclass, property } = _decorator;

@ccclass('PopSummonSettle')
export class PopSummonSettle extends PopBase {
    @property({type: Label})
    public lab_title = null as unknown as Label;

    // @property({type: LabelComponent})
    // public lab_content:LabelComponent | null = null;

    // @property({type: Node})
    // public btn_submit:Node | null = null;

    // private _submitCallFun:Function | null = null;

    start () {
        super.start();
        // this.btn_submit?.on(Node.EventType.TOUCH_END, this._onSubmit, this);
    }

    public iniUI()
    {
        var settleTitle = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.SUMMON_SETTLE_TITLE) as Config.language_ui.Record;
        this.lab_title.string = settleTitle.cn;
    }
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

   
}