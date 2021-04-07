
import { _decorator, Component, Node,resources,instantiate,Prefab } from 'cc';
import { ElementPubHeroIcon } from './ElementPubHeroIcon';
import { GameModel } from '../../../model/GameModel';
import { XConsts } from '../../../model/const/XConsts';
import { TableName, ValueMgr } from "../../../model/ValueMgr";
import { ItemEquipType,ItemEquipCell } from '../../menu/ItemEquipCell';
import { ResMgr } from '../../../control/ResMgr';
import { HeroIcon } from '../../hero/HeroIcon';
import { PopMgr } from '../../../control/PopMgr';
import {PopPubWonderRewardList} from "./PopPubWonderRewardList";
const { ccclass, property } = _decorator;

@ccclass('CellPubWonderRewardList')
export class CellPubWonderRewardList extends Component {
    @property({type :  Node})
    public node_list:Node[] = [];

    private _infoArray : Array<any> = [];

    private _node_parent : PopPubWonderRewardList = null as unknown as PopPubWonderRewardList;

    start () {
        
    }

    /**
     * initFragmentIconInfo
     */
    public initFragmentIconInfo(data : any,node : Node) {
        ResMgr.getInstance().loadPrefab('prefabs_ui/pub/pub_heroicon', (err: Error | null, res: Prefab | null)=>{
            let fragmentItem = instantiate(res as Prefab); 
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
                bg : "",
                param : 0
            }  
            info.type = data.awardParam1; // Msg.TFragmentType.EFragmentType_Random;
            info.star = data.awardParam3; //5
            if(info.type == Msg.TFragmentType.EFragmentType_CampRandom)
            {
                info.camp = "ui/common/team/" + XConsts.KHeroCampIcon[data.awardParam2] + "/spriteFrame";
                info.campName = XConsts.KCampName[data.awardParam2];
            }
            info.quality = "ui/common/icon/" + XConsts.KFragmentQualitySpriteName[0] + "/spriteFrame";
            info.frame = "ui/common/icon/" + XConsts.KFragmentFrameSpriteName[0] + "/spriteFrame";
            
            info.maxNum = data.awardNum;
            // 设置装备点击回调
            let script = fragmentItem.getComponent(ElementPubHeroIcon) as ElementPubHeroIcon;
            script.setWonderSummonShow(true,info);
            script.setBtnCallBack( 
                ()=>{
                    console.log("碎片");
                    this._node_parent.setIsNeedHide(false);
                    PopMgr.getInstance().popFragmentSynthesisWindow(info,()=>{console.log("碎片合成")},true);
            });  

            node.addChild(fragmentItem);
        },"CellPubWonderRewardList")
    }


    public initEquipIconInfo(data : any,node :Node)
    {
        ResMgr.getInstance().loadPrefab('prefabs_ui/main/itemequip_cell', (err: Error | null, res: Prefab | null)=>{
            let equipItem = instantiate(res as Prefab); 
            // equipItem.setScale(0.4,0.4,1)
            let id = data.awardParam1; 
            let num = data.awardNum;
            // 设置装备点击回调
            let script = equipItem.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemType(id, num, ItemEquipType.equip, 
                ()=>{
                    console.log("装备")
                    this._node_parent.setIsNeedHide(false);
                    PopMgr.getInstance().popEquipInfoView(id,true);
            });  
            node.addChild(equipItem);
        },"CellPubWonderRewardList")    
    }

    public initMagicDust(data : any, node : Node)
    {
        ResMgr.getInstance().loadPrefab('prefabs_ui/main/itemequip_cell', (err: Error | null, res: Prefab | null)=>{
            let equipItem = instantiate(res as Prefab); 
            // equipItem.setScale(0.4,0.4,1)
            let id = Msg.TObjectType.EObject_MagicDust; //data.awardParam1; 
            let num = data.awardNum;
            // 设置装备点击回调
            let script = equipItem.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemType(id, num, ItemEquipType.goods, 
                ()=>{
                    console.log("道具")
                    this._node_parent.setIsNeedHide(false);
                    PopMgr.getInstance().popItemUseSellView(id,ItemEquipType.goods,false);
            });  
            node.addChild(equipItem);
        },"CellPubWonderRewardList") 
    }

    public initAdvanceExp(data : any, node : Node)
    {
        ResMgr.getInstance().loadPrefab('prefabs_ui/main/itemequip_cell', (err: Error | null, res: Prefab | null)=>{
            let equipItem = instantiate(res as Prefab); 
            // equipItem.setScale(0.4,0.4,1)
            let id = Msg.TObjectType.EObject_AdvanceExp; //data.awardParam1; 
            let num = data.awardNum;
            // 设置装备点击回调
            let script = equipItem.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemType(id, num, ItemEquipType.goods, 
                ()=>{
                    console.log("道具")
                    this._node_parent.setIsNeedHide(false);
                    PopMgr.getInstance().popItemUseSellView(id,ItemEquipType.goods,false);
            });  
            node.addChild(equipItem);
        },"CellPubWonderRewardList") 
    }

    public initUsableItem(data : any, node : Node)
    {
        ResMgr.getInstance().loadPrefab('prefabs_ui/main/itemequip_cell', (err: Error | null, res: Prefab | null)=>{
            let equipItem = instantiate(res as Prefab); 
            // equipItem.setScale(0.4,0.4,1)
            let id = data.awardParam1; 
            let num = data.awardNum;
            // 设置装备点击回调
            let script = equipItem.getComponent("ItemEquipCell") as ItemEquipCell;
            script.setItemUseType(data.awardType);
            script.setItemType(id, num, ItemEquipType.goods, 
                ()=>{
                    console.log("道具")
                    this._node_parent.setIsNeedHide(false);
                    PopMgr.getInstance().popItemUseSellView(id,ItemEquipType.goods,false);
            });  
            node.addChild(equipItem);
        },"CellPubWonderRewardList") 
    }
    public initItemInfo(data : Array<any>)
    {
        this._infoArray = data;
        console.log("zzzzzz1111z",data);

        var nCounts  = this._infoArray.length;

        if(nCounts == 2)
        {
            ResMgr.getInstance().loadPrefab('prefabs_ui/main/hero_icon', (err: Error | null, res: Prefab | null)=>{
                let _heroIcon = instantiate(res as Prefab);
                 _heroIcon.setScale(0.8,0.8,1)
                let script = _heroIcon.getComponent(HeroIcon) as HeroIcon; 
                script.initUIHeroIconInfo(GameModel.getInstance().getHeroPubModel().getPlayerWonderHero(),XConsts.HERO_ICON_TYPE.WonderSummon);    
                script.setBtnCallBack(()=>{
                    PopMgr.getInstance().popOpenBookHeroDetail(GameModel.getInstance().getHeroPubModel().getPlayerWonderHero());
                })
               this.node_list[4]?.addChild(_heroIcon);   
            },"CellPubWonderRewardList");

            ResMgr.getInstance().loadPrefab('prefabs_ui/main/itemequip_cell', (err: Error | null, res: Prefab | null)=>{
                let itemEquipCell = instantiate(res as Prefab);
                //钻石 
                 itemEquipCell.setScale(1.2,1.2,1)
                let id = this._infoArray[1].awardType; //Msg.TObjectType.EObject_VRmb; 
                let num = this._infoArray[1].awardNum; //XConsts.PUB_UI_WONDER_DEFAULT_DIAMOND_REWARD;
                // 设置装备点击回调
                let script = itemEquipCell.getComponent("ItemEquipCell") as ItemEquipCell;
                script.setItemType(id, num, ItemEquipType.goods, 
                    ()=>{
                        console.log("点击钻石显示道具信息")
                        this._node_parent.setIsNeedHide(false);
                        PopMgr.getInstance().popItemUseSellView(id,ItemEquipType.goods,false);
                });  
    
                this.node_list[5]?.addChild(itemEquipCell);   
            },"CellPubWonderRewardList");
        }
        else if(nCounts == 4 )
        {
            for(let i = 0; i < nCounts; i++)
            {
                switch(this._infoArray[i].awardType)
                {
  
                    case Msg.TObjectType.EObject_VRmb:
                        break;
                    case Msg.TObjectType.EObject_Fragment:
                        this.initFragmentIconInfo(this._infoArray[i],this.node_list[i]);
                        // this.node_list[i].addChild()
                        break;
                    case Msg.TObjectType.EObject_Equip://ID （若参数1为0，则参数2为品质参数3为星级，随机从特定品质特定星级的装备中掉落一件）
                        this.initEquipIconInfo(this._infoArray[i],this.node_list[i]);
                        break;
                    case Msg.TObjectType.EObject_MagicDust:
                        this.initMagicDust(this._infoArray[i],this.node_list[i]);
                        break;
                    case Msg.TObjectType.EObject_AdvanceExp:
                        this.initAdvanceExp(this._infoArray[i],this.node_list[i]);
                        break;
                    case Msg.TObjectType.EObject_UsableItem:
                        this.initUsableItem(this._infoArray[i],this.node_list[i]);
                        break;
                    default: //心愿英雄
                }
            }
        }   
    }


    public setParentNode(node : PopPubWonderRewardList)
    {
        this._node_parent = node;
    }
}


