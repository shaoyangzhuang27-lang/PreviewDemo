//单个技能框UI

import { _decorator, Component, Node, Sprite, Label, Button,SpriteFrame, resources, math, UITransform, Material } from 'cc';
const { ccclass, property } = _decorator;
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { XConsts } from "../../model/const/XConsts";
import { HeroData } from '../../model/datas/HeroData';

@ccclass('SkillIcon')
export class SkillIcon extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    
    @property({type :  Node})
    public btn_bg:Node = null as unknown as Node;

    @property({type :  Node})
    public img_icon:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_level:Label = null as unknown as Label;
    
    @property({type :  Node})
    public node_lv:Node = null as unknown as Node;

    private _isGrayStatus: boolean = false;
    private _skillId: number = 0;
    private _skillLv: number = 0;
    private _skillData : any | null = null ;//as unknown as SkillData;
    private _heroInfo : HeroData | null = null as unknown as HeroData;
    private _heroLT : any | null = null as unknown as HeroData;

    private _callBack:Function|null = null as unknown as Function;  //回调方法


    start () {
        // [3]
        // this.btn_frame.on(Node.EventType.TOUCH_END, this.openHeroInfoView, this);        
    }
    
    private init()
    {
        if(!this._skillData)
        {
            return;
        }

        let _level : number = Number(this._skillData?.getLevel());
        let _iconName:string = this._skillData?.getImageIcon() as string;

        let heroIconPath:string = "ui/skill/" + _iconName + "/spriteFrame";
        if(_iconName == "无")
        {
            heroIconPath = "ui/skill_icon/英雄详情_无";
        }        
        this._resourceLoad(heroIconPath,this.img_icon);
        
        this._setLv(_level);
    }

    //资源替换
    private _resourceLoad (path:string,obj:any)
    {
        resources.load(path, (err,spriteFrame:SpriteFrame) =>
        {
            console.log("skill icon---------",err)
            if(!err)
            {
                let sprite = obj.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
    }

    private _setLv(lv:number)
    {
        if(lv<=0)
        {
            this.node_lv.active= false;
            //灰化处理
            this._doGrayNode();
        }
        else if(lv<=0)
        {
            this.node_lv.active= false;
        }
        else if(lv>1)
        {            
            this.node_lv.active= true;
        }
        this._skillLv= lv;
        this.lab_level.string = lv.toString();
    }

    private _doGrayNode()
    {
        this._isGrayStatus= false;
        //todo
        Material
        //内建材质
        //let material:Material = Material.getHash //.getBuiltinMaterial('2d-gray-sprite')
       // this.head.setMaterial(0, material);
    }

    private _doUnGrayNode()
    {
        this._isGrayStatus= true;
        //todo
    }
    ////////////////////////////////
    //传入英雄id 技能id  初始化对象
    public setHeroIDAndSkillId(_heroData : HeroData, _skillId: number)
    {
        this._skillId = _skillId;
        this._heroInfo = _heroData;
        this._heroLT = ValueMgr.getInstance().getItemByField(TableName.heroes,this._heroInfo.getStaticID()) as Config.heroes.Record;
        
        // this._callBack = _callBack;
        this.init();
    }


    public setBtnCallBack(_callBack:Function|null = null)
    {
        if(_callBack)
        {
            this.btn_bg.addComponent(Button);
            this.btn_bg.on(Node.EventType.TOUCH_END, ()=>{            
                _callBack(this._skillId, this._skillLv)                
            }, this);
        }
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
