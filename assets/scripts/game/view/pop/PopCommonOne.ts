import { _decorator, Component, Node,LabelComponent,Button,SpriteFrame, Sprite,resources, Label } from 'cc';
import { PopBase } from '../../../core/control/PopBase';
const { ccclass, property } = _decorator;

@ccclass('PopCommonOne')
export class PopCommonOne extends PopBase {
    @property({type: LabelComponent})
    public lab_title:LabelComponent | null = null;

    @property({type: LabelComponent})
    public lab_content:LabelComponent | null = null;

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
        if(this.lab_content)
            this.lab_content.string = content
    }
    public setSubmitCallBack(func:Function){
        this._submitCallFun = func;
    }

    public setGoCallBack(func:Function){
        this._goCallFun = func;
    }

    public setCloseCallBack(func:Function | null){
        if(func)
            this._closeFunc = func;
    }

    public setBtnSummitResource(spriteFramePath : string | null,content : string|null)
    {
        if(spriteFramePath)
        {
            resources.load(spriteFramePath, SpriteFrame ,(err: any, spriteFrame: SpriteFrame) => {
                var objSprite = this.btn_submit.getComponent(Sprite);
                if(objSprite)
                {
                    objSprite.spriteFrame = spriteFrame;
                }
            });
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

    public setBtnCancelResource(spriteFramePath : string | null,content : string|null)
    {
        if(spriteFramePath)
        {
            resources.load(spriteFramePath, SpriteFrame ,(err: any, spriteFrame: SpriteFrame) => {
                var objSprite = this.btn_cancel.getComponent(Sprite);
                if(objSprite)
                {
                    objSprite.spriteFrame = spriteFrame;
                }
            });
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


    public setBtnGoResource(spriteFramePath : string | null,content : string|null)
    {
        if(spriteFramePath)
        {
            resources.load(spriteFramePath, SpriteFrame ,(err: any, spriteFrame: SpriteFrame) => {
                var objSprite = this.btn_go.getComponent(Sprite);
                if(objSprite)
                {
                    objSprite.spriteFrame = spriteFrame;
                }
            });
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

    public setShowMode(mode : number)
    {
        if(mode == 1)
        {
            this.btn_submit.node.active = false;
            this.btn_cancel.active = false;
        }
        else
        {
            this.btn_go.node.active = false;
        }
    } 
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
