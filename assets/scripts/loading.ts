import { _decorator, Component, Node, Vec3, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {
    
    @property(Node)
    private loadingNode: Node | null = null;


    private _tmpRoatation = new Vec3()

    start () {
        let t = Date.parse((new Date()).toString());
        this.loadingNode?.getRotation().getEulerAngles(this._tmpRoatation);
        director.preloadScene("scene_main",function(c,t){
            console.log(c+"-"+t)
        }, function () {
            director.preloadScene("battle",function(c,t){
                console.log(c+"-"+t)
            }, function () {
                console.log(Date.parse((new Date()).toString()) - t);
                director.loadScene("battle")
            });
        });
    }

    update (dt: number) {
        this._tmpRoatation.z -= dt*360
        this.loadingNode?.setRotationFromEuler(this._tmpRoatation.x, this._tmpRoatation.y, this._tmpRoatation.z);
    }
}
