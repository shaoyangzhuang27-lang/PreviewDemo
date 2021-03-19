/**
 * 游戏组件:获得物品(多个)弹窗
 * @author 郭刚
 * @version 1.0.0,2021.3.19
 */
import { _decorator, Component, Node,LabelComponent,resources,ScrollView,instantiate,Vec3,UITransform,Size, Label } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { PopMgr } from '../../control/PopMgr';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { ItemMultiReward } from '../risestartower/ItemMultiReward';
const { ccclass, property } = _decorator;

@ccclass('PopMultiItemReward')
export class PopMultiItemReward extends PopBase {
    @property({type: Label})
    public lab_title = null as unknown as Label;


    @property({type: Label})
    public lab_content = null as unknown as Label;


    @property({type: Node})
    public btn_submit:Node | null = null;

    private _submitCallFun:Function | null = null;

    @property({type :  ScrollView})
    public scroll_item_view:ScrollView = null as unknown as ScrollView;

    //所有道具信息
    private _propInfoArray : Array<XStruct.prop_info.IRecord> = [];

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
        func ? this._submitCallFun = func : this._submitCallFun = ()=>{PopMgr.getInstance().deleteWindow()};
    }

    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }


    public initUI()
    {
        var title = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.KStarUpGainObjectTitle) as Config.language_ui.Record;
        this.lab_title.string = title.cn;
        let test: Array<XStruct.prop_info.IRecord> = [];

        var testInfo : XStruct.prop_info.Record ={
            nType : XConsts.KSTARUP_PROP_TYPE.Hero,
            nPropId : 3042500,
            nLevel : 20,
            nPropQuality : 0,
            num : 1,
        }
        this._propInfoArray.push(instantiate(testInfo));
        testInfo.nType = XConsts.KSTARUP_PROP_TYPE.Money;
        testInfo.nPropId = 0,
        testInfo.nLevel = 0,
        testInfo.num = 166,
        this._propInfoArray.push(instantiate(testInfo));

        testInfo.nType = XConsts.KSTARUP_PROP_TYPE.Exp;
        testInfo.nPropId = 0,
        testInfo.nLevel = 0,
        testInfo.num = 3332,
        this._propInfoArray.push(instantiate(testInfo));

        testInfo.nType = XConsts.KSTARUP_PROP_TYPE.Hero;
        testInfo.nPropId = 5051401,
        testInfo.nLevel = 19,
        testInfo.num = 1,
        this._propInfoArray.push(instantiate(testInfo));

          resources.load('prefabs_ui/main/item_multi_reward', (err:any,res:any)=>{
            for (var i = 0 ; i < this._propInfoArray.length; i++) {
                let prop_item = instantiate( res );
                prop_item.scale = new Vec3(0.7,0.7,1);
                let subWidget = prop_item.getComponent(UITransform) as UITransform;
                subWidget.contentSize = new Size(105,126);
                let script = prop_item.getComponent(ItemMultiReward);
                script.setPropInfo(this._propInfoArray[i]);
                this.scroll_item_view.content?.addChild(prop_item);
            }
        });

        // resources.load('prefabs_ui/main/item_multi_reward', (err:any,res:any)=>{
        //     for (var i = 0 ; i < this._propInfoArray.length; i++) {
        //         let prop_item = instantiate( res );
        //         prop_item.scale = new Vec3(0.7,0.7,1);
        //         let subWidget = prop_item.getComponent(UITransform) as UITransform;
        //         subWidget.contentSize = new Size(105,126);
        //         let script = prop_item.getComponent(ItemMultiReward);
        //         script.setPropInfo(this._propInfoArray[i]);
        //         this.scroll_item_view.content?.addChild(prop_item);
        //     }
        // });
    }


    /**
     * @description: 设置物品信息
     * @param data 物品信息数组
     */  
    public setPropsInfo(data :Array<XStruct.prop_info.IRecord>)
    {
        this._propInfoArray = data;
    }
}


