
import { _decorator, Component, Node, LabelComponent, SpriteFrame, resources, Sprite} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BonusDetail')
export class BonusDetail extends Component {
    @property({type: LabelComponent, displayName : "数量"})
    public m_labCount: LabelComponent | null = null;

    @property({type: Node, displayName : "图标"})
    public m_sptIcon: Node | null = null;

    start () {
        // [3]
    }

    public updateView(ob: {nCount : number, strPath : string}){
        let iconPath: string = "ui/main/" + ob.strPath + "/spriteFrame"
        resources.load(iconPath, (err, spriteFrame:SpriteFrame) =>{
            if(!err && this.m_sptIcon){
                let sprite = this.m_sptIcon.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
        if(this.m_labCount){
            let str: string = ob.nCount.toFixed(1) + "/5秒"
            this.m_labCount.string = str;
        }
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
