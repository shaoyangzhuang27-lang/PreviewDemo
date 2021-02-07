import { _decorator, Component, Node,director,instantiate,resources,Scene } from 'cc';
const { ccclass, property } = _decorator;
import { PopMgr } from "../control/PopMgr";
import { NotifyMgr } from "../control/NotifyMgr";

@ccclass('BaseScene')
export class BaseScene extends Component {

    @property({type: Node})
    public curScene:Scene | null = null;

    onLoad(){
        // console.log("BaseScene onLoad")
        if(!this.curScene){
            console.log("场景未设置,请设置当前场景");
            this.curScene = director.getScene();
        }
        PopMgr.getInstance().initPop(this.curScene)
        // NotifyMgr.getInstance().addNotifyHandler("test",this.notifyTest,this);
        
    }
    initUI(){
        resources.load('prefabs_ui/main_ui', (err:any,res:any)=>{
            let p = instantiate( res );
            this.curScene?.addChild(p);
        } );
    }

    start () {
    }
    notifyTest(data:any){
        // console.log("BaseScene notifyTest!!");
        // console.log(data);
    }
    onDestroy(){
        // console.log("BaseScene onDestory")
        PopMgr.getInstance().clearPop();
        NotifyMgr.getInstance().removeNotifyHandler("test",this.notifyTest,this);
    }
    
}
