// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { Basescene } from "../base/basescene";
import { PopBase } from "./manager/popBase";
import { PopManager } from "./manager/popManager";
import { DataManager } from "./data/dataManager";

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

    @property({type: cc.Prefab, displayName: "test"})
    public path:cc.Prefab[] = [];

    @property({type: cc.Node, displayName: "test3"})
    public path3:cc.node[] = [];


    @property({type: cc.Camera})
    public mainCamera:cc.Camera = null;

    @property({type: cc.Prefab})
    public popPre:cc.Prefab = null;
 
    private _ray:cc.geometry.ray = new cc.geometry.ray();
    start () {

        // console.log("start!!!")
        DataManager.getInstance().loadAllData((loadTotal,loadIndex)=>{
            // console.log("loadPro!!!")
            // console.log(loadTotal);
            // console.log(loadIndex);

        });
    }

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    prePosX:number = 0
    onTouchStart(event){
        // console.log(event)
        this.prePosX = event._point.x
    }
    onTouchMove(event){
        // console.log(event)
        // console.log(this.mainCamera)

        this.mainSceneMoveHandle(event)
        this.prePosX = event._point.x
    }
    onTouchEnd(event){
        this.clickBuildHandle(event)
    }

    mainSceneMoveHandle(event){
        let pos = this.mainCamera.node.position
        let lockPosX = (this.prePosX - event._point.x)/15+pos.x
        if(lockPosX<-20){
            lockPosX = -20
        }
        if(lockPosX > 20){
            lockPosX = 20
        }
        this.mainCamera.node.setPosition(cc.Vec3(lockPosX,pos.y,pos.z))
    }

    clickBuildHandle(event){
        this.mainCamera.screenPointToRay(event._point.x, event._point.y, this._ray);
        let dis = cc.Vec2.distance(event._startPoint,event._point)
        // console.log(dis)
        //基于物理碰撞器的射线检测
        if (cc.PhysicsSystem.instance.raycastClosest(this._ray) && dis<5) {
            console.log(PhysicsSystem.instance.raycastClosestResult.collider.node.name);
            this.pop(PhysicsSystem.instance.raycastClosestResult.collider.node.name);
        }
    }

    pop(buildName){

        let beast = PopManager.getInstance();
        beast.initPop(this.node)

        beast.popupSimpleWindow("建筑:"+buildName,"我是内容"+buildName,()=>{
            console.log("提交内容!")
            beast.popupSimpleWindow("删除建筑?","删除",()=>{
                console.log("提交内容!")
            });
        });
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
