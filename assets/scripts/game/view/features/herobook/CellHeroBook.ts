/**
 * 游戏组件:英雄图鉴
 * @author 黄志清
 * @version 1.0.0,2021.3.17
 */
import { _decorator, Component, Node, Label, resources, SpriteFrame, Sprite } from 'cc';
import { XConsts } from '../../../model/const/XConsts';
import { GameModel } from '../../../model/GameModel';
import { TableName, ValueMgr } from '../../../model/ValueMgr';
const { ccclass, property } = _decorator;

@ccclass('CellHeroBook')
export class CellHeroBook extends Component {
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
     * @param showType 界面显示状态
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

    /**
     * 重设界面显示状态
     * @param showType 界面显示状态
     */
    public resetBookView(showType:number)
    {
        this._itemType = showType;
        this._heroUb = GameModel.getInstance().getHeroesModel().getBookHeroDataByStaticID(this._heroStaticId);
        this._initNodeActive();
    }

    private _initUIIcon()
    {
        let careerName:any = XConsts.KClassesSpriteName[this._record.classes]
        let modelName:string = this._record.image
        let languageData:Config.language_data.Record = ValueMgr.getInstance().getItemByField(TableName.language_data,this._record.name) as Config.language_data.Record
        let heroName:string = languageData.cn;
        let heroCampBgName:string = XConsts.KItemHeroBookBGSpriteName[this._record.camp];

        let careerPath:string = "ui/book/" + careerName + "/spriteFrame"
        let modelPath:string = "ui/comm/hero_big/" + modelName+"_image" + "/spriteFrame"
        let campBgPath:string = "ui/book/" + heroCampBgName + "/spriteFrame"
        this._resourceLoad(careerPath,this.img_career);
        this._resourceLoad(modelPath,this.img_icon);
        this._resourceLoad(campBgPath,this.img_bg)

        this.lab_heroName.string = heroName.toString();

        this._initNodeActive()
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

    private _initNodeActive()
    {
        let labActice:Label = this.lab_active.getComponent(Label) as Label;
        if(this._itemType == XConsts.HeroBookState.Null)
        {            
            labActice.string = "未激活";
            this.img_mask.active = true;
            this.lab_active.active = true;

            this.img_lvUp.active = false;
            this.img_bookicon.active = false;
            this.img_active.active = false;
        }
        else if(this._itemType == XConsts.HeroBookState.CanActive)
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
        else if(this._itemType == XConsts.HeroBookState.CanUpGrade)
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

        this.lab_lv.string = "Lv." + this._heroUb.level.toString();
    }



}
