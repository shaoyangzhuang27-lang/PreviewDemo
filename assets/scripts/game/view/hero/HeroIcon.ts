/**
 * 游戏组件:英雄头像
 * @author 黄志清
 * @version 1.0.0,2021.3.13
 */

import { _decorator, Component, Node, Sprite, Label, Button,SpriteFrame, resources, math, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { XConsts } from "../../model/const/XConsts";
import { HeroData } from '../../model/datas/HeroData';
import {GameModel} from "../../model/GameModel";

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
    
    //英雄数据
    private _heroData : HeroData | null = null as unknown as HeroData;

    //
    private _wonderHeartHeroId : number = 0;

    start () {
        // [3]
        // this.btn_frame.on(Node.EventType.TOUCH_END, this.openHeroInfoView, this);        
    }
    
    private init()
    {
        if(!this._heroData)
        {
            return;
        }
        
        let level : number = Number(this._heroData?.getLevel());

        let campName:string = XConsts.KHeroCampIcon[this._heroData?.getCamp() as number];
        let iconName:string = this._heroData?.getImageIcon() as string;
        let starNum:number = this._heroData?.getStar() as number;

        if(!this._heroData.isRoleHero())
        {
            this.img_camp.active = true;
            let campIconPath:string = "ui/common/team/" + campName + "/spriteFrame";
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
        
        let heroIconPath:string = "ui/common/hero/" + iconName + "/spriteFrame";
        this._resourceLoad(heroIconPath,this.img_icon);
        
        this.lab_level.string = level.toString();

        this._setStar(starNum,this._heroData.getStaticID());
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

    private _setStar(star:number,firstid:number = 0)
    {
        let grade:number = Math.floor(star/5);
        let yu:number = (star - 1) % 5 + 1;

        let starName = ["初级星星","中级星星","高级星星"];
        let starPath = "ui/common/icon/" + starName + "/spriteFrame";

        for (let index = 0; index < this.starlist.length; index++) {
            if(index >= yu && yu != 0)
            {
                this.starlist[index].active = false;
            }
            else{
                this.starlist[index].active = true;
            }
        }
        
        firstid = firstid || Number(this._heroData?.getStaticID());
        let id1st = HeroData.getInitialStarByID(firstid);
        let frameName:string = XConsts.GetQualityBgByStar(id1st);
        if(firstid == 5 || this._heroData?.isRoleHero())    //传奇英雄、主角才需要更换外框
        {
            frameName = XConsts.GetQualityBgByStar(star);            
        }
        let framePath:string = "ui/common/icon/" + frameName + "/spriteFrame"
        this._resourceLoad(framePath,this.btn_frame);
        }

    private _initHeroIcon(heroinfo:Config.heroes.Record,lv:number)
    {
        let campName:string = XConsts.KHeroCampIcon[heroinfo.camp as number];
        let iconName:string = heroinfo.image as string;
        let starNum:number = heroinfo.star as number;

        this.img_camp.active = true;
        let campIconPath:string = "ui/common/team/" + campName + "/spriteFrame";
        this._resourceLoad(campIconPath,this.img_camp);
        
        let heroIconPath:string = "ui/common/hero/" + iconName + "/spriteFrame";
        this._resourceLoad(heroIconPath,this.img_icon);
        
        this.lab_level.string = lv.toString();
        if(lv == 0)
        {
            this.lab_level.node.active = false
        }

        this._setStar(starNum,heroinfo.id);
    }

    /**
     * 切换当前英雄为加一星状态,升星塔使用
     * 调用此方法前请先设置英雄数据
     */
    public addOneStar()
    {
        if(this._heroData)
        {
            let addStar = this._heroData.getStar()+1;
            this._setStar(addStar,this._heroData.getStaticID());
    }
    }

    /**
     * 设置为某英雄
     * @param heroData 英雄数据
     */
    public setHeroData(heroData : HeroData)
    {
        this._heroData = heroData;
        
        this.init();
    }
    /**
     * 设置为蒙版英雄[升星塔使用]
     * @param campType  阵营类型
     * @param star      英雄星级
     */
    public setMaskHeroData(campType:number,star:number, id:number)
    {
        this.lab_level.node.active = false;
        let campName:string = XConsts.KHeroCampIcon[campType];
        let campIconPath:string = "ui/common/team/" + campName + "/spriteFrame"
        this._resourceLoad(campIconPath,this.img_camp)
        this._setStar(star)
    }
    /**
     * 设置点击头像回调
     * @param callBack 回调函数
     */
    public setBtnCallBack(callBack:Function|null = null)
    {
        if(callBack)
        {
            this.btn_frame.addComponent(Button);
            this.btn_frame.on(Node.EventType.TOUCH_END, ()=>{            
                callBack(this._heroData)                
            }, this);
        }
    }


    /**
     * 设置英雄icon
     * @param id 英雄id
     * @param nType 显示类型
     */
    public initUIHeroIconInfo(id : number,nType : number)
    {
        this._wonderHeartHeroId = id;
        let info = GameModel.getInstance().getHeroesModel().getHeroIconInfoByHeroId(id);
        this.img_camp.active = true;
        let campIconPath:string = "ui/common/team/" + info.camp + "/spriteFrame";
        resources.load(campIconPath, (err,spriteFrame:SpriteFrame) =>
        {
            if(!err)
            {
                let sprite = this.img_camp.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });

        // let framePath:string = "ui/common/icon/" + info.frame + "/spriteFrame"
        // this._resourceLoad(framePath,this.btn_frame);

        let heroIconPath:string = "ui/common/hero/" + info.icon + "/spriteFrame";
        this._resourceLoad(heroIconPath,this.img_icon);

        // this.lab_level.node.active = false;

        this._setStar(info.star,id);

        switch (nType) 
        {
            case XConsts.HERO_ICON_TYPE.RecLineUp :
                this.lab_level.node.active = false;
                break;
            case XConsts.HERO_ICON_TYPE.SummonSettle:
                this.lab_level.string = "1"
                break;
            case XConsts.HERO_ICON_TYPE.WonderSummon :
                this.lab_level.node.active = false;
                break;   
        }
    }

    /**
     * 隐藏等级
     * @param isShow 是否隐藏
    */
    public setLvIconVisib(isShow:boolean = false)
    {
        this.lab_level.node.active = isShow
    }

    /**
     * 根据影响信息创建英雄头像
     * @param heroinfo 英雄信息
     */
    public setHeroInfo(heroinfo:Config.heroes.Record,level:number)
    {
        if(!heroinfo)
        {
            console.log("英雄信息错误");
            return;
        }
        this._initHeroIcon(heroinfo,level);
    }

    public getWonderHeartHeroId()
    {
        return this._wonderHeartHeroId || 0;
    }
}
