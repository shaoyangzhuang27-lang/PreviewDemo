/*
 * @Description: 学院界面内待选择英雄槽位
 * @Author: 徐涛
 * @Date: 2021-03-30 16:03:26
 * @LastEditTime: 2021-04-06 16:35:25
 */
import { _decorator, Component, Node, Sprite, Label, Button, SpriteFrame, resources, math, UITransform, EventTouch, Vec3, instantiate, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import { HeroData } from '../../model/datas/HeroData';
import { GameModel } from "../../model/GameModel";
import { HeroIcon } from '../hero/HeroIcon';
import { PopMgr } from '../../control/PopMgr';
import { XFuns } from '../../model/const/XFuns';
import { ResMgr } from '../../control/ResMgr';

@ccclass('CollegeItem')
export class CollegeItem extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({ type: Sprite, displayName: "背景" })
    public img_bg: Sprite = null as unknown as Sprite;

    @property({ type: Label, displayName: "冷却文字" })
    public lab_txt: Label = null as unknown as Label;

    @property({ type: Sprite, displayName: "提醒感叹号" })
    public img_tip: Sprite = null as unknown as Sprite;

    //英雄数据
    private _heroData: HeroData | null = null;// as unknown as HeroData;    
    //有英雄在这个槽位时对应英雄ui预制体
    private _heroIcon: HeroIcon | null = null;// as unknown as HeroIcon;
    //倒计时(单位:秒s)
    private _leftTime: number = 0;
    private CONST_LEFT_TIME: number = 2;
    private _isShowCD: boolean = false;
    private _isLocked: boolean = true;
    private _heroId: number = 0;
    private _pos: number = 0;
    private _isShowTip: boolean = false;

    public get heroId() {
        return this._heroId;
    }
    public get isLocked() {
        return this._isLocked;
    }
    public get pos() {
        return this._pos;
    }
    public get isShowCD() {
        return this._isShowCD;
    }

    start() {
        // [3]

    }

    onLoad() {
        this._setBtnCallBack();
    }

    /**
     * @description: 设置该槽位数据
     * @param {number} heroId 放在该槽位英雄
     * @param {boolean} isLocked 是否解锁槽位标志
     * @param {boolean} isShowTip 是否显示槽位提醒标志
     */
    public initHeroData(pos: number, heroId: number = 0, isLocked: boolean = false, isShowCD: boolean = false, isShowTip: boolean = false) {
        this._pos = pos;
        this.setHeroIcon(heroId);
        this.setShowCD(isShowCD);
        this.setLocked(isLocked);
        this.setShowTip(isShowTip);
    }

    public updateHeroData(heroId: number = 0, isLocked: boolean = false, isShowCD: boolean = false, isShowTip: boolean = false) {
        this.setHeroIcon(heroId, true);
        this.setShowCD(isShowCD, true);
        this.setLocked(isLocked, true);
        this.setShowTip(isShowTip, true);
    }

    public setShowCD(isShowCD: boolean, isUpdate = false) {
        if (isUpdate && isShowCD == this._isShowCD) {
            return;
        }
        this._isShowCD = isShowCD;
        if (isShowCD) {
            this._setCDTxt(true);
            let target = this;
            this.lab_txt.schedule(() => {
                target._setCDTxt(false);
            }, 1, this.CONST_LEFT_TIME);
        } else {
            this.lab_txt.node.active = false;
        }
    }

    private _setCDTxt(isFirst: boolean = false) {
        if (isFirst) {
            this._leftTime = 0;
            this.lab_txt.node.active = true;
            this.lab_txt.string = "冷却中\n00:00:0" + this.CONST_LEFT_TIME.toString();
        } else {
            this._leftTime += 1;
            let second = this.CONST_LEFT_TIME - this._leftTime;
            if (second >= 0) {
                this.lab_txt.string = "冷却中\n00:00:0" + second.toString();
            } else {
                this.lab_txt.node.active = false;
                this._isShowCD = false;
            }
        }
    }

    public setShowTip(isShowTip: boolean, isUpdate = false) {
        if (isUpdate && isShowTip == this._isShowTip) {
            return;
        }
        this._isShowTip = isShowTip;
        this.img_tip.node.active = isShowTip;
    }

    public setLocked(isLocked: boolean, isUpdate = false) {
        if (isUpdate && isLocked == this._isLocked) {
            return;
        }
        this._isLocked = isLocked;
        let imgPath = "ui/college/阵型调整_出战阵容英雄背景/spriteFrame";
        if (isLocked) {
            imgPath = "ui/college/阵型调整_未解锁背景/spriteFrame";
        }
        XFuns.ReplaceSpriteFrame(imgPath, this.img_bg);
    }

    public setHeroIcon(heroId: number, isUpdate = false) {
        if (isUpdate && heroId == this._heroId) {
            return;
        }
        this._heroId = heroId;
        if (heroId == 0) {
            this._clearHeroIcon();

        } else {
            let heroData = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(heroId);
            if (!heroData) {
                this._clearHeroIcon();
                return;
            }

            //等级等于学院等级
            console.log(heroData.level);
            console.log(GameModel.getInstance().getHeroesModel().heroCollegeLevel);
            heroData.level = GameModel.getInstance().getHeroesModel().heroCollegeLevel;
            this._heroData = heroData;
            if (this._heroIcon && this._heroIcon instanceof HeroIcon) {
                this._heroIcon.setHeroInfo(heroData.record, GameModel.getInstance().getHeroesModel().heroCollegeLevel);
                this._heroIcon.node.active = true;

            } else {
                this._heroIcon = null;
                let target = this;
                ResMgr.getInstance().loadPrefab('prefabs_ui/main/hero_icon', (err: any, res: any) => {
                    let heroIcon = instantiate(res as Prefab) as Node;
                    let script = heroIcon.getComponent("HeroIcon") as HeroIcon;
                    script.setHeroData(heroData as HeroData);
                    // script.setBtnCallBack((_data: HeroData) => {
                    //     target._openCollegeUnLoadView(_data);
                    // });
                    this._heroIcon = script;
                    this.node.addChild(heroIcon);
                    heroIcon.setScale(new Vec3(0.7, 0.7, 1));
                });
            }
        }
    }

    private _openCollegeUnLoadView(_heroData: HeroData) {
        console.log(" _openCollegeUnLoadView _heroData=", _heroData);
        PopMgr.getInstance().popHeroCollegeUnloadHeroView(_heroData.getDyncID(), this._pos);
    }

    private _clearHeroIcon() {
        this._heroData = null;
        if (this._heroIcon && this._heroIcon instanceof HeroIcon) {
            this._heroIcon.node.active = false;
        } else {
            this._heroIcon = null;
        }
    }

    // Item点击默认回调显示开启卡槽窗或选择放入书院的英雄窗       
    private _setBtnCallBack() {
        this.img_bg.addComponent(Button);
        let target = this;
        this.img_bg.node.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            if (target.isShowCD) {
                return;
            }
            if (target._isLocked) {
                PopMgr.getInstance().popHeroCollegeNoticeView();
            } else {
                if (!target._heroData) {
                    PopMgr.getInstance().popHeroCollegeSelectHeroView(target._pos);
                } else {
                    PopMgr.getInstance().popHeroCollegeUnloadHeroView(target._heroData.getDyncID(), target._pos);
                }
            }
        }, this);
    }

}
