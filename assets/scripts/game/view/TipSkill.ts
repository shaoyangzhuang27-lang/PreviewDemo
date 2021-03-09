import { _decorator, Node, Label, Vec3, Sprite, Color, UITransform, math, resources, SpriteFrame } from 'cc';
import { TableName, ValueMgr } from '../model/ValueMgr';
import { TipBase } from './TipBase';
const { ccclass, property } = _decorator;

@ccclass('TipSkill')
export class TipSkill extends TipBase {
    // [1]
    // dummy = '';

    _skillId:number =0 ; //技能id
    _skillLv:number =0 ; //当前技能等级
    private _recordSkill : Config.skill.Record = null as unknown as Config.skill.Record;    //记录的技能

    //技能图标
    @property({type: Sprite})
    public skill_icon:Sprite = null as unknown as Sprite;
    //技能名字
    @property({type: Label})
    public lab_name:Label = null as unknown as Label;
    //技能类型
    @property({type: Label})
    public lab_type:Label = null as unknown as Label;
    
    //技能等级描述
    @property({type: Label})
    public lab_txt_0:Label = null as unknown as Label;
    //技能等级描述
    @property({type: Label})
    public lab_txt_1:Label = null as unknown as Label;
    //技能等级描述
    @property({type: Label})
    public lab_txt_2:Label = null as unknown as Label;

    //底部三角形箭头标
    @property({type: Sprite})
    public bg_triangle:Sprite = null as unknown as Sprite;
    
    start () {
        super.start();
    }

    public setWinPos(pos:Vec3,align:number = 0,isViewPos:boolean = true){
        super.setWinPos(pos, align, isViewPos);

        console.log("设置三角形标x轴位置");
        this.setTrianglePos(pos.x);
    }

      //设置三角形标x轴位置
     setTrianglePos(x:number)
     {
        let pos:Vec3 = this.bg_triangle?.node.getPosition();
        // todo  
        let nodeSize = this.node.getComponent(UITransform)?.contentSize as math.Size;
        let winSize = this.window.getComponent(UITransform)?.contentSize as math.Size;
        if(x > nodeSize.width/2 - winSize.width/2){
            pos.x = -160;   //箭头位于左边
        }else if(pos.x < -(nodeSize.width/2 - winSize.width/2)){
            pos.x = 160;    //箭头位于右边
        }

        this.bg_triangle?.node.setPosition(pos) ;
     }

    setSkillData(skillId:number)
    {        
        this._recordSkill = ValueMgr.getInstance().getItemByField(TableName.skill,skillId) as Config.skill.Record;
        this._skillLv= this._recordSkill.level;

        // 技能名称
        let name= this._recordSkill.name;       
        
        let record_language_data = ValueMgr.getInstance().getItemByField(TableName.language_data,name) as Config.language_data.Record;
        this.lab_name.string = record_language_data.cn;
        // 技能类型 todo
        this.lab_type.string = "主动技能";
        //this.lab_type.string = "被动技能";

        // 技能图标
        let framePath:string = "ui/skill_icon/" + this._recordSkill.image + "/spriteFrame"
        this._resourceLoad(framePath,this.skill_icon);


        let skillId0= skillId;  //等级0的技能id    
        this.lab_txt_0.color = Color.BLACK;  
        this.lab_txt_1.color = Color.GRAY;  
        this.lab_txt_2.color = Color.GRAY;  
        if(this._skillLv ==2)
        {
            skillId0= skillId-1;
            this.lab_txt_1.color = Color.GREEN;
            this.lab_txt_2.color = Color.GRAY;
        }
        else if(this._skillLv ==3)
        {
            skillId0= skillId-2;
            this.lab_txt_1.color = Color.BLACK;
            this.lab_txt_2.color = Color.GREEN;
        }

        if(skillId0>0)
        {               
            //技能等级1
            let recordSkillId0 = ValueMgr.getInstance().getItemByField(TableName.skill,skillId0) as Config.skill.Record;
            this.setText(1, this.lab_txt_0, recordSkillId0);

            //技能等级2
            let recordSkillId1= ValueMgr.getInstance().getItemByField(TableName.skill, skillId0+1);
            if(recordSkillId1==undefined)
            {  
                this.lab_txt_1.string = "";  
                this.lab_txt_2.string = "";                        
            }
            else
            {                              
                let skillTmp = recordSkillId1 as Config.skill.Record;
                this.setText(2, this.lab_txt_1, skillTmp);
                
                //技能等级3
                let recordSkillId2= ValueMgr.getInstance().getItemByField(TableName.skill, skillId0+2);
                if(recordSkillId2==undefined)
                {  
                    this.lab_txt_2.string = "";                        
                }
                else
                { 
                    skillTmp = recordSkillId2 as Config.skill.Record;
                    this.setText(3, this.lab_txt_2, skillTmp);
                }
            }          
        }
  
    }
    
    //资源替换
    private _resourceLoad (path:string,obj:any)
    {
        resources.load(path, (err,spriteFrame:SpriteFrame) =>
        {
            console.log("tipSkill err=",err)
            if(!err)
            {
                let sprite = obj.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
    }
    
    setText(lv:number, lab_txt:Label, recordSkill:Config.skill.Record|null|undefined )
    {
        if(recordSkill == null || recordSkill ==undefined)
        {
            lab_txt.string ="";
            return ;
        }

        let skill= recordSkill as Config.skill.Record;
        let desc_id= skill.desc;
        // 获取技能描述
        let record_language_data = ValueMgr.getInstance().getItemByField(TableName.language_data,desc_id) as Config.language_data.Record;
        let strTmp= "Lv"+ lv.toString() + ":"+ record_language_data.cn;
        let values =  [0,0,0]; //todo
        lab_txt.string = this.formatSkillDesc(strTmp, values);
    }

    //todo 格式化填充技能描述
    formatSkillDesc(desc: string, values: number[]){     
        //替换填充数值 
        //<tn>--目标数
        //<ep1>--效果1
        //<ex1>--效果1 
        //<bt1>,<bt2>,<bt3>--持续多少秒
        //<ec1>--效果1

        return desc;
    }
}
