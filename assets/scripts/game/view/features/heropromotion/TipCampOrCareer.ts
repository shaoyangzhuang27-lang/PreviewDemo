/*
 * @Description: 阵营或职业Tip窗体
 * @Author: 徐涛
 * @Date: 2021-03-23 16:28:25
 * @LastEditTime: 2021-04-07 19:52:48
 */
import { _decorator, Label, Vec3, Sprite } from 'cc';
import { XConsts } from '../../../model/const/XConsts';
import { XFuns } from '../../../model/const/XFuns';
import { ValueMgr } from '../../../model/ValueMgr';
import { TipBase } from '../../../../core/control/TipBase';
const { ccclass, property } = _decorator;

@ccclass('TipCampOrCareer')
export class TipCampOrCareer extends TipBase {
    // [1]
    // dummy = '';
    private _career: number = 0; //职业
    private _camp: number = 0; //阵营
    // cocos编译器会报错.,所以注释了...
    // private _career: Msg.TClassesType = Msg.TClassesType.EClassesType_NULL; //职业
    // private _camp: Msg.TCampType = Msg.TCampType.ECampType_NULL; //阵营

    @property({ type: Label, displayName: "名字" })
    public lab_name: Label = null as unknown as Label;

    @property({ type: Label, displayName: "职业描述" })
    public lab_txt_career: Label = null as unknown as Label;

    @property({ type: Sprite, displayName: "当前阵营" })
    public sp_camp: Sprite = null as unknown as Sprite;

    @property({ type: Sprite, displayName: "克制当前的阵营" })
    public sp_camp_01: Sprite = null as unknown as Sprite;

    @property({ type: Sprite, displayName: "当前克制的阵营" })
    public sp_camp_02: Sprite = null as unknown as Sprite;

    @property({ type: Sprite, displayName: "克制当前的阵营箭头" })
    public sp_arrow_1: Sprite = null as unknown as Sprite;

    @property({ type: Sprite, displayName: "当前克制的阵营箭头" })
    public sp_arrow_2: Sprite = null as unknown as Sprite;

    @property({ type: Sprite, displayName: "底部三角形" })
    public bg_triangle: Sprite | null = null as unknown as Sprite;

    _mapRestrainCamp = new Map<number, number>();//阵营相克表


    start() {
        super.start();
    }

    onLoad() {
        for (let i = Msg.TCampType.ECampType_Water; i <= Msg.TCampType.ECampType_Dark; i++) {
            switch (i) {
                case Msg.TCampType.ECampType_Water:
                    this._mapRestrainCamp.set(Msg.TCampType.ECampType_Water, Msg.TCampType.ECampType_Fire);
                    break;
                case Msg.TCampType.ECampType_Fire:
                    this._mapRestrainCamp.set(Msg.TCampType.ECampType_Fire, Msg.TCampType.ECampType_Wood);
                    break;
                case Msg.TCampType.ECampType_Wood:
                    this._mapRestrainCamp.set(Msg.TCampType.ECampType_Wood, Msg.TCampType.ECampType_Water);
                    break;
                case Msg.TCampType.ECampType_Light:
                    this._mapRestrainCamp.set(Msg.TCampType.ECampType_Light, Msg.TCampType.ECampType_Dark);
                    break;
                case Msg.TCampType.ECampType_Dark:
                    this._mapRestrainCamp.set(Msg.TCampType.ECampType_Dark, Msg.TCampType.ECampType_Light);
                    break;
            }
        }
    }

    /**
     * @description: 重写基类TipBase的方法调整位置
     * @param {Vec3} pos
     * @param {number} align
     * @param {boolean} isViewPos
     */
    public setWinPos(pos: Vec3, align: number = 0, isViewPos: boolean = true) {
        // let posOld =new Vec3(pos);
        super.setWinPos(pos, align, isViewPos);
        let newPos = this.window.getPosition();
        // if (newPos.x < 0) {
        //     newPos.x += 50;
        // }
        // else if (newPos.x > 0) {
        //     newPos.x -= 50;
        // }
        // newPos.x= posOld.x;

        newPos.y += 20;
        this.window.setPosition(newPos);
    }

