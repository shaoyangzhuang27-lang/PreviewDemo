/*
 * @Description: 技能框点击弹出的Tip窗体
 * @Author: 徐涛
 * @Date: 2021-03-09 19:30:14
 * @LastEditTime: 2021-03-15 16:25:15
 */
import { _decorator, Node, Label, Vec3, Sprite, Color, UITransform, math, resources, SpriteFrame } from 'cc';
import { TableName, ValueMgr } from '../model/ValueMgr';
import { TipBase } from './TipBase';
const { ccclass, property } = _decorator;

@ccclass('TipSkill')
export class TipSkill extends TipBase {
    // [1]
    // dummy = '';
    
    private _skillId:number =0 ; //主动技能id
    private _talentId:number =0 ; //被动天赋id
    private _unlockTier:number =0 ; // 天赋解锁品阶
    private _skillOrTalentLv:number =0 ; // 当前技能/天赋等级    
    private _isUnLocked: boolean = true; // 当前技能/天赋是否已解锁
    private _recordSkill : Config.skill.Record = null as unknown as Config.skill.Record;//对应技能表内的一条记录数据
    private _recordTalent : Config.talent.Record = null as unknown as Config.talent.Record;//对应天赋表内的一条记录数据
    
    //技能图标
    @property({ type: Sprite, displayName: "技能图标" })
    public skill_icon: Sprite = null as unknown as Sprite;
    //技能名字
    @property({ type: Label, displayName: "技能名字" })
    public lab_name: Label = null as unknown as Label;
    //技能类型
    @property({ type: Label, displayName: "技能类型" })
    public lab_type: Label = null as unknown as Label;
    //技能等级描述
    @property({ type: Label, displayName: "等级1描述" })
    public lab_txt_0: Label = null as unknown as Label;
    //技能等级描述
    @property({ type: Label, displayName: "等级2描述" })
    public lab_txt_1: Label = null as unknown as Label;
    //技能等级描述
    @property({ type: Label, displayName: "等级3描述" })
    public lab_txt_2: Label = null as unknown as Label;
    //底部三角形箭头标
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
        this._setTrianglePos(pos.x);
    }

    //设置三角形标x轴位置
    private _setTrianglePos(x: number) {
        if (this.bg_triangle) {
            let pos = this.bg_triangle.node.getPosition();
            if (x > 0) {
                pos.x = 160;   //箭头位于右边
            } else if (x <= 0) {
                pos.x = -160;  //箭头位于左边
            }
            this.bg_triangle.node.setPosition(pos);
        }
    }

    /**
     * @description: 设置技能/天赋数据
     * @param skillData : {skillId: 技能id, talentId:天赋id, isUnlock:是否解锁, unlockTier:解锁品阶(天赋会用到)}
     */
    public setSkillData(skillData: any) {
        if(!skillData || ( !skillData.skillId && !skillData.talentId) )
        {
            console.log(" TipSkill::setSkillData() skillData err ");
            return ;
        }
        
        let skillId= skillData.skillId as number;
        let talentId= skillData.talentId as number;
        this._isUnLocked = skillData.isUnlock as boolean;
        this._unlockTier = skillData.unlockTier as number;

        let recordSkill, recordTalent;
        if(skillId>0)
        {
            recordSkill = ValueMgr.getInstance().getItemByField(TableName.skill, skillId);            
            if(recordSkill)
            {
                this._recordSkill = recordSkill as Config.skill.Record;
                this._skillId = skillId;
                this._doSetSkillData();
            }
        }
        
        if(talentId> 0)
        {
            recordTalent = ValueMgr.getInstance().getItemByField(TableName.talent, talentId);   
            if(recordTalent)
            {
                this._recordTalent = recordTalent as Config.talent.Record;
                this._talentId = talentId;
                this._doSetTalentData();
            }         
        }
        
    }

    private _doSetSkillData(){
        // 等级
        this._skillOrTalentLv = this._recordSkill.level;
        // 技能名称
        let name = this._recordSkill.name;
        let record_language_data = ValueMgr.getInstance().getItemByField(TableName.language_data, name) as Config.language_data.Record;
        this.lab_name.string = record_language_data.cn;
        // 技能类型 
        this.lab_type.string = "主动技能"; //"被动技能";

        // 技能图标
        let framePath: string = "ui/skill_icon/" + this._recordSkill.image + "/spriteFrame"
        this._resourceLoad(framePath, this.skill_icon);

        let skillId0 = this._skillId;  //等级0的技能id    
        this.lab_txt_0.color = Color.BLACK;
        this.lab_txt_1.color = Color.GRAY;
        this.lab_txt_2.color = Color.GRAY;
        if (this._skillOrTalentLv == 2) {
            skillId0 = this._skillId - 1;
            this.lab_txt_1.color = Color.GREEN;
            this.lab_txt_2.color = Color.GRAY;
        }
        else if (this._skillOrTalentLv == 3) {
            skillId0 = this._skillId - 2;
            this.lab_txt_1.color = Color.BLACK;
            this.lab_txt_2.color = Color.GREEN;
        }

        if (skillId0 > 0) {
            //技能等级1
            let recordSkillId0 = ValueMgr.getInstance().getItemByField(TableName.skill, skillId0) as Config.skill.Record;
            this._setSkillText(1, this.lab_txt_0, recordSkillId0);

            //技能等级2
            let recordSkillId1 = ValueMgr.getInstance().getItemByField(TableName.skill, skillId0 + 1);
            if (recordSkillId1 == undefined) {
                this.lab_txt_1.string = "";
                this.lab_txt_2.string = "";
            }
            else {
                let skillTmp = recordSkillId1 as Config.skill.Record;
                this._setSkillText(2, this.lab_txt_1, skillTmp);

                //技能等级3
                let recordSkillId2 = ValueMgr.getInstance().getItemByField(TableName.skill, skillId0 + 2);
                if (recordSkillId2 == undefined) {
                    this.lab_txt_2.string = "";
                }
                else {
                    skillTmp = recordSkillId2 as Config.skill.Record;
                    this._setSkillText(3, this.lab_txt_2, skillTmp);
                }
            }
        }

    }

    private _doSetTalentData(){
        // 等级
        this._skillOrTalentLv = this._recordTalent.level;
        // 技能名称
        let name = this._recordTalent.name;
        let record_language_data = ValueMgr.getInstance().getItemByField(TableName.language_data, name) as Config.language_data.Record;
        this.lab_name.string = record_language_data.cn;
        // 技能类型 
        this.lab_type.string = "被动技能";

        // 技能图标
        let framePath: string = "ui/skill_icon/" + this._recordTalent.image + "/spriteFrame";
        // todo 由于天赋图标还没资源,暂时统一用  愈合伤口 替代
        framePath = "ui/skill_icon/愈合伤口/spriteFrame";    
        this._resourceLoad(framePath, this.skill_icon);

        let skillId0 = this._talentId;  //等级0的技能id    
        this.lab_txt_0.color = Color.BLACK;
        this.lab_txt_1.color = Color.GRAY;
        this.lab_txt_2.color = Color.GRAY;
        if (this._skillOrTalentLv == 2) {
            skillId0 = this._talentId - 1;
            this.lab_txt_1.color = Color.GREEN;
            this.lab_txt_2.color = Color.GRAY;
        }
        else if (this._skillOrTalentLv == 3) {
            skillId0 = this._talentId - 2;
            this.lab_txt_1.color = Color.BLACK;
            this.lab_txt_2.color = Color.GREEN;
        }

        if (skillId0 > 0) {
            //技能等级1
            let recordSkillId0 = ValueMgr.getInstance().getItemByField(TableName.talent, skillId0) as Config.talent.Record;
            this._setTalentText(1, this.lab_txt_0, recordSkillId0);

            //技能等级2
            let recordSkillId1 = ValueMgr.getInstance().getItemByField(TableName.talent, skillId0 + 1);
            if (recordSkillId1 == undefined) {
                this.lab_txt_1.string = "";
                this.lab_txt_2.string = "";
            }
            else {
                let skillTmp = recordSkillId1 as Config.talent.Record;
                this._setTalentText(2, this.lab_txt_1, skillTmp);

                //技能等级3
                let recordSkillId2 = ValueMgr.getInstance().getItemByField(TableName.talent, skillId0 + 2);
                if (recordSkillId2 == undefined) {
                    this.lab_txt_2.string = "";
                }
                else {
                    skillTmp = recordSkillId2 as Config.talent.Record;
                    this._setTalentText(3, this.lab_txt_2, skillTmp);
                }
            }
        }

    }
    
    //资源替换
    private _resourceLoad(path: string, obj: any) {
        resources.load(path, SpriteFrame, (err, spriteFrame:SpriteFrame) =>{
            console.log("tipSkill _resourceLoad err=", err)
            if (!err) {
                let sprite = obj.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
    }

    private _setSkillText(lv: number, lab_txt: Label, record: Config.skill.Record| null | undefined ) {
        if (!record) {
            lab_txt.string = "";
            return;
        }
        
        let recordSkill = record as Config.skill.Record;
        let desc_id = recordSkill.desc;
        // 获取技能描述
        let record_language_data = ValueMgr.getInstance().getItemByField(TableName.language_data, desc_id) as Config.language_data.Record;
        let strTmp = "Lv" + lv.toString() + ":" + record_language_data.cn;
        let values = [10, 9, 8]; //todo
        let strFmtTmp = this._formatSkillDesc(strTmp, values);
        if( (recordSkill.unlockStar>0) && (lv == (this._skillOrTalentLv+1) ) )
        {
            // 组装技能解锁描述
            strFmtTmp += "("+recordSkill.unlockStar.toString()+"星解锁)"; 
        }
        lab_txt.string = strFmtTmp;
    }

    private _setTalentText(lv: number, lab_txt: Label, record: Config.talent.Record| null | undefined) {
        if (!record) {
            lab_txt.string = "";
            return;
        }

        let recordTalent = record as Config.talent.Record;
        let desc_id = recordTalent.desc;
        // 获取技能描述
        let record_language_data = ValueMgr.getInstance().getItemByField(TableName.language_data, desc_id) as Config.language_data.Record;
        let strTmp = "Lv" + lv.toString() + ":" + record_language_data.cn;
        let values = [10, 9, 8]; //todo
        let strFmtTmp = this._formatSkillDesc(strTmp, values);        
        if( !this._isUnLocked )        
        {
            if( (lv == this._skillOrTalentLv) && (this._unlockTier>0)  ) {            
                // 组装解锁描述
                strFmtTmp += "(品阶"+this._unlockTier.toString()+"解锁)";
            }
        }        
        else
        {
            if( (recordTalent.unlockStar>0) && (lv == (this._skillOrTalentLv+1) ) )
            {                    
                // 组装解锁描述
                strFmtTmp += "("+recordTalent.unlockStar.toString()+"星解锁)"; 
            }
        }
        lab_txt.string = strFmtTmp;
    }

    //todo 格式化填充技能描述 XShare.getInstance().getKeyStrSkillOrTalent
    private _formatSkillDesc(desc: string, values: number[]) {
        //替换填充数值 
        //<tn>--目标数
        //<ep1>--效果1
        //<ex1>--效果1 
        //<bt1>,<bt2>,<bt3>--持续多少秒
        //<ec1>--效果1
        //{0}--提升/降低效果1
        let newDesc = desc;
        for (let index = 0; index < values.length; index++) {
            newDesc = desc.replace(`<ep1>`, values[index].toString());
        }
        return newDesc;
    }
}
