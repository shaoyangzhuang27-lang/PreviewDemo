import { _decorator, Component, Node,Label,resources,instantiate } from 'cc';
import { XConsts } from '../../model/const/XConsts';
import { TableName, ValueMgr } from "../../model/ValueMgr";
import { GameModel } from '../../model/GameModel';
import { PubHeroIcon } from '../pub/PubHeroIcon';
import { HeroIcon } from '../hero/HeroIcon';
import { ItemEquipType,ItemEquipCell } from '../menu/ItemEquipCell';
const { ccclass, property } = _decorator;

@ccclass('PubWonderSummonSettle')
export class PubWonderSummonSettle extends Component {
    @property({type: Label})
    public lab_title:Label | null = null;

    @property({type :  Node})
    public nodelist:Node[] = [];

    @property({type: Node})
    public node_one:Node | null = null;

    @property({type: Node})
    public node_ten:Node | null = null;

    @property({type: Node})
    public node_window:Node | null = null;

    start () {
        this.lab_title?.node.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.node_window?.on(Node.EventType.TOUCH_END, this._onButtonClick, this);
        this.lab_title &&  (this.lab_title.string = ValueMgr.getInstance().getLanguageString(XConsts.PUB_UI_CLICKTOCONTINUE));
    }

    private _onButtonClick(event:any){
        this.node.active = false;
    }


    private _clearData()
    {
        this.node_one?.removeAllChildren();
        for(var i=0; i < this.nodelist.length; i++)
        {
            this.nodelist[i].removeAllChildren();
        }
    }
    public initShowAwardList(msgData : Msg.WonderSummonHeroA)
    {
        this._clearData();
        var nShowCounts = msgData.awardList.length + msgData.heroList.length;
        if(nShowCounts == 0)
        {
            this.node_one && (this.node_one.active = false);
            this.node_ten && (this.node_ten.active = false);
        }
        if(nShowCounts > 1 )
        {
            this.node_one && (this.node_one.active = false);
            this.node_ten && (this.node_ten.active = true);
            for(var i =0 ; i < msgData.awardList.length; i++)
            {
                this.node_ten && this.initAwardInfo(this.nodelist[i],msgData.awardList[i] as Msg.LootObject);
            }

            for(var k = 0; k < msgData.heroList.length ; k++ )
            {
                var index = k + msgData.awardList.length;
                this.node_ten && this.initHeroIcon(this.nodelist[index],msgData.heroList[k] as Msg.HeroInfo);
            }
        }
        else
        {
            this.node_one && (this.node_one.active = true);
            this.node_ten && (this.node_ten.active = false);
            this.node_one && this.initAwardInfo(this.node_one,msgData.awardList[0] as Msg.LootObject);
        }
    }

    public initAwardInfo(node : Node, info : Msg.LootObject)
    {
        switch(info.objType)
        {
            case Msg.TObjectType.EObject_VRmb:
                    break;
            case Msg.TObjectType.EObject_Fragment:
                this.initFragmentIconInfo(info,node);
                // this.node_list[i].addChild()
                break;
            case Msg.TObjectType.EObject_Equip://ID （若参数1为0，则参数2为品质参数3为星级，随机从特定品质特定星级的装备中掉落一件）
                this.initEquipIconInfo(info,node);
                break;
            case Msg.TObjectType.EObject_MagicDust:
                this.initMagicDust(info,node);
                break;
            case Msg.TObjectType.EObject_AdvanceExp:
                this.initAdvanceExp(info,node);
                break;
            case Msg.TObjectType.EObject_UsableItem:
                this.initUsableItem(info,node);
                break;
            default:   //心愿英雄    
        }
    }
 
