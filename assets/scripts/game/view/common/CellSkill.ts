/** 
 * 单个技能/天赋框UI单元
 * @author 徐涛
 * @version 1.0.0,2021.3.13
**/

import { _decorator, Component, Node, Sprite, Label, Button, SpriteFrame, resources, math, UITransform, Material, Vec3, EventTouch, systemEvent, SystemEvent } from 'cc';
import { PopMgr } from '../../control/PopMgr';
import { ResMgr } from '../../control/ResMgr';
import { XFuns } from '../../model/const/XFuns';
const { ccclass, property } = _decorator;
import { TableName, ValueMgr } from "../../model/ValueMgr";

@ccclass('CellSkill')
export class CellSkill extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({ type: Sprite, displayName: "技能背景框" })
    public btn_bg: Sprite = null as unknown as Sprite;

    @property({ type: Sprite, displayName: "技能图标" })
    public img_icon: Sprite = null as unknown as Sprite;

    @property({ type: Label, displayName: "技能等级" })
    public lab_level: Label = null as unknown as Label;

    @property({ type: Node, displayName: "技能等级背景" })
    public sp_lv: Node = null as unknown as Node;

    private _isGrayStatus: boolean = false; // 技能图标灰化标识
    private _skillId: number = 0; //主动技能id
    private _talentId: number = 0; //被动天赋id
    private _unlockTier: number = 0; // 天赋解锁品阶
    private _skillOrTalentLv: number = 0; // 当前技能/天赋等级    
    private _isUnLocked: boolean = true; // 当前技能/天赋是否已解锁
    private _recordSkill: Config.skill.Record = null as unknown as Config.skill.Record;//对应技能表内的一条记录数据
    private _recordTalent: Config.talent.Record = null as unknown as Config.talent.Record;//对应天赋表内的一条记录数据

    start() {
        // [3]
    }

    /** 
    * 设置技能单个Item的技能数据[英雄升级等UI使用]
    * @param skillId 主动技能id
    * @param star 英雄星级
    **/
    public setSkillData(skillId: number, star: number = 1) {
        if (skillId <= 0) {
            this._initDefaultView();
            return;
        }

        let recordTmp = ValueMgr.getInstance().getItemByField(TableName.skill, skillId);
        if (!recordTmp) {
            this._initDefaultView();
            return;
        }

        this._recordSkill = recordTmp as Config.skill.Record;
        this._skillOrTalentLv = this._recordSkill.level;
        this._skillId = skillId;
        this._unlockTier = 0;
        this._talentId = 0;
        // 技能图标
        let iconPath: string = "ui/skill_icon/" + this._recordSkill.image + "/spriteFrame";
        XFuns.ReplaceSpriteFrame(iconPath, this.img_icon);
        // 技能等级
        this._setLv(this._skillOrTalentLv);
        // 技能Item点击默认回调显示技能tip
        this._setDefaultBtnCallBack();
        // 技能是否解锁
        if (star >= this._recordSkill.unlockStar) {
            this._isUnLocked = true;
            //还原灰化处理
            this._doUnGrayNode();
        }
        else {
            this._isUnLocked = false;
            //灰化处理
            this._doGrayNode();
        }
    }

    /** 
    * 设置技能单个Item的天赋数据[英雄升级等UI使用]
    * @param talentId 被动天赋id
    * @param star 英雄星级
    * @param tier 英雄品阶
    * @param unlockTier 天赋解锁品阶
    **/
    public setTalentData(talentId: number, star: number = 1, tier: number = 1, unlockTier: number = 1) {
        if (talentId <= 0) {
            this._initDefaultView();
            return;
        }

        let recordTmp = ValueMgr.getInstance().getItemByField(TableName.talent, talentId);
        if (!recordTmp) {
            this._initDefaultView();
            return;
        }

        this._recordTalent = recordTmp as Config.talent.Record;
        this._skillOrTalentLv = this._recordTalent.level;
        this._talentId = talentId;
        this._unlockTier = unlockTier;
        this._skillId = 0;
        // 图标
        let framePath: string = "ui/skill_icon/" + this._recordTalent.image + "/spriteFrame";
        // todo 由于天赋图标还没资源,暂时统一用  愈合伤口 替代
        framePath = "ui/skill_icon/愈合伤口/spriteFrame";
        XFuns.ReplaceSpriteFrame(framePath, this.img_icon);
        // 等级
        this._setLv(this._skillOrTalentLv);
        // Item点击默认回调显示技能tip
        this._setDefaultBtnCallBack();
        // 天赋是否解锁
        if (tier >= unlockTier) {
            this._isUnLocked = true;
            //还原灰化处理
            this._doUnGrayNode();
        }
        else {
            this._isUnLocked = false;
            //灰化处理
            this._doGrayNode();
        }
    }

    // 默认空的技能/天赋Item显示
    private _initDefaultView() {
        this._skillId = 0;
        this._talentId = 0;
        this._skillOrTalentLv = 0;
        this._isGrayStatus = false;
        this._isUnLocked = false;
        this._unlockTier = 0;
        // 显示无技能图标
        XFuns.ReplaceSpriteFrame("ui/skill_item/英雄详情_无/spriteFrame", this.img_icon);
        // 技能等级及等级背景不显示
        this._setLv();
        return;
    }

    //技能等级及等级背景显示
    private _setLv(lv: number = 0) {
        if (lv <= 1) {
            this.sp_lv.active = false;
            this.lab_level.string = "";
        }
        else {
            this.sp_lv.active = true;
            this.lab_level.string = lv.toString();
        }
    }

    //资源替换
    private _resourceLoad(path: string, obj: any) {
        ResMgr.getInstance().loadSpriteFrame(path, (err, spriteFrame) => {
            console.log("skillItem icon _resourceLoad ---------", err)
            if (!err) {
                let sprite = obj.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
    }

    // 灰化图片处理
    private _doGrayNode() {
        this._isGrayStatus = true;
        //todo
        // Material
        // 内建材质
        // let material:Material = Material.getBuiltinMaterial('2d-gray-sprite')
        // this.head.setMaterial(0, material);
        // let sprite = this.img_icon.getComponent(Sprite) as Sprite;
        // sprite.setMaterial(Material.get);
    }

    // 还原灰化图片处理
    private _doUnGrayNode() {
        this._isGrayStatus = false;
        //todo
    }

    // 默认点击显示技能Tip        
    private _setDefaultBtnCallBack() {
        this.btn_bg.addComponent(Button);
        this.btn_bg.node.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            let pos = new Vec3(event.getLocation().x, event.getLocation().y, 0);
            if (event.target == this.btn_bg.node) {
                console.log("event.target == this.btn_bg");
                pos = this.btn_bg.node.getWorldPosition();
                console.log(pos);
                // let _node = this.node.getComponent(UITransform) as UITransform;
                // let k = this.btn_bg.node.getComponent(UITransform) as UITransform;
                // pos.y += k.contentSize.height/2;
            }

            PopMgr.getInstance().tipSkillWindow(pos, {
                skillId: this._skillId, talentId: this._talentId,
                isUnlock: this._isUnLocked, unlockTier: this._unlockTier
            });
        }, this);
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
