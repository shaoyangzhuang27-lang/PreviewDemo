import { _decorator, Component, Node,director,instantiate,resources,Scene, Layers, Widget } from 'cc';
const { ccclass, property } = _decorator;
import { PopMgr } from "../control/PopMgr";
import { NotifyMgr } from "../control/NotifyMgr";
import { XConsts } from '../model/const/XConsts';
import { BasisScene } from '../../core/control/BasisScene';

@ccclass('BaseScene')
export class BaseScene extends BasisScene {

    @property({type: Node, displayName: "当前场景[必填项]"})
    public curScene:Scene = null as unknown as Scene;

    @property({type: Node, displayName: "当前画布[必填项]"})
    public curCanvas:Node = null as unknown as Node;

    onLoad(){
        super.onLoad();
        if(!this.curScene){
            console.log("场景未设置,请设置当前场景");
            this.curScene = director.getScene() as Scene;
        }

        // this._initSecondaryUINode();
        PopMgr.getInstance().initPop(this);
        // NotifyMgr.getInstance().addNotifyHandler("test",this.notifyTest,this);
    }
    onDestroy(){
        super.onDestroy();
        PopMgr.getInstance().clearPop();
        // NotifyMgr.getInstance().removeNotifyHandler("test",this.notifyTest,this);
    }
    start () {}
    public getCanvas(){
        return this.curCanvas;
    }

    // private _initSecondaryUINode(){
        
    //     let secondaryNode = new Node();
    //     secondaryNode.parent = this.curCanvas;
    //     secondaryNode.layer = Layers.Enum.UI_2D;
    //     secondaryNode.addComponent(Widget);
    //     let w = secondaryNode.getComponent(Widget) as Widget;
    //     w.left = 0;
    //     w.right = 0;
    //     w.top = 0;
    //     w.bottom = 0;
    //     secondaryNode.setSiblingIndex(XConsts.OrderStage);
    //     this.setUnderNode(secondaryNode);

    // }

    protected initUI(callback?: (node: Node)=>void) {
        resources.load('prefabs_ui/main_ui', (err:any,res:any)=>{
            let mainUINode = instantiate( res ) as Node;
            this.curCanvas.addChild(mainUINode);
            mainUINode.setSiblingIndex(XConsts.OrderMainUI)
            if (callback) {
                callback(mainUINode);
            }
            this.setUnderNode(mainUINode);
        } );
    }

    notifyTest(data:any){
        // console.log("BaseScene notifyTest!!");
        // console.log(data);
    }

}
