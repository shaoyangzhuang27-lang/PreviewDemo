
import { _decorator, Node, Label ,ScrollView,Vec3,instantiate,UIOpacity,Prefab, Sprite, tween} from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { ElementEquipProp, EquipPropType } from '../../common/ElementEquipProp';
import { ResMgr } from '../../../control/ResMgr';
// import { AvatarNode } from '../menu/AvatarNode';
const { ccclass, property } = _decorator;

@ccclass('PopfPlayerLevelUpAward')
export class PopfPlayerLevelUpAward extends PopBase {

    // @property({ type: Label})
    // public lab_title : Label = null as unknown as Label; //标题

    @property({ type: Node})
    public node_head_portrait : Node = null as unknown as Node; //头像Node
    
    @property({ type: Label})
    public lab_lvo : Label = null as unknown as Label; //玩家旧等级label

    @property({ type: Label})
    public lab_lvn : Label = null as unknown as Label; //玩家新等级label

    @property({ type: Node})
    public node_reward : Node = null as unknown as Node; //奖励Node

    
    @property({ type: Sprite})
    public sprite_bg : Sprite = null as unknown as Sprite; //光晕背景精灵

    @property({type :  ScrollView})
    public scroll_award:ScrollView = null as unknown as ScrollView; //奖励滚动层，支持多个奖励


    // start () {
    //     super.start();
    //     this.node_head_portrait?.getComponents(AvatarNode).hideLevel();
    // }

    // onDestroy() {
    //     super.onDestroy();
    //     // this.sprite_bg.
    // }

    private _playLightAni(){

      // 播放光动画
      const tw = tween(this.sprite_bg);
      let eulerAngles = Vec3.clone(this.sprite_bg.node.eulerAngles); // 获取起始四元数
      tw.to(0.2, {}, {
          onUpdate: (target, ratio) => {
              // ratio : 0~1
              eulerAngles.z -= 1 // ratio*45
              this.sprite_bg.node.setRotationFromEuler(eulerAngles.x, eulerAngles.y, eulerAngles.z);
          },
      })
      tw.repeatForever();
      tw.start();
      // 需要在destroy时停止动画吗，还是节点回收会自动停止
    }

    public setInitData(msgData :Msg.NotifyLevelUpAward){

        this.lab_lvo.string = "等级：" +msgData.oldLevel.toString();
        this.lab_lvn.string = msgData.newLevel.toString();

        this._playLightAni()

        //奖励目前只有一种钻石，暂时写死一种
        this.scroll_award.horizontal = false;
        ResMgr.getInstance().loadPrefab('prefabs_ui/common/element_equipProp', (err:any,res:any)=>{
            for (var i = 0 ; i < 1; i++) {
                let prefab_item = instantiate( res as Prefab);
                this.scroll_award.content?.addChild(prefab_item);

               var item = prefab_item.getComponent(ElementEquipProp)as ElementEquipProp;
               item.setItemType(4,msgData.vrmb,EquipPropType.goods,(id:number,itemClickType:number,objClickType:number)=>{
                    console.log(" 玩家升级界面=>",id);
                });
            }
        });


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
