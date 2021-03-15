
import { _decorator, Component, Node, LabelComponent, resources, Sprite, SpriteFrame} from 'cc';
import { XConsts } from '../../model/const/XConsts';
const { ccclass, property } = _decorator;

@ccclass('BonusIcon')
export class BonusIcon extends Component {
    @property({type: LabelComponent, displayName : "数量"})
    public m_labCount: LabelComponent | null = null;

    @property({type: Node, displayName : "图标"})
    public m_sptIcon: Node | null = null;

    start () {
        // [3]
    }

    public updateView(data:any){
        let name: string = XConsts.KObjectIconSpriteName[data.obtype]
        let iconPath: string = "ui/main/" + name + "/spriteFrame"
        resources.load(iconPath, (err, spriteFrame: SpriteFrame) => {
            if (!err && this.m_sptIcon) {
                let sprite = this.m_sptIcon.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
        if (this.m_labCount) {
            let str: string = "x" + data.nCount
            this.m_labCount.string = str;
        }
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
