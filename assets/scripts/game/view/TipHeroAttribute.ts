import { _decorator, Component, Node, Sprite, math, Label } from 'cc';
import { DataMgr } from '../model/DataMgr';
import { HeroData } from '../model/datas/HeroData';
import { GameModel } from '../model/GameModel';
import { TipBase } from './TipBase';
const { ccclass, property } = _decorator;

@ccclass('TipHeroAttribute')
export class TipHeroAttribute extends TipBase {
    // [1]
    // dummy = '';
    _heroId:number =0 ; //英雄id
    //血量
    @property({type: Label})
    public lab_HP:Label = null as unknown as Label;
    //攻击
    @property({type: Label})
    public lab_Attack:Label = null as unknown as Label;
    //防御
    @property({type: Label})
    public lab_Def:Label = null as unknown as Label;
    //速度 
    @property({type: Label})
    public lab_Speed:Label = null as unknown as Label;
    //暴击
    @property({type: Label})
    public lab_Crit:Label = null as unknown as Label;
    //暴击伤害
    @property({type: Label})
    public lab_CritDamage:Label = null as unknown as Label;
    //命中
    @property({type: Label})
    public lab_Hit:Label = null as unknown as Label;
    //闪避
    @property({type: Label})
    public lab_Dodge:Label = null as unknown as Label;
    //破甲
    @property({type: Label})
    public lab_DEFBreak:Label = null as unknown as Label;

    //血量值
    @property({type: Label})
    public lab_HP_value:Label = null as unknown as Label;
    //攻击值
    @property({type: Label})
    public lab_Attack_value:Label = null as unknown as Label;
    //防御值
    @property({type: Label})
    public lab_Def_value:Label = null as unknown as Label;
    //速度值
    @property({type: Label})
    public lab_Speed_value:Label = null as unknown as Label;
    //暴击值
    @property({type: Label})
    public lab_Crit_value:Label = null as unknown as Label;
    //暴击伤害值
    @property({type: Label})
    public lab_CritDamage_value:Label = null as unknown as Label;
    //命中值
    @property({type: Label})
    public lab_Hit_value:Label = null as unknown as Label;
    //闪避值
    @property({type: Label})
    public lab_Dodge_value:Label = null as unknown as Label;
    //破甲值
    @property({type: Label})
    public lab_DEFBreak_value:Label = null as unknown as Label;

    start () {
        super.start();
    }

    setHeroId(heroid:number= 0)
    {
        let listNames: string[]=["血量", "攻击", "防御", "速度", "暴击", "暴击伤害", "命中", "闪避", "破甲"];
        let listValues: number[]=[];
        //骑士
        if(heroid==0)
        {            
            let playerInfo = DataMgr.getInstance().getPlayerInfo();            
            //todo
            // listValues[0] = herodata.getMaxHP();
            // listValues[1] = herodata.getATK();
            // listValues[2] = herodata.getDEF();
            // listValues[3] = herodata.getSpeed();
            // listValues[4] = herodata.getCrit();
            // listValues[5] = herodata.getCritDamage();
            // listValues[6] = herodata.getHit();
            // listValues[7] = herodata.getDodge();
            // listValues[8] = herodata.getDEFBreak();
        }
        else
        {
            let herodata = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(heroid) as HeroData;        
            listValues[0] = herodata.getMaxHP();
            listValues[1] = herodata.getATK();
            listValues[2] = herodata.getDEF();
            listValues[3] = herodata.getSpeed();
            listValues[4] = herodata.getCrit();
            listValues[5] = herodata.getCritDamage();
            listValues[6] = herodata.getHit();
            listValues[7] = herodata.getDodge();
            listValues[8] = herodata.getDEFBreak();
        }
        
        this.setContents(listNames, listValues);
    }


    setContents(names:string[], values: number[])
    {
        if(values.length <9 || names.length<9)
        {
            return ;
        }

        this.lab_HP.string         = names[0];
        this.lab_Attack.string     = names[1];
        this.lab_Def.string        = names[2];
        this.lab_Speed.string      = names[3];
        this.lab_Crit.string       = names[4];
        this.lab_CritDamage.string = names[5];
        this.lab_Hit.string        = names[6];
        this.lab_Dodge.string      = names[7];
        this.lab_DEFBreak.string   = names[8];

        this.lab_HP_value.string         = values[0].toString();
        this.lab_Attack_value.string     = values[1].toString();
        this.lab_Def_value.string        = values[2].toString();
        this.lab_Speed_value.string      = values[3].toString()+"秒";
        this.lab_Crit_value.string       = values[4].toString()+"%";
        this.lab_CritDamage_value.string = values[5].toString()+"%";
        this.lab_Hit_value.string        = values[6].toString()+"%";
        this.lab_Dodge_value.string      = values[7].toString()+"%";
        this.lab_DEFBreak_value.string   = values[8].toString()+"%";
    }
}
