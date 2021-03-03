import {  Node,resources,instantiate,LabelComponent,Vec3,tween,Scene } from 'cc';
import { XConsts } from '../../game/model/const/XConsts';
import { PopBase } from "./PopBase";
export class PopCore {

    // private static _instance: PopManager = new PopManager();
    // public static getInstance() {
    //     return this._instance;
    // }

    protected popArray:Array<Node> = [];
    protected popDataArray:Array<[Node,string,[] ]> = [];
    // protected pop 
    protected parent:Node | null = null;


    public initPop(parent:Node | null){
        this.parent = parent;
    }
    public clearPop(){
    }
    //节点
    //层级 
    //1 业务弹窗
    //2 系统等待loading
    //3 系统弹窗
    //是否换场景换场景释放
    protected pushWindow(w:Node,parent:Node|null = null){
        if(parent){
            this.parent = parent
        }

        this.popArray.push(w);

        let curPop = w;
        let prePop = this.popArray[this.popArray.length - 2];

        let curPopScript = this.getScript(curPop)
        let prePopScript = this.getScript(prePop)


        curPopScript?.createMe(()=>{this.deleteWindow()});
        this.parent?.addChild(curPop);
        curPopScript?.show();
        curPop.setSiblingIndex(XConsts.OrderPopShow);

        // curPop.zIndex = -1
        if(prePopScript){
            prePop.setSiblingIndex(XConsts.OrderPopHide);
            prePopScript.hide()
        }
    }

    public deleteWindow(){
        if(this.popArray.length == 0) return;

        let w = this.popArray.pop();
        if(w == undefined){
            console.log("已经没有弹窗了")
            return;
        }

        let curPop = w;
        let prePop = this.popArray[this.popArray.length - 1];

        let curPopScript = this.getScript(curPop)
        let prePopScript = this.getScript(prePop)

        curPopScript?.deleteMe();
        curPopScript?.hide();
        curPop.setSiblingIndex(XConsts.OrderPopHide);

        // curPop.zIndex = -1
        if(prePopScript){
            // prePop.zIndex = -1
            prePop.setSiblingIndex(XConsts.OrderPopShow);
            prePopScript.show()
        }
    }
    protected getScript(node:Node | null){
        let kk = node?.getComponent("PopBase") as PopBase;
        return kk;
    }

    public popupPrompt(content:string){

        resources.load('prefabs_ui/pop/pop_prompt', (err:Error | null,res:any)=>{
            let p = instantiate( res ) as Node;
            this.parent?.addChild(p)
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
    
    
}