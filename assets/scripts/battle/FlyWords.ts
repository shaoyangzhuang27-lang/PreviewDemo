
import { _decorator, Component, Node, Label, Color, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FlyWords')
export class FlyWords extends Component {
    

    private _actTime = 0.4;

    private _tmpScale = 0;

    onLoad() {
        // this.node.active = false;  
    }

    startFly(str: String, color: math.Color): void {
        this._tmpScale = 0.3;
        this.node.getComponent(Label).string = str;
        this.node.getComponent(Label).color = color;
        this.node.setScale(this._tmpScale, this._tmpScale);
        this.node.setPosition(-40 + Math.random() * 80, -80 + Math.random() * 20 );
        // this.node.active = true;
    }
    
    update (dt: number) {
        this.node.setPosition(this.node.position.x, this.node.position.y + dt * 40);
        this._tmpScale += dt * 2;
        this.node.setScale(this._tmpScale, this._tmpScale);

        this._actTime -= dt;
        if (this._actTime < 0) {
            this.node.destroy();
        }
    }
}
