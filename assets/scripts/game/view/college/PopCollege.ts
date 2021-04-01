/*
 * @Description: 英雄书院
 * @Author: 徐涛
 * @Date: 2021-03-30 19:49:03
 * @LastEditTime: 2021-04-01 15:38:09
 */
import { _decorator, Node, Label, resources, instantiate, ScrollView, Vec3, UITransform, math } from 'cc';
const { ccclass, property } = _decorator;
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { PopMgr } from '../../control/PopMgr';
import { NotifyMgr } from '../../control/NotifyMgr';
import { HeroModel } from '../hero/HeroModel';
import { ValueMgr } from "../../model/ValueMgr";
import { XFuns } from '../../model/const/XFuns';
import { XShare } from '../../model/const/XShare';
import { CollegeItem } from './CollegeItem';

@ccclass('PopCollege')
export class PopCollege extends PopBase {

    @property({ type: Node, displayName: "说明按钮" })
    public btn_explain: Node = null as unknown as Node;

    @property({ type: Label, displayName: "符文水晶" })
    public lab_has_fwsj: Label = null as unknown as Label;

    @property({ type: Label, displayName: "英雄1等级" })
    public lab_lv_1: Label = null as unknown as Label;
    @property({ type: Label, displayName: "英雄2等级" })
    public lab_lv_2: Label = null as unknown as Label;
    @property({ type: Label, displayName: "英雄3等级" })
    public lab_lv_3: Label = null as unknown as Label;
    @property({ type: Label, displayName: "英雄4等级" })
    public lab_lv_4: Label = null as unknown as Label;
    @property({ type: Label, displayName: "英雄5等级" })
    public lab_lv_5: Label = null as unknown as Label;

    @property({ type: Label, displayName: "当前开启槽位数" })
    public lab_has_slot: Label = null as unknown as Label;
    @property({ type: Label, displayName: "当前总槽位数" })
    public lab_all_slot: Label = null as unknown as Label;

    @property({ type: ScrollView, displayName: "英雄滚动视图组件" })
    public scroll_HeroView: ScrollView = null as unknown as ScrollView;

    private _heroPosList: Node[] = [];
    //拥有的所有英雄
    private _inCollegeHeroList: Map<number, number> = new Map<number, number>();
    //学院英雄items
    private _bottomHeroItemList: Map<number, CollegeItem> = new Map<number, CollegeItem>();

    private _heroModelArray: HeroModel[] = [];
    private _heroLvtxtArray: Label[] = [];
    private _heroID: number = 0;
    private _isAdd: boolean = false;
    private _pos: number = 0;

    onLoad() {
        super.onLoad();
        this.btn_explain?.on(Node.EventType.TOUCH_END, this._explainHandle, this);
    }

