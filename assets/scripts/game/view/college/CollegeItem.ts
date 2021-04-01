/*
 * @Description: 学院界面内待选择英雄槽位
 * @Author: 徐涛
 * @Date: 2021-03-30 16:03:26
 * @LastEditTime: 2021-03-30 19:44:17
 */
import { _decorator, Component, Node, Sprite, Label, Button, SpriteFrame, resources, math, UITransform, EventTouch, Vec3, instantiate } from 'cc';
const { ccclass, property } = _decorator;
import { HeroData } from '../../model/datas/HeroData';
import { GameModel } from "../../model/GameModel";
import { HeroIcon } from '../hero/HeroIcon';
import { PopMgr } from '../../control/PopMgr';
import { XFuns } from '../../model/const/XFuns';

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
    private _isShowTip: boolean = false;
    private _isCanDefaultCallBack: boolean = true;

    start() {
        // [3]

    }

    onLoad() {
        this._setDefaultBtnCallBack();
    }

    /**
     * @description: 设置该槽位数据
     * @param {number} heroId 放在该槽位英雄
     * @param {boolean} isLocked 是否解锁槽位标志
     * @param {boolean} isShowTip 是否显示槽位提醒标志
     */
    public setHeroData(heroId: number = 0, isLocked: boolean = false, isShowCD: boolean = false, isShowTip: boolean = false) {
        this._setHeroIcon(heroId);
        this._setShowCD(isShowCD);
        this._setLocked(isLocked);
        this._setShowTip(isShowTip);
    }

    private _setShowCD(isShowCD: boolean) {
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
            }
        }
    }

    private _setShowTip(isShowTip: boolean) {
        this._isShowTip = isShowTip;
        this.img_tip.node.active = isShowTip;
    }

    private _setLocked(isLocked: boolean) {
        this._isLocked = isLocked;
        let imgPath = "ui/college/阵型调整_出战阵容英雄背景/spriteFrame";
        if (isLocked) {
            imgPath = "ui/college/阵型调整_未解锁背景/spriteFrame";
        }
        XFuns.ReplaceSpriteFrame(imgPath, this.img_bg);
    }

    private _setHeroIcon(heroId: number) {
        this._heroId = heroId;
        if (heroId == 0) {
            this._clearHeroIcon();

        } else {
            let heroData = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(heroId);
            if (!heroData) {
                this._clearHeroIcon();
                return;
            }

            //等级等于学院等级 todo!
            // heroData.level= 
            this._heroData = heroData;
            this._isCanDefaultCallBack = false;
            if (this._heroIcon && this._heroIcon instanceof HeroIcon) {
                this._heroIcon.setHeroData(heroData);
                this._heroIcon.node.active = true;
            } else {
                this._heroIcon = null;
                let target = this;
                resources.load('prefabs_ui/main/hero_icon', (err: any, res: any) => {
                    let heroIcon = instantiate(res) as Node;
                    let script = heroIcon.getComponent("HeroIcon") as HeroIcon;
                    script.setHeroData(heroData as HeroData);
                    script.setBtnCallBack((_data: HeroData) => {
                        target._openCollegeUnLoadView(_data);
                    });
                    this.node.addChild(heroIcon);
                });
            }
        }
    }

    private _openCollegeUnLoadView(_heroData: HeroData) {
        console.log(" _openCollegeUnLoadView _heroData=", _heroData);
        PopMgr.getInstance().popHeroCollegeUnloadHeroView(_heroData.getDyncID());
    }

    private _clearHeroIcon() {
        this._heroData = null;
        this._isCanDefaultCallBack = true;
        if (this._heroIcon && this._heroIcon instanceof HeroIcon) {
            this._heroIcon.node.active = false;
        } else {
            this._heroIcon = null;
        }
    }

    // Item点击默认回调显示开启卡槽窗或选择放入书院的英雄窗       
    private _setDefaultBtnCallBack() {
        this.img_bg.addComponent(Button);
        let target = this;
        this.img_bg.node.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            if (target._isCanDefaultCallBack) {
                PopMgr.getInstance().popHeroCollegeNoticeView();
            }
            // PopMgr.getInstance().popHeroCollegeSelectHeroView();
        }, this);
    }

}
