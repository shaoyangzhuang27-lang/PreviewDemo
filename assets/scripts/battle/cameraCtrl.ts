
import { _decorator, Component, Node, Vec2, Vec3, Quat, systemEvent, Touch, EventTouch, SystemEventType } from 'cc';
const { ccclass, property } = _decorator;

let v2_1 = new Vec2();
let v2_2 = new Vec2();
let qt_1 = new Quat();


@ccclass('CameraCtrl')
export class CameraCtrl extends Component {
    
    private _euler = new Vec3();
    private _position = new Vec3();
    private _dis = 20;
    private _rotateSpeed = 0.3;
    private _damp = 0.2;

    onLoad() {
        // systemEvent.on(SystemEvent.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        // systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        // systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);

        this._dis = this.node.position.z;
        this.node.lookAt(Vec3.ZERO)
        Vec3.copy(this._euler, this.node.eulerAngles);
        Vec3.copy(this._position, this.node.position);

        console.log("this._position", this._position)
    }
 
    onDestroy() {
        // systemEvent.off(SystemEvent.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        // systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.off(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        // systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);

    }

    start () {
        // Your initialization goes here.

    }

    update (dt: number) {
        if (this._euler.y === this.node.eulerAngles.y) {
            return;
        }
        Quat.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
        Quat.slerp(qt_1, this.node.rotation, qt_1, dt / this._damp);
        this.node.setRotation(qt_1);

        this._position.x = Math.sin(Math.PI / 180 * this.node.eulerAngles.y) * this._dis;
        this._position.z = Math.cos(Math.PI / 180 * this.node.eulerAngles.y) * this._dis;
        
        if (Math.abs(this._euler.y - this.node.eulerAngles.y) < 0.01) {
            this._euler.y = this.node.eulerAngles.y
        }

        this.node.setPosition(this._position);
        console.log(this._euler, this.node.eulerAngles)
    }

    
    // onTouchStart() {
        // if (cc.game.canvas.requestPointerLock) cc.game.canvas.requestPointerLock();
        // let location = _e.getLocation();// 获取节点坐标
    // }

    onTouchMove(e?: Touch, even?: EventTouch) {
        // console.log("++++++++++++++++++")
        let touches = even?.getTouches();
 
        if (touches?.length == 1) {
            e?.getStartLocation(v2_1);
            e?.getDelta(v2_2);
            this._euler.y -= v2_2.x * this._rotateSpeed; // 可能需要根据屏幕宽度微调

            if (this._euler.y > 180) {
                this._euler.y -= 360
            } else if (this._euler.y < - 180) {
                this._euler.y += 360
            }
        }
 
    }
 

}
