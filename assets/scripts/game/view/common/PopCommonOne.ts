
/* 游戏组件:通用类型一弹窗
* @author 郭刚
* @version 1.0.0,2021.3.13
*/
import { _decorator, Component, Node,LabelComponent,Button,SpriteFrame, Sprite,resources, Label, RichText } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { ResMgr } from '../../control/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('PopCommonOne')
export class PopCommonOne extends PopBase {
    @property({type: Label})
    public lab_title:Label= null as unknown as Label;

    @property({type: Label})
    public lab_content:Label= null as unknown as Label;

    @property({type: RichText})
    public lab_rich:RichText  = null as unknown as RichText;

    @property({type: Button})
    public btn_submit = null as unknown as Button;

    @property({type: Button})
    public btn_go = null as unknown as Button;

    private _submitCallFun:Function | null = null;

    private _goCallFun:Function | null = null;

    start () {
        super.start();
        this.btn_submit.node.on(Node.EventType.TOUCH_END, this._onSubmit, this);
        this.btn_go.node.on(Node.EventType.TOUCH_END, this._onSubmit, this);
    }
    private _onSubmit(){
        if(this._submitCallFun){
            this._submitCallFun();
        }
    }

    // private _onGoClick(){
    //     if(this._goCallFun){
    //         this._goCallFun();
    //     }
    // }
    public setTitle(title:string){
        if(this.lab_title)
            this.lab_title.string = title
    }
    public setContent(content:string){
        console.log(content)
       this.lab_content.node.activeInHierarchy ?  this.lab_content.string = content : this.lab_rich.string = content;
           
    }
      /**
    * 设置弹窗按钮mode = 1情况下取消发送回调
    * @param func      回调函数
    */
    public setSubmitCallBack(func:Function){
        if(func)
            this._submitCallFun = func;
    }

    /**
    * 设置弹窗按钮mode = 0情况下按钮回调
    * @param func      回调函数
    */
    public setGoCallBack(func:Function){
        if(func)
            this._goCallFun = func;
    }

    /**
    * 设置弹窗按钮mode = 1情况下取消按钮回调
    * @param func      回调函数
    */
    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }

    /**
     * 设置弹窗按钮mode = 1情况下发送按钮
     * @param spriteFramePath      图片路径
     * @param content      文本内容
    */
    public setBtnSummitResource(spriteFramePath : string | null,content : string|null)
    {
        if(spriteFramePath)
        {
            ResMgr.getInstance().loadSpriteFrame(spriteFramePath ,(err: Error | null, spriteFrame: SpriteFrame | null) => {
                var objSprite = this.btn_submit.getComponent(Sprite);
                if(objSprite)
                {
                    objSprite.spriteFrame = spriteFrame;
                }
            },"PopCommonOne");
        }
        if(content)
        {
            var lab = this.btn_submit.node.getChildByName("lab")?.getComponent(Label);
            if(lab)
            {
                lab.string = content;
            }
        }
    }

    /**
     * 设置弹窗按钮mode = 1情况下取消按钮
     * @param spriteFramePath      图片路径
     * @param content      文本内容
     */
    public setBtnCancelResource(spriteFramePath : string | null,content : string|null)
    {
        if(spriteFramePath)
        {
            ResMgr.getInstance().loadSpriteFrame(spriteFramePath,(err: Error | null, spriteFrame: SpriteFrame | null) => {
                var objSprite = this.btn_cancel.getComponent(Sprite);
                if(objSprite)
                {
                    objSprite.spriteFrame = spriteFrame;
                }
            },"PopCommonOne");
        }
        if(content)
        {
            var lab = this.btn_cancel.getChildByName("lab")?.getComponent(Label);
            if(lab)
            {
                lab.string = content;
            }
        }
    }

    /**
     * 设置弹窗按钮mode = 0情况下按钮
     * @param spriteFramePath      图片路径
     * @param content      文本内容
     */
    public setBtnGoResource(spriteFramePath : string | null,content : string|null)
    {
        if(spriteFramePath)
        {
            ResMgr.getInstance().loadSpriteFrame(spriteFramePath,(err: Error | null, spriteFrame: SpriteFrame | null) => {
                var objSprite = this.btn_go.getComponent(Sprite);
                if(objSprite)
                {
                    objSprite.spriteFrame = spriteFrame;
                }
            },"PopCommonOne");
        }
        if(content)
        {
            var lab = this.btn_go.node.getChildByName("lab")?.getComponent(Label);
            if(lab)
            {
                lab.string = content;
            }
        }
    }

     /**
     * 设置按钮显示样式
     * @param mode      底部按钮显示样式 仅支持显示1,2个按钮
     */
    public setShowMode(mode : number)
    {
        if(mode)
        {
            this.btn_go.node.active = false;
        }
        else
        {

            this.btn_submit.node.active = false;
            this.btn_cancel.active = false;
        }
    } 


    public setRichLabMode(isRichLabelMode : boolean)
    {
        if(isRichLabelMode)
        {
            this.lab_content.node.active = false;
        }
        else
        {
            this.lab_rich.node.active = false;
        }
    }

    public setBtnContent(mode:number, submitContent : string, cancelConent : string)
    {
        if(mode)
        {
            var lab_submit  = this.btn_submit.node.getChildByName("lab")?.getComponent(Label);
            var lab_cancel  = this.btn_cancel.getChildByName("lab")?.getComponent(Label);
            submitContent && lab_submit && (lab_submit.string = submitContent);
            cancelConent && lab_cancel && (lab_cancel.string = cancelConent);
        }
        else
        {
            var lab  = this.btn_go.node.getChildByName("lab")?.getComponent(Label);
            submitContent && lab &&(lab.string = submitContent);
        }
    }
    public initUI(info : XStruct.common_one_info.Record)
    {
        this.setRichLabMode(info.isRichLabMode);
        this.setTitle(info.title);
        this.setContent(info.content);
        this.setShowMode(info.mode);
        this.setBtnContent(info.mode,info.submitContent,info.cancelContent);    
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
