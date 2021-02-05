import { _decorator, Component, Node, director } from 'cc';
import { DataMgr } from "./game/model/DataMgr";

import { PhysicsSystem, geometry, SystemEvent } from 'cc';
// import { _decorator, Component, Node, Vec3, SkeletalAnimationComponent, macro,ColliderComponent,RigidBodyComponent,AudioSourceComponent,CameraComponent, PhysicsSystem, SystemEvent,systemEvent,ICollisionEvent, ITriggerEvent ,CCInteger, geometry }

const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    onLoad(){

        // cc.loader.loadRes('prefabs_ui/main_ui', (err,res)=>{
        //     let p = cc.instantiate( res );
        //     this.node.addChild(p);
        // } );
        this.node.scene.name="scene_main"
    }
    start () {}
    // onClickMenu(e: any, k: any): void {
    //     console.log(e)
    //     console.log(k)
    //     director.loadScene("battle");
    // }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
