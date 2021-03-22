
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
import { ItemEquipCell, ItemEquipType } from '../menu/ItemEquipCell';

const { ccclass, property } = _decorator;

@ccclass('PopHeroEquipReplace')
export class PopHeroEquipReplace extends PopBase {
 
    @property({type: Label})
    public lab_title:Label | null = null;

    @property({ type: ItemEquipCell})
    public itemequip_cell_drag : ItemEquipCell = null as unknown as ItemEquipCell; //穿戴装备（当前穿戴的装备）
    
    @property({ type: Node})
    public node_equip_drag : Node = null as unknown as Node; //拖装备Node（穿戴的装备）

    @property({ type: Label})
    public equip_name_drag : Label = null as unknown as Label; //穿戴装备名称

    @property({ type: Sprite})
    public epuip_icon_drag : Sprite = null as unknown as Sprite; //穿戴装备类型ICON

    @property({ type: Label})
    public lab_main_attribute_drag : Label = null as unknown as Label; //穿戴装备主属性

    @property({ type: Node})
    public node_suit_drag : Node = null as unknown as Node; //穿戴装备套装属性Node


    @property({ type: ItemEquipCell})
    public itemequip_cell_wear : ItemEquipCell = null as unknown as ItemEquipCell; //替换的装备（当前要替换的的装备）
    
    @property({ type: Node})
    public node_equip_wear : Node = null as unknown as Node; //替换装备Node

    @property({ type: Label})
    public equip_name_wear : Label = null as unknown as Label; //替换装备名称

    @property({ type: Sprite})
    public epuip_icon_wear : Sprite = null as unknown as Sprite; //替换装备类型ICON

    @property({ type: Label})
    public lab_main_attribute_wear : Label = null as unknown as Label; //替换装备主属性

    @property({ type: Node})
    public node_suit_wear : Node = null as unknown as Node; //替换装备套装属性Node



    @property({type :  Button})
    public btn_wear = null as unknown as Button; //穿装备

    @property({type :  Button})
    public btn_drag = null as unknown as Button; //脱装备

    @property({type :  ScrollView})
    public scroll_equip:ScrollView = null as unknown as ScrollView;
    
    private _curHeroId : number  = 0;  //当前装备的英雄ID

    private _replaceEquipId : number = 0;//当前要替换的装备ID

    private _curEquipId : number = 0;//当前穿戴的装备ID

    private  TEquipLocationTypeIcon:string[] = new Array<string> ( "无", "英雄详情_装备图标1", "英雄详情_装备图标2", "英雄详情_装备图标3", "英雄详情_装备图标4");

    private _suitPropertyList: Map<Msg.THeroPropertyType, number> = new Map<Msg.THeroPropertyType, number>();      //套装属性

    private _locationType :Msg.TEquipLocationType = 0;

