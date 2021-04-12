
import { _decorator, Node, LabelComponent, resources, tween, instantiate, Quat, Vec3} from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { XConsts } from '../../../model/const/XConsts';
import { GameModel } from '../../../model/GameModel';
import { BonusDetail } from './BonusDetail';
import { BonusIcon } from './BonusIcon';

const { ccclass, property } = _decorator;

@ccclass('PopOffLineBonus')
export class PopOffLineBonus extends PopBase {
    @property({type: LabelComponent})
    public m_labTitle: LabelComponent | null = null;

    @property({type: LabelComponent, displayName : "挂机时间"})
    public m_labTtime: LabelComponent  = null as unknown as LabelComponent;

    @property({type: Node})
    public m_sptLight: Node = null as unknown as Node;

    @property({type: Node})
    public m_btnSubmit: Node | null = null;

    @property({type: Node})
    public m_layoutBonus : Node = null as unknown as Node;

    @property({type: Node})
    public m_layoutDetail : Node = null as unknown as Node;

    // 领取函数
    // private m_submitCallFun: Function | null = null;

    start(){
        super.start();
        // 领取事件
        this.m_btnSubmit?.on(Node.EventType.TOUCH_END, this._onSubmit, this);
       
        this._playLightAni()

        this._updateTimer()

        // 创建具体得奖励内容
        this._createBonus()

        // 创建可获得奖励信息
        this._createDetail()
    }

    private _playLightAni(){
        // 播放光动画
        const tw = tween(this.m_sptLight);
        let eulerAngles = Vec3.clone(this.m_sptLight.eulerAngles); // 获取起始四元数
        tw.to(0.2, {}, {
            onUpdate: (target, ratio) => {
                // ratio : 0~1
                eulerAngles.z -= 0.5 // ratio*45
                this.m_sptLight.setRotationFromEuler(eulerAngles.x, eulerAngles.y, eulerAngles.z);
            },
        })
        tw.repeatForever();
        tw.start();
        // 需要在destroy时停止动画吗，还是节点回收会自动停止
    }

    // 更新时间
    private _updateTimer(){
         // 挂机时间
        let offLineModel = GameModel.getInstance().getOfflineModel()
        let time = offLineModel.getPlayerOfflineTime()
        this.m_labTtime.string = time; 
    }

    // 奖励信息
    private _createDetail(){
        let offLineModel = GameModel.getInstance().getOfflineModel()
        let configBonusInfo = offLineModel.getBonusByCopy()
        if (configBonusInfo == null) {
            return 
        }
        // 依次填入 金币，经验，升级点数据
        let arrBonusData : any = []
        arrBonusData.push({ nCount : (configBonusInfo as any).idleMoney,   strPath : XConsts.KObjectIconSpriteName[Msg.TObjectType.EObject_Money]});
        arrBonusData.push({ nCount : (configBonusInfo as any).idleExp,     strPath : XConsts.KObjectIconSpriteName[Msg.TObjectType.EObject_Exp]});
        arrBonusData.push({ nCount : (configBonusInfo as any).idleUpgradePoint, strPath : XConsts.KObjectIconSpriteName[Msg.TObjectType.EObject_UpgradePoint]});

        resources.load('prefabs_ui/features/battle/offline/bonus_detail', (err:any,res:any)=>{
            // 通过预制体创建node
            for(let data of arrBonusData) {
                if (data.nCount == undefined || data.nCount == 0) {
                    continue
                }
                let p = instantiate(res) as Node;
                this.m_layoutDetail.addChild(p)
                let component = p.getComponent("BonusDetail") as BonusDetail
                component.updateView(data)
            }
        } );
    }

    private _createBonus() {
        let offLineModel = GameModel.getInstance().getOfflineModel()
        let bonusInfo = offLineModel.getBnousInfo()
        if (bonusInfo == null) {
            return
        }
        // message LootObject{
        //     TObjectType objType = 1;
        //     int32 param1 = 2;
        //     int32 param2 = 3;
        //     int32 param3 = 4;
        //     int32 num = 5;
        //     HeroInfo extent = 6;
        // }

        resources.load('prefabs_ui/features/battle/offline/bonus_icon', (err:any,res:any)=>{
            // 通过预制体创建node
            for (let data of bonusInfo) {
                let p = instantiate(res) as Node;
                this.m_layoutBonus.addChild(p)
                let component = p.getComponent("BonusIcon") as BonusIcon
                component.updateView(data)
            }
        });
    }

    private _onSubmit(){
        console.log("login");
        // 关闭弹窗
        this.delSelf()
        // 回调播放动画
        if(this._closeFunc)
            this._closeFunc()
    }

    public setCloseCallBack(func: Function | null) {
        if (func)
            this._closeFunc = func;
    }
}