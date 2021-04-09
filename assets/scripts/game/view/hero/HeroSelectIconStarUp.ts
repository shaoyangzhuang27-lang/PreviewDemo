/**
 * 游戏组件:升星塔头像
 * @author 施敏昭
 * @version 1.0.0,2021.3.13
 */
import { _decorator, Component, Node, resources, SpriteFrame,Sprite,instantiate,Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { ElementHeroIcon } from '../common/ElementHeroIcon';
import { HeroData } from '../../model/datas/HeroData';

@ccclass('HeroSelectIconStarUp')
export class HeroSelectIconStarUp extends Component {
    @property({type :  Node})
    public btnFrame:Node = null as unknown as Node;

    @property({type :  Node})
    public icoChoose:Node = null as unknown as Node;
    
    @property({type :  Node})
    public icoLock:Node = null as unknown as Node;

    @property({type :  Node})
    public icoStarUp:Node = null as unknown as Node;

    @property({type :  Node})
    public icoSymbol:Node = null as unknown as Node;


    private _choiceCallBack:Function | null = null as unknown as Function;
    private _heroInfo:HeroData | null = null as unknown as HeroData;

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
     * @param type 0:未选中 1:选中 2:锁定 3:升星主体
     */
    public setItemType(type:number=0)
    {
        this._itemType = type;

        this.icoChoose.active = false;
        this.icoLock.active = false;
        this.icoStarUp.active = false;

        if(type == 0){
        }else if(type == 1){
            this.icoChoose.active = true;
        }else if(type == 2){
            this.icoLock.active = true;
        }else if(type == 3){
            this.icoStarUp.active = true;
        }
    }
    /**是否可以升星标志
     * @param type 0:未选中 1:选中 
     */
    public setItemSymbol(type:number=0)
    {
        this.icoSymbol.active = false;

        if(type == 1){
            this.icoSymbol.active = true;
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
}
