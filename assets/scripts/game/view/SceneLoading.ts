
import { _decorator, Component, Node, ProgressBarComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneLoading')
export class SceneLoading extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    
    @property({type: Node})
    public progress_bar:Node | null = null;

    start () {
        // Your initialization goes here.
    }
    setProgress(pro:number){
        let p = this.progress_bar?.getComponent(ProgressBarComponent) as ProgressBarComponent;
        p.progress = pro;
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
