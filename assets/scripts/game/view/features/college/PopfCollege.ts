/*
 * @Description: 英雄书院
 * @Author: 徐涛
 * @Date: 2021-03-30 19:49:03
 * @LastEditTime: 2021-04-07 11:24:48
 */
import { _decorator, Node, Label, instantiate, ScrollView, Vec3, UITransform, math, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import { PopBase } from '../../../../core/control/PopBase';
import { GameModel } from '../../../model/GameModel';
import { PopMgr } from '../../../control/PopMgr';
import { NotifyMgr } from '../../../control/NotifyMgr';
import { HeroModel } from '../../hero/HeroModel';
import { ValueMgr } from '../../../model/ValueMgr';
import { XShare } from '../../../model/const/XShare';
import { CellCollege } from './CellCollege';
import { ResMgr } from '../../../control/ResMgr';

@ccclass('PopfCollege')
export class PopfCollege extends PopBase {

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

    //学院英雄items
    private _bottomHeroItemList: Map<number, CellCollege> = new Map<number, CellCollege>();

    private _heroModelArray: HeroModel[] = [];
    private _heroLvtxtArray: Label[] = [];
    private _heroId: number = 0;
    private _isAdd: boolean = false;
    private _pos: number = 0;

    onLoad() {
        super.onLoad();
        this.btn_explain?.on(Node.EventType.TOUCH_END, this._explainHandle, this);
        this._heroLvtxtArray.push(this.lab_lv_1);
        this._heroLvtxtArray.push(this.lab_lv_2);
        this._heroLvtxtArray.push(this.lab_lv_3);
        this._heroLvtxtArray.push(this.lab_lv_4);
        this._heroLvtxtArray.push(this.lab_lv_5);
    }

    start() {
        super.start();
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_set_college_hero, this._notifySetCollegeHeroHandle, this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_ui_set_college_hero, this._notifyUISetCollegeHeroHandle, this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_open_college_block, this._notifyOpenCollegeBlockHandle, this);
        this._initView();
    }

    onDestroy() {
        super.onDestroy();
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_set_college_hero, this._notifySetCollegeHeroHandle, this);
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_ui_set_college_hero, this._notifyUISetCollegeHeroHandle, this);
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

    private _notifyUISetCollegeHeroHandle(data: any = null) {
        if (!data) {
            return;
        }

        let msg = data as Msg.SetCollegeHeroR;
        if ((msg.pos != 0 && msg.isAdd && msg.heroId != 0) || (msg.pos != 0 && !msg.isAdd && msg.heroId != 0)) {
            this._heroId = msg.heroId;
            this._isAdd = msg.isAdd;
            this._pos = msg.pos;
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
        let index = 0;
        let all_open_solt = GameModel.getInstance().getHeroesModel().getCollegeUnlockBlockNum();
        let keys = GameModel.getInstance().getHeroesModel().heroIdInCollegeMap.keys();
        let heroIDInCollegeCount = GameModel.getInstance().getHeroesModel().getHeroIDInCollegeCount();
        this._bottomHeroItemList.forEach((collegeItem, pos) => {
            let isLocked = collegeItem.isLocked;
            if (index < all_open_solt) {
                isLocked = false;//开启对应格子
            }
            let isShowTip = false;
            let isShowCD = false;
            let heroId = collegeItem.heroId;
            let isHasInCollege = GameModel.getInstance().getHeroesModel().heroIdInCollegeMap.has(heroId);
            if (heroId > 0 && !isHasInCollege && heroId == this._heroId && !this._isAdd && this._pos == pos) {
                heroId = 0; //卸下 对应英雄
                isShowCD = true;
            } else if (heroId == 0 && pos == this._pos && this._isAdd && this._heroId > 0 &&
                GameModel.getInstance().getHeroesModel().heroIdInCollegeMap.has(this._heroId)) {
                heroId = this._heroId; //设置增加对应英雄
            }
            collegeItem.updateHeroData(heroId, isLocked, isShowCD, isShowTip);
            index += 1;
        });
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
        this._heroId = 0;
        this._pos = 0;
        this._refreshCollegeMoney();

        let heroTop5 = GameModel.getInstance().getHeroesModel().heroesTop5;
        // let node = new Node("model")
        // node.parent = this.window
        // node.layer = this.window.layer

        // let hero = node.addComponent(HeroModel)
        // hero.updateByHeroPerfabPath("hero_zhangfei")

        ResMgr.getInstance().loadPrefab('prefabs_ui/main/hero_model', (err: any, res: any) => {
            let p = instantiate(res);
            if (this._heroModelArray.length < heroTop5.Count) {
                for (let index = this._heroModelArray.length; index < heroTop5.Count; index++) {
                    let model = p.getComponent("hero_model") as HeroModel;
                    if (model) {
                        this.window.addChild(model.node);
                        this._heroModelArray.push(model);
                    }
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
                    // this._heroLvtxtArray[index].string = "Lv." + heroTop5.Get(index).level;
                    let pos = this._heroLvtxtArray[index].node.getPosition();
                    let nodeSize = this._heroLvtxtArray[index].node.getComponent(UITransform)?.contentSize as math.Size;
                    let posModel = new Vec3(pos);
                    posModel.y = pos.y + nodeSize.height;
                    this._heroModelArray[index].node.setPosition(posModel);
                    // this._heroModelArray[index].node.acitve=true;
                }
            }
        });


        for (let index = 0; index < this._heroLvtxtArray.length; index++) {
            if (heroTop5.Get(index)) {
                this._heroLvtxtArray[index].string = "Lv." + heroTop5.Get(index).level;
            } else {
                this._heroLvtxtArray[index].string = "";
            }
        }

        this._refreshSlotNum();
        this._initBottomHeros();
    }

    private _refreshCollegeMoney() {
        this.lab_has_fwsj.string = GameModel.getInstance().getPlayerModel().getPlayerInfo().CollegeMoney.toString();
    }

    private _initBottomHeros() {
        if (this.scroll_HeroView.content) {
            this.scroll_HeroView.content.removeAllChildren();
        }

        ResMgr.getInstance().loadPrefab('prefabs_ui/features/college/cell_college', (err: any, res: any) => {
            this._bottomHeroItemList.clear();
            let keys = GameModel.getInstance().getHeroesModel().heroIdInCollegeMap.keys();
            let unlockBlockNum = GameModel.getInstance().getHeroesModel().getCollegeUnlockBlockNum();
            let heroIDInCollegeCount = GameModel.getInstance().getHeroesModel().getHeroIDInCollegeCount();
            let isFirstLocked = true;
            for (let index = 0; index < XShare.getInstance().KCollegeBlockMaxNum; index++) {
                let node = instantiate(res as Prefab) as Node;
                this.scroll_HeroView.content?.addChild(node);

                let collegeItem = node.getComponent("CellCollege") as CellCollege;
                let heroId = 0;
                let isLocked = index >= unlockBlockNum;
                let isShowCD = false;
                let isShowTip = false;
                // 1.符文水晶足够可以解锁 2.已解锁的格子还空着
                let isCanUnLock = false;//todo
                if (isLocked && isCanUnLock && isFirstLocked) {
                    isShowTip = true;
                }
                else if (!isLocked && index >= heroIDInCollegeCount) {
                    isShowTip = true;
                }
                isFirstLocked = false;
                let pos = index + 1;

                GameModel.getInstance().getHeroesModel().heroIdInCollegeMap.forEach((_pos, _heroId, _m) => {
                    if (pos == _pos) {
                        heroId = _heroId;
                    }
                });
                collegeItem.initHeroData(pos, heroId, isLocked, isShowCD, isShowTip);
                this._bottomHeroItemList.set(pos, collegeItem);
            }
        });

    }

    // 符文水晶死否足够可以解锁 
    private _isCanUnLockBlock() {

    }

}
