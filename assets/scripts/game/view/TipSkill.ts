import { _decorator, Component, Node, Sprite, math, Label, Vec3 } from 'cc';
import { DataMgr } from '../model/DataMgr';
import { HeroData } from '../model/datas/HeroData';
import { GameModel } from '../model/GameModel';
import { TipBase } from './TipBase';
const { ccclass, property } = _decorator;

@ccclass('TipSkill')
export class TipSkill extends TipBase {
    // [1]
    // dummy = '';
    _heroId:number =0 ; //英雄id
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
    @property({type: Sprite})
    public bg_triangle:Sprite = null as unknown as Sprite;
    
    start () {
        super.start();
    }

    setSkillData(skillId:number, skillLv:number, heroId:number)
    {
        //骑士
        if(heroId==0)
        {            
            let playerInfo = DataMgr.getInstance().getPlayerInfo();            
            //todo
        }
        else
        {
            let herodata = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(heroid) as HeroData;     
        }        
    }

    setTxts()
    {
        this.lab_txt_0.string = "";
        this.lab_txt_1.string = "";
        this.lab_txt_2.string = "";
    }

    //设置三角形标x轴位置
    setTrianglePos(x:number)
    {
        let pos:Vec3= new Vec3(0,0,0);
        // this.bg_triangle.point(pos);
    }
}
