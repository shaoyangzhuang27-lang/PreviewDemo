import { _decorator, Node, Label, Vec3 } from 'cc';
import { TipBase } from './TipBase';
const { ccclass, property } = _decorator;

@ccclass('TipSkill')
export class TipSkill extends TipBase {
    // [1]
    // dummy = '';

    _skillId:number =0 ; //技能id
    _skillLv:number =0 ; //当前技能等级
    
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
    @property({type: Node})
    public bg_triangle:Node = null as unknown as Node;
    
    start () {
        super.start();
    }

    public setWinPos(pos:Vec3,align:number = 0,isViewPos:boolean = true){
        super.setWinPos(pos, align, isViewPos);
        // console.log("child-重写父类的方法，添加新的东西！");
        this.setTrianglePos(pos.x);
      }

    setSkillData(skillId:number, skillLv:number)
    {
        //todo 
        if(skillLv ==1)
        {            
            this.lab_txt_0.string = "xxxxxxxx";
            this.lab_txt_1.string = "";
            this.lab_txt_2.string = "";            
        }
        else if(skillLv ==2)
        {            
            this.lab_txt_0.string = "xxxxxxxx";
            this.lab_txt_1.string = "xxxxxxxx";
            this.lab_txt_2.string = "";            
        }
        else if(skillLv ==3)
        {            
            this.lab_txt_0.string = "xxxxxxxx";
            this.lab_txt_1.string = "xxxxxxxx";
            this.lab_txt_2.string = "xxxxxxxx";                           
        }
        else
        {
            //
            // this.lab_txt_0.string = "";
            // this.lab_txt_1.string = "";
            // this.lab_txt_2.string = "";
        }
    }

     //设置三角形标x轴位置
    setTrianglePos(x:number)
    {
        let pos:Vec3 = this.bg_triangle.getPosition();
        if(x < 0){
            pos.x = -160;   //箭头位于左边
        }else{
            pos.x = 160;    //箭头位于右边
        }       
        this.bg_triangle.setPosition(pos) ;
    }
}
