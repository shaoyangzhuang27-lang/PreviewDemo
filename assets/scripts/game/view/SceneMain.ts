
import { _decorator, Component, Node, resources, instantiate } from 'cc';
import { BaseScene } from './BaseScene';
const { ccclass, property } = _decorator;

@ccclass('SceneMain')
export class SceneMain extends BaseScene {
    start () {
        // Your initialization goes here.
        this.initUI();
        this.initCity();
    }
    initCity(){
        
        resources.load('prefabs_ui/main_city', (err:any,res:any)=>{
            let p = instantiate( res );
            this.curScene?.addChild(p);
        } );
    }

}
