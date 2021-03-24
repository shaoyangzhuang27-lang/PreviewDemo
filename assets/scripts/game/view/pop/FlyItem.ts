import { _decorator, Component, Node, Animation, SpriteFrame, find, Vec3, resources, instantiate, Sprite, LabelComponent, UIComponent, UITransform, size, Vec2, Color, Layers, director } from "cc";
import { XConsts } from "../../model/const/XConsts";
import { UINodeMgr } from "../UINodeMgr";
import { FlyAniItem } from "./FlyAniItem";

const { ccclass, property } = _decorator;
const MAX_REWARD_COUNT = 5; // 每种奖励最多创建5个

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

    getTargetPos(ob? : Msg.ILootObject) {
        // let config {
        //     "mainCoin" : Msg.TObjectType.EObject_Money,
        //     "mainDiamond": Msg.TObjectType.EObject_VRmb,
        //     "mainlevelPro": Msg.TObjectType.EObject_Exp,
        //     "mainlevelPro": Msg.TObjectType.EObject_UpgradePoint,
        // }
        let nodeGold = null;
        if (ob?.objType == Msg.TObjectType.EObject_Money){
            nodeGold = UINodeMgr.getNodeWithKey("mainCoin")
        } else if (ob?.objType == Msg.TObjectType.EObject_Exp){
            nodeGold = UINodeMgr.getNodeWithKey("mainlevelPro")
        } else if (ob?.objType == Msg.TObjectType.EObject_UpgradePoint){
            nodeGold = UINodeMgr.getNodeWithKey("mainlevelPro")
        }

        if (!nodeGold || !nodeGold.activeInHierarchy) {
            nodeGold = this.m_dstPosNode as Node
        }

        let dtPos = nodeGold.worldPosition;
        let localdtPos = this.m_itemParent.getComponent(UITransform)?.convertToNodeSpaceAR(dtPos) || Vec3.ZERO
        return localdtPos
    }

    getTargetPath(ob: Msg.ILootObject){
        if(!ob || !ob.objType){
            return
        }
        let name: string = XConsts.KObjectIconSpriteName[ob.objType]
        let iconPath: string = "ui/common/main/" + name + "/spriteFrame"
       return iconPath
    }

    createReward(items: Msg.ILootObject[], srcWPos: Vec3) {
        this.itemCount = 0
        for (const key in items) {
            if (!Object.prototype.hasOwnProperty.call(items, key)) {
                return
            }
            const item = items[key];
            let nCount = item.num || 0 
            nCount = nCount > MAX_REWARD_COUNT ? MAX_REWARD_COUNT : nCount
            let iconPath = this.getTargetPath(item) || ""
            let targetWPos = this.getTargetPos(item)
            resources.load(iconPath, (err, spriteFrame: SpriteFrame) => {
                if (!err) {
                    this._createAniItem(nCount, spriteFrame, targetWPos, srcWPos)
                    this.itemCount += nCount
                }
            });
        }
    }

    _createAniItem(nCount: number, imgReward: SpriteFrame, targetWPos: Vec3, srcWPos?: Vec3) {
        for (var idx = 0; idx < nCount; idx++) {
            let rewardNode = new Node("FlyAniItem")
            let flyItem = rewardNode.addComponent(FlyAniItem);
            rewardNode.parent = this.m_itemParent;
            rewardNode.layer = Layers.Enum.UI_2D //必须设置，camera visibllity 设置只显示这个 // UI_2D
            if (srcWPos) {
                rewardNode.worldPosition = srcWPos
            }
            // 其实可以直接把外面的节点传进来，用worldpos来做位置移动，不用做pos的转换
            flyItem.show(imgReward, targetWPos, (node: Node) => {
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
    static showActionFly(param1 :any) : void{
        // resources.load('prefabs_ui/fly_item', (err: any, res: any) => {
        //     let p = instantiate(res);
        //     // 当前running的scene上？
        //     p.parent = param1
        //     let component = p.getComponent("FlyItem") as FlyItem
        //     component.createReward(20)
        // });
    }
    /**
     * 曲线飞行到目标位置
     * @param srcWPos           初始位置(worldPos)
     * @param items             物品
     * @param parent            指定父节点
     */
    static showActionFlyWihtObject(srcWPos: Vec3, items: Msg.ILootObject[], parent: Node): void {
        resources.load('prefabs_ui/fly_item', (err: any, res: any) => {
            let p = instantiate(res);
            // 当前running的scene上？
            p.parent = parent
            let component = p.getComponent("FlyItem") as FlyItem
            component.createReward(items, srcWPos)
        });
    }

    // 掉落散开短暂延时后飞到目标位置
    static showActionDrop(){
    }
    // 直线飞行到目标位置
    static showActionMove(){
    }
}
