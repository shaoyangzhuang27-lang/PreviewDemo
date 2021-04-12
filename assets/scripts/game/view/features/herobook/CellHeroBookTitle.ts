/**
 * 游戏组件:英雄图鉴
 * @author 黄志清
 * @version 1.0.0,2021.3.17
 */
import { _decorator, Component, Node, Label, instantiate,resources,SpriteFrame,Sprite, Vec3, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CellHeroBookTitle')
export class CellHeroBookTitle extends Component {
    @property({type :  Node})
    public imgBg:Node = null as unknown as Node;

    @property({type :  Node})
    public imgFlower:Node = null as unknown as Node;

    @property({type :  Label})
    public labTitle:Label = null as unknown as Label;

    private _titleType:string = "";   //1传奇legend  2高级senior  3普通ordinary
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
            this.labTitle.string = "高级英雄"
        }
        else if(this._titleType == "ordinary")
        {
            bgPath = "ui/book/图鉴_标题背景3/spriteFrame";
            flowerPath = "ui/book/图鉴_品质背景3/spriteFrame";
            this.labTitle.string = "普通英雄"
        }
        this._resourceLoad(bgPath,this.imgBg);
        this._resourceLoad(flowerPath,this.imgFlower);

        
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

    /**
     * 设置图鉴标题内容及图案
     * @param _type 
     */
    public setBookHeroData(_type:string)
    {
        this._titleType = _type;
        this._initHeroCell();
    }
}
