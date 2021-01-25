
import { PopBase } from "./popBase";
import { PopSimple } from "./popSimple";

export class PopManager {

    private static _instance: PopManager = new PopManager();
    public static getInstance() {
        return this._instance;
    }

    public popArray:Array<cc.Node> = [];
    private parent:cc.Node = null;


    public initPop(parent){
        this.parent = parent;
    }
    public pushWindow(w:cc.Node,parent:cc.Node){
        if(parent){
            this.parent = parent
        }

        this.popArray.push(w);

        let curPop = w;
        let prePop = this.popArray[this.popArray.length - 2];

        let curPopScript = this.getScript(curPop)
        let prePopScript = this.getScript(prePop)

        curPopScript.createMe(this.parent,()=>{this.deleteWindow()});
        curPopScript.show();

        // curPop.zIndex = -1
        if(prePopScript){
            // prePop.zIndex = -1
            prePopScript.hide()
        }
    }

    public deleteWindow(){
        if(this.popArray.length == 0) return;

        let w = this.popArray.pop();

        let curPop = w;
        let prePop = this.popArray[this.popArray.length - 1];

        let curPopScript = this.getScript(curPop)
        let prePopScript = this.getScript(prePop)

        curPopScript.deleteMe();
        curPopScript.hide();

        // curPop.zIndex = -1
        if(prePopScript){
            // prePop.zIndex = -1
            prePopScript.show()
        }
    }
    public getScript(node){
        if(!node){
            return null
        }
        let kk = node.getComponent("PopBase") as PopBase;
        return kk;
    }

    public popupSimpleWindow(title,content,submitCallBack){

        cc.loader.loadRes('pre/pop_simple', (err,res)=>{
            let p = cc.instantiate( res );
            let beast = PopManager.getInstance();
            beast.pushWindow(p)

            let script = p.getComponent("PopSimple") as PopSimple;
            script.setTitle(title)
            script.setContent(content)
            script.setSubmitCallBack(submitCallBack)

        } );
    }
    // public Update(dt: number) {

    // }
}