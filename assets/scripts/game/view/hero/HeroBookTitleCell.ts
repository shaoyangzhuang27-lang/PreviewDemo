
import { _decorator, Component, Node, Label, instantiate,resources,SpriteFrame,Sprite, Vec3 } from 'cc';
import { HeroData } from '../../model/datas/HeroData';
import { HeroBookCell } from './HeroBookCell';
import { XMsgExt } from '../../model/const/XMsgExt'
import { GameModel } from '../../model/GameModel';
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
            let rowIndex = 0;
            for (let index = 0; index < this._heroListofBook.length; index++) {
                let bookcell = instantiate(res) as Node;
                this.imgFlower.addChild(bookcell)
                let pos:Vec3 = new Vec3(-215+index*220,-35 - rowIndex*305, 1);
                bookcell.position = pos;

                let script = bookcell.getComponent("HeroBookCell") as HeroBookCell; 
                let heroId = this._heroListofBook[index];
                
                let heroBookInfo:Msg.HeroBookUnit = GameModel.getInstance().getHeroesModel().getBookHeroDataByStaticID(heroId);
                let showType:number = 0;   //显示类型:0显示遮罩 1可激活 2可升级 3常态无遮罩
                if(heroBookInfo.level == 0 && heroBookInfo.curTopStar == 0)
                {
                    showType = 0
                }
                else if(heroBookInfo.level == 0 && heroBookInfo.curTopStar != 0)
                {
                    showType = 1
                }
                else if(XMsgExt.IsCanLevelUp(heroBookInfo))
                {
                    showType = 2
                }
                else if(heroBookInfo.level != 0 && heroBookInfo.curTopStar == heroBookInfo.level)
                {
                    showType = 3
                }
                script.setHeroBookData(showType,heroId,(_data:any)=>{
                    console.log("图鉴点击回调")
                });

                if(index % 3 == 0)
                {
                    rowIndex++;
                }
            }
        });
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

    //设置信息
    public setBookHeroData(_type:string,_data:number[])
    {
            this._titleType = _type;
            this._heroListofBook = _data;
            this._initHeroCell();
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
