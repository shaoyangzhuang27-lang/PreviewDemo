
import { _decorator, Component, Node ,Label, Button, EditBox} from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { MsgMgr } from '../../control/MsgMgr';
import { NotifyMgr } from '../../control/NotifyMgr';
import { PopMgr } from '../../control/PopMgr';

const { ccclass, property } = _decorator;

@ccclass('PopGiftCodeExchange')
export class PopGiftCodeExchange extends PopBase {

    @property({ type: Label})
    public lab_title : Label = null as unknown as Label; //标题

    @property({ type: Button})
    public btn_exchange : Button = null as unknown as Button; //兑换

    @property({ type: EditBox})
    public giftcode_editbox : EditBox = null as unknown as EditBox; //输入框

    start () {
        super.start();
        this.btn_exchange.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_giftCode_award,this._notifyGiftCodeAward,this);
    }


    onDestroy() {
        super.onDestroy();
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_hero_put_on_equip, this._notifyGiftCodeAward, this);

    }

    private _onButtonClick(event:any){

        switch (event.target.getComponent(Button)) {
            case this.btn_exchange:
                console.log("btn_exchange");
                let cont = this.giftcode_editbox.string;
                if(!cont.length){
                    PopMgr.getInstance().popupPrompt("请输入兑换码")
                }
                else
                {
                    MsgMgr.getInstance().getMsgGame().requestGiftCodeAward(cont);
                }
                break;    
        }
    }

    private _notifyGiftCodeAward(msgData : Msg.GiftCodeAwardA){
        if(msgData.err == Msg.TErrorCode.ERR_OK){
            let lootObjectData  = new Array<Msg.LootObject>();
            let data = msgData.awardList;
            for(let i=0;i< data.length;i++){
                lootObjectData.push(data[i] as Msg.LootObject)
            }
            PopMgr.getInstance().popMultiItemRewardWindow(lootObjectData,null);
            this.delSelf()
        }
        else{
            PopMgr.getInstance().popupPrompt("Error :" + msgData.err);
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
