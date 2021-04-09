
import { _decorator, Node, Label ,ScrollView,resources,instantiate,Layout} from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { ElementEquipProp, EquipPropType } from '../common/ElementEquipProp';
// import { AvatarNode } from '../menu/AvatarNode';
const { ccclass, property } = _decorator;

@ccclass('PopPlayerLevelUpAward')
export class PopPlayerLevelUpAward extends PopBase {

    @property({ type: Label})
    public lab_title : Label = null as unknown as Label; //标题

    @property({ type: Node})
    public node_head_portrait : Node = null as unknown as Node; //头像Node
    
    @property({ type: Label})
    public lab_lv : Label = null as unknown as Label; //玩家等级label

    @property({ type: Node})
    public node_reward : Node = null as unknown as Node; //奖励Node


    @property({type :  ScrollView})
    public scroll_award:ScrollView = null as unknown as ScrollView; //奖励滚动层，支持多个奖励


    // start () {
    //     super.start();
    //     this.node_head_portrait?.getComponents(AvatarNode).hideLevel();
    // }


    public setInitData(msgData :Msg.NotifyLevelUpAward){

        this.lab_lv.string = "LV." +msgData.oldLevel.toString() + " -> " + "LV." +msgData.newLevel.toString();

        // msgData.vrmb
        this.scroll_award.horizontal = false;
        resources.load('prefabs_ui/main/itemequip_cell', (err:any,res:any)=>{
            for (var i = 0 ; i < 1; i++) {
                let equip_item = instantiate( res );
                this.scroll_award.content?.addChild(equip_item);

                // var lay = this.scroll_award.content?.getComponent(Layout);
                // // if( lay)
                // // {
                // //     lay.type = 1
                // // }
                equip_item.getComponent(ItemEquipCell).setItemType(1,0,ItemEquipType.equip,(id:number,itemClickType:number,objClickType:number)=>{
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