    /**
     * initFragmentIconInfo
     */
     public initFragmentIconInfo(data : any,node : Node) {
        resources.load('prefabs_ui/pub/pub_heroicon', (err:any,res:any)=>{
            let fragmentItem = instantiate(res); 
            fragmentItem.setScale(0.6,0.6,1)
            var info : XStruct.fragment_synthesis_info.IRecord = {
                frame :"",
                camp : "",
                star : 0,
                quality : "",
                icon : "",
                type : 0,
                maxNum : 0,
                curNum : 0,
                heroName : "",
                campName : "",
                classesName : "",
                bg : ""
            }  
            info.type = data.param1; // Msg.TFragmentType.EFragmentType_Random;
            info.star = data.param3; //5
            if(info.type == Msg.TFragmentType.EFragmentType_CampRandom)
            {
                info.camp = "ui/common/team/" + XConsts.KHeroCampIcon[data.param2] + "/spriteFrame";
                info.campName = XConsts.KCampName[data.param2];
            }
            info.quality = "ui/common/icon/" + XConsts.KFragmentQualitySpriteName[0] + "/spriteFrame";
            info.frame = "ui/common/icon/" + XConsts.KFragmentFrameSpriteName[0] + "/spriteFrame";
            
            info.maxNum = data.num;
            // 设置装备点击回调
            let script = fragmentItem.getComponent(PubHeroIcon);
            script.setWonderSummonShow(true,info);
            script.setBtnCallBack( 
                ()=>{
                    console.log("碎片");
                    //PopMgr.getInstance().popFragmentSynthesisWindow(info,()=>{console.log("碎片合成")},true);
            });  

            node.addChild(fragmentItem);
        })
    }


    public initEquipIconInfo(data : any,node :Node)
    {
        resources.load('prefabs_ui/main/itemequip_cell', (err:any,res:any)=>{
            let equipItem = instantiate(res); 
            // equipItem.setScale(0.4,0.4,1)
            let id = data.param1; 
            let num = data.num;
            // 设置装备点击回调
            let script = equipItem.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemType(id, num, ItemEquipType.equip, 
                ()=>{
                    console.log("装备")
                    // PopMgr.getInstance().popItemUseSellView(id,ItemEquipType.equip,false);
            });  
            node.addChild(equipItem);
        })    
    }

    public initMagicDust(data : any, node : Node)
    {
        resources.load('prefabs_ui/main/itemequip_cell', (err:any,res:any)=>{
            let equipItem = instantiate(res); 
            // equipItem.setScale(0.4,0.4,1)
            let id = Msg.TObjectType.EObject_MagicDust; //data.awardParam1; 
            let num = data.num;
            // 设置装备点击回调
            let script = equipItem.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemType(id, num, ItemEquipType.goods, 
                ()=>{
                    console.log("道具", Msg.TObjectType.EObject_MagicDust)
                    // PopMgr.getInstance().popItemUseSellView(id,ItemEquipType.goods,false);
            });  
            node.addChild(equipItem);
        }) 
    }

    public initAdvanceExp(data : any, node : Node)
    {
        resources.load('prefabs_ui/main/itemequip_cell', (err:any,res:any)=>{
            let equipItem = instantiate(res); 
            // equipItem.setScale(0.4,0.4,1)
            let id = Msg.TObjectType.EObject_AdvanceExp; //data.awardParam1; 
            let num = data.num;
            // 设置装备点击回调
            let script = equipItem.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemType(id, num, ItemEquipType.goods, 
                ()=>{
                    console.log("道具",Msg.TObjectType.EObject_AdvanceExp)
                    //PopMgr.getInstance().popItemUseSellView(id,ItemEquipType.goods,false);
            });  
            node.addChild(equipItem);
        }) 
    }


    public initUsableItem(data : any, node : Node)
    {
        resources.load('prefabs_ui/main/itemequip_cell', (err:any,res:any)=>{
            let equipItem = instantiate(res); 
            // equipItem.setScale(0.4,0.4,1)
            let id = data.param1; 
            let num = data.num;
            // 设置装备点击回调
            let script = equipItem.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemType(id, num, ItemEquipType.goods, 
                ()=>{
                    console.log("道具")
                    //PopMgr.getInstance().popItemUseSellView(id,ItemEquipType.goods,false);
            });  
            node.addChild(equipItem);
        }) 
    }

    public initHeroIcon(node : Node, info : Msg.HeroInfo)
    {
        resources.load('prefabs_ui/main/hero_icon', (err:any,res:any)=>{
            let _heroIcon = instantiate(res);
             _heroIcon.setScale(0.66,0.66,1)
            let script = _heroIcon.getComponent(HeroIcon); 
            script.initUIHeroIconInfo(info.staticID,XConsts.HERO_ICON_TYPE.SummonSettle,info.level);    
            script.setBtnCallBack(()=>{
                //PopMgr.getInstance().popOpenBookHeroDetail(GameModel.getInstance().getHeroPubModel().getPlayerWonderHero());
            })
            node.addChild(_heroIcon); 
        });
    }
}
