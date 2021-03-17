import { _decorator, Component, Sprite, Vec3, SpriteFrame, tween, UITransform, size } from "cc";
const { ccclass } = _decorator;

@ccclass("FlyAniItem")
export class FlyAniItem extends Component {
    actionType : number = 3;

    bIsFlying : boolean =  false;

    targetPos: Vec3 = new Vec3();
    targetRotation: Vec3 = new Vec3(0, 0, 0);
    targetScale: Vec3 = new Vec3(1, 1, 1);
    posLast = new Vec3()
    _callback: Function | null = null;

    start() {
    }

    show(imgItem: SpriteFrame, posLast: Vec3, callback: Function) {
        this.posLast.set(posLast);
        this._callback = callback;
        // 添加sprite组件
        let sprite = this.node.addComponent(Sprite);
        sprite.trim = false;
        sprite.sizeMode = Sprite.SizeMode.RAW;
        sprite.spriteFrame = imgItem;
        // 设置icon显示大小
        let uitrans = sprite.addComponent(UITransform) as UITransform;
        uitrans.contentSize = size(50, 50)

        //每个去配个动作
        this.actionFly()
    }

    // 曲线飞向目标
    actionFly(){
        // 设置动作类型
        this.actionType = 3;
        // 设置随机角度
        // this.node.eulerAngles = new Vec3(0, 0, Math.floor(Math.random() * 360));
        this.offsetPos = new Vec3(5000 - Math.floor(Math.random() * 10000)  , 5000 - Math.floor(Math.random() * 10000), 0);
        this.bIsFlying = true
    }
    // 直线飞向目标位置
    actionMove(){
        // 设置动作类型
        this.actionType = 2;
        // 设置随机角度
        // this.node.eulerAngles = new Vec3(0, 0, Math.floor(Math.random() * 360));
        // this.node.angle = math.toRadian(Math.floor(Math.random() * 360))
        /// this.node.position = new Vec3(100, 150)
        this.bIsFlying = true
    }

    // 不做碰撞检测 判定移动到目标点附近就结束
    checkEndMove(){
        let dis = Vec3.distance(this.node.position, this.posLast);
        // console.log("fly ani end：", dis)
        if(dis < 50){
            this.bIsFlying = false;
            //飞行结束,fly item 中删除，并确定是否执行回调
            this._callback && this._callback(this.node);
        }
    }
    // 掉落散开，delay后飞向目标位置
    actionDrop(){
        this.actionType = 1;

        this.node.eulerAngles = new Vec3(0, 0, Math.floor(Math.random() * 360));
        this.targetRotation = new Vec3(this.node.eulerAngles);

        // 随机坐标
        let randTargetPos = new Vec3(Math.floor(Math.random() * 400) - 200, Math.floor(Math.random() * 300) - 100, 0);
        let costTime = Vec3.distance(randTargetPos, new Vec3(0, 0, 0)) / 400;
        tween(this.targetPos)
            // .to(costTime, randTargetPos, { easing: 'Circular-InOut'})
            .to(costTime, randTargetPos, { easing: 'cubicInOut' })
            .start();

        // 角度变化
        let randRotation = 120 + Math.floor(Math.random() * 60);
        randRotation = this.targetRotation.z + Math.floor(Math.random() * 2) === 1 ? randRotation : -randRotation;
        tween(this.targetRotation)
            .to(costTime, new Vec3(0, 0, randRotation))
            .start();

        // 缩放变化
        tween(this.targetScale)
            .to(costTime * 2 / 3, new Vec3(1.4, 1.4, 1.4))
            .to(costTime / 3, new Vec3(1, 1, 1))
            .call(() => {
                this.move2Target();
            })
            .start();
    }

    move2Target() {
        let move2TargetTime = Vec3.distance(this.node.position, this.posLast) / 1500;

        let delayTime = Math.floor(Math.random() * 10) / 20; //0~0.1s
        // tween(this.targetScale)
        //     .to(0.3, new Vec3(1.4, 1.4, 1.4))
        //     .to(0.7, new Vec3(1, 1, 1)).union()
        //     .repeat(50)
        //     .start();

        this.scheduleOnce(() => {
            tween(this.targetPos)
                .to(move2TargetTime, this.posLast)
                .call(() => {
                    //飞行结束
                    this._callback && this._callback(this.node);
                })
                .start();
        }, delayTime);
    }

    // offset 如果没有特别参数则直线move
    offsetPos : Vec3 = Vec3.ZERO;
    lerpChange : number = 10
    moveSpeed : number = 30 - Math.floor(Math.random() * 10) // 如果speed值太大，会在目标位置附近来回变换，始终无法进入指定区域distance = 50
    updateActionFly(deltaTime : number) {
        // 如果想要用现成的速度变化曲线可以用tween动作来创建缓动，在onupdate里面实现offset速度变化和node位移
        // 初始一个朝向, 线性插值有一定偏移
        let dis = Vec3.subtract(new Vec3(), this.posLast, this.offsetPos).length();
        Vec3.lerp(this.offsetPos, this.offsetPos, this.posLast, this.lerpChange*deltaTime);
        // 指向实际目标位置向量
        let direction = Vec3.subtract(new Vec3(), this.offsetPos, this.node.position)
        // 归一化
        let dirNormalize = direction.normalize()
        // 移动
        this.node.position = this.node.position.add(dirNormalize.multiplyScalar(this.moveSpeed));
        // 改变弧度暂时不用
        // this.node.angle = new Vec2(0, 1).signAngle(new Vec2(dirNormalize.x, dirNormalize.y)) * 180 / Math.PI
    }

    /* 设置朝向，然后向前位移。。。有问题。。。会一直转圈
    angleOffset: number = 1; // 角度修正速度
    moveOffset: number = 5; // Math.random() * 20 + 10;
    updateAction2(deltaTime : number){
        // 朝向目标的向量
        let targetRt = Vec3.subtract(new Vec3(), this.posLast, this.node.position)
        // 两向量夹角弧度
        let anglebt = Vec3.angle(this.node.position, targetRt)

        // 角度
        let eulerbt = math.toDegree(anglebt)
        console.log("夹角大小 ：", eulerbt)
        // 角度变化插值
        let eulerOffset = math.lerp(0, eulerbt, deltaTime * this.angleOffset)
        if(targetRt.x > 0){
            // 设置变化
            this.node.eulerAngles = new Vec3(0, 0, this.node.eulerAngles.z - eulerOffset)
        }else{
            // 设置变化
            this.node.eulerAngles = new Vec3(0, 0, eulerOffset + this.node.eulerAngles.z)
        }
        let angleOffset = math.toRadian(this.node.eulerAngles.z)
        
        // 创建一个单位向量
        let untilOffset = new Vec2(Math.cos(angleOffset), Math.sin(angleOffset))
        untilOffset.normalize()
        // 移动
        this.node.position = new Vec3(this.node.position.x + untilOffset.x * this.moveOffset, 
                                      this.node.position.y + untilOffset.y * this.moveOffset,
                                      this.node.position.z);
    }*/

    update(deltaTime: number) {
        if ((this.actionType == 3 || this.actionType == 2) && this.bIsFlying == true ){
            // 沿着向量移动
            this.updateActionFly(deltaTime)
            // 结束动作检查
            this.checkEndMove()

        } else if (this.actionType == 1){
            this.node.position = this.targetPos;
            this.node.eulerAngles = this.targetRotation;
            this.node.setScale(this.targetScale);
        }
    }
}