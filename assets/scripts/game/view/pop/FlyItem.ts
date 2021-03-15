import { _decorator, Component, Node, Animation, SpriteFrame, find, Vec3, resources, instantiate, Sprite, LabelComponent, UIComponent, UITransform, size, Vec2, Color, Layers, director } from "cc";
import { BonusIcon } from "./BonusIcon";
import { FlyAniItem } from "./FlyAniItem";

const { ccclass, property } = _decorator;
const MAX_REWARD_COUNT = 10;

@ccclass("FlyItem")
export class FlyItem extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property(SpriteFrame)
    m_imgGold: SpriteFrame = null!;

    @property(Node)
    m_itemParent: Node = null!;

    @property(Node)
    m_dstPosNode: Node = null!;

    itemCount = MAX_REWARD_COUNT

    // @property(Animation)
    // aniBoom: Animation = null!;

    finishIdx: number = 0;
    _callback: Function | undefined = undefined;
    isGoldOrDiamond: boolean = true;

    start() {
        // Your initialization goes here.
        // this.aniBoom.play();
    }

    update(){
    }

    getTargetPos() {
        let nodeGold = find('Canvas/main_ui/node_coin') as Node;

        if (!nodeGold) {
            nodeGold = this.m_dstPosNode as Node
            // this.node.destroy();

            // if (this._callback) {
            //     this._callback();
            // }

            // return Vec3.ZERO;
        }

        return nodeGold.position;
    }

    createReward(nCount ?: number) {
        if(nCount){
            this.itemCount = nCount
        }
        let imgReward = this.m_imgGold;

        // let dtPos = this.node_gold.getWorldPosition()
        // let parent = this.sprite_select.getParent() as unknown as Node;
        // let localdtPos = parent.getComponent(UITransform)?.convertToNodeSpaceAR(dtPos)
        let targetPos = this.getTargetPos();
        for (var idx = 0; idx < this.itemCount; idx++) {
            let rewardNode = new Node("FlyAniItem")
            let flyItem = rewardNode.addComponent(FlyAniItem);
            rewardNode.parent = this.m_itemParent;
            rewardNode.layer = Layers.Enum.UI_2D //必须设置，camera visibllity 设置只显示这个 // UI_2D

            // 其实可以直接把外面的节点传进来，用worldpos来做位置移动，不用做pos的转换
            flyItem.show(imgReward, targetPos, (node: Node) => {
                this.onFlyOver(node);
            })
        }
    }

    onFlyOver(node: Node) {
        // cc.gameSpace.audioManager.playSound('sell', false);
        node.active = false;
        this.finishIdx++;
        if (this.finishIdx === this.itemCount) {
            if (this._callback) {
                this._callback();
            }

            this.node.destroy();
        }
    }

    /**
     * 设置播放回调
     * @param {Function} callback
     * @param {Object} target
     */
    setEndListener(callback?: Function) {
        this._callback = callback;
    }

    // 静态接口，外部调用

    /* 3D界面转UI界面位置
    * Camera Component.
    * convertToUINode(target.worldPosition, uiNode.parent, out);
    * uiNode.position = out;
    * ```
    * param1 ：3D节点的WorldPos, param2 FlyItem
    * convertToUINode(wpos: math.Vec3, uiNode: Node, out?: math.Vec3): math.Vec3;
    */

    // 曲线飞行到目标位置
    static showActionFly(targetPos : Vec3, srcPos : Vec3) : void;
    static showActionFly(parentOb : Node) : void;
    /**
     * 曲线飞行到目标位置
     * @param targetObjects     目标节点
     * @param srcObject         初始节点
     * @param itemTypes         物品类型
     * @param itemCounts        对应的物品数量
     * @param parent            指定父节点
     */
    static showActionFly(targetObjects: Node[], srcObject: Vec3[], itemTypes : Msg.TObjectType[], itemCounts: number[], parent?: Node) : void;
    
    static showActionFly(param1 :any) : void{
        resources.load('prefabs_ui/fly_item', (err: any, res: any) => {
            let p = instantiate(res);
            p.parent = param1
            let component = p.getComponent("FlyItem") as FlyItem
            component.createReward(20)
        });
    }

    // 掉落散开短暂延时后飞到目标位置
    static showActionDrop(){
    }
    // 直线飞行到目标位置
    static showActionMove(){
    }
}
