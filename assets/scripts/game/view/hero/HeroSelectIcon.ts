
import { _decorator, Component, Node, resources, SpriteFrame,Sprite,instantiate,Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { HeroIcon } from '../hero/HeroIcon';
import { HeroData } from '../../model/datas/HeroData';

@ccclass('HeroSelectIcon')
export class HeroSelectIcon extends Component {
    @property({type :  Node})
    public btnFrame:Node = null as unknown as Node;

    @property({type :  Node})
    public choiceBg:Node = null as unknown as Node;


    private _choiceCallBack:Function | null = null as unknown as Function;
    private _heroInfo:HeroData | null = null as unknown as HeroData;

    private _clickType:number = 0;
    start () {
        this.btnFrame.on(Node.EventType.TOUCH_END, this.btnChoiceCallBack, this);
        // this.choiceBg.active = true;
    }

    private btnChoiceCallBack()
    {
        if(this._choiceCallBack)
        {
            this._choiceCallBack(this._heroInfo, this._clickType);
        }
    }

    private initHeroIcon()
    {
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{                  
            let _heroIcon = instantiate(res) as Node;
            _heroIcon.scale = new Vec3(0.6,0.6,1);
            this.btnFrame.addChild(_heroIcon);
            _heroIcon.position = this.btnFrame.position;
            _heroIcon.name = "formationIcon"

            let script = _heroIcon.getComponent("HeroIcon") as HeroIcon; 
            script.setHeroID(this._heroInfo as HeroData);
            script.setBtnCallBack(null);            
        });
    }

    //////////////////////////////
    public setSelectData(_heroData : HeroData, callback:Function)
    {
        this._heroInfo = _heroData;
        this._choiceCallBack = callback;
        this.initHeroIcon();
    }

    public getHeroInfo()
    {
        return this._heroInfo;
    }
    /**
     * @param _type 0:未选中 1:选中 2:锁定
     */
    public setChoiceIconImage(_type:number=0)
    {
        this._clickType = _type;

        if(_type == 0){
            this.choiceBg.active = false;
        }else if(_type == 1){
            this.choiceBg.active = true;
        }else if(_type == 2){
            resources.load("ui/team/弹框_升星_英雄锁定状态/spriteFrame",(err,_spriteFrame:SpriteFrame)=>{
                console.log("OPOPOPOPOP============")
                console.log(err)
                if(!err)
                {
                    let sprite = this.choiceBg.getComponent(Sprite) as Sprite;
                    sprite.spriteFrame = _spriteFrame;
                }
            })
        }
    }

    public getClickType():number
    {
        return this._clickType;
    }

    public getCurHeroInfo():HeroData|null
    {
        return this._heroInfo;
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
