/**
 * 游戏组件:英雄图鉴
 * @author 黄志清
 * @version 1.0.0,2021.3.17
 */
import { _decorator, Component, Node, Label, resources, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { XMsgExt } from '../../model/const/XMsgExt'
import { XConsts } from '../../model/const/XConsts';
import { GameModel } from '../../model/GameModel';

@ccclass('HeroBookCell')
export class HeroBookCell extends Component {
    @property({type :  Node})
    public img_bg:Node = null as unknown as Node;

    @property({type :  Node})
    public img_mask:Node = null as unknown as Node;

    @property({type :  Node})
    public img_icon:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_frame:Node = null as unknown as Node;
    
    @property({type :  Node})
    public img_career:Node = null as unknown as Node;

    @property({type :  Node})
    public img_active:Node = null as unknown as Node;

    @property({type :  Node})
    public img_lvUp:Node = null as unknown as Node;

    @property({type :  Node})
    public img_bookicon:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_heroName:Label = null as unknown as Label;

    @property({type :  Node})
    public lab_active:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_lv:Label = null as unknown as Label;


    private _itemType:number = -1;  //预制体显示类型  //0:激活,1:常态，2，升级
    private _record :any = null as unknown as Config.heroes.Record ;
    private _heroStaticId :number = 0;
    private _callBack:Function | null = null;
    private _heroUb:Msg.HeroBookUnit = null as unknown as Msg.HeroBookUnit;
    start () {
        this.btn_frame.on(Node.EventType.TOUCH_END, this._onClickItemCallback, this); 
    }

    /**
     * 设置图鉴英雄信息
     * @param showType 
     * @param heroStaticId 
     * @param callback 
     */
    public setHeroBookData(showType:number,heroStaticId:number,callback:Function|null = null)
    {
        this._itemType = showType;
        this._heroStaticId = heroStaticId;
        this._record = ValueMgr.getInstance().getItemByField(TableName.heroes,heroStaticId) as Config.heroes.Record;
        this._heroUb = GameModel.getInstance().getHeroesModel().getBookHeroDataByStaticID(this._heroStaticId);
        this._callBack = callback;
        this._initUIIcon()
    }

    private _initUIIcon()
    {
        let careerName:any = XConsts.KClassesSpriteName[this._record.classes]
        let modelName:string = this._record.image
        let languageData:Config.language_data.Record = ValueMgr.getInstance().getItemByField(TableName.language_data,this._record.name) as Config.language_data.Record
        let heroName:string = languageData.cn;
        let heroCampBgName:string = XConsts.KItemHeroBookBGSpriteName[this._record.camp];

        let careerPath:string = "ui/book/" + careerName + "/spriteFrame"
        let modelPath:string = "ui/hero/" + modelName+"_image" + "/spriteFrame"
        let campBgPath:string = "ui/book/" + heroCampBgName + "/spriteFrame"
        this._resourceLoad(careerPath,this.img_career);
        this._resourceLoad(modelPath,this.img_icon);
        this._resourceLoad(campBgPath,this.img_bg)

        this.lab_heroName.string = heroName.toString();
        this.lab_lv.string = "Lv." + this._heroUb.level.toString();

        let labActice:Label = this.lab_active.getComponent(Label) as Label;
        if(this._itemType == 0)
        {            
            labActice.string = "未激活";
            this.img_mask.active = true;
            this.lab_active.active = true;

            this.img_lvUp.active = false;
            this.img_bookicon.active = false;
            this.img_active.active = false;
        }
        else if(this._itemType == 1)
        {            
            labActice.string = "激活"
            this.lab_active.active = true;
            this.img_active.active = true;

            this.img_mask.active = false;           
            this.img_lvUp.active = false;
            this.img_bookicon.active = false;   

            labActice.color = XConsts.KColorGray;
            // labActice.color = "淡蓝色"
        }
        else if(this._itemType == 2)
        {            
            labActice.string = "升级";
            this.lab_active.active = true;
            this.img_lvUp.active = true;

            this.img_mask.active = false;            
            this.img_bookicon.active = false;
            this.img_active.active = false;
            labActice.color = XConsts.KColorGreen;
        }
        else 
        {
            this.img_bookicon.active = true;
            this.img_active.active = false;
            this.lab_active.active = false;
            this.img_mask.active = false;
            this.img_lvUp.active = false;
        }
    }

    private _onClickItemCallback()
    {
        if(this._callBack)
        {
            this._callBack(this._itemType,this._heroStaticId);
        }
    }

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
