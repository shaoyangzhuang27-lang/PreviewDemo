
import { _decorator, Component, Node, resources, SpriteFrame,Sprite,instantiate,Vec3 } from 'cc';
import { XConsts } from '../../model/const/XConsts';
import { HeroData } from '../../model/datas/HeroData';
import { GameModel } from '../../model/GameModel';
import { ElementHeroIcon } from './ElementHeroIcon';
const { ccclass, property } = _decorator;

@ccclass('HeroSelectIcon')
export class HeroSelectIcon extends Component {
    @property({type :  Node})
    public btnFrame:Node = null as unknown as Node;

    @property({type :  Node})
    public icoChoose:Node = null as unknown as Node;
    
    @property({type :  Node})
    public icoLock:Node = null as unknown as Node;


    private _choiceCallBack:Function | null = null as unknown as Function;
    private _heroInfo:HeroData | null = null as unknown as HeroData;

    private _selectedWonderHeroId : number = 0;
    private _itemType:number = 0;
    start () {
        this.btnFrame.on(Node.EventType.TOUCH_END, this.btnChoiceCallBack, this);
        // this.choiceBg.active = true;
    }

    private btnChoiceCallBack()
    {
        if(this._choiceCallBack)
        {
            this._choiceCallBack(this._heroInfo, this._itemType);//let isSelect = 
            // if(isSelect != null){
            //     this.setSelect(isSelect)
            // }
        }
    }

    private initHeroIcon()
    {
        resources.load('prefabs_ui/common/element_heroicon', (err:any,res:any)=>{                  
            let heroIcon = instantiate(res) as Node;
            heroIcon.scale = new Vec3(0.6,0.6,1);
            this.btnFrame.addChild(heroIcon);
            heroIcon.position = this.btnFrame.position;
            heroIcon.name = "formationIcon"

            let script = heroIcon.getComponent("ElementHeroIcon") as ElementHeroIcon; 
            script.setHeroData(this._heroInfo as HeroData);
            script.setBtnCallBack(null);            
        });
    }

    //////////////////////////////
    public setSelectData(heroData : HeroData, callback:Function)
    {
        this._heroInfo = heroData;
        this._choiceCallBack = callback;
        this.initHeroIcon();
    }

    public getHeroData()
    {
        return this._heroInfo;
    }
    /**
     * @param type 0:未选中 1:选中 2:锁定
     */
    public setItemType(type:number=0)
    {
        this._itemType = type;

        this.icoChoose.active = false;
        this.icoLock.active = false;

        if(type == 0){
        }else if(type == 1){
            this.icoChoose.active = true;
        }else if(type == 2){
            this.icoLock.active = true;
        }
    }
    public selectSelf(){
        let type = 0;
        if(this._itemType == 1){
            type = 0;
        }else if(this._itemType == 0){
            type = 1;
        }
        this.setItemType(type);
    }
    public setSelect(isSelect:boolean){
        if(isSelect){
            this.setItemType(1)
        }else{
            this.setItemType(0)
        }
    }

    public getItemType():number
    {
        return this._itemType;
    }

    public getCurHeroInfo():HeroData|null
    {
        return this._heroInfo;
    }

    public setWonderSelectData(value:number,id : number,callback:Function)
    {
        if(id == GameModel.getInstance().getHeroPubModel().getPlayerWonderHero())
        {
            this.setItemType(1);
        }
        else
        {
            this.setItemType(value);
        }
        this._choiceCallBack = callback;
        this.initWonderHeroIcon(id);
        this._selectedWonderHeroId = id;
    }
    private initWonderHeroIcon(id : number)
    {
        resources.load('prefabs_ui/common/element_heroicon', (err:any,res:any)=>{                  
            let heroIcon = instantiate(res) as Node;
            heroIcon.scale = new Vec3(0.6,0.6,1);
            this.btnFrame.addChild(heroIcon);
            heroIcon.position = this.btnFrame.position;
            heroIcon.name = "formationIcon"

            let script = heroIcon.getComponent("ElementHeroIcon") as ElementHeroIcon; 
            script.initUIHeroIconInfo(id,XConsts.HERO_ICON_TYPE.RecLineUp);
            script.setBtnCallBack(null);            
        });
    }
    public getSelectWonderHeroId()
    {
        return this._selectedWonderHeroId;
    } 
}
