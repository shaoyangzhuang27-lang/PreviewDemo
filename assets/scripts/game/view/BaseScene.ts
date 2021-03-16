import { _decorator, Component, Node,director,instantiate,resources,Scene } from 'cc';
const { ccclass, property } = _decorator;
import { PopMgr } from "../control/PopMgr";
import { NotifyMgr } from "../control/NotifyMgr";
import { XConsts } from '../model/const/XConsts';

@ccclass('BaseScene')
export class BaseScene extends Component {

    @property({type: Node, displayName: "当前场景[必填项]"})
    public curScene:Scene = null as unknown as Scene;

    @property({type: Node, displayName: "当前画布[必填项]"})
    public curCanvas:Node = null as unknown as Node;

    onLoad(){
        if(!this.curScene){
            console.log("场景未设置,请设置当前场景");
            this.curScene = director.getScene() as Scene;
        }
        PopMgr.getInstance().initPop(this.curCanvas);
        // NotifyMgr.getInstance().addNotifyHandler("test",this.notifyTest,this);
        console.log("---------------------------------------------------- "+this.name+" start ----------------------------------------------------");
    }
    start () {

    }
    onDestroy(){
        // console.log("BaseScene onDestory")
        console.log("---------------------------------------------------- "+this.name+" end ----------------------------------------------------");
        PopMgr.getInstance().clearPop();
        // NotifyMgr.getInstance().removeNotifyHandler("test",this.notifyTest,this);
    }

    protected initUI(callback?: (node: Node)=>void) {
        resources.load('prefabs_ui/main_ui', (err:any,res:any)=>{
            let p = instantiate( res ) as Node;
            this.curCanvas.addChild(p);
            p.setSiblingIndex(XConsts.OrderMainUI)
            if (callback) {
                callback(p);
            }
        } );
    }

    notifyTest(data:any){
        // console.log("BaseScene notifyTest!!");
        // console.log(data);
    }
    
}
