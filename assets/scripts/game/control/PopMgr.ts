import {  Node,resources,instantiate,LabelComponent,Vec3,tween,Scene, Script } from 'cc';
import { PopSimple } from "../view/pop/PopSimple";
import { PopCore } from "../../core/control/PopCore";
import { NetLoading } from '../view/NetLoading';
import { TipDemo } from '../view/TipDemo';
export class PopMgr extends PopCore  {

    private static _instance: PopMgr = new PopMgr();
    public static getInstance() {
        return this._instance;
    }
    
    public clearPop(){

    }

    public setNetLoading(bo:boolean,content:string){
        resources.load('prefabs_ui/net_loading', (err:Error | null,res:any)=>{
            // this.netLoading = instantiate( res );

            let net_loading = this.parent?.getChildByName("net_loading")
            if(!net_loading){
                net_loading = instantiate( res );
                if(net_loading)
                    this.parent?.addChild(net_loading);
            }
            if(net_loading){
                let script = net_loading.getComponent("NetLoading") as NetLoading;
                script.setContent(content);
                net_loading.active = bo;
            }
        })
    }

    //弹窗放这里------------------------------------------------------------
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
    
    //弹出阵容更换界面
    //type
    public popBattleTeamView(type:number,submitCallBack:Function,closeCallBack:Function|null = null,isMaskClose:boolean = true)
    {
        resources.load('prefabs_ui/pop_battleteam', (err:any,res:any)=>{
            let p = instantiate( res );
            this.pushWindow(p)

            let script = p.getComponent("PopBattleTeam");
            script.setSubmitCallBack(submitCallBack)
            script.setCloseCallBack(closeCallBack);
            script.setIsMaskClose(isMaskClose);
            script.setInitTeamView(type)
        } );
    }







    //弹窗放这里------------------------------------------------------------


    //弹出提示窗放这里-------------------------------------------------
    public tipSimpleWindow(pos:Vec3){
        
        resources.load('prefabs_ui/tip_demo', (err:any,res:any)=>{
            let p = instantiate( res ) as Node;
            this.parent?.addChild(p);
            let script = p.getComponent("TipDemo") as TipDemo;
            script.setWinPos(pos);
        });
    }






    //弹出提示窗放这里-------------------------------------------------

}