    start () {
        super.start();
        this.btn_wear.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.btn_drag.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_hero_put_on_equip, this._notifyHeroAllLoadEquipHandle, this);
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_net_hero_take_off_equip, this._notifyHeroAllUnLoadEquipHandle, this);
    }

    onDestroy() {
        super.onDestroy();
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_hero_put_on_equip, this._notifyHeroAllLoadEquipHandle, this);
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_net_hero_take_off_equip, this._notifyHeroAllUnLoadEquipHandle, this);
    }

    private _notifyHeroAllUnLoadEquipHandle(data: any = null) {
        if (!data) {
            return;
        }
        let msg = data as Msg.TakeOffEquipA;
        if (msg.err == Msg.TErrorCode.ERR_OK) {
            if (msg.heroID == this._curHeroId) {
                this.delSelf();              
            }
        }
        else {
            console.log(msg.errStr + " errCode=" + msg.err.toString());
            // TipsMgr.instance.ShowErrDialog(msg.Err);
        }
    }

    private _notifyHeroAllLoadEquipHandle(data: any = null) {
        if (!data) {
            return;
        }
        
        let msg = data as Msg.PutOnEquipA;
        if (msg.err == Msg.TErrorCode.ERR_OK) {
            if (msg.heroID == this._curHeroId) {
                this.delSelf();
            }
        } else {
            // TipsMgr.instance.ShowErrDialog(msg.Err);
            console.log(msg.errStr + " errCode=" + msg.err.toString());
        }

    }


    private _onButtonClick(event:any){

        switch (event.target.getComponent(Button)) {
            case this.btn_drag:
                console.log("equip_drag");
                MsgMgr.getInstance().getMsgFormation().requestHeroTakeOffEquip(this._curHeroId, [this._curEquipId]);

                break;
            case this.btn_wear:
                console.log("equip_wear");
                MsgMgr.getInstance().getMsgFormation().requestHeroPutOnEquip(this._curHeroId, [this._replaceEquipId]);
                break;        
        }

    }

    private _initEquipScrollview(){

        if(this.scroll_equip){
            this.scroll_equip.content?.removeAllChildren()
        }

        let allEquipList = GameModel.getInstance().getBagModel().getBagEquipList();
        let curlocationEquipData:Array<Config.equip.Record> = new  Array();

        //筛选出同类型装备
        for (let key of allEquipList.keys()) {
            let equipData:Config.equip.Record = ValueMgr.getInstance().getItemByField(TableName.equip,key) as Config.equip.Record;
            if(equipData.locationType == this._locationType){
                curlocationEquipData.push(equipData);
            }
        }

        resources.load('prefabs_ui/main/itemequip_cell', (err:any,res:any)=>{
            for (var i = 0 ; i < curlocationEquipData.length; i++) {
                let equip_item = instantiate( res );
                this.scroll_equip.content?.addChild(equip_item);
                let equipData = curlocationEquipData[i];
                equip_item.getComponent(ItemEquipCell).setItemType(equipData.id,0,ItemEquipType.equip,(id:number,itemClickType:number,objClickType:number)=>{
                    console.log(" 当前点击的背包装备ID=>",id);
                    this._refreshReplaceEquip(id)
                });
            }
        });

    }

    private _initView(equipData:Config.equip.Record,locationType:Msg.TEquipLocationType){

        let iconName:string = this.TEquipLocationTypeIcon[locationType];
        let classesIconPath:string = "ui/lv_up/" + iconName + "/spriteFrame"
        resources.load(classesIconPath, (err,spriteFrame:SpriteFrame) =>
        {
            if(!err)
            {
                let sprite = this.epuip_icon_wear.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
                sprite = this.epuip_icon_drag.getComponent(Sprite) as Sprite;
                sprite.spriteFrame = spriteFrame;
            }
        });  

        if(equipData && equipData.id !=0){
            this.node_equip_drag.active = true;
            this.node_equip_wear.setPosition(150,0);
            this._showCurEquip(equipData)
        }else{
            //无装备
            this.node_equip_drag.active = false;
            this.node_equip_wear.setPosition(0,0);
            this.btn_wear.interactable = false;
        }
    }


    private _showCurEquip(equipData:Config.equip.Record){

        this._curEquipId = equipData.id;
        //单个装备属性
        let propertyType:number = equipData.propertyType[0];
        let propertyNum:number = equipData.propertyNum[0];
        let uiLan = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.KPropertyName[propertyType]) as Config.language_ui.Record;

        let propertyStr:string = uiLan.cn + " +" + propertyNum.toString()
        this.lab_main_attribute_drag.string = propertyStr
        this.lab_main_attribute_drag.color = XConsts.KQualityColor[0];

        let nameData = ValueMgr.getInstance().getItemByField(TableName.language_data,equipData.name) as Config.language_data.Record;
        this.equip_name_drag.string = nameData.cn;
        this.equip_name_drag.color = XConsts.KQualityColor[equipData.quality];

        var suitID = equipData.quality * 100 + equipData.star;
        if(suitID != 0)
        {
            let suitEquipData = ValueMgr.getInstance().getItemByField(TableName.suit,suitID) as Config.suit.Record;
            if(!suitEquipData) {return;}; //低级装备没有套装属性，通过suitID 获取不到套装属性
            this.node_suit_drag.active = true;
            //suitEquipData.name
   
            var lab_suit_attribute1 : Label =  this.node_suit_drag.getChildByName("lab_suit_attribute1")?.getComponent(Label) as Label;
            var lab_suit_attribute2 : Label =  this.node_suit_drag.getChildByName("lab_suit_attribute2")?.getComponent(Label) as Label;
            var lab_suit_attribute3 : Label =  this.node_suit_drag.getChildByName("lab_suit_attribute3")?.getComponent(Label) as Label;
            
            var attributeLabels: Label[] = [lab_suit_attribute1,lab_suit_attribute2,lab_suit_attribute3];
            
            for(var i=0;i < suitEquipData.propertyType.length;i++){
                let uiLan = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.KPropertyName[suitEquipData.propertyType[i]]) as Config.language_ui.Record;
                let propertyStr:string = " +" + Number(suitEquipData.propertyNum[i]).toFixed(2).toString() +"%"  +uiLan.cn;
                attributeLabels[i].string = propertyStr;
                attributeLabels[i].color = XConsts.KColorGray;
            }

            var suitName : Label =  this.node_suit_drag.getChildByName("lab_suit")?.getComponent(Label) as Label;
            // suitName.color = XConsts.KColorGolden

            if(this._suitPropertyList){
                this._suitPropertyList.forEach((value, key) => {
                    if (key == suitID)
                    {
                        let record = ValueMgr.getInstance().getItemByField(TableName.suit, key) as Config.suit.Record;
                        if (record != null) {
                            suitName.string = suitEquipData.name +"(" + value +"/4)"  
                            for (var j = 0; i <value - 1; i++) 
                            {
                                attributeLabels[i].color = XConsts.KColorGreen;
                            }    
                        }
                    }
                })
            }
        }

        this.itemequip_cell_drag.setItemType(equipData.id,0,ItemEquipType.equip,(id:number,itemClickType:number,objClickType:number)=>{
            console.log(" 当前装备=>",id);
            // this._itemEqipCallBack(id,itemClickType,objClickType)

        });


    }

    private _refreshReplaceEquip(equipID: number){
        //如果第二次点击同一个装备，默认脱下，不替换
        this._replaceEquipId = this._replaceEquipId == equipID ? 0 : equipID;

        if(this._replaceEquipId == 0){
            this.equip_name_wear.string = "";
            this.lab_main_attribute_wear.string ="";
            this.node_suit_wear.active = false;
            this.btn_wear.interactable = false;
            this.itemequip_cell_wear.node.active = false;
        }
        else{

            let equipData:Config.equip.Record = ValueMgr.getInstance().getItemByField(TableName.equip,equipID) as Config.equip.Record;
            if(!equipData) {return;}

            this.node_suit_wear.active = true;
            this.btn_wear.interactable = true;
            this.itemequip_cell_wear.node.active = true;
             //单个装备属性
            let propertyType:number = equipData.propertyType[0];
            let propertyNum:number = equipData.propertyNum[0];
            let uiLan = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.KPropertyName[propertyType]) as Config.language_ui.Record;

            let propertyStr:string = uiLan.cn + " +" + propertyNum.toString()
            this.lab_main_attribute_wear.string = propertyStr
            this.lab_main_attribute_wear.color = XConsts.KQualityColor[0];

            let nameData = ValueMgr.getInstance().getItemByField(TableName.language_data,equipData.name) as Config.language_data.Record;
            this.equip_name_wear.string = nameData.cn;
            this.equip_name_wear.color = XConsts.KQualityColor[equipData.quality];
            this.itemequip_cell_wear.setItemType(equipData.id,0,ItemEquipType.equip,null);
            var suitID = equipData.quality * 100 + equipData.star;
            if(suitID != 0)
            {
                let suitEquipData = ValueMgr.getInstance().getItemByField(TableName.suit,suitID) as Config.suit.Record;
                if(!suitEquipData) {
                    
                    this.node_suit_wear.active = false;
                    return;}; //低级装备没有套装属性，通过suitID 获取不到套装属性
                this.node_suit_wear.active = true;
                //suitEquipData.name
                var lab_suit_attribute1 : Label =  this.node_suit_wear.getChildByName("lab_suit_attribute1")?.getComponent(Label) as Label;
                var lab_suit_attribute2 : Label =  this.node_suit_wear.getChildByName("lab_suit_attribute2")?.getComponent(Label) as Label;
                var lab_suit_attribute3 : Label =  this.node_suit_wear.getChildByName("lab_suit_attribute3")?.getComponent(Label) as Label;
                
                var attributeLabels: Label[] = [lab_suit_attribute1,lab_suit_attribute2,lab_suit_attribute3];
                
                for(var i=0;i < suitEquipData.propertyType.length;i++){
                    let uiLan = ValueMgr.getInstance().getItemByField(TableName.language_ui,XConsts.KPropertyName[suitEquipData.propertyType[i]]) as Config.language_ui.Record;
                    let propertyStr:string = " +" + Number(suitEquipData.propertyNum[i]).toFixed(2).toString() +"%"  +uiLan.cn;
                    attributeLabels[i].string = propertyStr;
                    attributeLabels[i].color = XConsts.KColorGray;
                }

                var suitName : Label =  this.node_suit_wear.getChildByName("lab_suit")?.getComponent(Label) as Label;
                // suitName.color = XConsts.KColorGolden

                if(this._suitPropertyList){
                    this._suitPropertyList.forEach((value, key) => {
                        if (key == suitID)
                        {
                            let record = ValueMgr.getInstance().getItemByField(TableName.suit, key) as Config.suit.Record;
                            if (record != null) {
                                suitName.string = suitEquipData.name +"(" + value +"/4)"  
                                for (var j = 0; i <value - 1; i++) 
                                {
                                    attributeLabels[i].color = XConsts.KColorGreen;
                                }    
                            }
                        }
                    })
                }
            }
     
        }
    }

    /**
     * @description: 设置装备数据
     * @param {number} equipId 装备id
     * @param {number} heroId 英雄id
     */
    public setEquipData(heroId: number, locationType:Msg.TEquipLocationType | 0){
        this._curHeroId = heroId;
        let heroData = GameModel.getInstance().getHeroesModel().getHeroInfoByDyncID(heroId);
        if(!heroData)   return

        this._suitPropertyList =  heroData.getSuitPropertyList() as unknown as Map<Msg.THeroPropertyType, number>;
        let equipOnList : Map<Msg.TEquipLocationType, Config.equip.Record> = heroData?.equipOnList as unknown as Map<Msg.TEquipLocationType, Config.equip.Record>;   
        if(!equipOnList) return
        let equipData :Config.equip.Record = equipOnList.get(locationType) as unknown as Config.equip.Record;
        //if(!equipData) return
        this._locationType = locationType;
        //初始化可替换装备列表
        this._initEquipScrollview()

        //初始化装备显示
        this._initView(equipData,locationType)


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
