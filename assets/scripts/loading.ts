import { _decorator, Component, Node, Vec3, director, ProgressBar } from 'cc';

import { BattleTest } from "./battle/test/BattleTest";
import { BattleResMgr } from "./battle/BattleResMgr";

import { ValueMgr } from './game/model/ValueMgr';
import { BattleMgr } from './battle/BattleMgr';

const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {
    
    @property(Node)
    private loadingNode: Node = null as unknown as Node;

    @property(ProgressBar)
    private loadingBar: ProgressBar = null as unknown as ProgressBar;


    private _tmpRoatation = new Vec3()
    private _tmpProgress = 0;

    start () {
        this.loadingBar.progress = 0;
        let t = Date.parse((new Date()).toString());
        this.loadingNode?.getRotation().getEulerAngles(this._tmpRoatation);
        director.preloadScene("scene_main", (c, t)=>{
                this._tmpProgress = 0.3 * c / t;
                if (this.loadingBar.progress < this._tmpProgress) {
                    this.loadingBar.progress = this._tmpProgress;
                }
                
            }, ()=>{
                director.preloadScene("battle", (c, t)=>{
                    this._tmpProgress = 0.3 + 0.3 * c / t;
                    if (this.loadingBar.progress < this._tmpProgress) {
                        this.loadingBar.progress = this._tmpProgress;
                    }
                }, ()=>{
                    console.log(Date.parse((new Date()).toString()) - t);
                    
                    BattleMgr.getInstance().buildTest((c, t)=>{
                                this._tmpProgress = 0.6 + 0.4 * c / t;
                                if (this.loadingBar.progress < this._tmpProgress) {
                                    this.loadingBar.progress = this._tmpProgress;
                                }
                            }, ()=>{

                            director.loadScene("battle");
                        })        
                });

        });
    }

    update (dt: number) {
        this._tmpRoatation.z -= dt*360
        this.loadingNode.setRotationFromEuler(this._tmpRoatation.x, this._tmpRoatation.y, this._tmpRoatation.z);
    }
}
