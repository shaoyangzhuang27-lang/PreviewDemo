//单个英雄头像
import { _decorator, Component, Node, Sprite, Label, Button,SpriteFrame, resources, math, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { XConsts } from "../../model/const/XConsts";
import { HeroData } from '../../model/datas/HeroData';

@ccclass('PubPubHeroIcon')
export class PubHeroIcon extends Component {
    @property({type :  Node})
    public img_camp:Node = null as unknown as Node;

    @property({type :  Node})
    public img_frame:Node = null as unknown as Node;


    @property({type :  Node})
    public img_debris:Node = null as unknown as Node;

    @property({type :  Label})
    public lab_num:Label = null as unknown as Label;

    @property({type :  Node})
    public starlist:Node[] = [];

    private _isWonderSummonShow : boolean = false; 

    start () {
        // this.img_camp.active = false;
               
    }

    private _setStar(star:number)
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
    
    public setWonderSummonShow(value : boolean,info : XStruct.fragment_synthesis_info.IRecord)
    {

        this.img_debris.active = false;
        this.img_camp.active = false;
        this.lab_num.node.active = false;
        this._setStar(5);
        if(value)
        {
            if(info)
            {
                this.lab_num.node.active = true;
                this.lab_num.string = String(info.maxNum);
                this._setStar(info.star?info.star : 5);
                Object.keys(info).forEach((val, idx, array) => {
                    // val: 当前值
                    // idx：当前index
                    // array: Array
        
                    // val == "icon" && info[val] && this._resourceLoad(info[val],this.img_icon);
                    val == "frame" && info[val] && this._resourceLoad(info[val],this.img_frame);
                    val == "camp" && info[val] && this._resourceLoad(info[val],this.img_camp);
                    val == "quality" && info[val] && this._resourceLoad(info[val],this.img_debris);
                    // val == "bg" && info[val] && this._resourceLoad(info[val],this.img_bg);
                    
                });
            }
        }
        // else
        // {
            // this.img_camp.active = false;
            // this.lab_num.node.active = false;
            // this.img_debris.active = false;
            // this._setStar(5);
        // }
        this._isWonderSummonShow = value;
    }
    

       //资源替换
    private  _resourceLoad (path:string | null | undefined,obj:any)
    {
        
            path && resources.load(path,SpriteFrame,(err:any,spriteFrame:SpriteFrame) =>
            {
                obj.active = true;
                let sprite = obj.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            });
        
    }

       /**
     * 设置点击头像回调
     * @param callBack 回调函数
     */
        public setBtnCallBack(callBack:Function|null = null)
        {
            if(callBack)
            {
                this.img_frame.addComponent(Button);
                this.img_frame.on(Node.EventType.TOUCH_END, ()=>{            
                    callBack();                
                }, this);
            }
        }
}


