
import { _decorator, Component, Node, resources, instantiate } from 'cc';
import { BaseScene } from './BaseScene';
const { ccclass, property } = _decorator;

@ccclass('SceneMain')
export class SceneMain extends BaseScene {
    onLoad(){
        super.onLoad();
        this.initUI();
        this.initCity();
    }
    start () {
    }
    initCity(){
        
        resources.load('prefabs_ui/main_city', (err:any,res:any)=>{
            let p = instantiate( res );
            this.curScene?.addChild(p);
        } );
    }

}
