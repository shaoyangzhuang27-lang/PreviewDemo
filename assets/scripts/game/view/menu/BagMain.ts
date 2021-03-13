
import { _decorator, Component, Node, ToggleContainer, EventHandler, Toggle, Vec3, tween, ScrollView, Game, resources, instantiate } from 'cc';
import { GameModel } from '../../model/GameModel';
import { ItemEquipType,ItemEquipCell } from './ItemEquipCell';
import { PopItemUseWin } from '../pop/PopItemUseWin';
import { PopMgr } from '../../control/PopMgr';
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
    
    @property({type: Node })
    public bgMask:Node = null as unknown as Node;

    //拥有的所有道具显示对象
    private _bagItemNodeList:Map<number, Node> = new Map<number, Node>();

    //拥有的所有装备列表显示对象
    private _bagEquipNodeList:Map<number, Node> = new Map<number, Node>();

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
    }

    private _initEquipScrollview()
    {
        this._bagEquipNodeList.clear()
        let allEquipList = GameModel.getInstance().getBagModel().getBagEquipList();
        resources.load('prefabs_ui/main/itemequipcell', (err:any,res:any)=>{
            for (let key of allEquipList.keys()) {
                let value = allEquipList.get(key);  //数量   
                let equipCell = instantiate(res) as Node;
                this.scroll_EquipView.content?.addChild(equipCell);
                this._initPrefab(equipCell,Number(key),Number(value),ItemEquipType.equip); 

                this._bagEquipNodeList.set(Number(key), equipCell);
            }
        })   
    }

    private _initItemScrollview()
    {
        let allGoodsList = GameModel.getInstance().getBagModel().getAllGoods();
        this._bagItemNodeList.clear()
        resources.load('prefabs_ui/main/itemequipcell', (err:any,res:any)=>{
            for (let index = 0; index < allGoodsList.length; index++) {
                let itemGoods = allGoodsList[index];

                let itemCell = instantiate(res) as Node;
                this.scroll_ItemView.content?.addChild(itemCell);

                if(itemGoods[0] == Msg.TObjectType.EObject_UsableItem)
                {
                    this._initPrefab(itemCell, Number(itemGoods[1]), Number(itemGoods[2]), ItemEquipType.goods, Number(Msg.TObjectType.EObject_UsableItem));
                    this._bagItemNodeList.set(Number(itemGoods[1]), itemCell);
                }
                else{
                    this._initPrefab(itemCell, Number(itemGoods[0]), Number(itemGoods[2]), ItemEquipType.goods, Number(itemGoods[0]));
                    this._bagItemNodeList.set(Number(itemGoods[0]), itemCell);
                }
            }            
        })   
    }

    private _initPrefab(iconNode:Node,key:number,value:number,itemType:ItemEquipType, objType:number = 0)
    {        
        let script = iconNode.getComponent("ItemEquipCell") as ItemEquipCell;
        script.setItemUseType(objType)
        script.setItemType(Number(key),Number(value),itemType,(id:number,itemClickType:number,objClickType:number)=>{
            this._itemEqipCallBack(id,itemClickType,objClickType)
        })
    }

    private _itemEqipCallBack(itemID:number,itemType:number,objType:number = 0)
    {
        if(itemType == ItemEquipType.goods)
        {
            PopMgr.getInstance().popItemUseSellView(itemID,objType);
        }
        else{
            PopMgr.getInstance().popEquipInfoView(itemID);            
        }
        
    }

    onDestroy()
    {

    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
