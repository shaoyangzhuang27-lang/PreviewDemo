//单个英雄头像
import { _decorator, Component, Node, Sprite, Label, Button,SpriteFrame, resources, math, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { XConsts } from "../../model/const/XConsts";
import { HeroData } from '../../model/datas/HeroData';

@ccclass('HeroIcon')
export class HeroIcon extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    
    @property({type :  Node})
    public img_bg:Node = null as unknown as Node;

    @property({type :  Node})
    public img_icon:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_frame:Node = null as unknown as Node;

    @property({type :  Node})
    public img_camp:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_level:Label = null as unknown as Label;

    @property({type :  Node})
    public starlist:Node[] = [];
    

    private _heroInfo : HeroData | null = null as unknown as HeroData;
    private _starNameList:string[] = new Array<string>();
    start () {
        this._starNameList = ["初级星星","中级星星","高级星星"]
        // [3]
        // this.btn_frame.on(Node.EventType.TOUCH_END, this.openHeroInfoView, this);        
    }
    
    private init()
    {
        if(!this._heroInfo)
        {
            return;
        }

        let campName:string = XConsts.KHeroCampIcon[this._heroInfo?.getCamp() as number];        
        let level : number = Number(this._heroInfo?.getLevel());
        let iconName:string = this._heroInfo?.getImageIcon() as string;
        let starNum:number = this._heroInfo?.getStar() as number;

        if(!this._heroInfo.isRoleHero())
        {
            this.img_camp.active = true;
            let campIconPath:string = "ui/team/" + campName + "/spriteFrame"
            resources.load(campIconPath, (err,spriteFrame:SpriteFrame) =>
            {
                if(!err)
                {
                    let sprite = this.img_camp.getComponent(Sprite) as Sprite;
                    sprite.spriteFrame = spriteFrame;
                }
            });            
        }
        else
        {
            this.img_camp.active = false;
        }

        let heroIconPath:string = "ui/hero/" + iconName + "/spriteFrame"
        this._resourceLoad(heroIconPath,this.img_icon);
        
        this.lab_level.string = level.toString();

        this._setStar(starNum);
    }

    //开启英雄面板
    // openHeroInfoView()
    // {
    //     if(this._callBack)
    //     {
    //         this._callBack(this._heroInfo);
    //     }
    // }

    //资源替换
    private _resourceLoad (path:string,obj:any)
    {
        resources.load(path, (err,spriteFrame:SpriteFrame) =>
        {
            console.log("errerrerrerrerrerrerr",err)
            if(!err)
            {
                let sprite = obj.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });
    }

    private _setStar(star:number)
    {
        let grade:number = Math.floor(star/5);
        let yu:number = (star - 1) % 5 + 1;

        let starName = this._starNameList[grade];
        let starPath = "ui/icon/" + starName + "/spriteFrame"

        for (let index = 0; index < this.starlist.length; index++) {
            if(index >= yu && yu != 0)
            {
                this.starlist[index].active = false;
            }
            else{
                this.starlist[index].active = true;
            }
        }

        let frameName:string = XConsts.GetQualityBgByStar(Number(star));
        let framePath:string = "ui/icon/" + frameName + "/spriteFrame"
        this._resourceLoad(framePath,this.btn_frame);
    }

    //增加一颗星  升星塔使用
    public addOneStar()
    {
        if(this._heroInfo)
        {
            let addStar = this._heroInfo.getStar()+1
            this._setStar(addStar);
        }
    }

    ////////////////////////////////
    //传入英雄id  初始化对象
    public setHeroData(heroData : HeroData)
    {
        this._heroInfo = heroData;
    
        this.init();
    }

    public setBtnCallBack(callBack:Function|null = null)
    {
        if(callBack)
        {
            this.btn_frame.addComponent(Button);
            this.btn_frame.on(Node.EventType.TOUCH_END, ()=>{            
                callBack(this._heroInfo)                
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
