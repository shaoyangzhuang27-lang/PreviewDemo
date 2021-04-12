/**
 * 弹窗管理器基类
 * @author 陈委津
 * @version 1.0.0,2021.3.1
 */
import {  Node,resources,instantiate,LabelComponent,Vec3,tween, Component } from 'cc';
import { XConsts } from '../../game/model/const/XConsts';
import { BasisScene } from './BasisScene';
// import { PopBase, PopType } from "./PopBase";
export enum PopType {
    window,fullscreen,
}
export class PopBasic extends Component{
    systemCreateMe(closeFunc:Function):void{};
    systemDeleteMe():void{};
    systemHide(isAnim:boolean = true):void{};
    systemShow(isAnim:boolean = true):void{};
    getPopType():PopType{return PopType.window};
    setPopType(popType:PopType):void{};
}

export class PopCore {

    // private static _instance: PopManager = new PopManager();
    // public static getInstance() {
    //     return this._instance;
    // }

    private _popArray:Array<Node> = [];
    protected _parent:Node | null = null;
    protected _scene:BasisScene | null = null;


    public initPop(scene:BasisScene){
        this._scene = scene;
        this._parent = scene.getCanvas();
    }
    public clearPop(){
        while(this._popArray.length > 0){
            let w = this._popArray.pop() as Node;
            if(!w)continue;
            // w.destroy();
            let curPopScript = this.getScript(w);
            if(!curPopScript)continue;
            curPopScript.systemDeleteMe();
            curPopScript?.systemHide(false);
        }
    }
    //节点
    //层级 
    //1 业务弹窗
    //2 系统等待loading
    //3 系统弹窗
    //是否换场景换场景释放
    public pushWindow(w:Node,parent:Node|null = null){
        if(parent){
            this._parent = parent
        }
        this.pushPop(w,parent,true,PopType.window);
    }

    public pushFullScreen(w:Node,parent:Node|null=null){
        if(parent){
            this._parent = parent
        }
        //清理所有弹窗
        this.clearWindows();
        //隐藏3d窗口,次ui及主ui
        this._scene?.setUnderNodeVisible(false);
        //显示一级窗口
        this.pushPop(w,parent,true,PopType.fullscreen);
    }
    public deleteWindow(){
        if(this._popArray.length == 0) return;

        let w = this._popArray.pop();
        if(w == undefined){
            console.log("已经没有弹窗了")
            return;
        }

        //显示3d窗口,次ui及主ui
        if(this._popArray.length == 0){
            this._scene?.setUnderNodeVisible(true);
        } 

        let curPop = w;
        let prePop = this._popArray[this._popArray.length - 1];

        let curPopScript = this.getScript(curPop)
        let prePopScript = this.getScript(prePop)

        curPopScript?.systemDeleteMe();
        curPopScript?.systemHide();
        curPop.setSiblingIndex(XConsts.OrderPopHide);

        // curPop.zIndex = -1
        if(prePopScript){
            // prePop.zIndex = -1
            prePop.setSiblingIndex(XConsts.OrderPopShow);
            prePopScript.systemShow()
        }
    }

    public popupPrompt(content:string){

        resources.load('prefabs_ui/common/spin_prompt', (err:Error | null,res:any)=>{
            let p = instantiate( res ) as Node;
            this._parent?.addChild(p)
            p.setSiblingIndex(XConsts.OrderToash);
            let lab = p.getChildByName('content') as Node;
            let labcom = lab.getComponent(LabelComponent) as LabelComponent;
            labcom.string = content;
            let curpos = lab.position
            // labcom.node.opacity = 10
            tween(lab)
            .to(0.1,{position:new Vec3(curpos.x,curpos.y+100,curpos.z)})
            .delay(2)
            .to(0.1,{position:new Vec3(curpos.x,curpos.y+200,curpos.z)})
            .call(() => {
                // lab.active = false;
                p.destroy();
            })
            .start()
        })
    }

    private clearWindows(){
        
        while(this._popArray.length > 0){
            let node = this._popArray[this._popArray.length - 1];

            let script = this.getScript(node);
            let type = script.getPopType();
            if(type == PopType.fullscreen)break;

            let w = this._popArray.pop() as Node;
            if(!w)continue;
            // w.destroy();
            let curPopScript = this.getScript(w);
            if(!curPopScript)continue;
            curPopScript.systemDeleteMe();
            curPopScript.systemHide(false);
        }
    }

    private pushPop(w:Node,parent:Node|null = null,isAnim:boolean = true,popType:PopType = PopType.window){
        
        this._popArray.push(w);

        let curPop = w;
        let prePop = this._popArray[this._popArray.length - 2];

        let curPopScript = this.getScript(curPop);
        let prePopScript = this.getScript(prePop);


        curPopScript?.systemCreateMe(()=>{this.deleteWindow()});
        this._parent?.addChild(curPop);
        curPopScript.setPopType(popType);
        curPopScript?.systemShow(isAnim);
        curPop.setSiblingIndex(XConsts.OrderPopShow);

        if(prePopScript){
            prePop.setSiblingIndex(XConsts.OrderPopHide);
            prePopScript.systemHide()
        }
    }

    protected getScript(node:Node | null){
        let kk = node?.getComponent("PopBase");
        return kk as unknown as PopBasic;
    }

    
    
}