
import { _decorator, Component, Node ,Label,resources,Vec3,Sprite, SpriteFrame, Button, instantiate,ScrollView} from 'cc';
import { PopBase } from '../../../core/control/PopBase';
import { GameModel } from '../../model/GameModel';
import { HeroData } from '../../model/datas/HeroData';
import { HeroModel } from '../hero/HeroModel';
import { PopMgr } from '../../control/PopMgr';
import { NotifyMgr } from '../../control/NotifyMgr';
import { MsgMgr } from '../../control/MsgMgr';
import { XShare } from '../../model/const/XShare';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
const { ccclass, property } = _decorator;

@ccclass('PopHeroEquipReplace')
export class PopHeroEquipReplace extends PopBase {
 
    @property({type: Label})
    public lab_title:Label | null = null;

    @property({ type: Node})
    public node_equip_drag : Node = null as unknown as Node; //拖装备Node

    @property({ type: Node})
    public node_equip_wear : Node = null as unknown as Node; //穿装备Node

    @property({type :  Button})
    public btn_wear = null as unknown as Button; //穿装备

    @property({type :  Button})
    public btn_drag = null as unknown as Button; //拖装备

    @property({type :  ScrollView})
    public scroll_equip:ScrollView = null as unknown as ScrollView;
    
    

    start () {
        super.start();

        // var name =  this.node_equip_drag.getChildByName("equip_name")?.getComponent(Label) as Label;
        // name.string = "丛林兜帽"; 
        
        this._initView()

        this.initScrollView()
        this.btn_wear.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_drag.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
    }

    private _initView(){
        var isHaveEquip = false
        if(!isHaveEquip){
            this.node_equip_drag.active = false;
            this.node_equip_wear.setPosition(0,0);
        }
        else{
            this._showCurEquip()
        }      
    }

    private _showCurEquip(){
        var eqName = this.node_equip_drag.getChildByName("equip_name")?.getComponent(Label) as Label;
        // var 

    }

    private _refreshReplaceEquip(){



    }

    private _onButtonClick(event:any){

        switch (event.target.getComponent(Button)) {
            case this.btn_drag:
                console.log("equip_drag");
      

                break;
            case this.btn_wear:
                console.log("equip_wear");

                break;        
        }

    }

    public initScrollView(){

        if(this.scroll_equip){
            this.scroll_equip.content?.removeAllChildren()
        }

        resources.load('prefabs_ui/main/itemequip_cell', (err:any,res:any)=>{
            for (var i = 0 ; i < 30; i++) {
                let equip_item = instantiate( res );
               // equip_item.setViewDetaiLabelContent(GameModel.getInstance().getHeroPubModel().getRecLineUpItemInfoByIndex(i));
                this.scroll_equip.content?.addChild(equip_item);
            }
        });

    }

    /**
     * @description: 设置装备数据
     * @param {number} equipId 装备id
     * @param {number} heroId 英雄id
     */
    public setEquipData(heroId: number, equipId:number=0){
        if(equipId ==0){
            //无装备
        }else{
            
        }
    }

    //设置标题
    public setTitle(title:string){
        if(this.lab_title)
            this.lab_title.string = title
    }

    public setCloseCallBack(func:Function | null){

       if(func){
            this._closeFunc = ()=>{
                func()
                this.delSelf();
            };
        }  

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
