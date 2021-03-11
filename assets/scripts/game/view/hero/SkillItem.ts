//单个技能框UI单元
import { _decorator, Component, Node, Sprite, Label, Button,SpriteFrame, resources, math, UITransform, Material, Vec3, EventTouch, systemEvent, SystemEvent } from 'cc';
import { PopMgr } from '../../control/PopMgr';
const { ccclass, property } = _decorator;
import { TableName, ValueMgr } from "../../model/ValueMgr";

@ccclass('SkillItem')
export class SkillItem extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    
    @property({type :  Sprite, displayName: "技能背景框"})
    public btn_bg:Sprite = null as unknown as Sprite;

    @property({type :  Node, displayName: "技能图标"})
    public img_icon:Node = null as unknown as Node;

    @property({type :  Label, displayName: "技能等级"})
    public lab_level:Label = null as unknown as Label;
    
    @property({type :  Node, displayName: "技能等级背景"})
    public sp_lv:Node = null as unknown as Node;

    private _isGrayStatus: boolean = false; // 技能图标灰化标识
    private _skillId:number =0 ; //技能id
    private _skillLv:number =0 ; //当前技能等级
    private _recordSkill : Config.skill.Record = null as unknown as Config.skill.Record;    //记录的技能


    start () {
        // [3]
        if(this._skillId ==0) //todo debug
        {
            this._skillId= 535002;//破甲弹2级
        }
        this.setDefaultBtnCallBack();
    }

    private init()
    {
        // 技能图标
        let iconPath:string = "ui/skill_icon/" + this._recordSkill.image + "/spriteFrame"        
        if(this._recordSkill.image == "无")
        {
            iconPath = "ui/skill_icon/英雄详情_无";
        }        
        this._resourceLoad(iconPath, this.img_icon);
        
        this._setLv(this._skillLv);
    }

    //资源替换
    private _resourceLoad (path:string,obj:any)
    {
        resources.load(path, (err,spriteFrame:SpriteFrame) =>
        {
            console.log("skillItem icon---------",err)
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
            this.sp_lv.active= false;
            this.lab_level.string = "";
            //灰化处理
            this._doGrayNode();
        }
        else 
        {
            this.sp_lv.active= true; 
            this.lab_level.string =  (lv==1) ? "": lv.toString();
            //还原灰化处理
            this._doUnGrayNode();
        }
    }

    //todo
    private _doGrayNode()
    {
        this._isGrayStatus= false;
        //Material
        //内建材质
        //let material:Material = Material.getBuiltinMaterial('2d-gray-sprite')
       // this.head.setMaterial(0, material);
       //let sprite = this.img_icon.getComponent(Sprite) as Sprite;
        //   sprite.setMaterial(Material.get);
    }
    //todo
    private _doUnGrayNode()
    {
        this._isGrayStatus= true;
        //todo
    }
    ////////////////////////////////
    //传入技能id  初始化对象
    public setSkillData(_skillId : number)
    {
        if(_skillId==0)
        {
            _skillId=512011;// todo debug 圣盾护体
        }
        this._recordSkill = ValueMgr.getInstance().getItemByField(TableName.skill, _skillId) as Config.skill.Record;
        this._skillLv = this._recordSkill.level;
        this._skillId = _skillId;

        // this._callBack = _callBack;
        this.init();
        this.setDefaultBtnCallBack();
    }

    public setDefaultBtnCallBack()
    {
        // todo 默认点击显示技能Tip
        // let tipPos0 = this.btn_bg.node.getPosition();        
        // console.log("tipPos0=====>");
        // console.log(tipPos0);
        // let tipPos = this.btn_bg.node.getWorldPosition(); 
        // console.log("tipPos=====>");
        // console.log(tipPos);
        
        this.btn_bg.addComponent(Button);        
        this.btn_bg.node.on(Node.EventType.TOUCH_END, (event:EventTouch)=>{               
            let pos = new Vec3(event.getLocation().x, event.getLocation().y,0);  
            if(event.target == this.btn_bg.node)
            {   
                console.log("event.target == this.btn_bg");             
                pos= this.btn_bg.node.getWorldPosition();
                console.log(pos);
                //let _node = this.node.getComponent(UITransform) as UITransform;
                // let k = this.btn_bg.node.getComponent(UITransform) as UITransform;
                // pos.y += k.contentSize.height/2;
            }
            
            PopMgr.getInstance().tipSkillWindow(pos, this._skillId);
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
