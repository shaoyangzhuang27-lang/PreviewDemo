// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, resources, instantiate } from 'cc';
import { BaseScene } from './BaseScene';
const { ccclass, property } = _decorator;

@ccclass('SceneMain')
export class SceneMain extends BaseScene {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

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

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
