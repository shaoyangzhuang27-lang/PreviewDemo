import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HeroBase')
export class HeroBase extends Component {

    public static STATUS = {
        NONE: 0,    // 无动作
        IDLE: 1,    // 待机
        RUN: 2,     // 奔跑
        ATTACK: 3,  // 攻击
        VICTORY: 4, // 胜利
        DIE: 5,     // 死亡
    }

    @property(Node)
    private attackNode: Node = null;

    @property(Node)
    private dieNode: Node = null;

    @property(Node)
    private idleNode: Node = null;

    @property(Node)
    private runNode: Node = null;

    @property(Node)
    private victoryNode: Node = null;

    private _status: number = 0;
    private _curNode: any = null;

    onLoad() {
        this._status = HeroBase.STATUS.IDLE;
    }

    start() {
        this.attackNode.active = false;
        this.dieNode.active = false;
        this.idleNode.active = false;
        this.runNode.active = false;
        this.victoryNode.active = false;

        this._curNode = this.idleNode;

        console.log(this.idleNode.getComponent(SkeletalAnimation)?.clips);

        this.idleNode.getComponent(SkeletalAnimation)?.on(SkeletalAnimation.EventType.LASTFRAME, function (a: any, b: any, c: any) {
            // this.idleNode.getComponent(SkeletalAnimation)?.off(SkeletalAnimation.EventType.LASTFRAME)
            console.log(a, b, c)
        }.bind(this))

        this.playAnim(HeroBase.STATUS.IDLE);
    }

    playAnim(status: number) {
        this._curNode.active = false;
        this._status = status;
        switch (status) {
            case HeroBase.STATUS.NONE:
                this._curNode = this.idleNode;
                break;
            case HeroBase.STATUS.IDLE:
                this._curNode = this.idleNode;
                break; 
            case HeroBase.STATUS.RUN:
                this._curNode = this.runNode;
                break;
            case HeroBase.STATUS.ATTACK:
                this._curNode = this.attackNode;
                break;
            case HeroBase.STATUS.VICTORY:
                this._curNode = this.victoryNode;
                break;
            case HeroBase.STATUS.DIE:
                this._curNode = this.dieNode;
                break;
            default:
                this._curNode = this.idleNode;
                break;
        }

        this._curNode.active = true;
        this._curNode.getComponent(SkeletalAnimation).play();
        
        // let a: SkeletalAnimation = this._curNode.getComponent(SkeletalAnimation)
        // a.play()
    }
    

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
