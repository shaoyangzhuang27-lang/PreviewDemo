
import { _decorator, Component, Node, Label, instantiate,resources,SpriteFrame } from 'cc';
import { HeroData } from '../../model/datas/HeroData';
const { ccclass, property } = _decorator;

@ccclass('HeroBookTitleCell')
export class HeroBookTitleCell extends Component {
    @property({type :  Node})
    public imgBg:Node = null as unknown as Node;

    @property({type :  Node})
    public imgFlower:Node = null as unknown as Node;

    @property({type :  Label})
    public labTitle:Label = null as unknown as Label;

    private _titleType:string = "";   //1传奇legend  2高级senior  3普通ordinary
    private _heroListofBook:number[] = new Array<number>();
    private _heroListData:Map<number,HeroData> = new Map<number,HeroData>();
    start () {
        
    }

    private _initHeroCell()
    {
        let bgPath:string = "";
        let flowerPath:string = "";
        if(this._titleType == "legend")
        {
            bgPath = "ui/book/图鉴_标题背景1/spriteFrame";
            flowerPath = "ui/book/图鉴_品质背景1/spriteFrame";
        }
        else if(this._titleType == "senior")
        {
            bgPath = "ui/book/图鉴_标题背景2/spriteFrame";
            flowerPath = "ui/book/图鉴_品质背景2/spriteFrame";
        }
        else if(this._titleType == "ordinary")
        {
            bgPath = "ui/book/图鉴_标题背景3/spriteFrame";
            flowerPath = "ui/book/图鉴_品质背景3/spriteFrame";
        }
        this._resourceLoad(bgPath,this.imgBg);
        this._resourceLoad(flowerPath,this.imgFlower);

        resources.load('prefabs_ui/main/bookcell', (err:any,res:any)=>{
            for (let index = 0; index < this._heroListofBook.length; index++) {
                let bookcell = instantiate(res) as Node;
                
            }
        });
    }
    
    public setBookHeroData(_type:string,_data:number[])
    {
            this._titleType = _type;
            this._heroListofBook = _data;
            this._initHeroCell();
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
