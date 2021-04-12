
import { _decorator, Component, Node, ToggleContainer, EventHandler, Toggle, Vec3, tween, ScrollView, Game,Size, resources, instantiate, Layout ,UITransform,Prefab} from 'cc';
import { GameModel } from '../../model/GameModel';
import { EquipPropType,ElementEquipProp } from '../common/ElementEquipProp';
import { PopMgr } from '../../control/PopMgr';
import { NotifyMgr } from '../../control/NotifyMgr';
import { ElementHeroFragment } from '../features/bag/ElementHeroFragment';
import { ResMgr } from '../../control/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('BagMain')
export class BagMain extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property({type: ToggleContainer })
    public selectGroup:ToggleContainer | null = null;
    
    @property({type: Node })
    public fragNode:Node | null = null;
    
    @property({type: Node })
    public equipNode:Node | null = null;
    
    @property({type: Node })
    public propsNode:Node | null = null;
    
    @property({type: Node })
    public pNode:Node | null = null;
    
    @property({type: Node })
    public btnClose:Node | null = null;

    @property({type :  ScrollView})
    public scroll_EquipView:ScrollView = null as unknown as ScrollView;

    @property({type :  ScrollView})
    public scroll_ItemView:ScrollView = null as unknown as ScrollView;

    @property({type :  ScrollView})
    public scroll_fragment:ScrollView = null as unknown as ScrollView;
    
    @property({type: Node })
    public bgMask:Node = null as unknown as Node;

    //拥有的所有道具显示对象
    private _bagItemNodeList:Map<number, Node> = new Map<number, Node>();

    //拥有的所有装备列表显示对象
    private _bagEquipNodeList:Map<number, Node> = new Map<number, Node>();

    onLoad()
    {
        NotifyMgr.getInstance().addNotifyHandler(NotifyMgr.event_equip_item_change,this._changeScrollviewItemData,this);
    }

    start () {
        // [3]
        const containerEventHandler = new EventHandler();
        containerEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        containerEventHandler.component = 'BagMain';// 这个是代码文件名
        containerEventHandler.handler = 'tabClick';
        containerEventHandler.customEventData = '';
        this.selectGroup?.checkEvents.push(containerEventHandler);
        this.btnClose?.on(Node.EventType.TOUCH_END, this.closeHandle, this);
        this.bgMask.on(Node.EventType.TOUCH_END, this.closeHandle, this);
        this.show();
    }
    
    tabClick(event: Event, customEventData: string){
        let tog:Toggle = (event as any);
        if(!(this.fragNode && this.equipNode && this.propsNode) )return;

        if(tog.node.name == "Toggle1"){
            this.fragNode.active = true;
            this.equipNode.active = false;
            this.propsNode.active = false;
        }else if(tog.node.name == "Toggle2"){
            this.fragNode.active = false;
            this.equipNode.active = true;
            this.propsNode.active = false;
        }else{
            this.fragNode.active = false;
            this.equipNode.active = false;
            this.propsNode.active = true;
        }
    }
    show(){
        tween(this.pNode)
        .to(0.1,{position:new Vec3(this.pNode?.getPosition().x,-340,0)})
        .call(() => {
            this._initScrollview()
        }).start()
    }
    hide(){
        
        tween(this.pNode)
        .to(0.1,{position:new Vec3(this.pNode?.getPosition().x,-900,0)})
        .call(() => {
            this.node.removeFromParent();
        }).start()
    }
    closeHandle(){
        this.hide();
    }

    private _initScrollview()
    {
        this._initEquipScrollview();
        this._initItemScrollview();
        this._initFragmentScrollview();
    }

    private _initEquipScrollview()
    {
        this._bagEquipNodeList.clear()
        let allEquipList = GameModel.getInstance().getBagModel().getBagEquipList();
        resources.load('prefabs_ui/common/element_equipprop', (err:any,res:any)=>{
            for (let key of allEquipList.keys()) {
                let value = allEquipList.get(key);  //数量   
                let equipCell = instantiate(res) as Node;
                this.scroll_EquipView.content?.addChild(equipCell);
                equipCell.name = "BagEquipCell_" + Number(key);
                this._initPrefab(equipCell, Number(key), Number(value), EquipPropType.equip, Number(Msg.TObjectType.EObject_Equip)); 

                this._bagEquipNodeList.set(Number(key), equipCell);
            }
        })   
    }

    private _initItemScrollview()
    {
        let allGoodsList = GameModel.getInstance().getBagModel().getAllGoods();
        this._bagItemNodeList.clear()
        resources.load('prefabs_ui/common/element_equipprop', (err:any,res:any)=>{
            for (let index = 0; index < allGoodsList.length; index++) {
                let itemGoods = allGoodsList[index];

                let itemCell = instantiate(res) as Node;
                this.scroll_ItemView.content?.addChild(itemCell);

                if(itemGoods[0] == Msg.TObjectType.EObject_UsableItem)
                {
                    this._initPrefab(itemCell, Number(itemGoods[1]), Number(itemGoods[2]), EquipPropType.goods, Number(Msg.TObjectType.EObject_UsableItem));
                    this._bagItemNodeList.set(Number(itemGoods[1]), itemCell);
                    itemCell.name = "BagUseItem_" + Number(itemGoods[1]);
                }
                else{
                    this._initPrefab(itemCell, Number(itemGoods[0]), Number(itemGoods[2]), EquipPropType.goods, Number(itemGoods[0]));
                    this._bagItemNodeList.set(Number(itemGoods[0]), itemCell);
                    itemCell.name = "BagNotUseItem_" + Number(itemGoods[0]);
                }
            }            
        })   
    }

    private _initPrefab(iconNode:Node,key:number,value:number,itemType:EquipPropType, objType:number)
    {        
        let script = iconNode.getComponent("ElementEquipProp") as ElementEquipProp;
        script.setItemUseType(objType)
      
        script.setItemType(Number(key),Number(value),itemType,(id:number,itemClickType:number,objClickType:number)=>{
            this._itemEqipCallBack(id,itemClickType,objClickType)
        })
    }

    private _itemEqipCallBack(itemID:number,itemType:number,objType:number)
    {
        if(itemType == EquipPropType.goods)
        {
            PopMgr.getInstance().popItemUseSellView(itemID,objType);
        }
        else{
            PopMgr.getInstance().popEquipInfoView(itemID);            
        }
        
    }

    //改变背包节点数据
    private _changeScrollviewItemData(data:any)
    {
        if(data instanceof Array)
        {
            let id:number = data[1];
            let name:string = "";
            if(data[0] == EquipPropType.goods && this._bagItemNodeList.has(id))
            {
                let count:number = GameModel.getInstance().getBagModel().getItemCountByKey(id,EquipPropType.goods)
                name = "BagUseItem_" + id
                let cell = this.scroll_ItemView.content?.getChildByName(name) as Node;
                let script = cell.getComponent("ElementEquipProp") as ElementEquipProp;
                if(count == 0)
                {
                    this._bagItemNodeList.delete(id);
                    cell.removeFromParent();
                }
                else{
                    script.resetItemCount(count);
                }
            }
            else if(data[0] == EquipPropType.equip && this._bagEquipNodeList.has(id))
            {
                let count:number = GameModel.getInstance().getBagModel().getItemCountByKey(id,EquipPropType.equip)
                name = "BagEquipCell_" + id
                let cell = this.scroll_EquipView.content?.getChildByName(name) as Node;
                let script = cell.getComponent("ElementEquipProp") as ElementEquipProp;
                if(count == 0)
                {
                    this._bagItemNodeList.delete(id);
                    cell.removeFromParent()
                }
                else{
                    script.resetItemCount(count);
                }
            }
        }
    }

    onDestroy()
    {
        NotifyMgr.getInstance().removeNotifyHandler(NotifyMgr.event_equip_item_change,this._changeScrollviewItemData,this);
    }

    private _initFragmentScrollview()
    {
        if(this.scroll_fragment.content)
        {
            this.scroll_fragment.content.destroyAllChildren()
        }

         

    //    GameModel.getInstance().getBagModel().initTestFragmentList();
       let fragmentSysthesisiInfoList = GameModel.getInstance().getBagModel().getFragmentSynthesisInfoList();
       ResMgr.getInstance().loadPrefab('prefabs_ui/features/bag/element_herofragment', (err:Error | null,res:Prefab | null)=>{
            for (var i = 0 ; i < fragmentSysthesisiInfoList.length; i++) {
                let fragment_item = instantiate( res  as Prefab);
                let script = fragment_item.getComponent(ElementHeroFragment) as ElementHeroFragment;
                fragment_item.scale = new Vec3(0.7,0.7,1);
                let subWidget = fragment_item.getComponent(UITransform) as UITransform;
                subWidget.contentSize = new Size(105,126);
                script.setFragmentInfo(fragmentSysthesisiInfoList[i]);
                script.setBtnClick();
                this.scroll_fragment.content?.addChild(fragment_item);
            }
        },"BagMain");
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
}
