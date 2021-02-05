import { Component, director, Node, ProgressBar, Vec3, _decorator } from 'cc';
const { ccclass, property } = _decorator;

let bStart = true;

@ccclass('Loading')
export class Loading extends Component {
    
    @property(Node)
    private loadingNode: Node = null;

    @property(ProgressBar)
    private loadingBar: ProgressBar = null;


    private _tmpRoatation = new Vec3()
    private _loadTmpPercent = 0;


    start () {
        this._loadTmpPercent = 0;
        this.loadingBar.progress = 0;
        let st = Date.parse((new Date()).toString());
        this.loadingNode.getRotation().getEulerAngles(this._tmpRoatation);
        if (!bStart) {
            this.loadingBar.node.active = false;
            director.loadScene("main")
        } else {
            this.loadingNode.active = false;
            director.preloadScene("main"
                , function (a, b){
                    this._loadTmpPercent = 0.3 * a / b;
                    if (this.loadingBar.progress < this._loadTmpPercent) {
                        this.loadingBar.progress = this._loadTmpPercent;
                    }
                }.bind(this)
                , function () { 
                    director.preloadScene("battle"
                        , function (c, t) {
                            this._loadTmpPercent = 0.3 + 0.7 * c / t
                            if (this.loadingBar.progress < this._loadTmpPercent) {
                                this.loadingBar.progress = this._loadTmpPercent;
                            }
                        }.bind(this)
                        , function () {
                            console.log(Date.parse((new Date()).toString()) - st);
                            // director.loadScene("main")
                            this.loadingNode.active = true;    
                            director.loadScene("battle")
                        }.bind(this));
                }.bind(this));
            bStart = false
        }
        
    }

    update (dt: number) {
        if (this.loadingNode.active) {
            this._tmpRoatation.z -= dt*360
            this.loadingNode.setRotationFromEuler(this._tmpRoatation.x, this._tmpRoatation.y, this._tmpRoatation.z);
        } 
    }
}
