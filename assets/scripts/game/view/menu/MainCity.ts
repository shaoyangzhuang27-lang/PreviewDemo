
import { _decorator, Component, Node, Vec2, Vec3,systemEvent,Camera, view } from 'cc';
// import { PopMgr } from "./game/control/PopMgr";
// import { DataMgr } from "../game/model/DataMgr";

import { PhysicsSystem, geometry, SystemEvent } from 'cc';
import { PopMgr } from '../../control/PopMgr';
// import { _decorator, Component, Node, Vec3, SkeletalAnimationComponent, macro,ColliderComponent,RigidBodyComponent,AudioSourceComponent,CameraComponent, PhysicsSystem, SystemEvent,systemEvent,ICollisionEvent, ITriggerEvent ,CCInteger, geometry }

const { ccclass, property } = _decorator;

@ccclass('MainCity')
export class MainCity extends Component {

    @property({type: Camera})
    public mainCamera:Camera | null = null;
 
    private _ray:geometry.ray = new geometry.ray();
    start () {
        console.log("city start!!!!")
    }

    onLoad() {
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    prePosX:number = 0
    onTouchStart(event:any){
        // print("city onTouchStart!!!!")
        // console.log(event)
        this.prePosX = event._point.x
        console.log("ontouchstart!")
    }
    onTouchMove(event:any){
        // console.log(event)
        // console.log(this.mainCamera)

        this.mainSceneMoveHandle(event)
        this.prePosX = event._point.x
        console.log("ontouchmove!")
    }
    onTouchEnd(event:any){
        this.clickBuildHandle(event)
        console.log("ontouchend!")
    }

    mainSceneMoveHandle(event:any){
        let pos = this.mainCamera?.node.position
        if(!pos){
            return;
        }
        let lockPosX = (this.prePosX - event._point.x)/15+pos.x
        if(lockPosX<-20){
            lockPosX = -20
        }
        if(lockPosX > 20){
            lockPosX = 20
        }
        this.mainCamera?.node.setPosition(new Vec3(lockPosX,pos.y,pos.z))
    }

    clickBuildHandle(event:any){
        
        // PopMgr.getInstance().tipSimpleWindow(new Vec3(event._point.x, event._point.y,0))
        
        this.mainCamera?.screenPointToRay(event._point.x, event._point.y, this._ray);
        let dis = Vec2.distance(event._startPoint,event._point)
        // console.log(dis)
        //基于物理碰撞器的射线检测
        // console.log(this.mainCamera)
        // console.log(event._point.x)
        // console.log(event._point.y)
        // console.log(this._ray)
        // console.log(PhysicsSystem.instance.raycastClosest(this._ray))
        // console.log(dis)
        if (PhysicsSystem.instance.raycastClosest(this._ray) && dis<5) {
            
            console.log(PhysicsSystem.instance.raycastClosestResult.collider.node.name);
            this.pop(PhysicsSystem.instance.raycastClosestResult.collider.node.name);
        }
    }

    pop(buildName:string){

        let beast = PopMgr.getInstance();
        // beast.initPop(this.node)
        if(buildName == "building_02"){
            PopMgr.getInstance().popStarUpView();
            return;
        }
        if(buildName == "building_12"){
            PopMgr.getInstance().popHeroResetView();
            return;
        }

        if(buildName == "building_01"){
            PopMgr.getInstance().popHeroPubWindow();
            return;
        }
        if (buildName == "building_03") {
            PopMgr.getInstance().popForge();
            return;
        }

        beast.popupSimpleWindow("建筑:"+buildName,"我是内容"+buildName,()=>{
            console.log("提交内容!")
            beast.popupSimpleWindow("删除建筑?","删除",()=>{
                // console.log("提交内容!")
                beast.popupPrompt("无法删除");
            });
        });

        // beast.popMultiItemRewardWindow();
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