    /**
     * @description: 设置要显示的职业或阵营
     * @param {Msg} career
     * @param {Msg} camp
     */
    public setData(career: Msg.TClassesType = Msg.TClassesType.EClassesType_NULL, camp: Msg.TCampType = Msg.TCampType.ECampType_NULL) {
        if (career != Msg.TClassesType.EClassesType_NULL) {
            // 显示职业
            this._career = career;
            this._showCarrer(career);
        } else if (camp != Msg.TCampType.ECampType_NULL) {
            // 显示阵营
            this._camp = camp;
            this._showCamp(camp);
        }
    }

    private _showCarrer(career: Msg.TClassesType) {
        let isShowCareer: boolean = true;
        this.lab_txt_career.node.active = isShowCareer;

        this.sp_camp.node.active = !isShowCareer;
        this.sp_camp_01.node.active = !isShowCareer;
        this.sp_camp_02.node.active = !isShowCareer;
        this.sp_arrow_1.node.active = !isShowCareer;
        this.sp_arrow_2.node.active = !isShowCareer;

        this.lab_name.string = ValueMgr.getInstance().getLanguageString("UI_Job");//"职业";
        this.lab_txt_career.string = ValueMgr.getInstance().getLanguageString(XConsts.KHeroClasses[career]);
    }

    private _showCamp(camp: Msg.TCampType) {
        this.lab_txt_career.node.active = false;
        this.lab_name.string = ValueMgr.getInstance().getLanguageString("UI_CampRestrain");// "阵营克制";                

        if (camp == Msg.TCampType.ECampType_Light || camp == Msg.TCampType.ECampType_Dark) {
            if (this._mapRestrainCamp.has(camp)) {
                let iconPath = "ui/features/heropromotion/" + XConsts.KCampSpriteNameForHeroPromotion[camp] + "/spriteFrame";
                XFuns.ReplaceSpriteFrame(iconPath, this.sp_camp);
                let iconPathArrow = "ui/features/heropromotion/" + XConsts.KHeroCampRestrainIconForHeroPromotion[camp] + "/spriteFrame";
                XFuns.ReplaceSpriteFrame(iconPathArrow, this.sp_arrow_2);

                let k = this._mapRestrainCamp.get(camp) as number;
                let iconPath1 = "ui/features/heropromotion/" + XConsts.KCampSpriteNameForHeroPromotion[k] + "/spriteFrame";
                XFuns.ReplaceSpriteFrame(iconPath1, this.sp_camp_01);
                let iconPathArrow1 = "ui/features/heropromotion/" + XConsts.KHeroCampRestrainIconForHeroPromotion[k] + "/spriteFrame";
                XFuns.ReplaceSpriteFrame(iconPathArrow1, this.sp_arrow_1);

                this.sp_camp_02.node.active = false;

                let pos = this.sp_camp.node.getPosition();
                let pos1 = this.sp_camp_01.node.getPosition();
                pos1.y = pos.y;
                this.sp_camp_01.node.setPosition(pos1);
            }

        } else {
            if (this._mapRestrainCamp.has(camp)) {
                let iconPath = "ui/features/heropromotion/" + XConsts.KCampSpriteNameForHeroPromotion[camp] + "/spriteFrame";
                XFuns.ReplaceSpriteFrame(iconPath, this.sp_camp);
                let iconPathArrow = "ui/features/heropromotion/" + XConsts.KHeroCampRestrainIconForHeroPromotion[camp] + "/spriteFrame";
                XFuns.ReplaceSpriteFrame(iconPathArrow, this.sp_arrow_2);


                let k = this._mapRestrainCamp.get(camp) as number;
                let iconPath1 = "ui/features/heropromotion/" + XConsts.KCampSpriteNameForHeroPromotion[k] + "/spriteFrame";
                XFuns.ReplaceSpriteFrame(iconPath1, this.sp_camp_02);

                let k2 = this._mapRestrainCamp.get(k) as number;
                let iconPath2 = "ui/features/heropromotion/" + XConsts.KCampSpriteNameForHeroPromotion[k2] + "/spriteFrame";
                XFuns.ReplaceSpriteFrame(iconPath2, this.sp_camp_01);
                let iconPathArrow1 = "ui/features/heropromotion/" + XConsts.KHeroCampRestrainIconForHeroPromotion[k2] + "/spriteFrame";
                XFuns.ReplaceSpriteFrame(iconPathArrow1, this.sp_arrow_1);
            }
        }
    }

}
