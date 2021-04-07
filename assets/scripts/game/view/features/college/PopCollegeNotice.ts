/*
 * @Description: 英雄书院解锁消耗注意弹窗
 * @Author: 徐涛
 * @Date: 2021-04-01 16:04:23
 * @LastEditTime: 2021-04-06 20:29:11
 */
import { _decorator, Node, Label, instantiate, Layout, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import { PopBase } from '../../../../core/control/PopBase';
import { GameModel } from '../../../model/GameModel';
import { PopMgr } from '../../../control/PopMgr';
import { NotifyMgr } from '../../../control/NotifyMgr';
import { ValueMgr } from "../../../model/ValueMgr";
import { XShare } from '../../../model/const/XShare';
import { CellCollegeCost } from './CellCollegeCost';
import { MsgMgr } from '../../../control/MsgMgr';
import { ResMgr } from '../../../control/ResMgr';

@ccclass('PopCollegeNotice')
export class PopCollegeNotice extends PopBase {

    @property({ type: Node, displayName: "确定消耗" })
    public btn_submit: Node = null as unknown as Node;

    @property({ type: Label, displayName: "标题" })
    public lab_title: Label = null as unknown as Label;

    @property({ type: Label, displayName: "内容" })
    public lab_content: Label = null as unknown as Label;
    @property({ type: Layout, displayName: "Layout组件" })
    public layout_cost: Layout = null as unknown as Layout;

    _isHasEnoughFwsj: boolean = false;
    _isUseVRmb: boolean = false;

    onLoad() {
        super.onLoad();
        this.btn_submit?.on(Node.EventType.TOUCH_END, this._submitHandle, this);
    }

    start() {
        super.start();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_open_college_block, this._notifyOpenCollegeHeroHandle, this);
        this._initView();
    }

    onDestroy() {
        super.onDestroy();
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_open_college_block, this._notifyOpenCollegeHeroHandle, this);
    }

    private _notifyOpenCollegeHeroHandle(data: any = null) {
        if (!data) {
            return;
        }

        let msg = data as Msg.OpenCollegeBlockA;
        if (msg.err == Msg.TErrorCode.ERR_OK) {
            //关闭当前窗体
            this.delSelf();
        }
    }

    private _submitHandle() {
        let unlockCollegeMoney = XShare.getInstance().GetCollegeMoneyConsume(GameModel.getInstance().getHeroesModel().getCollegeUnlockBlockNum() + 1);
        let hasCollegeMoney = GameModel.getInstance().getPlayerModel().getPlayerInfo().CollegeMoney;
        if (!this._isUseVRmb && hasCollegeMoney < unlockCollegeMoney) {
            PopMgr.getInstance().popupPrompt(ValueMgr.getInstance().getLanguageString("UI_CollegeMoneyInsufficient"));
            return;
        }

        MsgMgr.getInstance().getMsgHeroCollege().requestOpenCollegeBlock(this._isUseVRmb);
    }

    private _initView() {
        this.lab_title.string = ValueMgr.getInstance().getLanguageString("UI_Notice");
        let strContent = ValueMgr.getInstance().getLanguageString("UI_HeroCollegeUnlockTips");
        let unlockCollegeMoney = XShare.getInstance().GetCollegeMoneyConsume(GameModel.getInstance().getHeroesModel().getCollegeUnlockBlockNum() + 1);
        let hasCollegeMoney = GameModel.getInstance().getPlayerModel().getPlayerInfo().CollegeMoney;
        strContent = strContent.replace("{0}", unlockCollegeMoney.toString());
        this.lab_content.string = strContent;
        ResMgr.getInstance().loadPrefab('prefabs_ui/features/college/cell_college_cost', (err: any, res: any) => {
            let node = instantiate(res as Prefab) as Node;
            this.layout_cost.node.addChild(node);
            let collegeCostItem = node.getComponent("CellCollegeCost") as CellCollegeCost;
            collegeCostItem.setData(Msg.TObjectType.EObject_CollegeMoney, hasCollegeMoney, unlockCollegeMoney);
        });

        this._isHasEnoughFwsj = hasCollegeMoney > unlockCollegeMoney;
        this._isUseVRmb = false;
        if (!this._isHasEnoughFwsj) {
            let curVrmb = GameModel.getInstance().getPlayerModel().getPlayerInfo().vrmb;
            let consumeVrmb = XShare.getInstance().KCollegeUnlockBlockVrmb;
            this._isUseVRmb = curVrmb > consumeVrmb;
            if (curVrmb >= unlockCollegeMoney) {
                strContent = ValueMgr.getInstance().getLanguageString("UI_HeroCollegeUnlockVrmbTips");
                strContent = strContent.replace("{0}", consumeVrmb.toString());
                this.lab_content.string = strContent;
                ResMgr.getInstance().loadPrefab('prefabs_ui/features/college/cell_college_cost', (err: any, res: any) => {
                    let node = instantiate(res as Prefab) as Node;
                    this.layout_cost.node.addChild(node);
                    let collegeCostItem = node.getComponent("CellCollegeCost") as CellCollegeCost;
                    collegeCostItem.setData(Msg.TObjectType.EObject_VRmb, curVrmb, consumeVrmb);
                });
            }
        }

    }

}