    start() {
        super.start();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_set_college_hero, this._notifySetCollegeHeroHandle, this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_open_college_block, this._notifyOpenCollegeBlockHandle, this);
        this._initView();
    }

    onDestroy() {
        super.onDestroy();
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_set_college_hero, this._notifySetCollegeHeroHandle, this);
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_open_college_block, this._notifyOpenCollegeBlockHandle, this);
    }

    private _notifyOpenCollegeBlockHandle(data: any = null) {
        if (!data) {
            return;
        }

        let msg = data as Msg.OpenCollegeBlockA;
        if (msg.err == Msg.TErrorCode.ERR_OK) {
            this._refreshCollegeMoney();
            //刷新槽位数
            this._refreshSlotNum();
            //刷新英雄列表
            this._refreshCells();
            PopMgr.getInstance().popupPrompt(ValueMgr.getInstance().getLanguageString("UI_UnlockPetSuccess"));
        }
    }

    private _notifySetCollegeHeroHandle(data: any = null) {
        if (!data) {
            return;
        }

        let msg = data as Msg.SetCollegeHeroA;
        if (msg.err == Msg.TErrorCode.ERR_OK) {
            //刷新槽位数
            this._refreshSlotNum();
            //刷新英雄列表
            this._refreshCells();
        }
    }

    private _refreshSlotNum() {
        this.lab_has_slot.string = GameModel.getInstance().getHeroesModel().getHeroIDInCollegeCount().toString();
        this.lab_all_slot.string = "/" + GameModel.getInstance().getHeroesModel().getCollegeUnlockBlockNum().toString();
    }

    private _refreshCells() {
        // let totalCount = XShare.getInstance().KCollegeBlockMaxNum;

    }

    //获取列表英雄
    private _getInCollegeHeroList() {
        this._inCollegeHeroList.clear();
        this._inCollegeHeroList = GameModel.getInstance().getHeroesModel().heroIdInCollegeMap;//GameModel.getInstance().getHeroesModel().getHeroList();
    }

    //说明界面
    private _explainHandle() {
        let strTitle = ValueMgr.getInstance().getLanguageString("UI_HeroCollegeTitle");
        let strExplain = ValueMgr.getInstance().getLanguageString("UI_HeroCollegeExplainContent");
        PopMgr.getInstance().popExplain(strTitle, strExplain, () => {
            PopMgr.getInstance().deleteWindow();
        });
    }

    private _initView() {
        this._heroID = 0;
        this._pos = 0;
        this._refreshCollegeMoney();

        let heroTop5 = GameModel.getInstance().getHeroesModel().heroesTop5;
        resources.load('prefabs_ui/main/hero_model', (err: any, res: any) => {
            let p = instantiate(res);
            if (this._heroModelArray.length < heroTop5.Count) {
                for (let index = this._heroModelArray.length; index < heroTop5.Count; index++) {
                    let model = p.getComponent("hero_model") as HeroModel;
                    this.window.addChild(model.node);
                    this._heroModelArray.push(model);
                }
            }
            for (let index = 0; index < this._heroModelArray.length; index++) {
                const element = this._heroModelArray[index];
                if (index >= heroTop5.Count) {
                    // this._heroModelArray[index].node.acitve=false;
                    continue;
                }

                if (heroTop5.Get(index)) {
                    // this._heroModelArray[index].updateByHeroPerfabPath("");
                    this._heroLvtxtArray[index].string = "Lv." + heroTop5.Get(index).level;
                    let pos = this._heroLvtxtArray[index].node.getPosition();
                    let nodeSize = this._heroLvtxtArray[index].node.getComponent(UITransform)?.contentSize as math.Size;
                    let posModel = new Vec3(pos);
                    posModel.y = pos.y + nodeSize.height;
                    this._heroModelArray[index].node.setPosition(posModel);
                    // this._heroModelArray[index].node.acitve=true;
                }
            }
        });

        this._refreshSlotNum();
        this._getInCollegeHeroList();
        this._initBottomHeros();
    }

    private _refreshCollegeMoney() {
        this.lab_has_fwsj.string = GameModel.getInstance().getPlayerModel().getPlayerInfo().CollegeMoney.toString();
    }

    private _initBottomHeros() {
        if (this.scroll_HeroView.content) {
            this.scroll_HeroView.content.removeAllChildren();
        }

        resources.load('prefabs_ui/college/college_item', (err: any, res: any) => {
            this._bottomHeroItemList.clear();
            let keys = this._inCollegeHeroList.keys();
            let unlockBlockNum = GameModel.getInstance().getHeroesModel().getCollegeUnlockBlockNum();
            let heroIDInCollegeCount = GameModel.getInstance().getHeroesModel().getHeroIDInCollegeCount();
            for (let index = 0; index < XShare.getInstance().KCollegeBlockMaxNum; index++) {
                let node = instantiate(res) as Node;
                this.scroll_HeroView.content?.addChild(node);

                let collegeItem = node.getComponent("CollegeItem") as CollegeItem;
                let heroId = 0;
                let isLocked = index >= unlockBlockNum;
                let isShowCD = false;
                let isShowTip = false;
                // 1.符文水晶足够可以解锁 2.已解锁的格子还空着
                let isCanUnLock = false;//
                if (isLocked && isCanUnLock) {
                    isShowTip = true;
                }
                else if (!isLocked && index > heroIDInCollegeCount) {
                    isShowTip = true;
                }
                if (index < this._inCollegeHeroList.size) {
                    let key = keys.next();
                    let heroId = this._inCollegeHeroList.get(key.value) as number;
                    this._bottomHeroItemList.set(heroId, collegeItem);
                    collegeItem.setHeroData(heroId, isLocked, isShowCD, isShowTip);

                } else {
                    collegeItem.setHeroData(heroId, isLocked, isShowCD, isShowTip);
                }
            }
        });

    }

    private _isCanUnLockBlock() {

    }

}
