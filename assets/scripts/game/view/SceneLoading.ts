
import { _decorator, Component, Node, ProgressBarComponent, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneLoading')
export class SceneLoading extends Component {
    @property({type: Node})
    public progress_bar:Node | null = null;
    
    @property({type: Label})
    public txt_content:Label = null as unknown as Label;

    start () {
        // Your initialization goes here.
    }
    setProgress(pro:number,resName:string){
        let p = this.progress_bar?.getComponent(ProgressBarComponent) as ProgressBarComponent;
        p.progress = pro;
        this.txt_content.string = "正在加载" + resName + "...";
    }

}
