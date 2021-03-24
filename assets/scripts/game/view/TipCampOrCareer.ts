/*
 * @Description: 阵营或职业Tip窗体
 * @Author: 徐涛
 * @Date: 2021-03-23 16:28:25
 * @LastEditTime: 2021-03-23 20:20:05
 */
import { _decorator, Node, Label, Vec3, Sprite, Color, UITransform, math, resources, SpriteFrame } from 'cc';
import { XConsts } from '../model/const/XConsts';
import { TableName, TLanguageType, ValueMgr } from '../model/ValueMgr';
import { TipBase } from './TipBase';
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
    public sp_icon1: Sprite = null as unknown as Sprite;

    @property({ type: Sprite, displayName: "当前克制的阵营" })
    public sp_icon2: Sprite = null as unknown as Sprite;

    @property({ type: Sprite, displayName: "克制当前的阵营箭头" })
    public sp_arrow1: Sprite = null as unknown as Sprite;

    @property({ type: Sprite, displayName: "当前克制的阵营箭头" })
    public sp_arrow2: Sprite = null as unknown as Sprite;

    @property({ type: Sprite, displayName: "底部三角形" })
    public bg_triangle: Sprite | null = null as unknown as Sprite;


    start() {
        super.start();
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
        if (newPos.x < 0) {
            newPos.x += 50;
        }
        else if (newPos.x > 0) {
            newPos.x -= 50;
        }
        // newPos.x= posOld.x;
        this.window.setPosition(newPos);
    }

    /**
     * @description: 设置要显示的职业或阵营
     * @param {Msg} career
     * @param {Msg} camp
     */
    public setData(career: Msg.TClassesType = Msg.TClassesType.EClassesType_NULL, camp: Msg.TCampType = Msg.TCampType.ECampType_NULL) {
        if(career != Msg.TClassesType.EClassesType_NULL){
            // 显示职业
            this._career = career;
            this._showCarrer(career);
        }else if(camp != Msg.TCampType.ECampType_NULL){
            // 显示阵营
            this._camp = camp;
            this._showCamp(camp);
        }
    }

    private _showCarrer(career: Msg.TClassesType){
        this._setShowNodes(true);
        this.lab_name.string= ValueMgr.getInstance().getLanguageString("UI_Job");//"职业";
        this.lab_txt_career.string= ValueMgr.getInstance().getLanguageString(XConsts.KHeroClasses[career] );
    }

    private _showCamp(camp: Msg.TCampType){
        this._setShowNodes(false);
        this.lab_name.string= ValueMgr.getInstance().getLanguageString("UI_CampRestrain");// "阵营克制";

        if(camp == Msg.TCampType.ECampType_Water){

        }
    }

    private _setShowNodes(isShowCareer: boolean= true){
        // this.lab_name.node.active= true;
        this.lab_txt_career.node.active= isShowCareer;

        this.sp_camp.node.active= !isShowCareer;
        this.sp_icon1.node.active= !isShowCareer;
        this.sp_icon2.node.active= !isShowCareer;
        this.sp_arrow1.node.active= !isShowCareer;
        this.sp_arrow2.node.active= !isShowCareer;
    }
}
