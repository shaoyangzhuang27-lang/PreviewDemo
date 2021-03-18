
import { _decorator, Component, Label, math } from 'cc';
const { ccclass } = _decorator;

@ccclass('FlyWords')
export class FlyWords extends Component {
    

    private _actTime = 0.4;
    private _tmpScale = 0;

    startFly(str: string, color: math.Color, startX: number = 0): void {
        this._tmpScale = 0.3;
        (this.node.getComponent(Label) as Label).string = str;
        (this.node.getComponent(Label) as Label).color = color;
        this.node.setScale(this._tmpScale, this._tmpScale);
        this.node.setPosition(startX + Math.random() * 30 - 15, -80 + Math.random() * 20);
        // this.node.setPosition(0, -80 + Math.random() * 20);
    }
    
    update (dt: number) {
        this.node.setPosition(this.node.position.x, this.node.position.y + dt * 40);
        this._tmpScale += dt * 1.5;
        this.node.setScale(this._tmpScale, this._tmpScale);

        this._actTime -= dt;
        if (this._actTime < 0) {
            this.node.destroy();
            // this.node.removeFromParent();
        }
    }
}
