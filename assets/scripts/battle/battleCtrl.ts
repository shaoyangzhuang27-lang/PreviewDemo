
import { _decorator, Component, Node, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

const MOVE_SPEED = 0.1;
const ROTATION_SPEED = 120;

let tmpSpeed = new Vec3();
let tmpRotation = new Quat();

@ccclass('BattleCtrl')
export class BattleCtrl extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    @property(Node)
    private mainRole: Node | null = null

    start () {
        // Your initialization goes here.

        // this.role.getRotation()

        // let a = this.mainRole?.getChildByName("attack_01")?.getChildByName("Bip001 R Hand Socket")
        // console.log(a)
        // a.active = false;

    }

    update (dt: number) {
        // tmpSpeed.x += dt * MOVE_SPEED;
        // this.mainRole.translate(tmpSpeed);

        // Quat.fromEuler(tmpRotation, 0, dt * ROTATION_SPEED, 0);
        // this.mainRole?.rotate(tmpRotation);
    }
}
