/**
 * 游戏组件:背包英雄礼包选择弹窗
 * @author 黄志清
 * @version 1.0.0,2021.3.16
 */
import { _decorator, Component, Node, ScrollView, resources, instantiate, EventTouch } from 'cc';
import { PopBase } from '../../../../core/control/PopBase';
import { MsgMgr } from '../../../control/MsgMgr';
import { PopMgr } from '../../../control/PopMgr';
import { TableName, ValueMgr } from '../../../model/ValueMgr';
import { HeroGiftChoiceCell } from '../../hero/HeroGiftChoiceCell';
const { ccclass, property } = _decorator;

@ccclass('PopHeroChoiceGiftView')
export class PopHeroChoiceGiftView extends PopBase {
    @property({type :  Node})
    public btn_submit:Node = null as unknown as Node;

    @property({type :  Node})
    public img_shadow:Node = null as unknown as Node;

    @property({type :  ScrollView})
    public scroll_hero:ScrollView = null as unknown as ScrollView;

    //礼包数据
    private _giftId:number = -1;
    private _giftData:Config.item_usable.Record = new Config.item_usable.Record();
    //礼包创建的节点集合
    private _heroGiftNodeList:Map<number, Node> = new Map<number, Node>();

    private _visit:boolean = false;     //参观模式

    private _selectHeroId:number = 0;    
    private _lastCellNode :Node | null = null;
    private _selectData = []
    start () {
        super.start()
        this.btn_submit.on(Node.EventType.TOUCH_END, this._onSubmit, this);
    }

    private _onSubmit()
    {
        if(this._selectHeroId == 0)
        {
            PopMgr.getInstance().popupPrompt("请先选择英雄!");
            return;
        }
        if(this._giftId != -1)
        {
            let selectIndex = this._giftData.param1.indexOf(this._selectHeroId);
            MsgMgr.getInstance().getMsgBag().requestUseItem(this._giftId, 1, selectIndex);
            this.delSelf()
        }
        
    }

    private _initScrollview()
    {
        resources.load('prefabs_ui/main/hero_packchoice', (err:any,res:any)=>{
            if(this._giftData && this._giftData.objType)
            {
                for (let index = 0; index < this._giftData.objType.length; index++) {
                    let heroChoiceCell = instantiate(res) as Node;
                    this.scroll_hero.content?.addChild(heroChoiceCell);
                    let script = heroChoiceCell.getComponent("HeroGiftChoiceCell") as HeroGiftChoiceCell;
                        
                    let packType = this._giftData.objType[index];
                    let param1 = this._giftData.param1[index];                    
                    let param2 = this._giftData.param2[index];
                    let param3 = this._giftData.param2[index];
                    let mytuple = [packType, param1, param2, param3];

                    // heroChoiceCell.name = "packHeroCell_" + packHeroId.toString();

                    this._heroGiftNodeList.set(param1, heroChoiceCell);
                    script.setHeroGiftData(mytuple,(id:number, data:any)=>{
                        this._choiceHeroItemCallback(id,data);
                    }, this._visit);
                }
            }
        })
    }

    private _choiceHeroItemCallback(heroid:number,data:any)
    {
        // let node = touchNode.currentTarget as Node;
        if(this._lastCellNode != null)
        {
            let curScript = this._lastCellNode.getComponent("HeroGiftChoiceCell") as HeroGiftChoiceCell;
            curScript.setImgBgActive("orange")
            this._selectData = []
        }
        
        if(heroid != 0)
        {
            let curCell = this._heroGiftNodeList.get(heroid) as Node;
            if(curCell)
            {
                let curScript = curCell.getComponent("HeroGiftChoiceCell") as HeroGiftChoiceCell;
                curScript.setImgBgActive("blue")
            }
            this._lastCellNode = curCell;
            this._selectData = data;
        }

        this._selectHeroId = heroid;
    }

    /**
     * 根据礼包id，获取礼包数据
     * @param giftid 礼包道具id
     * @param visit 预览模式   隐藏确定按钮、阴影
     */
    public setGiftID(giftid:number,visit:boolean=false)
    {
        if(visit)
        {
            this.img_shadow.active = false;
        }
        this._visit = visit;
        this._giftId = giftid;
        this._giftData = ValueMgr.getInstance().getItemByField(TableName.item_usable, giftid) as Config.item_usable.Record;
        this._initScrollview()
    }

}
