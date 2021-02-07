import {  Node,resources,instantiate,LabelComponent,Vec3,tween,Scene } from 'cc';
import { PopSimple } from "../view/PopSimple";
import { PopCore } from "../../core/control/PopCore";
import { NetLoading } from '../view/NetLoading';
export class PopMgr extends PopCore  {

    private static _instance: PopMgr = new PopMgr();
    public static getInstance() {
        return this._instance;
    }

    
    private netLoading:Node | null = null;
    
    public clearPop(){
        this.netLoading = null;
    }
    public popupSimpleWindow(title:string,content:string,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true){

        resources.load('prefabs_ui/pop_simple', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopSimple") as PopSimple;
            script.setTitle(title)
            script.setContent(content)
            script.setSubmitCallBack(submitCallBack)
            script.setCloseCallBack(closeCallBack);
            script.setIsMaskClose(isMaskClose);

        } );
    }

    public setNetLoading(bo:boolean,content:string){
        // console.log(content+"hhhhhhh:::");
        // console.log(bo);
        if(this.netLoading){
            let script = this.netLoading.getComponent("NetLoading") as NetLoading;
            script.setContent(content);
            this.netLoading.active = bo;
            return;
        }
        resources.load('prefabs_ui/net_loading', (err:Error | null,res:any)=>{
            this.netLoading = instantiate( res );
            if(this.netLoading){
                this.parent?.addChild(this.netLoading)
                let script = this.netLoading.getComponent("NetLoading") as NetLoading;
                script.setContent(content);
                this.netLoading.active = bo;
            }
        })
    }

}