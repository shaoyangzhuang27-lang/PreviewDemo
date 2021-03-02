//单个英雄头像
import { _decorator, Component, Node, Sprite, Label, Button,SpriteFrame, resources } from 'cc';
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
    private _heroLT : any | null = null as unknown as HeroData;


    start () {
        // [3]
        this.btn_frame.on(Node.EventType.TOUCH_END, this.openHeroInfoView, this);        
    }

    //传入英雄id  初始化对象
    setHeroID(_heroData : HeroData)
    {
        this._heroInfo = _heroData;
        this._heroLT = ValueMgr.getInstance().getItemByField(TableName.heroes,this._heroInfo.getStaticID()) as Config.heroes.Record;
        // this.init();
    }

    init()
    {
        let _campName:string = XConsts.KCampSpriteName[this._heroInfo?.getCamp() as number];
        let _frameName:string = XConsts.GetQualityBgByStar(this._heroInfo?.getStar() as number);
        let _level : number = Number(this._heroInfo?.getLevel());
        let _iconName:string = this._heroInfo?.getImageIcon() as string;
        let _starNum:number = this._heroInfo?.getStar() as number;

        let campIconPath:string = "resources/ui/icon/" + _campName + ".png"
        this._resourceLoad(campIconPath,this.img_camp);
        
        let framePath:string = "resources/ui/icon/" + _frameName + ".png"
        this._resourceLoad(framePath,this.btn_frame);

        let heroIconPath:string = "resources/ui/hero/" + _iconName + ".png"
        this._resourceLoad(heroIconPath,this.img_icon);
        
        this.lab_level.string = _level.toString();

        this._setStar(_starNum);
    }

    //开启英雄面板
    openHeroInfoView()
    {
        
    }

    //资源替换
    _resourceLoad (path:string,obj:any)
    {
        resources.load(path,SpriteFrame,(err:any,spriteFrame:SpriteFrame) =>
        {
            let sprite = obj.getComponent(Sprite) as Sprite;
            sprite.spriteFrame = spriteFrame;
        });
    }

    _setStar(star:number)
    {
        if(star > 5 && star <= 10)
        {
            star -= 5;
            //初始化星星，使用中级星星  "resources/ui/icon/星星中级.png"
        }
        else if(star > 10)
        {
            star -= 10;
            //初始化星星，使用中级星星  "resources/ui/icon/星星高级.png"
        }
        else{
            //初始化星星，使用中级星星  "resources/ui/icon/星星初级.png"
        }

        for (let index = 0; index < this.starlist.length; index++) {
            if(index > star)
            {
                this.starlist[index].active = false;
            }
            else{
                this.starlist[index].active = true;
            }
            
        }
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
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
