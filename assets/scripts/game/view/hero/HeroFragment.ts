//英雄碎片
import { _decorator, Component, Node, Sprite, Label, Button,SpriteFrame, resources,ProgressBar,instantiate, CCInteger } from 'cc';
const { ccclass, property } = _decorator;
import { TableName, ValueMgr } from "../../model/ValueMgr";

@ccclass('HeroFragment')
export class HeroFragment extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    
    @property({type :  Node})
    public img_bg:Node = null as unknown as Node;

    @property({type :  Node})
    public btn_icon:Node = null as unknown as Node;

    @property({type :  Node})
    public img_frame:Node = null as unknown as Node;

    @property({type :  Node})
    public img_camp:Node = null as unknown as Node;

    @property({type :  Node})
    public img_debris:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_process_num:Label = null as unknown as Label;

    @property({type : ProgressBar})
    public probar_fragment:ProgressBar = null as unknown as ProgressBar;

    @property({type :  Node})
    public img_point:Node = null as unknown as Node;

    @property({type :  Node})
    public starlist:Node[] = [];


    private _fragmentInfo : XStruct.fragment_synthesis_info.IRecord = {
        frame :"",
        camp : "",
        star : 0,
        quality : "",
        img : "",
        type : 0,
        maxNum : 0,
        curNum : 0
    }  
    

    private _heroInfo : any | null = null;
    private _heroLT : any | null = null;


    start () {
        // [3]
        //英雄合成界面
        this.btn_icon.on(Node.EventType.TOUCH_END, this.onClickIcon, this);        
        // this.img_camp.active = false;

    }

    //传入英雄id  初始化对象
    setHeroID(_heroData : Msg.HeroInfo)
    {
        this._heroInfo = _heroData;
        this._heroLT = ValueMgr.getInstance().getItemByField(TableName.heroes,this._heroInfo.id) as Config.heroes.Record;
        this.init();
    }

    //初始化碎片信息，碎片阵营、背景、头像、数量、品质
    //表名不详
    init()
    {
        // let _campName:string = XConsts.KCampSpriteName[this._heroLT.camp];
        // let _frameName:string = XConsts.GetQualityBgByStar(this._heroLT.star);
        // // let _level : string = this._heroInfo.level;
        // let _iconName:string = this._heroLT.image;
        // let _starNum:number = this._heroLT.star;

        // let campIconPath:string = "resources/ui/icon/" + _campName + ".png"
        // this._resourceLoad(campIconPath,this.img_camp);
        
        // let framePath:string = "resources/ui/icon/" + _frameName + ".png"
        // this._resourceLoad(framePath,this.btn_frame);

        // let heroIconPath:string = "resources/ui/hero/" + _iconName + ".png"
        // this._resourceLoad(heroIconPath,this.btn_icon);
        
        // this.lab_num.string = "10/50";

        // this._setStar(_starNum);
    }

    //碎片合成弹窗
    onClickIcon()
    {
        
    }

    //资源替换
    _resourceLoad (path:string | null | undefined,obj:any)
    {

        path && resources.load(path,SpriteFrame,(err:any,spriteFrame:SpriteFrame) =>
        {
            let sprite = obj.getComponent(Sprite) as Sprite;
            sprite.spriteFrame = spriteFrame;
        });
    }

    _setStar(star:number)
    {
        for (let index = 0; index < this.starlist.length; index++) {
            if(index > star-1)
            {
                this.starlist[index].active = false;
            }
            else{
                this.starlist[index].active = true;
                if(star % 2 == 0)
                {
                   var pos =  this.starlist[index].getPosition();
                   this.starlist[index].setPosition(pos.x + 7,pos.y);
                }
            } 
        }
    }


    public set FragmentInfo(info : XStruct.fragment_synthesis_info.IRecord)
    {
        this._fragmentInfo = instantiate(info);
        
        Object.keys(this._fragmentInfo).forEach((val, idx, array) => {
            // val: 当前值
            // idx：当前index
            // array: Array
            val == "img" && this._fragmentInfo[val] && this._resourceLoad(this._fragmentInfo[val],this.btn_icon);
            val == "frame" && this._fragmentInfo[val] && this._resourceLoad(this._fragmentInfo[val],this.img_frame);
            val == "camp" && this._fragmentInfo[val] && this._resourceLoad(this._fragmentInfo[val],this.img_camp);
            val == "quality" && this._fragmentInfo[val] && this._resourceLoad(this._fragmentInfo[val],this.img_debris);
        });

        if(info.maxNum && info.curNum )
        {
            let nPreocess = info.curNum / info.maxNum ;
            if(nPreocess > 1)
            {
                nPreocess = 1;
            }

            let bar = this.probar_fragment.node.getChildByName("bar");
            let path = nPreocess !=1 ? "ui/icon/" + "碎片未满进度条" + "/spriteFrame" : "ui/icon/" + "碎片已满进度条" + "/spriteFrame";
            this._resourceLoad(path,bar);
           
            var barCompoent =  this.probar_fragment?.getComponent(ProgressBar);
            if(barCompoent)
            {
                barCompoent.progress = nPreocess ;
            }

            var str = String(info.curNum) + "/" + String(info.maxNum);
            this.lab_process_num.string = str;

            nPreocess != 1 ? this.img_point.active = false : this.img_point.active = true;

            this._setStar(info.star ? info.star : 0);

        }

    }

    // set FragmentInfo(info : XStruct.fragment_synthesis_info.IRecord)
    // {

    // }
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
